-- Workspace Management System Migration
-- Created: 2025-11-22
-- Description: 建立工作區管理系統所需的資料表、索引、RLS policies 和 triggers

-- ============================================================================
-- 1. WORKSPACES TABLE (主表)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('personal', 'organization')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 索引優化
CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_type ON workspaces(type);
CREATE INDEX idx_workspaces_is_active ON workspaces(is_active);
CREATE INDEX idx_workspaces_created_at ON workspaces(created_at DESC);

-- 註解
COMMENT ON TABLE workspaces IS '工作區主表，支援個人和組織兩種類型';
COMMENT ON COLUMN workspaces.type IS '工作區類型: personal (個人) 或 organization (組織)';
COMMENT ON COLUMN workspaces.slug IS '工作區唯一識別碼（URL-friendly）';
COMMENT ON COLUMN workspaces.owner_id IS '工作區擁有者（可以是使用者或組織）';
COMMENT ON COLUMN workspaces.settings IS '工作區設定（JSON 格式）';
COMMENT ON COLUMN workspaces.metadata IS '額外的元資料（JSON 格式）';

-- ============================================================================
-- 2. WORKSPACE_MEMBERS TABLE (成員關聯表)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions JSONB DEFAULT '{}'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(workspace_id, account_id)
);

-- 索引優化
CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_account_id ON workspace_members(account_id);
CREATE INDEX idx_workspace_members_role ON workspace_members(role);
CREATE INDEX idx_workspace_members_joined_at ON workspace_members(joined_at DESC);

-- 註解
COMMENT ON TABLE workspace_members IS '工作區成員關聯表';
COMMENT ON COLUMN workspace_members.role IS '成員角色: owner (擁有者), admin (管理員), member (成員), viewer (瀏覽者)';
COMMENT ON COLUMN workspace_members.permissions IS '自訂權限設定（JSON 格式）';

-- ============================================================================
-- 3. WORKSPACE_RESOURCES TABLE (資源關聯表)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workspace_resources (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引優化
CREATE INDEX idx_workspace_resources_workspace_id ON workspace_resources(workspace_id);
CREATE INDEX idx_workspace_resources_type ON workspace_resources(resource_type);
CREATE INDEX idx_workspace_resources_resource_id ON workspace_resources(resource_id);
CREATE INDEX idx_workspace_resources_created_at ON workspace_resources(created_at DESC);

-- 複合索引（常見查詢優化）
CREATE INDEX idx_workspace_resources_workspace_type ON workspace_resources(workspace_id, resource_type);

-- 註解
COMMENT ON TABLE workspace_resources IS '工作區資源關聯表，用於連結工作區與其他資源（如團隊、儲存庫等）';
COMMENT ON COLUMN workspace_resources.resource_type IS '資源類型（例如: team, repository, project）';
COMMENT ON COLUMN workspace_resources.resource_id IS '資源的 UUID';
COMMENT ON COLUMN workspace_resources.metadata IS '資源相關的額外資訊（JSON 格式）';

-- ============================================================================
-- 4. TRIGGERS (自動更新 updated_at)
-- ============================================================================

-- 建立 trigger function（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 為 workspaces 表建立 trigger
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- 啟用 RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_resources ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- WORKSPACES RLS POLICIES
-- ============================================================================

-- 1. 查看工作區：擁有者或成員可以查看
CREATE POLICY "Users can view workspaces they own or are members of"
  ON workspaces FOR SELECT
  USING (
    auth.uid() = owner_id
    OR
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.account_id = auth.uid()
    )
  );

-- 2. 建立工作區：已認證使用者可以建立
CREATE POLICY "Authenticated users can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- 3. 更新工作區：擁有者或管理員可以更新
CREATE POLICY "Owners and admins can update workspaces"
  ON workspaces FOR UPDATE
  USING (
    auth.uid() = owner_id
    OR
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.account_id = auth.uid()
      AND workspace_members.role IN ('admin', 'owner')
    )
  );

