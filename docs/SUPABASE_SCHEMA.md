# Supabase Database Schema for DDD Architecture

## 資料表設計

### 1. accounts 表

儲存所有類型的帳號（User, Organization, Bot）使用單一表格策略（Single Table Inheritance）。

```sql
-- Create accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  type TEXT NOT NULL CHECK (type IN ('user', 'organization', 'bot')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- User specific fields
  first_name TEXT,
  last_name TEXT,
  location TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Organization specific fields
  company_name TEXT,
  member_count INTEGER DEFAULT 0,
  team_count INTEGER DEFAULT 0,
  
  -- Bot specific fields
  owner_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  purpose TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT display_name_length CHECK (char_length(display_name) >= 2),
  
  -- Type-specific constraints
  CONSTRAINT user_must_have_email CHECK (
    type != 'user' OR email IS NOT NULL
  ),
  CONSTRAINT org_must_have_company CHECK (
    type != 'organization' OR company_name IS NOT NULL
  ),
  CONSTRAINT bot_must_have_owner CHECK (
    type != 'bot' OR owner_id IS NOT NULL
  )
);

-- Create indexes
CREATE INDEX idx_accounts_username ON accounts(username);
CREATE INDEX idx_accounts_type ON accounts(type);
CREATE INDEX idx_accounts_email ON accounts(email) WHERE email IS NOT NULL;
CREATE INDEX idx_accounts_owner_id ON accounts(owner_id) WHERE owner_id IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE accounts IS 'Unified accounts table for users, organizations, and bots';
COMMENT ON COLUMN accounts.type IS 'Account type: user, organization, or bot';
COMMENT ON COLUMN accounts.username IS 'Unique username for the account';
COMMENT ON COLUMN accounts.email IS 'Email address (required for users)';
COMMENT ON COLUMN accounts.display_name IS 'Display name shown in UI';
```

### 2. teams 表

```sql
-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT team_name_length CHECK (char_length(name) >= 2),
  CONSTRAINT team_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT unique_org_slug UNIQUE (organization_id, slug)
);

-- Create indexes
CREATE INDEX idx_teams_organization_id ON teams(organization_id);
CREATE INDEX idx_teams_slug ON teams(slug);

-- Create updated_at trigger
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE teams IS 'Teams within organizations';
COMMENT ON COLUMN teams.slug IS 'URL-friendly team identifier';
COMMENT ON COLUMN teams.organization_id IS 'Parent organization';
```

### 3. organization_members 表（關聯表）

```sql
-- Create organization_members table
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_org_member UNIQUE (organization_id, account_id),
  CONSTRAINT not_self_member CHECK (organization_id != account_id)
);

-- Create indexes
CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_account_id ON organization_members(account_id);

COMMENT ON TABLE organization_members IS 'Organization membership and roles';
COMMENT ON COLUMN organization_members.role IS 'Member role: owner, admin, member, guest';
```

### 4. team_members 表（關聯表）

```sql
-- Create team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('maintainer', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_team_member UNIQUE (team_id, account_id)
);

-- Create indexes
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_account_id ON team_members(account_id);

COMMENT ON TABLE team_members IS 'Team membership';
```

### 5. repositories 表

```sql
-- Create repositories table
CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  full_name TEXT NOT NULL UNIQUE,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('user', 'organization')),
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'internal')),
  default_branch TEXT DEFAULT 'main',
  is_archived BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  pushed_at TIMESTAMPTZ,
  star_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  watcher_count INTEGER DEFAULT 0,
  open_issue_count INTEGER DEFAULT 0,
  language TEXT,
  topics TEXT[] DEFAULT '{}',
  homepage TEXT,
  
  CONSTRAINT repo_name_length CHECK (char_length(name) >= 1),
  CONSTRAINT unique_owner_repo UNIQUE (owner_id, name)
);

-- Create indexes
CREATE INDEX idx_repositories_owner_id ON repositories(owner_id);
CREATE INDEX idx_repositories_visibility ON repositories(visibility);
CREATE INDEX idx_repositories_full_name ON repositories(full_name);
CREATE INDEX idx_repositories_language ON repositories(language) WHERE language IS NOT NULL;
CREATE INDEX idx_repositories_topics ON repositories USING GIN(topics);

-- Create updated_at trigger
CREATE TRIGGER update_repositories_updated_at
  BEFORE UPDATE ON repositories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE repositories IS 'Code repositories';
COMMENT ON COLUMN repositories.full_name IS 'Format: owner_username/repo_name';
COMMENT ON COLUMN repositories.visibility IS 'Repository visibility: public, private, internal';
```

