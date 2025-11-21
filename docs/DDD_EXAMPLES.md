# DDD 架構圖示與使用範例

## 層次架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                      Presentation Layer                          │
│  ┌───────────────┐  ┌──────────────┐  ┌───────────────────────┐│
│  │   Layouts     │  │  Components  │  │    Stores (Signals)   ││
│  │  - Default    │  │  - Account   │  │  - CurrentAccount     ││
│  │    Layout     │  │    Switcher  │  │  - AccessibleAccounts ││
│  └───────────────┘  └──────────────┘  └───────────────────────┘│
└───────────────────────────────┬─────────────────────────────────┘
                                │ uses
┌───────────────────────────────▼─────────────────────────────────┐
│                      Application Layer                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  CQRS Pattern                                                ││
│  │  ┌──────────────────┐         ┌─────────────────────────┐  ││
│  │  │    Commands      │         │       Queries           │  ││
│  │  │  - Create User   │         │  - Get Current Account  │  ││
│  │  │  - Create Org    │         │  - List Accessible      │  ││
│  │  │  - Create Bot    │         │  - Get By Username      │  ││
│  │  │  - Switch        │         │                         │  ││
│  │  └──────────────────┘         └─────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬─────────────────────────────────┘
                                │ coordinates
┌───────────────────────────────▼─────────────────────────────────┐
│                        Domain Layer                              │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Account Domain   │  │ Team Domain  │  │ Repo Domain      │  │
│  │  ┌────────────┐  │  │  - Team      │  │  - Repository    │  │
│  │  │  Account   │  │  │    Model     │  │    Model         │  │
│  │  │ (abstract) │  │  │  - Team      │  │  - Permission    │  │
│  │  └─────┬──────┘  │  │    Service   │  │    Service       │  │
│  │   ┌────┴─────┐   │  └──────────────┘  └──────────────────┘  │
│  │   ▼    ▼     ▼   │                                           │
│  │  User Org  Bot   │  Value Objects: AccountType, AccountRole │
│  │                  │  Services: AccountDomainService           │
│  │  Repository      │           AccountSwitcherService          │
│  │  Interface       │                                           │
│  └──────────────────┘                                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │ implements
┌───────────────────────────────▼─────────────────────────────────┐
│                    Infrastructure Layer                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Supabase Integration                                        ││
│  │  ┌──────────────────┐         ┌─────────────────────────┐  ││
│  │  │   Repositories   │         │       Mappers           │  ││
│  │  │  - Account Repo  │◄────────│  - Account Mapper       │  ││
│  │  │    (implements   │         │    (polymorphic)        │  ││
│  │  │     interface)   │         │  - Team Mapper          │  ││
│  │  └──────────────────┘         └─────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬─────────────────────────────────┘
                                │ persists to
                                ▼
                        ┌───────────────┐
                        │   Supabase    │
                        │   Database    │
                        └───────────────┘
```

## Account 多型結構

```
                 ┌─────────────────┐
                 │    Account      │ (abstract)
                 │  - id           │
                 │  - username     │
                 │  - displayName  │
                 │  - type         │
                 │  + toJSON()     │
                 │  + abstract     │
                 │    getTypeData()│
                 └────────┬────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
    │   User   │    │   Org    │    │   Bot    │
    │ Account  │    │ Account  │    │ Account  │
    ├──────────┤    ├──────────┤    ├──────────┤
    │firstName │    │companyName│   │ownerId   │
    │lastName  │    │memberCount│   │purpose   │
    │location  │    │teamCount  │   │isActive  │
    │website   │    │location   │   │lastActive│
    │isVerified│    │isVerified │   │          │
    └──────────┘    └──────────┘    └──────────┘
```

## 資料流範例

### 1. 建立使用者帳號

```typescript
// 1. Presentation Layer - Component
const dto: CreateUserAccountDto = {
  username: 'john_doe',
  displayName: 'John Doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe'
};

// 2. Application Layer - Command
const createCommand = inject(CreateUserAccountCommand);
const accountRepository = inject(AccountRepository);