-- 4. 刪除工作區：僅擁有者可以刪除
CREATE POLICY "Only owners can delete workspaces"
  ON workspaces FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- WORKSPACE_MEMBERS RLS POLICIES
-- ============================================================================

-- 1. 查看成員：工作區成員可以查看
CREATE POLICY "Workspace members can view other members"
  ON workspace_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.account_id = auth.uid()
    )
  );

-- 2. 新增成員：擁有者或管理員可以新增
CREATE POLICY "Owners and admins can add members"
  ON workspace_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN workspaces w ON w.id = wm.workspace_id
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND (
        wm.account_id = auth.uid() AND wm.role IN ('admin', 'owner')
        OR w.owner_id = auth.uid()
      )
    )
  );

-- 3. 更新成員：擁有者或管理員可以更新
CREATE POLICY "Owners and admins can update members"
  ON workspace_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN workspaces w ON w.id = wm.workspace_id
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND (
        wm.account_id = auth.uid() AND wm.role IN ('admin', 'owner')
        OR w.owner_id = auth.uid()
      )
    )
  );

-- 4. 刪除成員：擁有者或管理員可以刪除（不能刪除擁有者自己）
CREATE POLICY "Owners and admins can remove members"
  ON workspace_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN workspaces w ON w.id = wm.workspace_id
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND (
        wm.account_id = auth.uid() AND wm.role IN ('admin', 'owner')
        OR w.owner_id = auth.uid()
      )
    )
    AND workspace_members.role != 'owner'
  );

-- ============================================================================
-- WORKSPACE_RESOURCES RLS POLICIES
-- ============================================================================

-- 1. 查看資源：工作區成員可以查看
CREATE POLICY "Workspace members can view resources"
  ON workspace_resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_resources.workspace_id
      AND workspace_members.account_id = auth.uid()
    )
  );

-- 2. 新增資源：成員以上角色可以新增
CREATE POLICY "Members and above can add resources"
  ON workspace_resources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_resources.workspace_id
      AND workspace_members.account_id = auth.uid()
      AND workspace_members.role IN ('member', 'admin', 'owner')
    )
  );

-- 3. 刪除資源：管理員以上角色可以刪除
CREATE POLICY "Admins and above can remove resources"
  ON workspace_resources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_resources.workspace_id
      AND workspace_members.account_id = auth.uid()
      AND workspace_members.role IN ('admin', 'owner')
    )
  );

-- ============================================================================
-- 6. UTILITY FUNCTIONS
-- ============================================================================

-- 檢查使用者是否為工作區成員
CREATE OR REPLACE FUNCTION is_workspace_member(workspace_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = workspace_uuid
    AND account_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 檢查使用者在工作區中的角色
CREATE OR REPLACE FUNCTION get_workspace_role(workspace_uuid UUID, user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM workspace_members
  WHERE workspace_id = workspace_uuid
  AND account_id = user_uuid;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 取得使用者可存取的工作區數量
CREATE OR REPLACE FUNCTION count_user_workspaces(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT w.id)
    FROM workspaces w
    LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
    WHERE w.owner_id = user_uuid
    OR wm.account_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. SAMPLE DATA (僅用於開發環境，生產環境請註解或移除)
-- ============================================================================

-- 取消下方註解以插入測試資料
/*
-- 假設已有 account id: '00000000-0000-0000-0000-000000000001'
INSERT INTO workspaces (id, type, name, slug, description, owner_id)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'personal', 'My Personal Workspace', 'my-personal-workspace', 'My personal work area', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'organization', 'Team Workspace', 'team-workspace', 'Our team collaboration space', '00000000-0000-0000-0000-000000000001');

INSERT INTO workspace_members (workspace_id, account_id, role)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'owner');
*/

-- ============================================================================
-- Migration Complete
-- ============================================================================
