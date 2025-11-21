# ng-gighub DDD 架構文件

## 專案架構概覽

本專案採用 Domain-Driven Design (DDD) 架構模式，清楚劃分不同的職責層次。

## 目錄結構

```
src/app/
├── domain/                          # 領域層 - 核心業務邏輯
│   ├── account/                     # Account 領域（統一的帳號抽象）
│   │   ├── models/
│   │   │   ├── account.model.ts           # 抽象基類
│   │   │   ├── user-account.model.ts      # User 子類
│   │   │   ├── organization-account.model.ts  # Organization 子類
│   │   │   └── bot-account.model.ts       # Bot 子類
│   │   ├── value-objects/
│   │   │   ├── account-type.vo.ts         # 帳號類型值物件
│   │   │   └── account-role.vo.ts         # 角色值物件
│   │   ├── repositories/
│   │   │   └── account.repository.interface.ts  # Repository 介面
│   │   └── services/
│   │       ├── account-domain.service.ts  # 領域服務
│   │       └── account-switcher.service.ts # 帳號切換服務
│   │
│   ├── team/                        # Team 領域
│   │   ├── models/
│   │   │   └── team.model.ts
│   │   └── services/
│   │       └── team-domain.service.ts
│   │
│   └── repository/                  # Repository 領域
│       ├── models/
│       │   └── repository.model.ts
│       └── services/
│           └── repository-permission.service.ts
│
├── application/                     # 應用層 - CQRS 模式
│   ├── account/
│   │   ├── commands/                # 命令（寫操作）
│   │   │   ├── switch-account.command.ts
│   │   │   ├── create-user-account.command.ts
│   │   │   ├── create-organization.command.ts
│   │   │   └── create-bot.command.ts
│   │   ├── queries/                 # 查詢（讀操作）
│   │   │   ├── get-current-account.query.ts
│   │   │   ├── list-accessible-accounts.query.ts
│   │   │   └── get-account-by-username.query.ts
│   │   └── dto/
│   │       └── account.dto.ts
│   │
│   ├── organization/
│   │   ├── commands/
│   │   └── queries/
│   │
│   └── team/
│       ├── commands/
│       └── queries/
│
├── presentation/                    # 展示層 - UI 組件與狀態
│   ├── layouts/
│   │   └── default/
│   │       ├── components/
│   │       │   └── account-switcher/  # 帳號切換器組件
│   │       │       ├── account-switcher.component.ts
│   │       │       ├── account-switcher.component.html
│   │       │       └── account-switcher.component.scss
│   │       └── default-layout.component.ts
│   │
│   ├── pages/                       # 頁面組件（待實作）
│   │   ├── account/
│   │   ├── organization/
│   │   └── repositories/
│   │
│   └── store/                       # 狀態管理（使用 Angular Signals）
│       ├── account/
│       │   ├── current-account.store.ts
│       │   └── accessible-accounts.store.ts
│       └── organization/
│
└── infrastructure/                  # 基礎設施層 - 外部服務整合
    └── supabase/
        ├── repositories/
        │   └── account.repository.ts  # Supabase 實作
        └── mappers/
            ├── account.mapper.ts      # 多型映射
            └── team.mapper.ts
```

## 架構層次說明

### 1. Domain Layer（領域層）

**職責：** 包含核心業務邏輯與規則，與外部技術無關

**組成：**
- **Models（模型）：** 業務實體，使用物件導向的繼承結構
  - `Account` - 抽象基類
  - `UserAccount`, `OrganizationAccount`, `BotAccount` - 具體子類
- **Value Objects（值物件）：** 不可變的值對象，如 `AccountType`, `AccountRole`
- **Repositories（倉儲介面）：** 定義資料存取契約，但不實作
- **Domain Services（領域服務）：** 跨多個實體的業務邏輯

**關鍵特性：**
- 使用多型（Polymorphism）實現不同類型的帳號
- 包含業務驗證邏輯
- 不依賴任何外部框架或資料庫

**範例：**
```typescript
// Account 抽象基類
export abstract class Account {
  abstract getTypeSpecificData(): Record<string, unknown>;
}

// User 子類實作
export class UserAccount extends Account {
  getFullName(): string | null {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

### 2. Application Layer（應用層）

**職責：** 協調領域物件執行使用案例，實作 CQRS 模式

**組成：**
- **Commands（命令）：** 處理寫操作（建立、更新、刪除）
- **Queries（查詢）：** 處理讀操作（取得資料）
- **DTOs（資料傳輸物件）：** 用於跨層傳輸的簡單資料結構

**CQRS 模式：**
- 分離讀寫操作
- 命令負責改變狀態
- 查詢負責取得資料

**範例：**
```typescript
// Command 範例
@Injectable({ providedIn: 'root' })
export class CreateUserAccountCommand {
  execute(dto: CreateUserAccountDto): Observable<UserAccount> {
    // 驗證並建立使用者帳號
  }
}

