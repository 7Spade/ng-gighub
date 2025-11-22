# 資料庫 Schema 企業級標準

## 概述

本文件定義 ng-gighub 專案的資料庫 Schema 設計標準，確保所有資料表符合企業級 SaaS 系統的要求，包含命名規範、欄位標準、索引策略、效能優化及維護性考量。

## 目錄

- [核心原則](#核心原則)
- [命名規範](#命名規範)
- [必要欄位標準](#必要欄位標準)
- [資料類型標準](#資料類型標準)
- [索引策略](#索引策略)
- [約束與驗證](#約束與驗證)
- [多租戶隔離](#多租戶隔離)
- [審計與追蹤](#審計與追蹤)
- [效能優化](#效能優化)
- [遷移策略](#遷移策略)

## 核心原則

### 1. 一致性 (Consistency)
所有資料表遵循相同的命名規範與結構模式

### 2. 可擴展性 (Scalability)
Schema 設計需考慮未來擴展需求

### 3. 安全性 (Security)
所有資料表啟用 Row Level Security (RLS)

### 4. 可維護性 (Maintainability)
清晰的結構與完整的註解

### 5. 效能 (Performance)
適當的索引與分區策略

## 命名規範

### 資料表命名

```
{entity}_{suffix}

範例：
- users (單數或複數視情況)
- user_profiles
- organization_members
- workspace_resources
```

**規則：**
- 使用小寫英文
- 單字間使用底線 `_` 分隔
- 複數形式（除非是關聯表或特殊情況）
- 清晰描述資料表內容

### 欄位命名

```
{descriptor}_{type}

範例：
- id (主鍵)
- user_id (外鍵)
- created_at (時間戳)
- is_active (布林值)
- display_name (一般欄位)
```

**規則：**
- 使用小寫英文
- 單字間使用底線 `_` 分隔
- 布林值前綴 `is_`, `has_`, `can_`
- 時間戳後綴 `_at`
- 外鍵後綴 `_id`

### 索引命名

```
idx_{table}_{columns}[_{type}]

範例：
- idx_users_email
- idx_workspaces_slug_unique
- idx_workspace_members_composite
- idx_work_items_workspace_status
```

### 約束命名

```
{table}_{columns}_{constraint_type}

範例：
- users_email_unique
- workspaces_owner_id_fkey
- work_items_status_check
```

## 必要欄位標準

### 所有資料表必須包含

#### 1. 主鍵 (Primary Key)

```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
```

**說明：**
- 使用 UUID 而非 SERIAL
- 避免順序性洩漏資訊
- 支援分散式系統

#### 2. 時間戳 (Timestamps)

```sql
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
```

**說明：**
- 使用 `timestamptz` 包含時區資訊
- 設定 NOT NULL 與 DEFAULT
- 自動更新 `updated_at`（透過 Trigger）

#### 3. 軟刪除 (Soft Delete) - 選用

```sql
deleted_at timestamptz,
deleted_by uuid REFERENCES accounts(id)
```

**說明：**
- 允許資料恢復
- 保留審計記錄
- 不適用於所有表

### 多租戶表必須包含

#### 租戶識別 (Tenant Identifier)

```sql
-- Personal Workspace
workspace_id uuid NOT NULL REFERENCES workspaces(id),

-- Organization
organization_id uuid NOT NULL REFERENCES accounts(id),

-- Team
team_id uuid NOT NULL REFERENCES teams(id)
```

**說明：**
- 根據資料類型選擇適當的租戶欄位
- 設定 NOT NULL 確保資料隔離
- 建立適當的索引

#### 建立者追蹤

```sql
created_by uuid REFERENCES accounts(id)
```

**說明：**
- 記錄資料建立者
- 用於審計與權限檢查
- 可為 NULL（系統建立）

## 資料類型標準

### 文字類型

| 用途 | 類型 | 說明 |
|------|------|------|
| 短文字 (< 255 字元) | `text` | 名稱、標題、slug |
| 長文字 | `text` | 描述、內容 |
| 固定長度文字 | `char(n)` | 代碼、識別碼（少用） |

**為何使用 `text`？**
- PostgreSQL `text`, `varchar`, `character varying` 效能相同
- `text` 更簡潔，無需指定長度
- 長度限制應在應用層或 CHECK 約束實作

### 數值類型

| 用途 | 類型 | 說明 |
|------|------|------|
| 整數 | `int` / `bigint` | 計數、數量 |
| 小數 | `numeric(precision, scale)` | 金額、精確計算 |
| 浮點數 | `real` / `double precision` | 統計、概率（避免用於金額） |

**金額處理：**
```sql
-- 使用 numeric 儲存金額（單位：最小貨幣單位）
amount numeric(19, 4) NOT NULL CHECK (amount >= 0),
currency char(3) NOT NULL DEFAULT 'TWD'
```

### 布林類型

```sql
is_active boolean NOT NULL DEFAULT true,
is_public boolean DEFAULT false
```

**規則：**
- 設定明確的 DEFAULT 值
- 避免 NULL（除非「未知」是有效狀態）

### 時間類型

```sql
-- 時間戳（含時區）
created_at timestamptz NOT NULL DEFAULT now(),

-- 日期
birth_date date,

-- 時間間隔
session_duration interval,

-- 僅時間
work_start_time time
```

**規則：**
- 優先使用 `timestamptz`（含時區）
- 避免使用 `timestamp` without time zone

### JSON 類型

```sql
-- 結構化資料
metadata jsonb DEFAULT '{}',
settings jsonb DEFAULT '{}',

-- 陣列資料
tags text[] DEFAULT ARRAY[]::text[]
```

**JSONB vs JSON：**
- 優先使用 `jsonb`（支援索引、查詢更快）
- 僅當需要保留原始格式時使用 `json`

### 枚舉類型

```sql
-- 方法 1: CHECK 約束（推薦）
status text NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),

-- 方法 2: PostgreSQL ENUM
CREATE TYPE workspace_type AS ENUM ('personal', 'organization');
type workspace_type NOT NULL
```

**選擇建議：**
- CHECK 約束：更靈活，易於修改
- ENUM：效能更好，類型安全，但修改複雜

## 索引策略

### 1. 主鍵索引（自動建立）

```sql
PRIMARY KEY (id)
```

### 2. 外鍵索引（必須手動建立）

```sql
CREATE INDEX idx_workspace_members_workspace_id 
  ON workspace_members(workspace_id);

CREATE INDEX idx_workspace_members_account_id 
  ON workspace_members(account_id);
```

**重要：** PostgreSQL 不會自動為外鍵建立索引

### 3. 唯一性索引

```sql
-- 單欄位唯一
CREATE UNIQUE INDEX idx_accounts_email 
  ON accounts(email);

-- 複合唯一（多欄位組合唯一）
CREATE UNIQUE INDEX idx_workspace_members_unique 
  ON workspace_members(workspace_id, account_id);

-- 條件唯一（僅特定條件下唯一）
CREATE UNIQUE INDEX idx_workspaces_slug_active 
  ON workspaces(slug) 
  WHERE deleted_at IS NULL;
```

### 4. 查詢優化索引

#### 單欄位索引

```sql
-- 經常用於 WHERE 條件的欄位
CREATE INDEX idx_work_items_status 
  ON work_items(status);

-- 經常用於 ORDER BY 的欄位
CREATE INDEX idx_work_items_created_at 
  ON work_items(created_at DESC);
```

#### 複合索引

```sql
-- 多欄位查詢（左對齊原則）
CREATE INDEX idx_work_items_workspace_status 
  ON work_items(workspace_id, status);

-- 支援查詢：
-- WHERE workspace_id = ? AND status = ?
-- WHERE workspace_id = ? (也會用到此索引)
-- WHERE status = ? (不會用到此索引)
```

#### 部分索引

```sql
-- 僅索引活躍資料
CREATE INDEX idx_work_items_active 
  ON work_items(workspace_id, status)
  WHERE deleted_at IS NULL;

-- 僅索引特定條件
CREATE INDEX idx_repositories_private 
  ON repositories(owner_id, created_at)
  WHERE is_private = true;
```

### 5. 全文搜尋索引

```sql
-- 建立全文搜尋欄位
ALTER TABLE repositories 
  ADD COLUMN search_vector tsvector;

-- 建立 GIN 索引
CREATE INDEX idx_repositories_search 
  ON repositories USING GIN(search_vector);

-- 更新 Trigger
CREATE TRIGGER repositories_search_update
  BEFORE INSERT OR UPDATE ON repositories
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();
```

### 6. JSONB 索引

```sql
-- 整個 JSONB 欄位索引
CREATE INDEX idx_metadata_gin 
  ON work_items USING GIN(metadata);

-- 特定 JSON 路徑索引
CREATE INDEX idx_metadata_tag 
  ON work_items((metadata->>'tag'));
```

### 索引維護

```sql
-- 查看索引使用統計
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;

-- 查找未使用的索引
SELECT *
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- 重建索引
REINDEX INDEX idx_work_items_workspace_status;
REINDEX TABLE work_items;
```

## 約束與驗證

### 1. NOT NULL 約束

```sql
-- 必填欄位
name text NOT NULL,
email text NOT NULL,
created_at timestamptz NOT NULL DEFAULT now()
```

**原則：**
- 明確定義哪些欄位不可為 NULL
- 避免隱式 NULL（未指定即為 NULL）

### 2. UNIQUE 約束

```sql
-- 單欄位唯一
email text UNIQUE NOT NULL,

-- 複合唯一
UNIQUE(workspace_id, slug)
```

### 3. CHECK 約束

```sql
-- 數值範圍
priority int CHECK (priority BETWEEN 1 AND 10),

-- 枚舉值
status text CHECK (status IN ('draft', 'published', 'archived')),

-- 邏輯約束
CHECK (start_date < end_date),

-- 複雜邏輯
CHECK (
  (type = 'personal' AND organization_id IS NULL) OR
  (type = 'organization' AND organization_id IS NOT NULL)
)
```

### 4. FOREIGN KEY 約束

```sql
-- 基本外鍵
user_id uuid REFERENCES accounts(id),

-- 級聯刪除
workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,

-- 限制刪除
owner_id uuid REFERENCES accounts(id) ON DELETE RESTRICT,

-- 設為 NULL
manager_id uuid REFERENCES accounts(id) ON DELETE SET NULL
```

**刪除策略：**
- `CASCADE`: 刪除父記錄時，自動刪除子記錄
- `RESTRICT`: 有子記錄時，禁止刪除父記錄
- `SET NULL`: 刪除父記錄時，將子記錄外鍵設為 NULL
- `NO ACTION`: 與 RESTRICT 類似（預設）

### 5. DEFAULT 約束

```sql
-- 固定值
is_active boolean DEFAULT true,

-- 函數
id uuid DEFAULT gen_random_uuid(),
created_at timestamptz DEFAULT now(),

-- JSON
metadata jsonb DEFAULT '{}',
tags text[] DEFAULT ARRAY[]::text[]
```

## 多租戶隔離

### RLS Policy 模式

#### 模式 1：Workspace 隔離

```sql
-- 啟用 RLS
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;

-- 使用者只能存取所屬 Workspace 的資料
CREATE POLICY "Workspace isolation"
  ON work_items
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE account_id = auth.uid()
    )
  );
```

#### 模式 2：Organization 隔離

```sql
CREATE POLICY "Organization isolation"
  ON teams
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE account_id = auth.uid()
    )
  );
```

#### 模式 3：Owner 隔離

```sql
-- 僅擁有者可存取
CREATE POLICY "Owner only"
  ON workspaces
  FOR ALL
  USING (owner_id = auth.uid());
```

#### 模式 4：混合隔離

```sql
-- 公開資料 OR 有權限的私有資料
CREATE POLICY "Public or authorized"
  ON repositories
  FOR SELECT
  USING (
    is_public = true
    OR
    owner_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE account_id = auth.uid()
    )
  );
```

### RLS 效能優化

```sql
-- 使用 Security Definer 函數優化
CREATE OR REPLACE FUNCTION user_workspaces()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT workspace_id
  FROM workspace_members
  WHERE account_id = auth.uid();
$$;

-- 在 Policy 中使用
CREATE POLICY "Optimized workspace isolation"
  ON work_items
  FOR ALL
  USING (workspace_id IN (SELECT user_workspaces()));
```

## 審計與追蹤

### 審計表設計

```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 操作資訊
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  
  -- 變更內容
  old_data jsonb,
  new_data jsonb,
  changes jsonb,
  
  -- 使用者資訊
  user_id uuid REFERENCES accounts(id),
  user_email text,
  user_ip inet,
  user_agent text,
  
  -- 時間與上下文
  occurred_at timestamptz NOT NULL DEFAULT now(),
  workspace_id uuid,
  
  -- 額外資訊
  metadata jsonb DEFAULT '{}'
);

-- 索引
CREATE INDEX idx_audit_logs_table_record 
  ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user 
  ON audit_logs(user_id, occurred_at DESC);
CREATE INDEX idx_audit_logs_workspace 
  ON audit_logs(workspace_id, occurred_at DESC);
CREATE INDEX idx_audit_logs_occurred 
  ON audit_logs(occurred_at DESC);
```

### 自動審計 Trigger

```sql
-- 審計 Trigger 函數
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_data jsonb;
  v_new_data jsonb;
  v_changes jsonb;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := NULL;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
    -- 計算變更欄位
    v_changes := jsonb_diff(v_old_data, v_new_data);
  ELSIF (TG_OP = 'INSERT') THEN
    v_old_data := NULL;
    v_new_data := to_jsonb(NEW);
  END IF;

  INSERT INTO audit_logs (
    table_name,
    record_id,
    operation,
    old_data,
    new_data,
    changes,
    user_id,
    user_email
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    v_old_data,
    v_new_data,
    v_changes,
    auth.uid(),
    auth.email()
  );

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- 套用到資料表
CREATE TRIGGER work_items_audit
  AFTER INSERT OR UPDATE OR DELETE ON work_items
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();
```

### 活動日誌（Activity Log）

```sql
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 活動資訊
  actor_id uuid NOT NULL REFERENCES accounts(id),
  actor_type text NOT NULL CHECK (actor_type IN ('user', 'system', 'bot')),
  action text NOT NULL, -- 'created', 'updated', 'deleted', 'invited', etc.
  
  -- 目標資源
  target_type text NOT NULL, -- 'repository', 'workspace', 'team', etc.
  target_id uuid NOT NULL,
  target_name text,
  
  -- 上下文
  workspace_id uuid REFERENCES workspaces(id),
  
  -- 詳細資訊
  description text,
  metadata jsonb DEFAULT '{}',
  
  -- 時間
  occurred_at timestamptz NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX idx_activity_logs_actor 
  ON activity_logs(actor_id, occurred_at DESC);
CREATE INDEX idx_activity_logs_workspace 
  ON activity_logs(workspace_id, occurred_at DESC);
CREATE INDEX idx_activity_logs_target 
  ON activity_logs(target_type, target_id, occurred_at DESC);
```

## 效能優化

### 1. 分區（Partitioning）

```sql
-- 按時間分區
CREATE TABLE activity_logs_partitioned (
  id uuid DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  -- 其他欄位...
) PARTITION BY RANGE (occurred_at);

-- 建立分區
CREATE TABLE activity_logs_2025_01 PARTITION OF activity_logs_partitioned
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE activity_logs_2025_02 PARTITION OF activity_logs_partitioned
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### 2. Materialized Views

```sql
-- 統計資料 Materialized View
CREATE MATERIALIZED VIEW workspace_statistics AS
SELECT
  w.id,
  w.name,
  COUNT(DISTINCT wm.account_id) as member_count,
  COUNT(DISTINCT r.id) FILTER (WHERE r.resource_type = 'repository') as repository_count
FROM workspaces w
LEFT JOIN workspace_members wm ON w.id = wm.workspace_id
LEFT JOIN workspace_resources r ON w.id = r.workspace_id
GROUP BY w.id, w.name;

-- 建立索引
CREATE INDEX idx_workspace_statistics_id 
  ON workspace_statistics(id);

-- 定期更新
REFRESH MATERIALIZED VIEW CONCURRENTLY workspace_statistics;
```

### 3. 查詢優化

```sql
-- 使用 EXPLAIN ANALYZE 分析查詢
EXPLAIN ANALYZE
SELECT *
FROM work_items
WHERE workspace_id = 'uuid'
  AND status = 'in_progress'
ORDER BY created_at DESC
LIMIT 20;

-- 根據分析結果建立適當索引
CREATE INDEX idx_work_items_workspace_status_created
  ON work_items(workspace_id, status, created_at DESC);
```

## 遷移策略

### 遷移檔案結構

```
supabase/migrations/
├── 20250101000000_initial_schema.sql
├── 20250102000000_add_workspaces.sql
├── 20250103000000_add_teams.sql
└── 20250104000000_add_rls_policies.sql
```

### 遷移最佳實踐

#### 1. 向後相容

```sql
-- ❌ 不要直接刪除欄位
ALTER TABLE users DROP COLUMN old_field;

-- ✅ 先標記為 deprecated，下個版本再刪除
ALTER TABLE users ALTER COLUMN old_field SET DEFAULT NULL;
COMMENT ON COLUMN users.old_field IS 'DEPRECATED: Use new_field instead';
```

#### 2. 分階段遷移

```sql
-- Phase 1: 新增欄位（允許 NULL）
ALTER TABLE users ADD COLUMN new_email text;

-- Phase 2: 資料遷移
UPDATE users SET new_email = old_email WHERE new_email IS NULL;

-- Phase 3: 加入約束
ALTER TABLE users ALTER COLUMN new_email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_new_email_unique UNIQUE (new_email);

-- Phase 4: 刪除舊欄位（下個版本）
ALTER TABLE users DROP COLUMN old_email;
```

#### 3. 大量資料遷移

```sql
-- 分批次更新，避免鎖表
DO $$
DECLARE
  batch_size int := 1000;
  rows_updated int;
BEGIN
  LOOP
    UPDATE users
    SET new_field = compute_new_value(old_field)
    WHERE id IN (
      SELECT id
      FROM users
      WHERE new_field IS NULL
      LIMIT batch_size
    );
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;
    
    COMMIT;
    PERFORM pg_sleep(0.1); -- 短暫休息，避免長時間鎖定
  END LOOP;
END $$;
```

### 回滾策略

```sql
-- 每個遷移都應有對應的回滾腳本
-- 20250102000000_add_workspaces.sql
CREATE TABLE workspaces (...);

-- 20250102000000_add_workspaces_rollback.sql
DROP TABLE IF EXISTS workspaces CASCADE;
```

## 範例：完整資料表定義

```sql
-- 工作項目表（綜合範例）
CREATE TABLE work_items (
  -- 主鍵
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本欄位
  title text NOT NULL CHECK (char_length(title) >= 3),
  description text,
  
  -- 狀態與優先級
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- 多租戶
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- 關聯
  assignee_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  
  -- 分類
  tags text[] DEFAULT ARRAY[]::text[],
  
  -- 時間戳
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  
  -- 追蹤
  created_by uuid REFERENCES accounts(id),
  
  -- 軟刪除
  deleted_at timestamptz,
  
  -- 額外資料
  metadata jsonb DEFAULT '{}',
  
  -- 約束
  CONSTRAINT valid_completion CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status != 'completed' AND completed_at IS NULL)
  )
);

-- 註解
COMMENT ON TABLE work_items IS '工作項目管理表';
COMMENT ON COLUMN work_items.id IS '唯一識別符';
COMMENT ON COLUMN work_items.title IS '工作項目標題（最少 3 字元）';
COMMENT ON COLUMN work_items.workspace_id IS '所屬工作區 UUID';

-- 索引
CREATE INDEX idx_work_items_workspace 
  ON work_items(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_work_items_status 
  ON work_items(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_work_items_assignee 
  ON work_items(assignee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_work_items_composite 
  ON work_items(workspace_id, status, created_at DESC) WHERE deleted_at IS NULL;

-- RLS
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view work items"
  ON work_items FOR SELECT
  USING (
    workspace_id IN (SELECT user_workspaces())
  );

CREATE POLICY "Workspace admins can manage work items"
  ON work_items FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE account_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Trigger: 自動更新 updated_at
CREATE TRIGGER work_items_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: 審計日誌
CREATE TRIGGER work_items_audit
  AFTER INSERT OR UPDATE OR DELETE ON work_items
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();
```

## 相關文件

- [多租戶架構](./multi-tenancy.md)
- [授權與權限管理](./authorization.md)
- [系統基礎設施概覽](./overview.md)
- [Supabase 設定](../setup/supabase.md)

## 檢查清單

使用此檢查清單驗證資料表設計：

### 基本結構
- [ ] 使用 UUID 作為主鍵
- [ ] 包含 `created_at` 與 `updated_at`
- [ ] 遵循命名規範
- [ ] 欄位有適當的 NOT NULL 約束
- [ ] 欄位有適當的 DEFAULT 值

### 多租戶
- [ ] 包含租戶識別欄位（workspace_id/organization_id/team_id）
- [ ] 啟用 Row Level Security
- [ ] RLS Policy 正確實作資料隔離
- [ ] 包含 `created_by` 欄位

### 效能
- [ ] 外鍵欄位已建立索引
- [ ] 常用查詢欄位已建立索引
- [ ] 複合索引順序合理（左對齊原則）
- [ ] 使用部分索引優化特定查詢

### 資料完整性
- [ ] 外鍵設定適當的 ON DELETE 行為
- [ ] CHECK 約束驗證業務規則
- [ ] UNIQUE 約束確保唯一性
- [ ] 使用 Trigger 自動更新欄位

### 可維護性
- [ ] 資料表與欄位有註解說明
- [ ] 複雜約束有清晰的錯誤訊息
- [ ] 索引命名清晰
- [ ] 遷移腳本可回滾

### 審計
- [ ] 重要資料表有審計 Trigger
- [ ] 敏感操作記錄到 activity_logs
- [ ] 保留資料變更歷史

---

**最後更新**: 2025-11-22  
**維護者**: Development Team  
**版本**: 1.0.0
