# Workspace Management System - Implementation Guide

## 已完成階段

### ✅ Phase 1: Database Schema (Supabase)
**檔案位置**: `src/app/core/infrastructure/persistence/supabase/migrations/20251122_workspace_tables.sql`

**完成項目**:
- workspaces 表（12 欄位）
- workspace_members 表（6 欄位）
- workspace_resources 表（5 欄位）
- 完整的 RLS policies（安全性）
- 索引優化（效能）
- Triggers（自動更新 updated_at）
- Utility functions（is_workspace_member, get_workspace_role, count_user_workspaces）

**Migration 已套用到 Supabase**: ✅

### ✅ Phase 2: Domain Layer
**檔案位置**: `src/app/core/domain/workspace/`

**完成項目**:
- ✅ WorkspaceAggregate (聚合根, 11KB)
- ✅ Value Objects (4 個): WorkspaceId, WorkspaceType, WorkspaceSlug, MemberRole
- ✅ Entities (2 個): WorkspaceMember, WorkspaceResource
- ✅ Domain Events (8 個): Created, Updated, Deleted, MemberAdded, MemberRemoved, MemberRoleChanged, ResourceAdded, ResourceRemoved
- ✅ IWorkspaceRepository (Repository Interface)
- ✅ index.ts (統一匯出)
- ✅ README.md (完整文件)

**驗證**: TypeScript 編譯成功, Angular build 成功

---

## 待實作階段

### 🚧 Phase 3: Infrastructure Layer

#### 3.1 Workspace Schema (TypeScript Types)
**檔案**: `src/app/core/infrastructure/persistence/supabase/schemas/workspace.schema.ts`

```typescript
export interface WorkspaceSchema {
  id: string;
  type: 'personal' | 'organization';
  name: string;
  slug: string;
  description: string | null;
  owner_id: string;
  avatar_url: string | null;
  settings: Record<string, any>;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMemberSchema {
  id: string;
  workspace_id: string;
  account_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: Record<string, boolean>;
  joined_at: string;
}

export interface WorkspaceResourceSchema {
  id: string;
  workspace_id: string;
  resource_type: string;
  resource_id: string;
  metadata: Record<string, any>;
  created_at: string;
}
```

#### 3.2 Workspace Mapper
**檔案**: `src/app/core/infrastructure/persistence/supabase/mappers/workspace.mapper.ts`

**功能**:
- `toDomain(schema: WorkspaceSchema, members: WorkspaceMemberSchema[], resources: WorkspaceResourceSchema[]): WorkspaceAggregate`
- `toPersistence(aggregate: WorkspaceAggregate): { workspace: WorkspaceSchema, members: WorkspaceMemberSchema[], resources: WorkspaceResourceSchema[] }`

**重點**:
- 將 DB schema 轉換為 Domain model
- 處理日期格式轉換
- 處理 JSON 欄位的序列化/反序列化

#### 3.3 Workspace Repository Implementation
**檔案**: `src/app/core/infrastructure/persistence/supabase/repositories/workspace.repository.ts`

**實作介面**: `IWorkspaceRepository`

**方法**:
- `save(workspace: WorkspaceAggregate): Promise<void>`
  - 使用 Supabase client insert/update
  - 同時處理 members 和 resources 的儲存
  - 使用 transaction 確保原子性

- `findById(id: WorkspaceId): Promise<WorkspaceAggregate | null>`
  - 查詢 workspaces 表
  - 左連接 workspace_members 和 workspace_resources
  - 使用 Mapper 轉換為 Aggregate

- `findBySlug(slug: string): Promise<WorkspaceAggregate | null>`
- `findByOwnerId(ownerId: string): Promise<WorkspaceAggregate[]>`
- `findByMemberId(accountId: string): Promise<WorkspaceAggregate[]>`
- `delete(id: WorkspaceId): Promise<void>`
- `slugExists(slug: string): Promise<boolean>`

#### 3.4 Workspace Query Service
**檔案**: `src/app/core/infrastructure/persistence/supabase/services/workspace-query.service.ts`

**功能**: 高效能的查詢服務（不需要完整的 Aggregate）

```typescript
@Injectable({ providedIn: 'root' })
export class WorkspaceQueryService {
  async getWorkspaceList(accountId: string): Promise<WorkspaceListItem[]>
  async getWorkspaceMembers(workspaceId: string): Promise<MemberListItem[]>
  async getWorkspaceResources(workspaceId: string, type?: string): Promise<ResourceListItem[]>
  async getWorkspaceStats(workspaceId: string): Promise<WorkspaceStats>
}
```

---

### 🚧 Phase 4: Application Layer

#### 4.1 DTOs
**檔案**: `src/app/core/application/workspace/dto/`