// Query 範例
@Injectable({ providedIn: 'root' })
export class GetCurrentAccountQuery {
  execute(): Account | null {
    // 取得目前帳號
  }
}
```

### 3. Presentation Layer（展示層）

**職責：** 處理 UI 邏輯與使用者互動

**組成：**
- **Layouts（版面配置）：** 主要版面結構
- **Pages（頁面）：** 具體的頁面組件
- **Store（狀態管理）：** 使用 Angular Signals 管理應用狀態

**狀態管理策略：**
- 使用 Angular 的 `signal()` 和 `computed()`
- 響應式、類型安全
- 避免不必要的重新渲染

**範例：**
```typescript
@Injectable({ providedIn: 'root' })
export class CurrentAccountStore {
  readonly currentAccount = this.accountSwitcher.currentAccount;
  readonly hasAccount = computed(() => this.currentAccount() !== null);
}
```

### 4. Infrastructure Layer（基礎設施層）

**職責：** 實作與外部服務的整合（資料庫、API 等）

**組成：**
- **Repositories（倉儲實作）：** 實作領域層定義的介面
- **Mappers（映射器）：** 將資料庫資料轉換為領域模型

**映射策略：**
- 雙向映射：`toDomain()` 和 `toPersistence()`
- 支援多型映射（根據 type 欄位決定建立哪個子類）
- 處理日期、null 值等格式轉換

**範例：**
```typescript
export class AccountMapper {
  static toDomain(row: AccountRow): Account {
    switch (row.type) {
      case AccountType.USER:
        return new UserAccount(...);
      case AccountType.ORGANIZATION:
        return new OrganizationAccount(...);
      // ...
    }
  }
}
```

## 多型設計模式

### Account 繼承結構

```
Account (abstract)
├── UserAccount
├── OrganizationAccount
└── BotAccount
```

**優點：**
1. **型別安全：** TypeScript 編譯時檢查
2. **程式碼重用：** 共用屬性與方法在基類中
3. **擴展性：** 新增帳號類型只需加新子類
4. **多型：** 可以統一處理不同類型的帳號

## 資料流

### 讀取流程（Query）
```
Component → Store → Query → Repository → Supabase
                                ↓
Component ← Store ← Mapper ← Database Row
```

### 寫入流程（Command）
```
Component → Store → Command → Domain Service → Repository
                                                    ↓
Component ← Store ← Event ← Mapper ← Database
```

## 依賴注入

所有服務使用 Angular 的依賴注入：
```typescript
@Injectable({ providedIn: 'root' })
export class SomeService {
  private readonly dependency = inject(DependencyService);
}
```

## SSR 相容性

所有與瀏覽器相關的 API 使用都經過檢查：
```typescript
if (isPlatformBrowser(this.platformId)) {
  // 只在瀏覽器執行的程式碼
}
```

## 測試策略

- **Domain Layer：** 單元測試，不依賴外部服務
- **Application Layer：** 使用 mock repository 測試
- **Presentation Layer：** 組件測試
- **Infrastructure Layer：** 整合測試

## 未來擴展

目前已實作基礎架構，未來可以：
1. 加入 Organization 成員管理
2. 加入 Team 相關功能
3. 加入 Repository 管理
4. 實作更多頁面組件
5. 加入路由與導航
6. 實作完整的錯誤處理
7. 加入快取策略
8. 實作離線支援（PWA）

## 開發指南

### 加入新的 Domain Model

1. 在 `domain/` 建立新的領域目錄
2. 定義模型類別
3. 定義 Repository 介面
4. 實作 Domain Service（如需要）

### 加入新的 Command/Query

1. 在 `application/` 對應的目錄建立 Command/Query
2. 注入所需的 Domain Service 或 Repository
3. 實作 `execute()` 方法

### 加入新的 Component

1. 在 `presentation/pages/` 建立組件
2. 建立對應的 Store（如需要）
3. 注入 Store 並使用 signals

## 技術棧

- **Angular 20.1** - 前端框架
- **TypeScript 5.8** - 程式語言
- **RxJS** - 響應式程式
- **Angular Signals** - 狀態管理
- **Supabase** - 後端服務
- **SCSS** - 樣式

## 參考資源

- [DDD in TypeScript](https://khalilstemmler.com/articles/domain-driven-design-intro/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Angular Signals](https://angular.dev/guide/signals)
