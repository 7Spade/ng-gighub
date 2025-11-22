# 命名規範 (Naming Conventions)

## 目的

統一的命名規範確保代碼的可讀性、可維護性和團隊協作效率。本文檔定義了 ng-gighub 專案中所有命名的標準。

---

## 目錄

1. [檔案命名](#檔案命名)
2. [TypeScript 命名](#typescript-命名)
3. [Angular 特定命名](#angular-特定命名)
4. [資料庫和 Supabase 命名](#資料庫和-supabase-命名)
5. [測試檔案命名](#測試檔案命名)
6. [常見範例](#常見範例)

---

## 檔案命名

### 基本原則

- 使用 **kebab-case**（小寫字母，單詞間用連字號分隔）
- 檔案名應清楚表達內容用途
- 使用適當的後綴標識檔案類型

### Angular 檔案後綴

| 類型 | 後綴 | 範例 |
|------|------|------|
| Component | `.component.ts` | `user-profile.component.ts` |
| Service | `.service.ts` | `auth.service.ts` |
| Directive | `.directive.ts` | `highlight.directive.ts` |
| Pipe | `.pipe.ts` | `date-format.pipe.ts` |
| Guard | `.guard.ts` | `auth.guard.ts` |
| Interceptor | `.interceptor.ts` | `auth.interceptor.ts` |
| Model/Interface | `.model.ts` 或 `.interface.ts` | `user.model.ts` |
| Module | `.module.ts` | `shared.module.ts` |
| Routing | `.routes.ts` | `app.routes.ts` |

### DDD 特定後綴

| 類型 | 後綴 | 範例 |
|------|------|------|
| Aggregate | `.aggregate.ts` | `account.aggregate.ts` |
| Entity | `.entity.ts` | `user.entity.ts` |
| Value Object | `.vo.ts` | `email.vo.ts` |
| Domain Event | `.event.ts` | `user-created.event.ts` |
| Repository Interface | `.repository.ts` | `account.repository.ts` |
| Command | `.command.ts` | `create-account.command.ts` |
| Query | `.query.ts` | `get-account.query.ts` |
| DTO | `.dto.ts` | `account.dto.ts` |
| Mapper | `.mapper.ts` | `account.mapper.ts` |

### 樣式檔案

- Component 樣式: `user-profile.component.scss`
- 全域樣式: `styles.scss`
- 主題檔案: `theme.scss`

### HTML 模板

- Component 模板: `user-profile.component.html`
- 部分模板（如果分離）: `user-profile-form.template.html`

---

## TypeScript 命名

### 類別 (Classes)

**格式**: `PascalCase`

```typescript
// ✅ 正確
class UserProfileComponent { }
class AuthService { }
class EmailValueObject { }
class AccountAggregate { }

// ❌ 錯誤
class userProfile { }
class auth_service { }
```

### 介面 (Interfaces)

**格式**: `PascalCase`

**選項 1**: 不使用 `I` 前綴（推薦）
```typescript
// ✅ 推薦
interface UserRepository { }
interface AccountDto { }
```

**選項 2**: 使用 `I` 前綴（可接受）
```typescript
// ✅ 可接受
interface IUserRepository { }
interface IAccountDto { }
```

**一致性原則**: 專案中選擇一種風格並保持一致。本專案推薦**不使用 `I` 前綴**。

### 類型別名 (Type Aliases)

**格式**: `PascalCase`

```typescript
// ✅ 正確
type UserId = string;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type AsyncResult<T> = Promise<Result<T, Error>>;

// ❌ 錯誤
type user_id = string;
type httpMethod = 'GET' | 'POST';
```

### 列舉 (Enums)

**Enum 名稱**: `PascalCase`  
**Enum 成員**: `UPPER_SNAKE_CASE`

```typescript
// ✅ 正確
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

// ❌ 錯誤
enum userRole {
  Admin = 'admin',
  User = 'user',
}
```

### 變數 (Variables)

**格式**: `camelCase`

```typescript
// ✅ 正確
const userName = 'John';
let isAuthenticated = false;
const userProfile = { name: 'John', age: 30 };

// ❌ 錯誤
const UserName = 'John';
let is_authenticated = false;
const user_profile = { };
```

### 常數 (Constants)

**格式**: `UPPER_SNAKE_CASE`

```typescript
// ✅ 正確
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;

// 配置物件使用 camelCase
const appConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retryCount: 3,
};

// ❌ 錯誤
const maxRetryCount = 3;
const Api_Base_Url = 'https://api.example.com';
```

### 函數 (Functions)

**格式**: `camelCase`

```typescript
// ✅ 正確
function getUserById(id: string): User { }
function validateEmail(email: string): boolean { }
async function fetchUserData(): Promise<User> { }

// ❌ 錯誤
function GetUserById(id: string): User { }
function validate_email(email: string): boolean { }
```

### 泛型參數 (Generic Parameters)

**格式**: 單一大寫字母或 `PascalCase`

```typescript
// ✅ 正確 - 單一字母
function identity<T>(arg: T): T { }
class Repository<T, K> { }

// ✅ 正確 - 描述性名稱
function mapArray<TInput, TOutput>(
  items: TInput[],
  mapper: (item: TInput) => TOutput
): TOutput[] { }

// ❌ 錯誤
function identity<t>(arg: t): t { }
class Repository<type, key> { }
```

---

## Angular 特定命名

### Component

**類別名稱**: `[Feature][Type]Component`  
**Selector**: `app-[feature-name]`

```typescript
// ✅ 正確
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent { }

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent { }

// ❌ 錯誤
@Component({
  selector: 'user-profile', // 缺少 app- 前綴
})
export class UserProfile { } // 缺少 Component 後綴
```

### Service

**類別名稱**: `[Feature]Service`

```typescript
// ✅ 正確
@Injectable({ providedIn: 'root' })
export class AuthService { }

@Injectable({ providedIn: 'root' })
export class UserManagementService { }

// ❌ 錯誤
export class Auth { }
export class UserManagement { }
```

### Directive

**類別名稱**: `[Feature]Directive`  
**Selector**: `app[FeatureName]`（camelCase，無連字號）

```typescript
// ✅ 正確
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective { }

@Directive({
  selector: '[appPermission]',
})
export class PermissionDirective { }

// ❌ 錯誤
@Directive({
  selector: '[app-highlight]', // Directive selector 不應用連字號
})
export class Highlight { } // 缺少 Directive 後綴
```

### Pipe

**類別名稱**: `[Feature]Pipe`  
**Pipe 名稱**: `camelCase`

```typescript
// ✅ 正確
@Pipe({ name: 'dateFormat' })
export class DateFormatPipe { }

@Pipe({ name: 'truncate' })
export class TruncatePipe { }

// ❌ 錯誤
@Pipe({ name: 'DateFormat' }) // 應該是 camelCase
export class DateFormat { } // 缺少 Pipe 後綴
```

### Guard

**類別名稱**: `[Feature]Guard`

```typescript
// ✅ 正確
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate { }

// ❌ 錯誤
export class Auth { }
export class AuthenticationGuard { } // 過長，用 Auth 即可
```

---

## 資料庫和 Supabase 命名

### 資料表 (Tables)

**格式**: `snake_case`，複數形式

```sql
-- ✅ 正確
accounts
organizations
team_members
repository_settings

-- ❌ 錯誤
Account
organization
teamMember
```

### 欄位 (Columns)

**格式**: `snake_case`

```sql
-- ✅ 正確
user_id
created_at
email_address
is_active

-- ❌ 錯誤
UserId
createdAt
emailAddress
```

### 索引 (Indexes)

**格式**: `idx_[table]_[columns]`

```sql
-- ✅ 正確
idx_accounts_email
idx_organizations_owner_id
idx_team_members_team_id_user_id

-- ❌ 錯誤
accounts_email_index
index_organizations
```

### 外鍵約束 (Foreign Keys)

**格式**: `fk_[table]_[referenced_table]`

```sql
-- ✅ 正確
fk_team_members_teams
fk_team_members_users
fk_repositories_organizations

-- ❌ 錯誤
team_members_teams_fk
fk_team_member_team
```

### RLS Policies

**格式**: `[action]_[table]_[condition]`

```sql
-- ✅ 正確
select_accounts_own
insert_team_members_admin
update_repositories_owner

-- ❌ 錯誤
accounts_select_own
admin_can_insert_team_members
```

---

## 測試檔案命名

### 單元測試

**格式**: `[original-file-name].spec.ts`

```
user.service.spec.ts
account.aggregate.spec.ts
email.vo.spec.ts
```

### E2E 測試

**格式**: `[feature].e2e-spec.ts`

```
login.e2e-spec.ts
user-registration.e2e-spec.ts
```

### 測試資料檔案

**格式**: `[feature].mock.ts` 或 `[feature].fixture.ts`

```
user.mock.ts
account.fixture.ts
```

---

## 常見範例

### Domain Layer 範例

```
src/app/core/domain/
├── account/
│   ├── account.aggregate.ts          # AccountAggregate
│   ├── account.entity.ts             # AccountEntity
│   ├── account.repository.ts         # AccountRepository (interface)
│   ├── events/
│   │   ├── account-created.event.ts  # AccountCreatedEvent
│   │   └── account-updated.event.ts  # AccountUpdatedEvent
│   └── value-objects/
│       ├── email.vo.ts               # Email (value object)
│       └── user-role.vo.ts           # UserRole (value object)
```

### Application Layer 範例

```
src/app/core/application/
├── commands/
│   ├── create-account.command.ts     # CreateAccountCommand
│   └── handlers/
│       └── create-account.handler.ts # CreateAccountHandler
├── queries/
│   ├── get-account.query.ts          # GetAccountQuery
│   └── handlers/
│       └── get-account.handler.ts    # GetAccountHandler
└── dtos/
    └── account.dto.ts                # AccountDto
```

### Features Layer 範例

```
src/app/features/account/
├── pages/
│   ├── account-list/
│   │   ├── account-list.component.ts
│   │   ├── account-list.component.html
│   │   ├── account-list.component.scss
│   │   └── account-list.component.spec.ts
│   └── account-detail/
│       ├── account-detail.component.ts
│       ├── account-detail.component.html
│       └── account-detail.component.scss
├── components/
│   ├── account-card/
│   │   ├── account-card.component.ts
│   │   ├── account-card.component.html
│   │   └── account-card.component.scss
│   └── account-form/
│       ├── account-form.component.ts
│       ├── account-form.component.html
│       └── account-form.component.scss
└── state/
    └── account.store.ts              # AccountStore
```

---

## 特殊情況

### Private 成員

使用 `_` 前綴表示 private（僅在必要時使用，優先使用 TypeScript 的 `private` 關鍵字）

```typescript
// ✅ 正確
class UserService {
  private _cache: Map<string, User> = new Map();
  
  private _loadFromCache(id: string): User | undefined {
    return this._cache.get(id);
  }
}

// ✅ 更好的做法（優先使用）
class UserService {
  private cache: Map<string, User> = new Map();
  
  private loadFromCache(id: string): User | undefined {
    return this.cache.get(id);
  }
}
```

### Observable 變數

可選擇性地使用 `$` 後綴表示 Observable（非強制，但建議保持一致）

```typescript
// ✅ 正確
const users$ = this.userService.getUsers();
const isLoading$ = new BehaviorSubject<boolean>(false);

// ✅ 也可接受（不使用 $ 後綴）
const users = this.userService.getUsers();
const isLoading = new BehaviorSubject<boolean>(false);
```

**一致性原則**: 專案中選擇一種風格並保持一致。

### Boolean 變數

使用 `is`, `has`, `should`, `can` 等前綴

```typescript
// ✅ 正確
const isAuthenticated = true;
const hasPermission = false;
const shouldShowModal = true;
const canEdit = false;

// ❌ 錯誤
const authenticated = true;
const permission = false;
```

---

## 檢查清單

在提交代碼前，確認：

- [ ] 所有檔案名稱使用 kebab-case
- [ ] 類別名稱使用 PascalCase
- [ ] 變數和函數使用 camelCase
- [ ] 常數使用 UPPER_SNAKE_CASE
- [ ] Angular component selector 使用 `app-` 前綴
- [ ] 檔案後綴符合類型規範
- [ ] 資料庫命名使用 snake_case
- [ ] 命名清楚表達用途，避免縮寫
- [ ] 遵循 DDD 命名後綴規範

---

## 參考資源

- [Angular Style Guide - Naming](https://angular.dev/style-guide#naming)
- [TypeScript Handbook - Naming Conventions](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

---

**注意**: 命名規範的一致性比具體選擇哪種風格更重要。選定一種風格後，整個專案都應遵循。