```typescript
// workspace.dto.ts
export class WorkspaceDto {
  id: string;
  type: 'personal' | 'organization';
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  avatarUrl: string | null;
  settings: Record<string, any>;
  isActive: boolean;
  memberCount: number;
  resourceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// workspace-member.dto.ts
export class WorkspaceMemberDto {
  id: string;
  accountId: string;
  role: string;
  permissions: Record<string, boolean>;
  joinedAt: Date;
}

// workspace-resource.dto.ts
export class WorkspaceResourceDto {
  id: string;
  resourceType: string;
  resourceId: string;
  metadata: Record<string, any>;
  createdAt: Date;
}
```

#### 4.2 Commands
**檔案**: `src/app/core/application/workspace/commands/`

**Commands**:
1. `create-workspace.command.ts`
   ```typescript
   export class CreateWorkspaceCommand {
     constructor(
       public readonly type: 'personal' | 'organization',
       public readonly name: string,
       public readonly slug: string,
       public readonly ownerId: string,
       public readonly description?: string
     ) {}
   }
   ```

2. `update-workspace.command.ts`
3. `delete-workspace.command.ts`
4. `add-member.command.ts`
5. `remove-member.command.ts`
6. `change-member-role.command.ts`
7. `add-resource.command.ts`
8. `remove-resource.command.ts`

#### 4.3 Command Handlers
**檔案**: `src/app/core/application/workspace/commands/handlers/`

**範例**: `create-workspace.handler.ts`
```typescript
@Injectable()
export class CreateWorkspaceHandler {
  constructor(
    private repository: IWorkspaceRepository
  ) {}

  async handle(command: CreateWorkspaceCommand): Promise<WorkspaceDto> {
    // 1. 驗證 slug 唯一性
    const slugExists = await this.repository.slugExists(command.slug);
    if (slugExists) {
      throw new Error('Workspace slug already exists');
    }

    // 2. 建立 Aggregate
    const workspace = WorkspaceAggregate.create(
      WorkspaceId.create(crypto.randomUUID()),
      WorkspaceType.fromString(command.type),
      command.name,
      WorkspaceSlug.create(command.slug),
      command.ownerId,
      command.description
    );

    // 3. 儲存
    await this.repository.save(workspace);

    // 4. 發布事件 (可選)
    // eventBus.publish(workspace.getDomainEvents());

    // 5. 轉換為 DTO 返回
    return this.toDto(workspace);
  }
}
```

#### 4.4 Queries
**檔案**: `src/app/core/application/workspace/queries/`

```typescript
// get-workspace-by-id.query.ts
export class GetWorkspaceByIdQuery {
  constructor(public readonly workspaceId: string) {}
}

// list-workspaces.query.ts
export class ListWorkspacesQuery {
  constructor(
    public readonly accountId: string,
    public readonly type?: 'personal' | 'organization'
  ) {}
}

// list-workspace-members.query.ts
export class ListWorkspaceMembersQuery {
  constructor(public readonly workspaceId: string) {}
}
```

#### 4.5 Query Handlers
**檔案**: `src/app/core/application/workspace/queries/handlers/`

**使用 Query Service**（更高效）而非 Repository

#### 4.6 Application Service
**檔案**: `src/app/core/application/workspace/services/workspace-application.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class WorkspaceApplicationService {
  constructor(
    private createHandler: CreateWorkspaceHandler,
    private updateHandler: UpdateWorkspaceHandler,
    // ... 其他 handlers
  ) {}

  // 提供統一的 API 給 Features layer
  async createWorkspace(command: CreateWorkspaceCommand): Promise<WorkspaceDto>
  async updateWorkspace(command: UpdateWorkspaceCommand): Promise<WorkspaceDto>
  async deleteWorkspace(command: DeleteWorkspaceCommand): Promise<void>
  async getWorkspace(query: GetWorkspaceByIdQuery): Promise<WorkspaceDto>
  async listWorkspaces(query: ListWorkspacesQuery): Promise<WorkspaceDto[]>
}
```

---

### 🚧 Phase 5: Features Layer (UI)

#### 5.1 Workspace Context Service
**檔案**: `src/app/features/workspace/services/workspace-context.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class WorkspaceContextService {
  // Signals for reactive state
  private currentWorkspace = signal<WorkspaceDto | null>(null);
  private currentMembers = signal<WorkspaceMemberDto[]>([]);
  private currentResources = signal<WorkspaceResourceDto[]>([]);
  private isLoading = signal<boolean>(false);

  // Readonly signals
  readonly workspace = this.currentWorkspace.asReadonly();
  readonly members = this.currentMembers.asReadonly();
  readonly resources = this.currentResources.asReadonly();
  readonly loading = this.isLoading.asReadonly();

  // Computed signals
  readonly isOwner = computed(() => {
    const workspace = this.currentWorkspace();
    // Check if current user is owner
    return workspace?.ownerId === this.getCurrentUserId();
  });

  constructor(
    private workspaceService: WorkspaceApplicationService
  ) {}

  async loadWorkspace(workspaceId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const workspace = await this.workspaceService.getWorkspace(
        new GetWorkspaceByIdQuery(workspaceId)
      );
      this.currentWorkspace.set(workspace);
      await this.loadMembers(workspaceId);
      await this.loadResources(workspaceId);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMembers(workspaceId: string): Promise<void> { }
  async loadResources(workspaceId: string): Promise<void> { }
  clearContext(): void { }
}
```

