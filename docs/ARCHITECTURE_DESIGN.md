# ng-gighub 架構設計文件

## 文件資訊
- **專案名稱**: ng-gighub
- **架構模式**: Domain-Driven Design + Clean Architecture + CQRS
- **框架**: Angular 20.1.x with SSR
- **建立日期**: 2025-11-21
- **版本**: 1.0.0

---

## 目錄

1. [架構概覽](#1-架構概覽)
2. [核心概念與設計模式](#2-核心概念與設計模式)
3. [分層架構詳解](#3-分層架構詳解)
4. [聚合根設計](#4-聚合根設計)
5. [資料流與互動](#5-資料流與互動)
6. [技術棧說明](#6-技術棧說明)
7. [開發規範與最佳實踐](#7-開發規範與最佳實踐)
8. [實作路線圖](#8-實作路線圖)

---

## 1. 架構概覽

### 1.1 架構目標

ng-gighub 專案採用 **Domain-Driven Design (DDD)** 搭配 **Clean Architecture** 原則，目標是建立一個：

- **高內聚、低耦合** 的模組化系統
- **易於測試** 的業務邏輯層
- **可維護且可擴展** 的程式碼結構
- **領域驅動** 的設計方法，將業務邏輯與技術實作分離

### 1.2 架構分層

專案採用四層架構，依照依賴方向由內到外：

```
┌─────────────────────────────────────────────────────┐
│                  Features Layer                      │
│              (Presentation / UI Layer)               │
│        Components, Pages, State Management           │
└─────────────────────────────────────────────────────┘
                         ↓ depends on
┌─────────────────────────────────────────────────────┐
│                 Application Layer                    │
│           Commands, Queries, Use Cases               │
│            DTOs, Application Services                │
└─────────────────────────────────────────────────────┘
                         ↓ depends on
┌─────────────────────────────────────────────────────┐
│                   Domain Layer                       │
│      Aggregates, Entities, Value Objects             │
│    Domain Events, Domain Services, Interfaces        │
│               (Pure Business Logic)                  │
└─────────────────────────────────────────────────────┘
                         ↑ implemented by
┌─────────────────────────────────────────────────────┐
│              Infrastructure Layer                    │
│    Repositories, Persistence, External Services      │
│        Event Bus, Auth, Email, Storage               │
└─────────────────────────────────────────────────────┘
```

**依賴規則：**
- Domain Layer 不依賴任何其他層（純業務邏輯）
- Application Layer 只依賴 Domain Layer
- Infrastructure Layer 實作 Domain Layer 定義的接口
- Features Layer 依賴 Application Layer 與 Domain Layer

---

## 2. 核心概念與設計模式

### 2.1 Domain-Driven Design (DDD)

#### 2.1.1 聚合根 (Aggregate Root)
聚合根是一組相關實體與值對象的入口點，負責維護聚合內的一致性。

**本專案的聚合根：**
- **Account**：使用者帳戶（User/Organization/Bot 三種類型）
- **Organization**：組織實體，管理成員與團隊
- **Team**：團隊實體，管理團隊成員
- **Repository**：程式碼倉庫，管理協作者與權限

#### 2.1.2 實體 (Entity)
具有唯一識別符的領域對象。

範例：
- `AccountProfile`：帳戶個人檔案
- `OrganizationMember`：組織成員
- `TeamMember`：團隊成員
- `RepositoryCollaborator`：倉庫協作者

#### 2.1.3 值對象 (Value Object)
不可變的領域概念，通過屬性值識別，封裝驗證邏輯。

範例：
- `AccountId`：帳戶唯一識別碼
- `Email`：電子郵件（含驗證）
- `Username`：使用者名稱（含格式驗證）
- `AccountRole`：帳戶角色

#### 2.1.4 領域事件 (Domain Event)
描述領域中發生的重要事情，用於模組間解耦。

範例：
- `AccountCreatedEvent`：帳戶建立事件
- `MemberAddedEvent`：成員加入事件
- `PermissionGrantedEvent`：權限授予事件

#### 2.1.5 領域服務 (Domain Service)
跨多個聚合根或實體的業務邏輯。

範例：
- `AccountDomainService`：帳戶領域服務
- `MemberManagementService`：成員管理服務
- `PermissionManagementService`：權限管理服務

#### 2.1.6 規格模式 (Specification)
封裝業務規則，可組合與重用。

範例：
- `CanSwitchAccountSpec`：是否可切換帳戶
- `CanDeleteAccountSpec`：是否可刪除帳戶

### 2.2 CQRS (Command Query Responsibility Segregation)

將系統的讀取（Query）與寫入（Command）操作分離。

#### 2.2.1 Command (命令)
改變系統狀態的操作。

```typescript
// Command 範例
export class CreateUserAccountCommand {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly displayName: string
  ) {}
}
```

#### 2.2.2 Query (查詢)
讀取系統狀態的操作。

```typescript
// Query 範例
export class GetAccountByIdQuery {
  constructor(public readonly accountId: string) {}
}
```

### 2.3 Repository Pattern (倉儲模式)

抽象資料存取層，Domain Layer 定義接口，Infrastructure Layer 實作。

```typescript
// Domain Layer - 接口定義
export interface IAccountRepository {
  findById(id: AccountId): Promise<Account | null>;
  save(account: Account): Promise<void>;
  delete(id: AccountId): Promise<void>;
}

// Infrastructure Layer - Supabase 實作
export class SupabaseAccountRepository implements IAccountRepository {
  // 實作細節...
}
```

### 2.4 Dependency Inversion (依賴反轉)

高層模組（Domain/Application）定義接口，低層模組（Infrastructure）實作接口，達到解耦。

---

## 3. 分層架構詳解

### 3.1 Domain Layer（領域層）

**位置：** `src/app/core/domain/`

**職責：**
- 定義核心業務邏輯與規則
- 不依賴任何外部框架或資料庫
- 純粹的 TypeScript 類別與接口

**結構：**

```
core/domain/
├── account/                    # Account 聚合根
│   ├── aggregates/
│   │   ├── account.aggregate.ts           # 抽象聚合根
│   │   ├── user-account.aggregate.ts      # User 類型
│   │   ├── organization-account.aggregate.ts
│   │   └── bot-account.aggregate.ts
│   ├── entities/
│   │   ├── account-profile.entity.ts
│   │   └── account-settings.entity.ts
│   ├── value-objects/
│   │   ├── account-id.vo.ts
│   │   ├── account-type.vo.ts
│   │   ├── account-name.vo.ts
│   │   ├── username.vo.ts
│   │   ├── email.vo.ts
│   │   └── account-role.vo.ts
│   ├── events/
│   │   ├── account-created.event.ts
│   │   ├── account-switched.event.ts
│   │   ├── account-updated.event.ts
│   │   └── account-deleted.event.ts
│   ├── repositories/
│   │   └── account.repository.interface.ts
│   ├── services/
│   │   ├── account-domain.service.ts
│   │   ├── account-factory.service.ts
│   │   └── account-validator.service.ts
│   └── specifications/
│       ├── can-switch-account.spec.ts
│       └── can-delete-account.spec.ts
├── organization/               # Organization 聚合根
├── team/                       # Team 聚合根
├── repository/                 # Repository 聚合根
└── shared/                     # 共享領域基礎
    ├── base/
    │   ├── aggregate-root.base.ts
    │   ├── entity.base.ts
    │   ├── value-object.base.ts
    │   └── domain-event.base.ts
    ├── types/
    │   ├── result.ts           # Result<T, E> 類型
    │   ├── either.ts           # Either<L, R> 類型
    │   └── unique-id.ts        # UniqueId 類型
    └── errors/
        ├── domain-error.ts
        └── validation-error.ts
```

**範例：Value Object**

```typescript
// username.vo.ts
export class Username extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(username: string): Result<Username, ValidationError> {
    if (!username || username.length < 3) {
      return Result.fail(new ValidationError('Username must be at least 3 characters'));
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return Result.fail(new ValidationError('Username contains invalid characters'));
    }
    return Result.ok(new Username(username));
  }

  public getValue(): string {
    return this.value;
  }
}
```

### 3.2 Application Layer（應用層）

**位置：** `src/app/core/application/`

**職責：**
- 協調領域對象執行用例
- 處理命令與查詢（CQRS）
- 定義 DTOs 用於資料傳輸
- 不包含業務邏輯（業務邏輯在 Domain Layer）

**結構：**

```
core/application/
├── account/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── create-user-account.handler.ts
│   │   │   ├── switch-account.handler.ts
│   │   │   ├── update-account.handler.ts
│   │   │   └── delete-account.handler.ts
│   │   ├── create-user-account.command.ts
│   │   ├── switch-account.command.ts
│   │   ├── update-account.command.ts
│   │   └── delete-account.command.ts
│   ├── queries/
│   │   ├── handlers/
│   │   │   ├── get-current-account.handler.ts
│   │   │   ├── list-accessible-accounts.handler.ts
│   │   │   └── get-account-by-username.handler.ts
│   │   ├── get-current-account.query.ts
│   │   ├── list-accessible-accounts.query.ts
│   │   └── get-account-by-username.query.ts
│   ├── dto/
│   │   ├── account.dto.ts
│   │   ├── user-account.dto.ts
│   │   ├── organization-account.dto.ts
│   │   └── bot-account.dto.ts
│   └── services/
│       ├── account-application.service.ts
│       └── account-switcher.service.ts
├── organization/
├── team/
├── repository/
└── shared/
    ├── interfaces/
    │   ├── command-handler.interface.ts
    │   └── query-handler.interface.ts
    └── base/
        ├── base-command.ts
        └── base-query.ts
```

**範例：Command Handler**

```typescript
// create-user-account.handler.ts
export class CreateUserAccountHandler implements ICommandHandler<CreateUserAccountCommand> {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly accountFactory: AccountFactory,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: CreateUserAccountCommand): Promise<Result<void, Error>> {
    // 1. 使用 Factory 建立聚合根
    const accountResult = this.accountFactory.createUser({
      username: command.username,
      email: command.email,
      displayName: command.displayName
    });

    if (accountResult.isFailure) {
      return Result.fail(accountResult.error);
    }

    const account = accountResult.getValue();

    // 2. 儲存到倉儲
    await this.accountRepository.save(account);

    // 3. 發布領域事件
    account.domainEvents.forEach(event => {
      this.eventPublisher.publish(event);
    });

    return Result.ok();
  }
}
```

### 3.3 Infrastructure Layer（基礎設施層）

**位置：** `src/app/core/infrastructure/`

**職責：**
- 實作 Domain Layer 定義的接口
- 處理資料持久化（Supabase）
- 整合外部服務（Email, Storage）
- 處理技術細節（Auth, Event Bus）

**結構：**

```
core/infrastructure/
├── persistence/
│   ├── supabase/
│   │   ├── repositories/
│   │   │   ├── account.repository.ts      # 實作 IAccountRepository
│   │   │   ├── organization.repository.ts
│   │   │   ├── team.repository.ts
│   │   │   └── repository.repository.ts
│   │   ├── mappers/
│   │   │   ├── account.mapper.ts          # Domain ↔ DB 轉換
│   │   │   ├── organization.mapper.ts
│   │   │   ├── team.mapper.ts
│   │   │   └── repository.mapper.ts
│   │   ├── schemas/
│   │   │   ├── account.schema.ts          # Supabase 表結構定義
│   │   │   ├── organization.schema.ts
│   │   │   ├── team.schema.ts
│   │   │   └── repository.schema.ts
│   │   └── migrations/
│   │       └── initial-schema.sql
│   └── query-services/
│       ├── account-query.service.ts       # 讀取優化（CQRS 查詢端）
│       ├── organization-query.service.ts
│       ├── team-query.service.ts
│       └── repository-query.service.ts
├── messaging/
│   ├── event-bus.service.ts               # 事件總線
│   ├── event-publisher.service.ts
│   └── handlers/
│       ├── account-created.handler.ts
│       ├── account-switched.handler.ts
│       ├── member-added.handler.ts
│       └── repository-created.handler.ts
├── auth/
│   ├── auth.service.ts
│   ├── jwt.service.ts
│   └── guards/
│       ├── auth.guard.ts
│       └── role.guard.ts
└── external/
    ├── email/
    │   └── email.service.ts
    └── storage/
        └── file-storage.service.ts
```

**範例：Mapper**

```typescript
// account.mapper.ts
export class AccountMapper {
  // Domain → Database
  public static toPersistence(account: Account): AccountRecord {
    return {
      id: account.id.getValue(),
      username: account.username.getValue(),
      email: account.email.getValue(),
      account_type: account.accountType.getValue(),
      display_name: account.displayName,
      created_at: account.createdAt,
      updated_at: account.updatedAt
    };
  }

  // Database → Domain
  public static toDomain(record: AccountRecord): Account {
    const accountId = AccountId.create(record.id).getValue();
    const username = Username.create(record.username).getValue();
    const email = Email.create(record.email).getValue();
    const accountType = AccountType.create(record.account_type).getValue();

    return Account.create({
      id: accountId,
      username,
      email,
      accountType,
      displayName: record.display_name,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }).getValue();
  }
}
```

### 3.4 Features Layer（功能模塊/展示層）

**位置：** `src/app/features/`

**職責：**
- 展示 UI 與使用者互動
- 調用 Application Layer 執行用例
- 管理 UI 狀態（Angular Signals）
- 處理路由與導航

**結構：**

```
features/
├── account/
│   ├── pages/
│   │   ├── account-profile/
│   │   │   ├── account-profile.component.ts
│   │   │   ├── account-profile.component.html
│   │   │   └── account-profile.component.scss
│   │   ├── account-settings/
│   │   └── account-switcher/
│   ├── components/
│   │   ├── account-card/
│   │   ├── account-avatar/
│   │   └── account-dropdown/
│   ├── state/
│   │   ├── current-account.store.ts       # Angular Signals Store
│   │   ├── accessible-accounts.store.ts
│   │   └── account-switcher.store.ts
│   └── account.routes.ts
├── organization/
│   ├── pages/
│   ├── components/
│   ├── state/
│   └── organization.routes.ts
├── team/
├── repository/
└── shared/                                 # 共享 UI 組件
    ├── components/
    ├── directives/
    ├── pipes/
    └── utils/
```

**範例：Component with State**

```typescript
// account-profile.component.ts
@Component({
  selector: 'app-account-profile',
  standalone: true,
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss']
})
export class AccountProfileComponent implements OnInit {
  private readonly currentAccountStore = inject(CurrentAccountStore);
  private readonly getAccountQuery = inject(GetCurrentAccountHandler);

  // Signals
  account = this.currentAccountStore.currentAccount;
  isLoading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.isLoading.set(true);
    
    const result = await this.getAccountQuery.execute(
      new GetCurrentAccountQuery()
    );

    if (result.isSuccess) {
      this.currentAccountStore.setAccount(result.getValue());
    } else {
      this.error.set(result.error.message);
    }

    this.isLoading.set(false);
  }
}
```

---

## 4. 聚合根設計

### 4.1 Account 聚合根

**概念：** 系統中的帳戶，支援三種類型：User（使用者）、Organization（組織）、Bot（機器人）。

**聚合邊界：**
- Account（聚合根）
  - AccountProfile（實體）
  - AccountSettings（實體）

**Value Objects:**
- AccountId
- Username
- Email
- AccountType
- AccountRole

**領域事件：**
- AccountCreatedEvent
- AccountSwitchedEvent
- AccountUpdatedEvent
- AccountDeletedEvent

**業務規則：**
1. Username 必須唯一且符合格式
2. Email 必須有效且已驗證
3. 只有擁有者可以刪除帳戶
4. 切換帳戶需要使用者有存取權限

### 4.2 Organization 聚合根

**概念：** 組織實體，管理成員、團隊與專案。

**聚合邊界：**
- Organization（聚合根）
  - OrganizationMember（實體集合）
  - OrganizationInvitation（實體集合）

**Value Objects:**
- OrganizationId
- MemberRole
- OrganizationPlan

**領域事件：**
- OrganizationCreatedEvent
- MemberAddedEvent
- MemberRemovedEvent
- TeamCreatedEvent

**業務規則：**
1. 組織必須至少有一位 Owner
2. 只有 Owner/Admin 可以新增/移除成員
3. 成員角色：Owner, Admin, Member, Billing
4. 組織名稱必須唯一

### 4.3 Team 聚合根

**概念：** 團隊，隸屬於組織，管理團隊成員與倉庫權限。

**聚合邊界：**
- Team（聚合根）
  - TeamMember（實體集合）

**Value Objects:**
- TeamId
- TeamName
- TeamRole

**領域事件：**
- TeamCreatedEvent
- MemberJoinedEvent
- MemberLeftEvent

**業務規則：**
1. 團隊必須隸屬於組織
2. 團隊名稱在組織內唯一
3. 只有組織管理員可以建立團隊
4. 團隊成員必須是組織成員

### 4.4 Repository 聚合根

**概念：** 程式碼倉庫，管理協作者與權限。

**聚合邊界：**
- Repository（聚合根）
  - RepositoryPermission（實體集合）
  - RepositoryCollaborator（實體集合）

**Value Objects:**
- RepositoryId
- RepositoryName
- Visibility（Public/Private/Internal）
- PermissionLevel（Read/Write/Admin）

**領域事件：**
- RepositoryCreatedEvent
- PermissionGrantedEvent
- CollaboratorAddedEvent

**業務規則：**
1. 倉庫名稱在擁有者範圍內唯一
2. Private 倉庫需要明確授權才能存取
3. 權限層級：Read < Write < Admin
4. 只有 Admin 可以變更權限

---

## 5. 資料流與互動

### 5.1 Command Flow（寫入流程）

```
User Action (UI)
    ↓
Component dispatches Command
    ↓
Command Handler (Application Layer)
    ↓
Domain Service / Aggregate Root (Domain Layer)
    ↓
Repository Interface (Domain Layer)
    ↓
Repository Implementation (Infrastructure Layer)
    ↓
Supabase Database
    ↓
Domain Events published
    ↓
Event Handlers react
```

**範例：建立使用者帳戶**

```typescript
// 1. UI Component
async createAccount() {
  const command = new CreateUserAccountCommand(
    this.form.value.username,
    this.form.value.email,
    this.form.value.displayName
  );
  
  const result = await this.commandHandler.execute(command);
  
  if (result.isSuccess) {
    this.router.navigate(['/account/profile']);
  }
}

// 2. Command Handler
async execute(command: CreateUserAccountCommand) {
  // 驗證與建立領域對象
  const account = await this.accountFactory.createUser(command);
  
  // 儲存
  await this.accountRepository.save(account);
  
  // 發布事件
  this.eventPublisher.publishAll(account.domainEvents);
  
  return Result.ok();
}

// 3. Domain Layer
class UserAccount extends Account {
  // 業務邏輯在這裡
}

// 4. Infrastructure Layer
class SupabaseAccountRepository {
  async save(account: Account) {
    const record = AccountMapper.toPersistence(account);
    await this.supabase.from('accounts').insert(record);
  }
}
```

### 5.2 Query Flow（讀取流程）

```
User Request (UI)
    ↓
Component dispatches Query
    ↓
Query Handler (Application Layer)
    ↓
Query Service (Infrastructure Layer)
    ↓
Supabase Database (optimized read)
    ↓
DTO returned to UI
```

**範例：查詢帳戶列表**

```typescript
// 1. UI Component
accounts = signal<AccountDTO[]>([]);

async loadAccounts() {
  const query = new ListAccessibleAccountsQuery(this.currentUserId);
  const result = await this.queryHandler.execute(query);
  
  if (result.isSuccess) {
    this.accounts.set(result.getValue());
  }
}

// 2. Query Handler
async execute(query: ListAccessibleAccountsQuery) {
  // 直接查詢優化的讀取模型
  const accounts = await this.accountQueryService.findAccessibleAccounts(
    query.userId
  );
  
  return Result.ok(accounts.map(a => AccountDTO.fromDomain(a)));
}

// 3. Query Service (Infrastructure)
async findAccessibleAccounts(userId: string) {
  const { data } = await this.supabase
    .from('accounts')
    .select('*, account_members!inner(*)')
    .eq('account_members.user_id', userId)
    .order('name');
  
  return data;
}
```

### 5.3 Event Flow（事件流程）

```
Aggregate emits Domain Event
    ↓
Event Publisher collects events
    ↓
Event Bus broadcasts
    ↓
Event Handlers subscribe and react
    ↓
Side Effects (send email, update cache, etc.)
```

**範例：帳戶建立事件**

```typescript
// 1. Domain Event
export class AccountCreatedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly accountType: string,
    public readonly email: string
  ) {
    super();
  }
}

// 2. Aggregate emits event
class UserAccount {
  public static create(props: UserAccountProps): Result<UserAccount> {
    const account = new UserAccount(props);
    
    // 發出領域事件
    account.addDomainEvent(new AccountCreatedEvent(
      account.id.getValue(),
      'user',
      account.email.getValue()
    ));
    
    return Result.ok(account);
  }
}

// 3. Event Handler
@Injectable()
export class AccountCreatedHandler implements IEventHandler<AccountCreatedEvent> {
  constructor(private readonly emailService: EmailService) {}
  
  async handle(event: AccountCreatedEvent): Promise<void> {
    // 發送歡迎信
    await this.emailService.sendWelcomeEmail(event.email);
    
    // 其他副作用...
  }
}
```

---

## 6. 技術棧說明

### 6.1 核心技術

| 技術 | 版本 | 用途 |
|------|------|------|
| Angular | 20.1.x | 前端框架 |
| TypeScript | 5.8.x | 程式語言 |
| RxJS | 7.8.x | 響應式程式設計 |
| @angular/ssr | 20.1.x | 伺服器端渲染 |
| Express | 5.1.x | SSR 伺服器 |

### 6.2 後端服務

| 技術 | 用途 |
|------|------|
| Supabase | PostgreSQL 資料庫 + Storage + Auth |
| @supabase/supabase-js | Supabase 客戶端函式庫 |

### 6.3 UI 框架

| 技術 | 版本 | 用途 |
|------|------|------|
| Angular Material | 20.1.x | UI 元件庫 |
| Angular CDK | 20.1.x | 元件開發工具包 |
| @angular/animations | 20.1.x | 動畫 |

### 6.4 測試

| 技術 | 用途 |
|------|------|
| Jasmine | 測試框架 |
| Karma | 測試執行器 |

### 6.5 開發工具

| 技術 | 用途 |
|------|------|
| Angular CLI | 專案腳手架與建置工具 |
| Prettier | 程式碼格式化 |

---

## 7. 開發規範與最佳實踐

### 7.1 領域層規範

#### 7.1.1 聚合根設計原則
1. **小聚合優先**：聚合應該盡量小，只包含必須保持一致性的實體
2. **通過 ID 引用**：聚合之間通過 ID 引用，而非直接持有對象
3. **事務邊界**：一個事務只修改一個聚合根
4. **不變性維護**：聚合根負責維護聚合內的業務不變性

#### 7.1.2 值對象規範
1. **不可變性**：值對象建立後不可修改
2. **自我驗證**：驗證邏輯封裝在 `create()` 靜態方法
3. **相等性比較**：通過值比較，而非引用比較

```typescript
export abstract class ValueObject<T> {
  protected readonly value: T;

  protected constructor(value: T) {
    this.value = Object.freeze(value);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this.value) === JSON.stringify(vo.value);
  }
}
```

#### 7.1.3 領域事件規範
1. **過去式命名**：事件名稱使用過去式（AccountCreated, MemberAdded）
2. **不可變**：事件物件不可修改
3. **包含足夠資訊**：事件應包含處理所需的所有資訊
4. **時間戳記**：每個事件記錄發生時間

```typescript
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;

  protected constructor() {
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID();
  }
}
```

### 7.2 應用層規範

#### 7.2.1 Command Handler 規範
1. **單一職責**：一個 Handler 只處理一個 Command
2. **協調不計算**：Handler 協調領域對象，不包含業務邏輯
3. **錯誤處理**：使用 `Result<T, E>` 型別回傳結果
4. **事務管理**：Handler 負責事務邊界

```typescript
export interface ICommandHandler<TCommand> {
  execute(command: TCommand): Promise<Result<void, Error>>;
}
```

#### 7.2.2 Query Handler 規範
1. **不改變狀態**：Query 只讀取，不修改狀態
2. **回傳 DTO**：不直接回傳領域對象，使用 DTO
3. **效能優化**：可直接查詢資料庫，無需載入完整聚合

```typescript
export interface IQueryHandler<TQuery, TResult> {
  execute(query: TQuery): Promise<Result<TResult, Error>>;
}
```

#### 7.2.3 DTO 規範
1. **純資料對象**：只包含資料，無行為
2. **扁平結構**：適合前端使用的扁平結構
3. **明確命名**：清楚表達用途（UserAccountDTO, OrganizationListDTO）

### 7.3 基礎設施層規範

#### 7.3.1 Repository 實作規範
1. **接口實作**：嚴格實作 Domain Layer 定義的接口
2. **Mapper 分離**：使用 Mapper 進行領域對象與資料庫記錄轉換
3. **錯誤處理**：捕捉資料庫錯誤，轉換為領域錯誤

```typescript
export class SupabaseAccountRepository implements IAccountRepository {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly mapper: AccountMapper
  ) {}

  async findById(id: AccountId): Promise<Account | null> {
    const { data, error } = await this.supabase
      .from('accounts')
      .select('*')
      .eq('id', id.getValue())
      .single();

    if (error) {
      throw new RepositoryError(error.message);
    }

    return data ? this.mapper.toDomain(data) : null;
  }

  async save(account: Account): Promise<void> {
    const record = this.mapper.toPersistence(account);
    const { error } = await this.supabase
      .from('accounts')
      .upsert(record);

    if (error) {
      throw new RepositoryError(error.message);
    }
  }
}
```

#### 7.3.2 Mapper 規範
1. **雙向轉換**：實作 `toDomain()` 和 `toPersistence()` 方法
2. **完整性**：確保轉換過程不遺失資料
3. **類型安全**：使用 TypeScript 型別確保正確性

### 7.4 展示層規範

#### 7.4.1 Component 規範
1. **Standalone Components**：優先使用 Standalone Components
2. **OnPush Strategy**：使用 OnPush Change Detection 提升效能
3. **Signal-based State**：使用 Angular Signals 管理狀態
4. **Smart/Dumb 分離**：分離容器組件與展示組件

```typescript
@Component({
  selector: 'app-account-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AccountCardComponent],
  template: `
    <div class="account-list">
      @for (account of accounts(); track account.id) {
        <app-account-card [account]="account" />
      }
    </div>
  `
})
export class AccountListComponent {
  accounts = input.required<AccountDTO[]>();
}
```

#### 7.4.2 State Management 規範
1. **Store 模式**：使用 Store 管理複雜狀態
2. **Computed Signals**：使用 computed() 衍生狀態
3. **Effect 謹慎使用**：只在必要時使用 effect()

```typescript
@Injectable()
export class CurrentAccountStore {
  // State
  private readonly _account = signal<AccountDTO | null>(null);
  private readonly _isLoading = signal(false);

  // Selectors
  public readonly currentAccount = this._account.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  // Computed
  public readonly isOrganization = computed(() => 
    this.currentAccount()?.accountType === 'organization'
  );

  // Actions
  public setAccount(account: AccountDTO) {
    this._account.set(account);
  }

  public setLoading(loading: boolean) {
    this._isLoading.set(loading);
  }
}
```

### 7.5 測試規範

#### 7.5.1 單元測試
1. **測試領域邏輯**：重點測試 Domain Layer 的業務邏輯
2. **隔離測試**：使用 Mock 隔離依賴
3. **AAA 模式**：Arrange-Act-Assert

```typescript
describe('Username ValueObject', () => {
  it('should create valid username', () => {
    // Arrange
    const validUsername = 'john_doe123';

    // Act
    const result = Username.create(validUsername);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().getValue()).toBe(validUsername);
  });

  it('should fail for short username', () => {
    // Arrange
    const shortUsername = 'ab';

    // Act
    const result = Username.create(shortUsername);

    // Assert
    expect(result.isFailure).toBe(true);
  });
});
```

#### 7.5.2 整合測試
1. **測試層間互動**：測試 Application → Infrastructure 整合
2. **使用測試資料庫**：Supabase 測試專案
3. **清理測試資料**：每個測試後清理

---

## 8. 實作路線圖

### Phase 1: 基礎設施建立（Week 1-2）

- [ ] 建立資料夾結構
  - `src/app/core/domain/`
  - `src/app/core/application/`
  - `src/app/core/infrastructure/`
  - `src/app/features/`
- [ ] 實作 Shared Domain 基礎類別
  - `AggregateRoot`, `Entity`, `ValueObject`
  - `DomainEvent`, `Result`, `Either`
  - Domain Errors
- [ ] 設定 Supabase 連線與配置
- [ ] 建立基礎測試架構

### Phase 2: Account 聚合根實作（Week 3-4）

- [ ] Domain Layer
  - Account Aggregate (User/Organization/Bot)
  - Value Objects (Username, Email, AccountId, etc.)
  - Domain Events
  - Repository Interface
  - Domain Services
- [ ] Application Layer
  - Commands & Handlers (Create, Update, Delete)
  - Queries & Handlers (Get, List)
  - DTOs
- [ ] Infrastructure Layer
  - Supabase Repository Implementation
  - Mappers
  - Database Schema & Migration
- [ ] Features Layer
  - Account Profile Page
  - Account Settings Page
  - Account Switcher Component

### Phase 3: Organization 聚合根實作（Week 5-6）

- [ ] Domain Layer
  - Organization Aggregate
  - Member Management
  - Value Objects & Events
- [ ] Application Layer
  - Member Commands (Add, Remove, UpdateRole)
  - Organization Queries
- [ ] Infrastructure Layer
  - Organization Repository
  - Member Mappers
- [ ] Features Layer
  - Organization Dashboard
  - Members Management UI

### Phase 4: Team 聚合根實作（Week 7-8）

- [ ] Domain Layer
  - Team Aggregate
  - Team Member Entity
  - Team Events
- [ ] Application Layer
  - Team Commands & Queries
- [ ] Infrastructure Layer
  - Team Repository
- [ ] Features Layer
  - Team Pages & Components

### Phase 5: Repository 聚合根實作（Week 9-10）

- [ ] Domain Layer
  - Repository Aggregate
  - Permission Management
  - Collaborator Management
- [ ] Application Layer
  - Repository Commands & Queries
- [ ] Infrastructure Layer
  - Repository Repository (!)
  - Permission Service
- [ ] Features Layer
  - Repository List/Detail Pages
  - Collaborator Management UI

### Phase 6: Event System 與整合（Week 11-12）

- [ ] Event Bus Implementation
- [ ] Event Handlers
- [ ] Cross-Aggregate Workflows
- [ ] Integration Testing

### Phase 7: UI 優化與完善（Week 13-14）

- [ ] Shared Components
- [ ] Layouts
- [ ] Navigation
- [ ] Error Handling
- [ ] Loading States

### Phase 8: 測試與文件（Week 15-16）

- [ ] Unit Tests Coverage > 80%
- [ ] Integration Tests
- [ ] E2E Tests (critical paths)
- [ ] API Documentation
- [ ] User Documentation

---

## 附錄

### A. 資料夾結構完整清單

完整的資料夾結構請參考專案根目錄提供的結構草圖，或查看 `docs/architecture/FOLDER_STRUCTURE.md`。

### B. 相關文件

- **系統概覽**: `docs/architecture/system-overview.md`
- **API 規格**: `docs/architecture/api-specs/`
- **資料庫 Schema**: `docs/architecture/DATABASE_SCHEMA.md`
- **Supabase 設定**: `setup/supabase.md`
- **環境設定**: `setup/environment.md`

### C. 參考資料

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Angular Architecture Guide](https://angular.dev/guide/architecture)
- [Supabase Documentation](https://supabase.com/docs)

---

**文件維護者**: Development Team  
**最後更新**: 2025-11-22  
**版本**: 1.0.0