createCommand.execute(dto, accountRepository).subscribe({
  next: (userAccount) => {
    // 3. Domain Model - UserAccount 實例
    console.log(userAccount.getFullName()); // "John Doe"
    
    // 4. Update Store
    currentAccountStore.setCurrentAccount(userAccount);
  }
});

// Behind the scenes:
// - Command 驗證 DTO
// - 建立 UserAccount domain model
// - AccountDomainService 驗證業務規則
// - Repository 透過 Mapper 轉換為 DB row
// - Supabase 儲存資料
// - Mapper 將結果轉回 domain model
```

### 2. 切換帳號

```typescript
// 1. User clicks on account in switcher
onSwitchAccount(accountId: string) {
  // 2. Component calls Store
  this.currentAccountStore.switchAccount(accountId);
}

// Behind the scenes in Store:
switchAccount(accountId: string) {
  // 3. Store uses Command
  return this.switchAccountCommand.execute(accountId);
}

// In Command:
execute(accountId: string): boolean {
  // 4. Command uses Domain Service
  return this.accountSwitcher.switchToAccount(accountId);
}

// In Domain Service:
switchToAccount(accountId: string): boolean {
  const account = this.accessibleAccounts().find(a => a.id === accountId);
  if (account) {
    // 5. Update signal (reactive)
    this.currentAccountSignal.set(account);
    return true;
  }
  return false;
}

// 6. All components using currentAccount signal automatically update!
```

### 3. 取得可切換的帳號列表

```typescript
// 1. Component initializes
ngOnInit() {
  const userId = this.currentAccountStore.accountId();
  
  // 2. Load accessible accounts
  this.accessibleAccountsStore.loadAccessibleAccounts(userId);
}

// Behind the scenes:
loadAccessibleAccounts(userId: string) {
  // 3. Store uses Query
  this.listAccessibleAccountsQuery
    .execute(userId, this.accountRepository)
    .subscribe({
      next: (accounts) => {
        // 4. Update signal with results
        this.accountSwitcher.setAccessibleAccounts(accounts);
      }
    });
}

// In Query:
execute(userId: string, repository: IAccountRepository) {
  // 5. Query calls Repository
  return repository.findAccessibleAccounts(userId);
}

// In Repository:
findAccessibleAccounts(userId: string) {
  // 6. Query Supabase
  return from(
    this.client
      .from('accounts')
      .select('*')
      .or(`id.eq.${userId},type.eq.organization`)
  ).pipe(
    // 7. Map rows to domain models (polymorphic!)
    map(({ data }) => AccountMapper.toDomainArray(data))
  );
}

// 8. Mapper creates correct subclass based on type
// - type: 'user' → new UserAccount(...)
// - type: 'organization' → new OrganizationAccount(...)
// - type: 'bot' → new BotAccount(...)
```

## 多型映射範例

```typescript
// Database Row (from Supabase)
const row = {
  id: '123',
  username: 'acme_corp',
  type: 'organization',
  display_name: 'ACME Corporation',
  company_name: 'ACME Corp',
  member_count: 50,
  team_count: 5,
  // ... other fields
};

// Mapper 自動判斷類型並建立對應的子類
const account = AccountMapper.toDomain(row);
// → OrganizationAccount 實例