#### 5.2 Routing
**檔案**: `src/app/app.routes.ts`

```typescript
{
  path: 'workspaces',
  loadComponent: () => import('./layouts/default/default.component').then(m => m.DefaultLayoutComponent),
  children: [
    {
      path: '',
      loadComponent: () => import('./features/workspace/pages/workspace-list/workspace-list.component').then(m => m.WorkspaceListComponent)
    },
    {
      path: 'create',
      loadComponent: () => import('./features/workspace/pages/workspace-create/workspace-create.component').then(m => m.WorkspaceCreateComponent)
    },
    {
      path: ':id',
      loadComponent: () => import('./features/workspace/layouts/workspace-layout/workspace-layout.component').then(m => m.WorkspaceLayoutComponent),
      children: [
        {
          path: '',
          loadComponent: () => import('./features/workspace/pages/workspace-dashboard/workspace-dashboard.component').then(m => m.WorkspaceDashboardComponent)
        },
        {
          path: 'members',
          loadComponent: () => import('./features/workspace/pages/workspace-members/workspace-members.component').then(m => m.WorkspaceMembersComponent)
        },
        {
          path: 'settings',
          loadComponent: () => import('./features/workspace/pages/workspace-settings/workspace-settings.component').then(m => m.WorkspaceSettingsComponent)
        }
      ]
    }
  ]
}
```

#### 5.3 Components

**WorkspaceLayoutComponent** (Context Layer):
```typescript
@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  template: `
    <div class="workspace-layout">
      <!-- Workspace Header -->
      <header class="workspace-header">
        <app-workspace-header />
      </header>

      <!-- Workspace Sidebar -->
      <aside class="workspace-sidebar">
        <app-workspace-sidebar />
      </aside>

      <!-- Workspace Content -->
      <main class="workspace-content">
        <router-outlet />
      </main>
    </div>
  `
})
export class WorkspaceLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contextService = inject(WorkspaceContextService);

  async ngOnInit() {
    const workspaceId = this.route.snapshot.paramMap.get('id');
    if (workspaceId) {
      await this.contextService.loadWorkspace(workspaceId);
    }
  }
}
```

**WorkspaceListComponent**:
- 顯示使用者可存取的所有工作區
- 支援篩選（個人/組織）
- 支援搜尋
- 卡片式呈現

**WorkspaceCreateComponent**:
- 表單：名稱、類型、描述
- 自動生成 slug（可編輯）
- 驗證

**WorkspaceMembersComponent**:
- 成員列表（表格）
- 新增成員（對話框）
- 變更角色
- 移除成員

**WorkspaceSettingsComponent**:
- 基本資訊編輯
- 刪除工作區（確認對話框）

---

## 實作順序建議

1. **Infrastructure Layer** (2-3 小時)
   - Schema types
   - Mapper
   - Repository implementation
   - Query service

2. **Application Layer** (3-4 小時)
   - DTOs
   - Commands + Handlers (最重要: Create, Update, Delete)
   - Queries + Handlers
   - Application Service

3. **Features Layer - Core** (4-5 小時)
   - Context Service
   - Routing 配置
   - Workspace Layout Component
   - Workspace List Component
   - Workspace Create Component

4. **Features Layer - Advanced** (3-4 小時)
   - Workspace Members Component
   - Workspace Settings Component
   - 各種子元件（header, sidebar, card 等）

5. **Testing** (2-3 小時)
   - Domain layer unit tests
   - Application layer unit tests (mock repository)
   - Component tests

6. **Documentation** (1 小時)
   - 更新 ARCHITECTURE.md
   - API 使用範例
   - 截圖

---

## 重要提醒

### SSR 相容性
所有 service 都要檢查 `isPlatformBrowser`:
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export class MyService {
  private platformId = inject(PLATFORM_ID);

  async someMethod() {
    if (!isPlatformBrowser(this.platformId)) {
      // SSR: return mock data or skip
      return;
    }
    // Browser: normal logic
  }
}
```

### 錯誤處理
使用 Result pattern 或 try-catch，提供友善的錯誤訊息。

### 效能優化
- 使用 Query Service 而非 Repository（查詢場景）
- 實作分頁
- 考慮快取策略

### 安全性
- RLS policies 已配置
- 前端也要驗證權限（雙重保障）
- 敏感操作要二次確認

---

## 下一步行動

建議按照以下順序繼續：

1. **立即開始**: Infrastructure Layer
   - 先實作 Schema types
   - 再實作 Mapper
   - 最後實作 Repository

2. **測試驗證**: 
   - 建立簡單的測試程式驗證 Repository 可以正常 CRUD

3. **繼續推進**: Application Layer
   - 從最基本的 CreateWorkspace 開始
   - 逐步完成其他 Commands/Queries

4. **UI 實作**: Features Layer
   - 先做 List 和 Create
   - 再做 Layout 和 Context
   - 最後做 Members 和 Settings

加油！🚀
