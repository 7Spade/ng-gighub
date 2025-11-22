# 依賴規則 (Dependency Rules)

## 概述

本文檔補充 [ARCHITECTURE.md](./src/app/ARCHITECTURE.md) 中的依賴規則，詳細說明模組間的依賴關係、禁止事項和檢查方法。

---

## 目錄

1. [核心原則](#核心原則)
2. [分層依賴規則](#分層依賴規則)
3. [模組間依賴](#模組間依賴)
4. [禁止的依賴模式](#禁止的依賴模式)
5. [依賴注入原則](#依賴注入原則)
6. [檢查和驗證](#檢查和驗證)

---

## 核心原則

### 1. 依賴反轉原則 (Dependency Inversion Principle)

高層模組不應依賴低層模組，兩者都應依賴抽象。

```typescript
// ✅ 正確 - 依賴抽象（Interface）
// domain/account.repository.ts
export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}

// application/create-account.handler.ts
export class CreateAccountHandler {
  constructor(
    private readonly accountRepo: AccountRepository // 依賴抽象
  ) {}
}

// infrastructure/supabase-account.repository.ts
@Injectable()
export class SupabaseAccountRepository implements AccountRepository {
  // 實作細節
}

// ❌ 錯誤 - 直接依賴具體實作
export class CreateAccountHandler {
  constructor(
    private readonly accountRepo: SupabaseAccountRepository // 依賴具體類別
  ) {}
}
```

### 2. 單向依賴流

依賴只能從外層指向內層，不能反向。

```
┌─────────────────────────────────────────┐
│         Presentation (Features)         │ ─┐
└─────────────────────────────────────────┘  │
                    ↓                         │
┌─────────────────────────────────────────┐  │
│      Application (Use Cases/CQRS)       │ ─┤ 依賴方向
└─────────────────────────────────────────┘  │
                    ↓                         │
┌─────────────────────────────────────────┐  │
│    Domain (Business Logic/Aggregates)   │ ─┘
└─────────────────────────────────────────┘
                    ↑
┌─────────────────────────────────────────┐
│  Infrastructure (DB/API/External Svcs)  │
└─────────────────────────────────────────┘
```

---

## 分層依賴規則

### Domain 層

**可以依賴**:
- ✅ 無（Domain 層不依賴任何其他層）
- ✅ TypeScript 標準庫
- ✅ RxJS（僅 Observable 型別，不依賴具體操作）

**不可依賴**:
- ❌ Application 層
- ❌ Infrastructure 層
- ❌ Features 層
- ❌ Angular 框架
- ❌ 外部 UI 庫
- ❌ HTTP 客戶端
- ❌ 資料庫客戶端

```typescript
// ✅ 正確 - Domain 層純粹的業務邏輯
// domain/account.aggregate.ts
export class AccountAggregate {
  private constructor(
    public readonly id: string,
    private name: string,
    private email: Email, // 值物件
    private events: DomainEvent[] = []
  ) {}
  
  static create(name: string, email: string): AccountAggregate {
    const emailVo = Email.create(email);
    const account = new AccountAggregate(
      generateId(),
      name,
      emailVo
    );
    account.addEvent(new AccountCreatedEvent(account.id));
    return account;
  }
}

// ❌ 錯誤 - Domain 層依賴外部框架
import { Injectable } from '@angular/core'; // ❌ 不應依賴 Angular
import { HttpClient } from '@angular/common/http'; // ❌ 不應依賴 HTTP

export class AccountAggregate {
  constructor(private http: HttpClient) {} // ❌
}
```

### Application 層

**可以依賴**:
- ✅ Domain 層（Aggregates, Entities, Value Objects, Events, Repository Interfaces）
- ✅ TypeScript 標準庫
- ✅ RxJS

**不可依賴**:
- ❌ Infrastructure 層（具體實作）
- ❌ Features 層
- ❌ 具體的資料庫或 API 客戶端

```typescript
// ✅ 正確 - Application 層只依賴 Domain 介面
// application/commands/create-account.handler.ts
export class CreateAccountHandler {
  constructor(
    private readonly accountRepo: AccountRepository, // Domain interface
    private readonly eventBus: EventBus // Domain interface
  ) {}
  
  async handle(command: CreateAccountCommand): Promise<void> {
    const account = AccountAggregate.create(
      command.name,
      command.email
    );
    
    await this.accountRepo.save(account);
    await this.eventBus.publish(account.events);
  }
}

// ❌ 錯誤 - 依賴具體實作
import { SupabaseService } from '../../infrastructure/supabase'; // ❌

export class CreateAccountHandler {
  constructor(
    private readonly supabase: SupabaseService // ❌ 具體實作
  ) {}
}
```

### Infrastructure 層

**可以依賴**:
- ✅ Domain 層（實作 Repository 介面）
- ✅ TypeScript 標準庫
- ✅ RxJS
- ✅ 外部庫（Supabase, HTTP 客戶端等）
- ✅ Angular 服務（用於 DI）

**不可依賴**:
- ❌ Application 層（Commands, Queries, Handlers）
- ❌ Features 層

```typescript
// ✅ 正確 - Infrastructure 實作 Domain 介面
// infrastructure/repositories/supabase-account.repository.ts
@Injectable({ providedIn: 'root' })
export class SupabaseAccountRepository implements AccountRepository {
  constructor(private readonly supabase: SupabaseService) {}
  
  async findById(id: string): Promise<Account | null> {
    const { data, error } = await this.supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    return AccountMapper.toDomain(data);
  }
  
  async save(account: Account): Promise<void> {
    const dbModel = AccountMapper.toPersistence(account);
    await this.supabase.from('accounts').upsert(dbModel);
  }
}

// ❌ 錯誤 - Infrastructure 依賴 Application
import { CreateAccountHandler } from '../../application'; // ❌
```

### Features 層（Presentation）

**可以依賴**:
- ✅ Application 層（Commands, Queries, DTOs）
- ✅ Shared 模組
- ✅ Angular 框架
- ✅ UI 庫（Angular Material）
- ✅ RxJS

**不可依賴**:
- ❌ Domain 層直接（應透過 Application 層）
- ❌ Infrastructure 層（具體實作）
- ❌ 其他 Feature 模組

```typescript
// ✅ 正確 - Features 通過 Application Services 使用業務邏輯
// features/account/pages/account-list/account-list.component.ts
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
  accounts$!: Observable<AccountDto[]>;
  
  constructor(
    private readonly accountAppService: AccountApplicationService
  ) {}
  
  ngOnInit(): void {
    this.accounts$ = this.accountAppService.getAllAccounts();
  }
  
  onCreateAccount(name: string, email: string): void {
    const command = new CreateAccountCommand(name, email);
    this.accountAppService.createAccount(command).subscribe();
  }
}

// ❌ 錯誤 - 直接使用 Infrastructure
import { SupabaseService } from '../../../../core/infrastructure'; // ❌

@Component({ ... })
export class AccountListComponent {
  constructor(private supabase: SupabaseService) {} // ❌
}

// ❌ 錯誤 - 直接使用 Domain Aggregate
import { AccountAggregate } from '../../../../core/domain'; // ❌

@Component({ ... })
export class AccountListComponent {
  createAccount(): void {
    const account = AccountAggregate.create('name', 'email'); // ❌
  }
}
```

---

## 模組間依賴

### Feature 模組隔離

Feature 模組之間不應直接依賴。

```typescript
// ❌ 錯誤 - Feature 直接依賴另一個 Feature
// features/team/pages/team-list.component.ts
import { AccountListComponent } from '../../account/pages'; // ❌

// ✅ 正確 - 透過 Shared 模組或 Application 層
// shared/components/entity-selector/entity-selector.component.ts
@Component({ ... })
export class EntitySelectorComponent {
  @Input() entities: any[] = [];
  @Output() selected = new EventEmitter<string>();
}

// features/team/pages/team-list.component.ts
import { EntitySelectorComponent } from '../../../shared/components';
```

### Shared 模組使用

Shared 模組可被所有層使用，但不應依賴 Feature 模組。

```typescript
// ✅ 正確 - Shared 模組提供通用元件
// shared/components/loading-spinner/loading-spinner.component.ts
@Component({
  selector: 'app-loading-spinner',
  template: '<div class="spinner"></div>',
})
export class LoadingSpinnerComponent {}

// ✅ 在 Feature 中使用
// features/account/pages/account-list.component.html
<app-loading-spinner *ngIf="isLoading"></app-loading-spinner>

// ❌ 錯誤 - Shared 依賴 Feature
// shared/components/some-component.ts
import { AccountListComponent } from '../../features/account'; // ❌
```

---

## 禁止的依賴模式

### 1. 循環依賴

```typescript
// ❌ 錯誤 - 循環依賴
// service-a.ts
import { ServiceB } from './service-b';

export class ServiceA {
  constructor(private serviceB: ServiceB) {}
}

// service-b.ts
import { ServiceA } from './service-a';

export class ServiceB {
  constructor(private serviceA: ServiceA) {} // 循環！
}

// ✅ 解決方案 - 提取共用邏輯或使用事件
// shared.service.ts
export class SharedService {
  // 共用邏輯
}

// service-a.ts
export class ServiceA {
  constructor(private shared: SharedService) {}
}

// service-b.ts
export class ServiceB {
  constructor(private shared: SharedService) {}
}
```

### 2. 向上依賴

```typescript
// ❌ 錯誤 - 內層依賴外層
// domain/account.aggregate.ts
import { CreateAccountHandler } from '../application'; // ❌ Domain 不能依賴 Application

// ❌ 錯誤 - Application 依賴 Features
// application/services/account.service.ts
import { AccountListComponent } from '../../features'; // ❌
```

### 3. 跨 Feature 直接依賴

```typescript
// ❌ 錯誤
// features/team/services/team.service.ts
import { AccountService } from '../../account/services'; // ❌

// ✅ 正確 - 透過 Application 層
// features/team/services/team.service.ts
import { AccountApplicationService } from '../../../core/application';
```

---

## 依賴注入原則

### 1. Constructor Injection

```typescript
// ✅ 正確 - 使用 constructor injection
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: LoggerService
  ) {}
}

// ❌ 錯誤 - 直接 import 和 new
import { LoggerService } from './logger.service';

export class UserService {
  private logger = new LoggerService(); // ❌
}
```

### 2. Interface 注入

```typescript
// ✅ 正確 - 注入介面（使用 InjectionToken）
// domain/account.repository.ts
export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
}

export const ACCOUNT_REPOSITORY = new InjectionToken<AccountRepository>(
  'AccountRepository'
);

// infrastructure/providers.ts
export const INFRASTRUCTURE_PROVIDERS = [
  {
    provide: ACCOUNT_REPOSITORY,
    useClass: SupabaseAccountRepository,
  },
];

// application/handlers/create-account.handler.ts
export class CreateAccountHandler {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly accountRepo: AccountRepository
  ) {}
}
```

---

## 檢查和驗證

### 1. 手動檢查

定期檢查 import 語句：

```bash
# 檢查 Domain 層是否有不當依賴
grep -r "from '@angular" src/app/core/domain/

# 檢查 Application 層是否依賴 Infrastructure
grep -r "infrastructure" src/app/core/application/

# 檢查 Feature 之間的依賴
grep -r "features/account" src/app/features/team/
```

### 2. ESLint 規則（未來考慮）

可以配置 ESLint 規則來自動檢查依賴：

```javascript
// eslint.config.js（未來擴展）
{
  rules: {
    'import/no-restricted-paths': ['error', {
      zones: [
        {
          target: './src/app/core/domain',
          from: './src/app/core/application',
        },
        {
          target: './src/app/core/domain',
          from: './src/app/core/infrastructure',
        },
        {
          target: './src/app/core/application',
          from: './src/app/features',
        },
      ],
    }],
  },
}
```

### 3. 架構測試（未來考慮）

使用 TypeScript 測試檢查架構規則：

```typescript
// architecture.spec.ts（未來添加）
describe('Architecture Rules', () => {
  it('Domain layer should not depend on Application layer', () => {
    // 檢查邏輯
  });
  
  it('Features should not depend on Infrastructure', () => {
    // 檢查邏輯
  });
});
```

---

## 依賴圖範例

### 正確的依賴流

```
┌─────────────────┐
│ AccountList     │ (Feature)
│ Component       │
└────────┬────────┘
         │ uses
         ↓
┌─────────────────┐
│ Account         │ (Application Service)
│ App Service     │
└────────┬────────┘
         │ uses
         ↓
┌─────────────────┐
│ CreateAccount   │ (Command Handler)
│ Handler         │
└────────┬────────┘
         │ uses
         ↓
┌─────────────────┐      ┌──────────────────┐
│ Account         │◄─────│ Supabase         │
│ Repository      │      │ Account Repo     │
│ (Interface)     │      │ (Implementation) │
└─────────────────┘      └──────────────────┘
         ↑
         │ implements
         │
┌─────────────────┐
│ Account         │ (Domain Aggregate)
│ Aggregate       │
└─────────────────┘
```

---

## 違規處理

違反依賴規則的代碼將：

1. **Code Review 階段被拒絕**
2. **需要重構以符合規範**
3. **嚴重情況下需要重新設計**

---

## 學習資源

- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

**記住**: 依賴規則是確保架構穩定性和可維護性的關鍵。違反規則會導致技術債務累積。