## Row Level Security (RLS) Policies

### accounts 表 RLS

```sql
-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public account info
CREATE POLICY "Public accounts are viewable by everyone"
  ON accounts FOR SELECT
  USING (true);

-- Policy: Users can insert their own account
CREATE POLICY "Users can create their own account"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own account
CREATE POLICY "Users can update their own account"
  ON accounts FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Only owners can delete accounts
CREATE POLICY "Account owners can delete their account"
  ON accounts FOR DELETE
  USING (auth.uid() = id);
```

### teams 表 RLS

```sql
-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Policy: Public teams viewable by all
CREATE POLICY "Public teams viewable by all"
  ON teams FOR SELECT
  USING (NOT is_private OR EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = teams.organization_id
    AND account_id = auth.uid()
  ));

-- Policy: Org admins can manage teams
CREATE POLICY "Organization admins can manage teams"
  ON teams FOR ALL
  USING (EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = teams.organization_id
    AND account_id = auth.uid()
    AND role IN ('owner', 'admin')
  ));
```

### repositories 表 RLS

```sql
-- Enable RLS
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;

-- Policy: Public repos viewable by all
CREATE POLICY "Public repositories viewable by all"
  ON repositories FOR SELECT
  USING (visibility = 'public');

-- Policy: Private repos viewable by owner and collaborators
CREATE POLICY "Private repositories viewable by authorized users"
  ON repositories FOR SELECT
  USING (
    visibility = 'private' AND (
      owner_id = auth.uid() OR
      -- Add collaborator check here
      true
    )
  );

-- Policy: Owners can manage their repositories
CREATE POLICY "Owners can manage their repositories"
  ON repositories FOR ALL
  USING (owner_id = auth.uid());
```

## Triggers for Maintaining Counts

### Update organization member_count

```sql
CREATE OR REPLACE FUNCTION update_org_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE accounts
    SET member_count = member_count + 1
    WHERE id = NEW.organization_id AND type = 'organization';
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE accounts
    SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.organization_id AND type = 'organization';
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_org_member_count_trigger
  AFTER INSERT OR DELETE ON organization_members
  FOR EACH ROW
  EXECUTE FUNCTION update_org_member_count();
```

### Update organization team_count

```sql
CREATE OR REPLACE FUNCTION update_org_team_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE accounts
    SET team_count = team_count + 1
    WHERE id = NEW.organization_id AND type = 'organization';
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE accounts
    SET team_count = GREATEST(0, team_count - 1)
    WHERE id = OLD.organization_id AND type = 'organization';
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_org_team_count_trigger
  AFTER INSERT OR DELETE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_org_team_count();
```

### Update team member_count

```sql
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE teams
    SET member_count = member_count + 1
    WHERE id = NEW.team_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE teams
    SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.team_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_member_count_trigger
  AFTER INSERT OR DELETE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_member_count();
```

## Functions for Common Queries

### Get accessible accounts for a user

```sql
CREATE OR REPLACE FUNCTION get_accessible_accounts(user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  type TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- User's own account
  SELECT a.id, a.username, a.display_name, a.avatar_url, a.type
  FROM accounts a
  WHERE a.id = user_id
  
  UNION
  
  -- Organizations the user is a member of
  SELECT a.id, a.username, a.display_name, a.avatar_url, a.type
  FROM accounts a
  INNER JOIN organization_members om ON a.id = om.organization_id
  WHERE om.account_id = user_id AND a.type = 'organization'
  
  ORDER BY username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Sample Data

```sql
-- Insert sample user
INSERT INTO accounts (username, email, display_name, type, first_name, last_name)
VALUES 
  ('john_doe', 'john@example.com', 'John Doe', 'user', 'John', 'Doe'),
  ('jane_smith', 'jane@example.com', 'Jane Smith', 'user', 'Jane', 'Smith');

