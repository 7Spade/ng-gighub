# DDD Architecture Usage Guide

## 快速開始

這份指南說明如何使用 ng-gighub 的新 DDD 架構。

## 目錄結構概覽

```
src/app/
├── domain/              # 領域層 - 業務邏輯與實體
├── application/         # 應用層 - 用例與 CQRS
├── presentation/        # 展示層 - UI 與狀態管理
└── infrastructure/      # 基礎設施層 - 技術實作
```

## 核心概念

### 1. Domain Layer（領域層）

領域層包含純粹的業務邏輯，不依賴任何外部框架。

#### Account 多型模型

```typescript
import { Account, UserAccount, OrganizationAccount, BotAccount } from './domain/account';

// 建立 User Account
const user = new UserAccount(
  'uuid',
  'johndoe',
  'John Doe',
  'john@example.com'
);

// 建立 Organization Account
const org = new OrganizationAccount(
  'uuid',
  'myorg',
  'My Organization',
  'My Org Inc.'
);

// 型別保護
if (account.isUser()) {
  // TypeScript 知道這是 UserAccount
  console.log(account.email);
}

if (account.isOrganization()) {
  // TypeScript 知道這是 OrganizationAccount
  console.log(account.organizationName);
}
```

#### Domain Services

```typescript
import { inject } from '@angular/core';
import { AccountSwitcherService } from './domain/account';

const switcher = inject(AccountSwitcherService);

// 取得當前帳號（signal）
const currentAccount = switcher.currentAccount();

// 切換帳號
switcher.switchAccount(account);

// 檢查是否為組織
const isOrg = switcher.isCurrentAccountOrganization();
```

### 2. Application Layer（應用層）

應用層使用 CQRS 模式分離讀寫操作。

#### Commands（寫入操作）

```typescript
import { inject } from '@angular/core';
import { CreateUserAccountCommandHandler } from './application/account';

const handler = inject(CreateUserAccountCommandHandler);

handler.execute({
  username: 'johndoe',
  displayName: 'John Doe',
  email: 'john@example.com',
  bio: 'Developer'
}).subscribe({
  next: (accountDto) => {
    console.log('Account created:', accountDto);
  },
  error: (err) => {
    console.error('Failed to create account:', err);
  }
});
```

#### Queries（讀取操作）

```typescript
import { inject } from '@angular/core';
import { ListAccessibleAccountsQueryHandler } from './application/account';

const handler = inject(ListAccessibleAccountsQueryHandler);

handler.execute({ userId: 'current-user-id' }).subscribe({
  next: (accounts) => {
    console.log('Accessible accounts:', accounts);
  }
});
```

### 3. Presentation Layer（展示層）

#### 使用 Stores（Signal-based State Management）

```typescript
import { Component, inject } from '@angular/core';
import { CurrentAccountStore, AccessibleAccountsStore } from './presentation/store';

@Component({
  // ...
})
export class MyComponent {
  private currentAccountStore = inject(CurrentAccountStore);
  private accessibleAccountsStore = inject(AccessibleAccountsStore);

  // Signals（自動響應式）
  currentAccount = this.currentAccountStore.account;
  isUser = this.currentAccountStore.isUser;
  accounts = this.accessibleAccountsStore.accounts;

  // 在 template 中使用
  // {{ currentAccount()?.displayName }}
  // {{ isUser() ? 'User Mode' : 'Other Mode' }}
}
```

#### 更新 Store 狀態

```typescript
// 設定當前帳號
currentAccountStore.setAccount(accountDto);

// 設定載入狀態
currentAccountStore.setLoading(true);

// 設定錯誤
currentAccountStore.setError('Something went wrong');

// 清除狀態
currentAccountStore.clear();
```

### 4. Infrastructure Layer（基礎設施層）

基礎設施層包含與外部系統（資料庫、API）的整合。

#### 使用 Repository

```typescript
import { inject } from '@angular/core';
import { AccountRepository } from './infrastructure/supabase/repositories/account.repository';

const repo = inject(AccountRepository);

// 查詢帳號
repo.findById('uuid').subscribe(account => {
  if (account) {
    console.log('Found:', account);
  }
});

// 檢查 username 可用性
repo.isUsernameAvailable('newuser').subscribe(available => {
  if (available) {
    console.log('Username is available');
  }
});
```

## 完整範例：建立並切換帳號

```typescript
import { Component, inject } from '@angular/core';
import { CreateUserAccountCommandHandler, SwitchAccountCommandHandler } from './application/account';
import { CurrentAccountStore, AccessibleAccountsStore } from './presentation/store';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-account-example',
  template: `
    <div>
      <h2>Current Account</h2>
      @if (currentAccount(); as account) {
        <p>{{ account.displayName }} (@{{ account.username }})</p>
      }

      <h2>Available Accounts</h2>
      @for (account of accessibleAccounts(); track account.id) {
        <button (click)="switchTo(account.id)">
          {{ account.displayName }}
        </button>
      }

      <h2>Create New Account</h2>
      <button (click)="createAccount()">Create Test User</button>
    </div>
  `
})
export class AccountExampleComponent {
  private createUserHandler = inject(CreateUserAccountCommandHandler);
  private switchAccountHandler = inject(SwitchAccountCommandHandler);
  private currentAccountStore = inject(CurrentAccountStore);
  private accessibleAccountsStore = inject(AccessibleAccountsStore);

  currentAccount = this.currentAccountStore.account;
  accessibleAccounts = this.accessibleAccountsStore.accounts;

  createAccount(): void {
    this.createUserHandler.execute({
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com'
    }).pipe(
      // 建立後自動切換
      switchMap(accountDto => 
        this.switchAccountHandler.execute({ accountId: accountDto.id })
      )
    ).subscribe({
      next: () => {
        console.log('Account created and switched');
      },
      error: (err) => {
        console.error('Failed:', err);
      }
    });
  }

  switchTo(accountId: string): void {
    this.switchAccountHandler.execute({ accountId }).subscribe();
  }
}
```