// 多型使用
account.getDisplayName(); // 繼承自 Account
account.hasMembers();     // OrganizationAccount 特有方法
account.toJSON();         // 包含所有欄位（基類 + 子類）
```

## 測試範例

### Domain Layer 測試

```typescript
describe('UserAccount', () => {
  it('should get full name', () => {
    const user = new UserAccount(
      '1', 'john', 'john@test.com', 'John Doe',
      null, null, new Date(), new Date(),
      'John', 'Doe', null, null, false
    );
    
    expect(user.getFullName()).toBe('John Doe');
  });
  
  it('should validate email', () => {
    const service = new AccountDomainService();
    const user = new UserAccount(
      '1', 'john', 'invalid-email', 'John',
      null, null, new Date(), new Date(),
      null, null, null, null, false
    );
    
    const result = service.validateAccountCreation(user);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });
});
```

### Application Layer 測試

```typescript
describe('CreateUserAccountCommand', () => {
  it('should create user account', (done) => {
    const mockRepo: IAccountRepository = {
      create: jasmine.createSpy('create').and.returnValue(
        of(new UserAccount(...))
      )
    };
    
    const command = new CreateUserAccountCommand(/* inject mocks */);
    const dto: CreateUserAccountDto = {
      username: 'test',
      displayName: 'Test User',
      email: 'test@test.com'
    };
    
    command.execute(dto, mockRepo).subscribe({
      next: (account) => {
        expect(account).toBeInstanceOf(UserAccount);
        expect(mockRepo.create).toHaveBeenCalled();
        done();
      }
    });
  });
});
```

### Presentation Layer 測試

```typescript
describe('CurrentAccountStore', () => {
  it('should switch account', () => {
    const store = new CurrentAccountStore(/* inject mocks */);
    const account = new UserAccount(...);
    
    store.setCurrentAccount(account);
    
    expect(store.currentAccount()).toBe(account);
    expect(store.hasAccount()).toBe(true);
  });
});
```

## 擴展指南

### 加入新的 Account 類型（例如：TeamAccount）

1. **建立 Domain Model**
```typescript
// domain/account/models/team-account.model.ts
export class TeamAccount extends Account {
  constructor(
    // ... base properties
    public readonly teamId: string,
    public readonly permissions: string[]
  ) {
    super(..., AccountType.TEAM);
  }
  
  getTypeSpecificData() {
    return { teamId: this.teamId, permissions: this.permissions };
  }
}
```

2. **更新 Value Object**
```typescript
// domain/account/value-objects/account-type.vo.ts
export enum AccountType {
  USER = 'user',
  ORGANIZATION = 'organization',
  BOT = 'bot',
  TEAM = 'team' // 新增
}
```

3. **更新 Mapper**
```typescript
// infrastructure/supabase/mappers/account.mapper.ts
switch (row.type) {
  // ... existing cases
  case AccountType.TEAM:
    return new TeamAccount(...);
}
```

4. **建立 Command**
```typescript
// application/account/commands/create-team-account.command.ts
export class CreateTeamAccountCommand {
  execute(dto: CreateTeamAccountDto) {
    const team = new TeamAccount(...);
    // validation and creation logic
  }
}
```

That's it! 多型架構讓擴展變得簡單。

## 最佳實務

1. **Domain Layer 保持純粹**：不依賴外部框架
2. **使用 Value Objects**：封裝業務概念（如 AccountType）
3. **Repository Interface 在 Domain**：實作在 Infrastructure
4. **CQRS 分離讀寫**：命令改變狀態，查詢讀取資料
5. **Signals 取代 RxJS**：在 Store 層使用 signals 提升效能
6. **Mapper 負責轉換**：Domain ↔ Database 的橋樑
7. **SSR 相容**：所有瀏覽器 API 使用前先檢查平台
8. **型別安全**：使用 TypeScript 嚴格模式
9. **不可變性**：避免直接修改物件
10. **測試每一層**：Domain 最重要，必須完整測試

## 效能考量

- **Signals 優於 RxJS Subjects**：更好的變更偵測
- **computed() 自動快取**：只在依賴改變時重新計算
- **Lazy Loading**：頁面組件可以使用路由的 lazy loading
- **OnPush Change Detection**：與 signals 搭配使用
- **Repository 層可加快取**：減少資料庫查詢

## 部署建議

1. **環境變數**：`.env` 設定 Supabase URL 和 Key
2. **Database Schema**：建立對應的 accounts, teams, repositories 表
3. **RLS Policies**：設定適當的 Row Level Security
4. **Index**：為常用查詢欄位建立索引（username, type）
5. **SSR 預渲染**：考慮預渲染公開頁面
