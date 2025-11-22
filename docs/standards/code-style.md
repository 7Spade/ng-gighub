# 代碼風格指南 (Code Style Guide)

## 概述

本文檔定義 ng-gighub 專案的代碼風格規範。這些規範通過 ESLint 和 Prettier 自動化執行。

---

## 目錄

1. [TypeScript 風格](#typescript-風格)
2. [Angular 風格](#angular-風格)
3. [HTML 模板風格](#html-模板風格)
4. [SCSS 風格](#scss-風格)
5. [註解和文檔](#註解和文檔)
6. [最佳實踐](#最佳實踐)

---

## TypeScript 風格

### 基本格式

```typescript
// ✅ 正確
const userName = 'John Doe';
const age = 30;

// 使用 const，除非需要重新賦值
const config = { timeout: 5000 };

// 需要重新賦值時使用 let
let counter = 0;
counter++;

// ❌ 錯誤 - 禁止使用 var
var oldStyle = 'bad';
```

### 型別宣告

```typescript
// ✅ 正確 - 明確型別
function getUserById(id: string): User | null {
  return this.users.find(user => user.id === id) || null;
}

const users: User[] = [];
const config: AppConfig = { timeout: 5000 };

// ✅ 正確 - 型別推斷明確時可省略
const count = 42; // TypeScript 自動推斷為 number
const message = 'Hello'; // TypeScript 自動推斷為 string

// ❌ 錯誤 - 避免使用 any
function processData(data: any): any {
  return data;
}

// ✅ 使用泛型或 unknown
function processData<T>(data: T): T {
  return data;
}

function processUnknown(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
}
```

### Interface vs Type

```typescript
// ✅ Interface - 用於物件結構定義
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// ✅ Type - 用於聯合型別、交集型別、工具型別
type UserId = string;
type UserRole = 'admin' | 'user' | 'guest';
type Result<T, E> = { success: true; data: T } | { success: false; error: E };

// 擴展 Interface
interface AdminUser extends User {
  permissions: string[];
}

// 交集型別
type AdminUser = User & {
  permissions: string[];
};
```

### 函數風格

```typescript
// ✅ 正確 - 箭頭函數（推薦用於簡短函數）
const double = (n: number) => n * 2;
const greet = (name: string) => `Hello, ${name}!`;

// ✅ 正確 - 傳統函數（用於複雜邏輯）
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 正確 - Async/Await
async function fetchUserData(id: string): Promise<User> {
  try {
    const response = await this.http.get<User>(`/api/users/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error}`);
  }
}

// ❌ 錯誤 - 函數過長
function complexProcess() {
  // ... 100 行代碼
}

// ✅ 拆分成多個小函數
function complexProcess() {
  const data = prepareData();
  const validated = validateData(data);
  return processData(validated);
}
```

### Class 風格

```typescript
// ✅ 正確
export class UserService {
  // Public 屬性（預設）
  readonly apiUrl = 'https://api.example.com';
  
  // Private 屬性
  private cache = new Map<string, User>();
  
  // Constructor injection（Angular DI）
  constructor(
    private readonly http: HttpClient,
    private readonly logger: LoggerService
  ) {}
  
  // Public 方法
  async getUser(id: string): Promise<User> {
    const cached = this.getCachedUser(id);
    if (cached) return cached;
    
    const user = await this.fetchUser(id);
    this.cacheUser(id, user);
    return user;
  }
  
  // Private 方法
  private getCachedUser(id: string): User | undefined {
    return this.cache.get(id);
  }
  
  private async fetchUser(id: string): Promise<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).toPromise();
  }
  
  private cacheUser(id: string, user: User): void {
    this.cache.set(id, user);
  }
}
```

### 解構賦值

```typescript
// ✅ 正確 - 使用解構
const { id, name, email } = user;
const [first, second, ...rest] = array;

// 函數參數解構
function displayUser({ name, email }: User) {
  console.log(`${name} <${email}>`);
}

// ✅ 正確 - 預設值
const { timeout = 5000, retries = 3 } = config;
```

### 模板字串

```typescript
// ✅ 正確 - 使用模板字串
const greeting = `Hello, ${userName}!`;
const url = `${baseUrl}/api/users/${userId}`;

// ❌ 錯誤 - 字串串接
const greeting = 'Hello, ' + userName + '!';
const url = baseUrl + '/api/users/' + userId;
```

### 可選鏈和空值合併

```typescript
// ✅ 正確 - 使用可選鏈
const userName = user?.profile?.name;
const firstItem = array?.[0];

// ✅ 正確 - 使用空值合併
const timeout = config?.timeout ?? 5000;
const name = user?.name ?? 'Anonymous';

// ❌ 錯誤 - 手動檢查
const userName = user && user.profile && user.profile.name;
const timeout = config.timeout !== null && config.timeout !== undefined 
  ? config.timeout 
  : 5000;
```

---

## Angular 風格

### Component 結構

```typescript
// ✅ 正確 - Component 結構順序
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // 推薦使用 OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // 1. Input 屬性
  @Input() userId!: string;
  @Input() showDetails = true;
  
  // 2. Output 屬性
  @Output() userUpdated = new EventEmitter<User>();
  
  // 3. ViewChild / ContentChild
  @ViewChild('userForm') userForm!: ElementRef;
  
  // 4. Public 屬性
  user: User | null = null;
  isLoading = false;
  
  // 5. Private 屬性
  private destroy$ = new Subject<void>();
  
  // 6. Constructor（依賴注入）
  constructor(
    private readonly userService: UserService,
    private readonly cdr: ChangeDetectorRef
  ) {}
  
  // 7. 生命週期鉤子（按順序）
  ngOnInit(): void {
    this.loadUser();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 8. Public 方法
  async loadUser(): Promise<void> {
    this.isLoading = true;
    try {
      this.user = await this.userService.getUser(this.userId);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }
  
  onSave(): void {
    if (this.user) {
      this.userUpdated.emit(this.user);
    }
  }
  
  // 9. Private 方法
  private validateUser(user: User): boolean {
    return !!user.email && !!user.name;
  }
}
```

### Service 結構

```typescript
// ✅ 正確
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  
  constructor(
    private readonly http: HttpClient,
    private readonly supabase: SupabaseService
  ) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }
  
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

### RxJS 風格

```typescript
// ✅ 正確 - 使用 pipe 和 operators
this.userService.getUsers().pipe(
  map(users => users.filter(u => u.isActive)),
  tap(users => console.log('Active users:', users.length)),
  catchError(error => {
    console.error(error);
    return of([]);
  }),
  takeUntil(this.destroy$)
).subscribe(users => {
  this.users = users;
});

// ✅ 正確 - 使用 async pipe（推薦）
// Component
users$ = this.userService.getUsers().pipe(
  map(users => users.filter(u => u.isActive))
);

// Template
<div *ngFor="let user of users$ | async">{{ user.name }}</div>

// ❌ 錯誤 - 忘記 unsubscribe
this.userService.getUsers().subscribe(users => {
  this.users = users;
}); // Memory leak!
```

---

## HTML 模板風格

### 基本格式

```html
<!-- ✅ 正確 - 清晰的縮排和結構 -->
<div class="user-profile">
  <header class="profile-header">
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
  </header>
  
  <section class="profile-details">
    <div *ngIf="isLoading" class="loading">
      Loading...
    </div>
    
    <div *ngIf="!isLoading && user" class="user-info">
      <p>Created: {{ user.createdAt | date:'short' }}</p>
    </div>
  </section>
</div>

<!-- ❌ 錯誤 - 混亂的格式 -->
<div class="user-profile"><header class="profile-header"><h1>{{ user.name }}</h1><p>{{ user.email }}</p></header></div>
```

### 結構型指令

```html
<!-- ✅ 正確 - 使用 ng-container 避免額外 DOM -->
<ng-container *ngIf="user; else loading">
  <div class="user-details">
    {{ user.name }}
  </div>
</ng-container>

<ng-template #loading>
  <div class="loading">Loading...</div>
</ng-template>

<!-- ✅ 正確 - ngFor 使用 trackBy -->
<div *ngFor="let user of users; trackBy: trackByUserId">
  {{ user.name }}
</div>

// Component
trackByUserId(index: number, user: User): string {
  return user.id;
}
```

### 屬性綁定

```html
<!-- ✅ 正確 - 屬性綁定 -->
<img [src]="user.avatarUrl" [alt]="user.name">
<button [disabled]="isLoading" (click)="onSave()">Save</button>

<!-- ✅ 正確 - Class 和 Style 綁定 -->
<div [class.active]="isActive" [class.disabled]="isDisabled">
  Content
</div>

<div [style.width.px]="width" [style.color]="textColor">
  Styled content
</div>

<!-- ❌ 錯誤 - 混合使用字串和綁定 -->
<div class="user-card {{isActive ? 'active' : ''}}">
```

### 事件處理

```html
<!-- ✅ 正確 - 清楚的事件處理 -->
<button (click)="onSave()">Save</button>
<input (input)="onSearch($event)" [value]="searchTerm">

<!-- ✅ 正確 - 防止預設行為 -->
<form (ngSubmit)="onSubmit($event)">
  <button type="submit">Submit</button>
</form>
```

---

## SCSS 風格

### 基本格式

```scss
// ✅ 正確
.user-profile {
  padding: 16px;
  background-color: #ffffff;
  
  &__header {
    margin-bottom: 24px;
    
    h1 {
      font-size: 24px;
      color: #333333;
    }
  }
  
  &__content {
    display: flex;
    gap: 16px;
  }
  
  &--loading {
    opacity: 0.5;
    pointer-events: none;
  }
}

// ❌ 錯誤 - 過深的巢狀
.user-profile {
  .header {
    .title {
      .text {
        .content {
          color: red; // 太深了！
        }
      }
    }
  }
}
```

### 變數和主題

```scss
// ✅ 正確 - 使用 CSS 變數或 SCSS 變數
$primary-color: #007bff;
$spacing-unit: 8px;

.button {
  background-color: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
}

// 或使用 SCSS 變數
.button {
  background-color: $primary-color;
  padding: $spacing-unit * 2;
}
```

### BEM 命名

```scss
// ✅ 推薦 - BEM 命名規範
.user-card {              // Block
  &__header {             // Element
    font-weight: bold;
  }
  
  &__body {               // Element
    padding: 16px;
  }
  
  &--featured {           // Modifier
    border: 2px solid gold;
  }
  
  &--disabled {           // Modifier
    opacity: 0.5;
  }
}
```

---

## 註解和文檔

### JSDoc 風格

```typescript
/**
 * 根據 ID 取得使用者資料
 * 
 * @param id - 使用者的唯一識別碼
 * @returns Promise<User | null> - 使用者物件，若不存在則返回 null
 * @throws {Error} 當 API 請求失敗時
 * 
 * @example
 * ```typescript
 * const user = await userService.getUserById('123');
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
async getUserById(id: string): Promise<User | null> {
  // 實作...
}
```

### 單行註解

```typescript
// ✅ 正確 - 解釋為什麼（Why），而非什麼（What）
// 使用 cache 避免重複的 API 請求
const cachedUser = this.cache.get(userId);

// ❌ 錯誤 - 重複代碼的意思
// 從 cache 取得 user
const cachedUser = this.cache.get(userId);
```

### TODO 註解

```typescript
// TODO: 實作錯誤重試機制
// FIXME: 處理 edge case - 當 userId 為空字串時
// NOTE: 這個方法在未來版本會被廢棄
// HACK: 臨時解決方案，等待 API 更新
```

---

## 最佳實踐

### 1. 單一職責原則

```typescript
// ✅ 正確 - 每個函數只做一件事
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendWelcomeEmail(email: string): Promise<void> {
  return this.emailService.send(email, 'Welcome!');
}

// ❌ 錯誤 - 函數做太多事
function processUser(email: string): void {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (isValid) {
    this.emailService.send(email, 'Welcome!');
    this.logService.log(`Email sent to ${email}`);
    this.analyticsService.track('user_registered');
  }
}
```

### 2. 錯誤處理

```typescript
// ✅ 正確 - 明確的錯誤處理
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error(`Unable to fetch user ${id}`);
  }
}

// ❌ 錯誤 - 吞掉錯誤
async function fetchUser(id: string): Promise<User | null> {
  try {
    return await fetch(`/api/users/${id}`).then(r => r.json());
  } catch {
    return null; // 錯誤被隱藏了
  }
}
```

### 3. 不可變性

```typescript
// ✅ 正確 - 使用不可變操作
const newUsers = [...users, newUser];
const updatedUser = { ...user, name: 'New Name' };
const filteredUsers = users.filter(u => u.isActive);

// ❌ 錯誤 - 直接修改
users.push(newUser);
user.name = 'New Name';
```

### 4. 避免魔術數字

```typescript
// ✅ 正確 - 使用命名常數
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const ITEMS_PER_PAGE = 20;

if (retryCount >= MAX_RETRY_COUNT) {
  throw new Error('Max retries exceeded');
}

// ❌ 錯誤 - 魔術數字
if (retryCount >= 3) {
  throw new Error('Max retries exceeded');
}
```

---

## 自動化檢查

### 執行格式化和檢查

```bash
# 檢查代碼格式
npm run format:check

# 自動格式化代碼
npm run format

# 執行 ESLint
npm run lint

# 自動修復 ESLint 問題
npm run lint:fix

# 執行所有檢查
npm run check
```

### Pre-commit Hook（可選）

使用 husky 和 lint-staged 在 commit 前自動檢查：

```json
// package.json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"],
    "*.html": ["prettier --write"],
    "*.scss": ["prettier --write"]
  }
}
```

---

## 參考資源

- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**記住**: 一致性比完美更重要。當團隊就風格達成共識後，最重要的是**保持一致**。