## 資料庫操作

### 直接使用 Supabase Client（適用於簡單查詢）

```typescript
import { inject } from '@angular/core';
import { SupabaseService } from './services/supabase.service';

const supabase = inject(SupabaseService);
const client = supabase.client;

if (client) {
  // 查詢 teams
  const { data, error } = await client
    .from('teams')
    .select('*')
    .eq('organization_id', 'org-uuid');

  if (!error && data) {
    console.log('Teams:', data);
  }
}
```

### 使用 Mappers 轉換資料

```typescript
import { AccountMapper } from './infrastructure/supabase/mappers/account.mapper';

// DB → Domain
const domainAccount = AccountMapper.toDomain(dbRow);

// Domain → DB Insert
const insertData = AccountMapper.toInsert(domainAccount);

// Domain → DB Update
const updateData = AccountMapper.toUpdate(domainAccount);
```

## 測試

### Domain Models

```typescript
import { UserAccount } from './domain/account';

describe('UserAccount', () => {
  it('should validate email', () => {
    const account = new UserAccount(
      'uuid',
      'john',
      'John',
      'invalid-email'
    );

    expect(account.validate()).toBe(false);
  });

  it('should update email', () => {
    const account = new UserAccount(
      'uuid',
      'john',
      'John',
      'john@example.com'
    );

    account.updateEmail('newemail@example.com');
    expect(account.email).toBe('newemail@example.com');
  });
});
```

### Command Handlers

```typescript
import { TestBed } from '@angular/core/testing';
import { CreateUserAccountCommandHandler } from './application/account';
import { AccountRepository } from './infrastructure/supabase/repositories/account.repository';
import { of } from 'rxjs';

describe('CreateUserAccountCommandHandler', () => {
  let handler: CreateUserAccountCommandHandler;
  let mockRepo: jasmine.SpyObj<AccountRepository>;

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('AccountRepository', ['createUser']);
    
    TestBed.configureTestingModule({
      providers: [
        CreateUserAccountCommandHandler,
        { provide: AccountRepository, useValue: mockRepo }
      ]
    });

    handler = TestBed.inject(CreateUserAccountCommandHandler);
  });

  it('should create user account', (done) => {
    const mockAccount = { /* ... */ };
    mockRepo.createUser.and.returnValue(of(mockAccount));

    handler.execute({
      username: 'test',
      displayName: 'Test',
      email: 'test@example.com'
    }).subscribe({
      next: (result) => {
        expect(result).toBeTruthy();
        done();
      }
    });
  });
});
```

## 最佳實踐

### 1. 依賴方向
```
Presentation → Application → Domain ← Infrastructure
```

- Domain 不應依賴任何其他層
- Application 可依賴 Domain
- Infrastructure 實作 Domain 定義的介面
- Presentation 使用 Application 與 Domain

### 2. 使用 Signals 而非 Observables（當適用時）

```typescript
// ✅ 好的做法 - 使用 signal 作為狀態
readonly account = signal<Account | null>(null);

// ❌ 避免 - 使用 BehaviorSubject 作為狀態
readonly account$ = new BehaviorSubject<Account | null>(null);
```

### 3. 使用 inject() 而非 constructor injection（現代 Angular）

```typescript
// ✅ 好的做法
export class MyComponent {
  private store = inject(CurrentAccountStore);
}

// ❌ 舊的做法（但仍可用）
export class MyComponent {
  constructor(private store: CurrentAccountStore) {}
}
```

### 4. 使用型別保護

```typescript
// ✅ 好的做法 - 使用型別保護
if (account.isUser()) {
  // TypeScript 知道這是 UserAccount
  const email = account.email; // OK
}

// ❌ 避免 - 型別斷言
const userAccount = account as UserAccount; // 不安全
```

## 擴充架構

### 新增 Domain Entity

1. 在 `domain/<entity>/models/` 建立 model
2. 定義驗證邏輯
3. 建立 repository interface

### 新增 Command/Query

1. 在 `application/<entity>/commands/` 或 `queries/` 建立 handler
2. 定義介面
3. 注入必要的 repositories
4. 實作業務邏輯

### 新增 Store

1. 在 `presentation/store/<entity>/` 建立 store
2. 使用 signals 定義狀態
3. 定義 actions 方法
4. 使用 `providedIn: 'root'` 讓 store 為 singleton

## 常見問題

### Q: 為什麼使用 CQRS？
A: CQRS 分離讀寫操作，讓程式碼更清晰、易於測試和維護。

### Q: 何時使用 Domain Services vs. Application Services？
A: Domain Services 包含純業務邏輯，Application Services 編排 use cases 並處理 DTO 轉換。

### Q: Signal 與 Observable 的差異？
A: Signals 是同步、細粒度的響應式原語，適合狀態管理。Observables 更適合非同步操作流。

### Q: 如何處理表單？
A: 在 Presentation Layer 使用 Reactive Forms，透過 Commands 送出資料。

## 參考資源

- [DDD 架構文件](./DDD_ARCHITECTURE.md)
- [Angular Signals 文件](https://angular.dev/guide/signals)
- [Domain-Driven Design 概念](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS 模式](https://martinfowler.com/bliki/CQRS.html)
