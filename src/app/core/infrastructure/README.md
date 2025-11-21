# Core / Infrastructure 層

## 概述

Infrastructure 層負責實作技術細節，包括資料持久化、外部服務整合、訊息傳遞等。這一層是 Domain 層與外部世界的橋樑。

## 職責

- **實作 Repository**: 實作 Domain 層定義的 Repository 介面
- **資料映射**: 在領域物件與資料庫模型之間轉換
- **外部服務整合**: Email, Storage, 第三方 API
- **事件處理**: 領域事件的發布與訂閱機制
- **認證授權**: 使用者認證與授權邏輯

## 資料夾結構

### persistence/
資料持久化相關

#### supabase/
使用 Supabase 作為資料庫

- **repositories/**: Repository 實作
  - `account.repository.ts` - 實作 IAccountRepository
  - `organization.repository.ts` - 實作 IOrganizationRepository
  - `team.repository.ts` - 實作 ITeamRepository
  - `repository.repository.ts` - 實作 IRepositoryRepository

- **mappers/**: 領域物件與資料庫模型的轉換器
  - `account.mapper.ts` - 帳號映射器
  - `organization.mapper.ts` - 組織映射器
  - `team.mapper.ts` - 團隊映射器
  - `repository.mapper.ts` - 倉庫映射器

- **schemas/**: TypeScript 資料表結構定義
  - `account.schema.ts` - 帳號資料表型別
  - `organization.schema.ts` - 組織資料表型別
  - `team.schema.ts` - 團隊資料表型別
  - `repository.schema.ts` - 倉庫資料表型別

- **migrations/**: 資料庫遷移腳本
  - `initial-schema.sql` - 初始 schema

#### query-services/
專門用於查詢的服務

- `account-query.service.ts` - 帳號查詢服務
- `organization-query.service.ts` - 組織查詢服務
- `team-query.service.ts` - 團隊查詢服務
- `repository-query.service.ts` - 倉庫查詢服務

> **注意**: Query Service 可以跨聚合根查詢，直接回傳 DTO，不需要經過領域物件

### messaging/
事件訊息處理

- **event-bus.service.ts**: 事件匯流排，管理事件的發布與訂閱
- **event-publisher.service.ts**: 事件發布器
- **handlers/**: 事件處理器
  - `account-created.handler.ts` - 處理帳號建立事件
  - `account-switched.handler.ts` - 處理帳號切換事件
  - `member-added.handler.ts` - 處理成員加入事件
  - `repository-created.handler.ts` - 處理倉庫建立事件

### auth/
認證與授權

- **auth.service.ts**: 認證服務
- **jwt.service.ts**: JWT token 服務
- **guards/**: 路由守衛
  - `auth.guard.ts` - 認證守衛
  - `role.guard.ts` - 角色守衛

### external/
外部服務整合

- **email/**: 郵件服務
  - `email.service.ts` - Email 發送服務

- **storage/**: 檔案儲存
  - `file-storage.service.ts` - 檔案儲存服務（整合 Supabase Storage）

## 設計模式

### Repository Pattern
```typescript
export class AccountRepository implements IAccountRepository {
  constructor(
    private supabaseClient: SupabaseClient,
    private mapper: AccountMapper
  ) {}

  async findById(id: AccountId): Promise<AccountAggregate | null> {
    const { data, error } = await this.supabaseClient
      .from('accounts')
      .select('*')
      .eq('id', id.value)
      .single();

    if (error || !data) return null;
    return this.mapper.toDomain(data);
  }

  async save(account: AccountAggregate): Promise<void> {
    const dbModel = this.mapper.toPersistence(account);
    await this.supabaseClient
      .from('accounts')
      .upsert(dbModel);
  }
}
```

### Mapper Pattern
```typescript
export class AccountMapper {
  static toDomain(schema: AccountSchema): AccountAggregate {
    // 從資料庫模型轉換為領域物件
  }

  static toPersistence(aggregate: AccountAggregate): AccountSchema {
    // 從領域物件轉換為資料庫模型
  }
}
```

### Event Bus Pattern
```typescript
export class EventBusService {
  private handlers = new Map<string, Function[]>();

  subscribe(eventType: string, handler: Function) {
    // 訂閱事件
  }

  publish(event: DomainEvent) {
    // 發布事件到所有訂閱者
  }
}
```

## 與其他層的關係

- **實作 Domain 層介面**: Repository, Domain Service 介面
- **被 Application 層使用**: 注入 Repository 實作到 Command/Query Handler
- **獨立部署**: 可以抽換不同的持久化技術（例如從 Supabase 換成 PostgreSQL）

## Supabase 整合

### 連線設定
```typescript
const supabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey
);
```

### 資料表設計原則
- 每個聚合根有自己的主表
- 使用 UUID 作為主鍵
- 包含 `created_at`, `updated_at` 時間戳記
- 設定適當的 Row Level Security (RLS) policies

### 事務處理
- Supabase 支援 PostgreSQL 事務
- Command Handler 中使用事務確保一致性

## 測試策略

- **Repository**: 使用 Supabase 本地開發環境或測試資料庫
- **Mapper**: 單元測試，驗證轉換邏輯
- **Query Service**: 整合測試
- **Event Bus**: 單元測試，使用 mock