-- Insert sample organization
INSERT INTO accounts (username, email, display_name, type, company_name)
VALUES 
  ('acme_corp', 'contact@acme.com', 'ACME Corporation', 'organization', 'ACME Corp');

-- Insert sample bot
INSERT INTO accounts (username, display_name, type, owner_id, purpose)
SELECT 
  'ci_bot', 
  'CI Bot', 
  'bot', 
  id, 
  'Continuous Integration Bot'
FROM accounts WHERE username = 'acme_corp';

-- Add organization members
INSERT INTO organization_members (organization_id, account_id, role)
SELECT 
  (SELECT id FROM accounts WHERE username = 'acme_corp'),
  id,
  CASE WHEN username = 'john_doe' THEN 'owner' ELSE 'member' END
FROM accounts WHERE username IN ('john_doe', 'jane_smith');

-- Create a team
INSERT INTO teams (name, slug, description, organization_id)
SELECT 
  'Engineering Team',
  'engineering',
  'Product engineering team',
  id
FROM accounts WHERE username = 'acme_corp';

-- Add team members
INSERT INTO team_members (team_id, account_id, role)
SELECT 
  t.id,
  a.id,
  'member'
FROM teams t
CROSS JOIN accounts a
WHERE t.slug = 'engineering' AND a.username = 'john_doe';

-- Create a repository
INSERT INTO repositories (name, full_name, description, owner_id, owner_type, visibility)
SELECT 
  'awesome-project',
  'acme_corp/awesome-project',
  'An awesome project',
  id,
  'organization',
  'public'
FROM accounts WHERE username = 'acme_corp';
```

## Migration Script

將以上所有 SQL 整理成一個完整的 migration：

```sql
-- Migration: Create DDD Architecture Tables
-- Version: 1.0
-- Date: 2025-11-21

BEGIN;

-- 1. Create accounts table
-- (paste accounts table SQL here)

-- 2. Create teams table
-- (paste teams table SQL here)

-- 3. Create organization_members table
-- (paste organization_members table SQL here)

-- 4. Create team_members table
-- (paste team_members table SQL here)

-- 5. Create repositories table
-- (paste repositories table SQL here)

-- 6. Set up RLS policies
-- (paste RLS SQL here)

-- 7. Create triggers
-- (paste trigger SQL here)

-- 8. Create functions
-- (paste function SQL here)

COMMIT;
```

## 使用 Supabase CLI 執行 Migration

```bash
# 建立新 migration
supabase migration new ddd_architecture

# 編輯 migration 檔案，貼上上述 SQL

# 執行 migration
supabase db push

# 或使用 Supabase Dashboard
# 1. 前往 SQL Editor
# 2. 貼上 migration SQL
# 3. 執行
```

## TypeScript Types 生成

```bash
# 生成 TypeScript types
npx supabase gen types typescript --project-id xxycyrsgzjlphohqjpsh > src/app/infrastructure/supabase/database.types.ts
```

生成的 types 可以與 Mapper 搭配使用：

```typescript
import { Database } from './database.types';

type AccountRow = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];
```

## 資料庫最佳化建議

1. **Indexes**: 為常用查詢欄位建立索引
2. **Partitioning**: 考慮對大表進行分區（如 repositories）
3. **Materialized Views**: 為複雜查詢建立物化視圖
4. **Connection Pooling**: 使用 Supabase 的連接池
5. **Caching**: 在應用層實作快取策略

## 備份與恢復

```bash
# 備份資料庫
supabase db dump -f backup.sql

# 恢復資料庫
psql $DATABASE_URL < backup.sql
```
