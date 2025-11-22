# Workspace Domain Module

## 概述

Workspace（工作區）是 ng-gighub 的第五個聚合根，用於管理工作區的基本資訊、成員和資源。

## 架構

### 聚合根
- **WorkspaceAggregate**: 工作區聚合根，維護工作區的完整性和業務規則

### 值物件 (Value Objects)
- **WorkspaceId**: 工作區唯一識別碼（UUID）
- **WorkspaceType**: 工作區類型（personal | organization）
- **WorkspaceSlug**: URL-friendly 識別碼
- **MemberRole**: 成員角色（owner | admin | member | viewer）

### 實體 (Entities)
- **WorkspaceMember**: 工作區成員
- **WorkspaceResource**: 工作區資源（連結到 team, repository 等）

### 領域事件 (Domain Events)
- **WorkspaceCreatedEvent**: 工作區建立事件
- **WorkspaceUpdatedEvent**: 工作區更新事件
- **WorkspaceDeletedEvent**: 工作區刪除事件
- **MemberAddedEvent**: 成員加入事件
- **MemberRemovedEvent**: 成員移除事件
- **MemberRoleChangedEvent**: 成員角色變更事件
- **ResourceAddedEvent**: 資源加入事件
- **ResourceRemovedEvent**: 資源移除事件

### Repository Interface
- **IWorkspaceRepository**: 工作區持久化介面

## 業務規則

### 工作區規則
1. 工作區必須有唯一的 slug
2. 工作區名稱不可為空，且不超過 100 字元
3. 工作區類型只能是 personal 或 organization
4. 擁有者不能被移除

### 成員規則
1. 擁有者自動成為工作區成員
2. 成員在工作區中必須唯一（一個 account 只能是一個成員）
3. 擁有者的角色不能被變更
4. 角色階層：owner > admin > member > viewer

### 資源規則
1. 資源可以是任意類型（team, repository, project 等）
2. 資源通過 resource_type 和 resource_id 識別
3. 資源可以有自訂的 metadata

## 使用範例

### 建立工作區
```typescript
import { WorkspaceAggregate, WorkspaceId, WorkspaceType, WorkspaceSlug } from '@core/domain/workspace';

const workspaceId = WorkspaceId.create('uuid-here');
const type = WorkspaceType.createPersonal();
const slug = WorkspaceSlug.fromName('My Workspace');

const workspace = WorkspaceAggregate.create(
  workspaceId,
  type,
  'My Workspace',
  slug,
  'owner-account-id',
  'My personal workspace for projects'
);
```

### 新增成員
```typescript
import { MemberRole } from '@core/domain/workspace';

workspace.addMember(
  'member-id',
  'account-id',
  MemberRole.createAdmin()
);
```

### 新增資源
```typescript
workspace.addResource(
  'resource-relation-id',
  'team',
  'team-uuid',
  { name: 'Engineering Team' }
);
```

### 取得領域事件
```typescript
const events = workspace.getDomainEvents();
// 處理事件...
workspace.clearDomainEvents();
```

## 設計決策

1. **聚合內集合**: 使用 Map 儲存成員和資源，提供 O(1) 查詢效能
2. **領域事件**: 所有重要的業務操作都會發布領域事件
3. **不可變值物件**: 所有值物件都是不可變的，確保一致性
4. **重建方法**: 提供 `reconstruct` 方法從持久化層重建聚合
5. **業務邏輯封裝**: 所有業務規則都封裝在聚合根內

## 依賴關係

```
WorkspaceAggregate
├── WorkspaceId (VO)
├── WorkspaceType (VO)
├── WorkspaceSlug (VO)
├── WorkspaceMember (Entity)
│   └── MemberRole (VO)
└── WorkspaceResource (Entity)
```

## 下一步

- [ ] 實作 Infrastructure Layer（Repository, Mapper）
- [ ] 實作 Application Layer（Commands, Queries, Handlers）
- [ ] 實作 Features Layer（UI Components）
- [ ] 撰寫單元測試
