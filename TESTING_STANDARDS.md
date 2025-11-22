# 測試規範 (Testing Standards)

## 概述

本文檔定義 ng-gighub 專案的測試標準和策略，確保代碼品質和系統穩定性。

---

## 目錄

1. [測試金字塔](#測試金字塔)
2. [單元測試](#單元測試)
3. [整合測試](#整合測試)
4. [E2E 測試](#e2e-測試)
5. [測試覆蓋率](#測試覆蓋率)
6. [測試最佳實踐](#測試最佳實踐)

---

## 測試金字塔

```
        ╱╲
       ╱  ╲
      ╱ E2E╲           ← 少量，測試關鍵使用者流程
     ╱──────╲
    ╱        ╲
   ╱ Integr. ╲         ← 中等數量，測試模組整合
  ╱────────────╲
 ╱              ╲
╱  Unit Tests   ╲      ← 大量，測試單一功能
──────────────────
```

### 測試分佈建議

- **單元測試**: 70%
- **整合測試**: 20%
- **E2E 測試**: 10%

---

## 單元測試

### Domain 層測試

**目標覆蓋率**: 100%

Domain 層包含核心業務邏輯，必須有完整的測試覆蓋。

```typescript
// domain/account.aggregate.spec.ts
describe('AccountAggregate', () => {
  describe('create', () => {
    it('should create a new account with valid data', () => {
      // Arrange
      const name = 'John Doe';
      const email = 'john@example.com';
      
      // Act
      const account = AccountAggregate.create(name, email);
      
      // Assert
      expect(account).toBeDefined();
      expect(account.name).toBe(name);
      expect(account.email.value).toBe(email);
    });
    
    it('should throw error when email is invalid', () => {
      // Arrange
      const name = 'John Doe';
      const invalidEmail = 'not-an-email';
      
      // Act & Assert
      expect(() => AccountAggregate.create(name, invalidEmail))
        .toThrow('Invalid email format');
    });
    
    it('should emit AccountCreatedEvent', () => {
      // Arrange
      const name = 'John Doe';
      const email = 'john@example.com';
      
      // Act
      const account = AccountAggregate.create(name, email);
      
      // Assert
      const events = account.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AccountCreatedEvent);
    });
  });
  
  describe('updateEmail', () => {
    it('should update email when valid', () => {
      // Arrange
      const account = AccountAggregate.create('John', 'old@example.com');
      const newEmail = 'new@example.com';
      
      // Act
      account.updateEmail(newEmail);
      
      // Assert
      expect(account.email.value).toBe(newEmail);
    });
    
    it('should emit EmailUpdatedEvent', () => {
      // Arrange
      const account = AccountAggregate.create('John', 'old@example.com');
      account.clearEvents(); // 清除 create 時的事件
      
      // Act
      account.updateEmail('new@example.com');
      
      // Assert
      const events = account.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(EmailUpdatedEvent);
    });
  });
});

// domain/value-objects/email.vo.spec.ts
describe('Email Value Object', () => {
  describe('create', () => {
    it('should create valid email', () => {
      const email = Email.create('test@example.com');
      expect(email.value).toBe('test@example.com');
    });
    
    it.each([
      'invalid',
      '@example.com',
      'test@',
      'test@.com',
      '',
    ])('should throw error for invalid email: %s', (invalidEmail) => {
      expect(() => Email.create(invalidEmail))
        .toThrow('Invalid email format');
    });
  });
  
  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });
    
    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
```

### Application 層測試

**目標覆蓋率**: 80-90%

Application 層測試應 Mock Repository 和外部依賴。

```typescript
// application/handlers/create-account.handler.spec.ts
describe('CreateAccountHandler', () => {
  let handler: CreateAccountHandler;
  let mockAccountRepo: jasmine.SpyObj<AccountRepository>;
  let mockEventBus: jasmine.SpyObj<EventBus>;
  
  beforeEach(() => {
    // 建立 Mock
    mockAccountRepo = jasmine.createSpyObj('AccountRepository', ['save', 'findByEmail']);
    mockEventBus = jasmine.createSpyObj('EventBus', ['publish']);
    
    // 注入 Handler
    handler = new CreateAccountHandler(mockAccountRepo, mockEventBus);
  });
  
  describe('handle', () => {
    it('should create and save account', async () => {
      // Arrange
      const command = new CreateAccountCommand('John Doe', 'john@example.com');
      mockAccountRepo.findByEmail.and.returnValue(Promise.resolve(null));
      mockAccountRepo.save.and.returnValue(Promise.resolve());
      mockEventBus.publish.and.returnValue(Promise.resolve());
      
      // Act
      await handler.handle(command);
      
      // Assert
      expect(mockAccountRepo.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    });
    
    it('should throw error when email already exists', async () => {
      // Arrange
      const command = new CreateAccountCommand('John Doe', 'john@example.com');
      const existingAccount = AccountAggregate.create('Existing', 'john@example.com');
      mockAccountRepo.findByEmail.and.returnValue(Promise.resolve(existingAccount));
      
      // Act & Assert
      await expectAsync(handler.handle(command))
        .toBeRejectedWithError('Email already exists');
      expect(mockAccountRepo.save).not.toHaveBeenCalled();
    });
    
    it('should handle repository errors', async () => {
      // Arrange
      const command = new CreateAccountCommand('John Doe', 'john@example.com');
      mockAccountRepo.findByEmail.and.returnValue(Promise.resolve(null));
      mockAccountRepo.save.and.returnValue(Promise.reject(new Error('DB Error')));
      
      // Act & Assert
      await expectAsync(handler.handle(command))
        .toBeRejected();
    });
  });
});
```

### Service 測試

```typescript
// services/user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch users', () => {
    // Arrange
    const mockUsers: User[] = [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];
    
    // Act
    service.getUsers().subscribe(users => {
      // Assert
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });
    
    // Assert HTTP Request
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('should handle errors', () => {
    // Act
    service.getUsers().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        // Assert
        expect(error.message).toContain('Something went wrong');
      },
    });
    
    // Assert HTTP Request
    const req = httpMock.expectOne('/api/users');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

### Component 測試

```typescript
// features/account/pages/account-list.component.spec.ts
describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let mockAccountService: jasmine.SpyObj<AccountApplicationService>;
  
  beforeEach(async () => {
    mockAccountService = jasmine.createSpyObj('AccountApplicationService', [
      'getAllAccounts',
      'createAccount',
    ]);
    
    await TestBed.configureTestingModule({
      declarations: [AccountListComponent],
      providers: [
        { provide: AccountApplicationService, useValue: mockAccountService },
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load accounts on init', () => {
    // Arrange
    const mockAccounts: AccountDto[] = [
      { id: '1', name: 'Account 1', email: 'acc1@example.com' },
    ];
    mockAccountService.getAllAccounts.and.returnValue(of(mockAccounts));
    
    // Act
    fixture.detectChanges(); // triggers ngOnInit
    
    // Assert
    expect(mockAccountService.getAllAccounts).toHaveBeenCalled();
    component.accounts$.subscribe(accounts => {
      expect(accounts).toEqual(mockAccounts);
    });
  });
  
  it('should display loading state', () => {
    // Arrange
    component.isLoading = true;
    
    // Act
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading')).toBeTruthy();
  });
  
  it('should call createAccount when form submitted', () => {
    // Arrange
    const command = new CreateAccountCommand('New Account', 'new@example.com');
    mockAccountService.createAccount.and.returnValue(of(void 0));
    
    // Act
    component.onCreateAccount('New Account', 'new@example.com');
    
    // Assert
    expect(mockAccountService.createAccount).toHaveBeenCalled();
  });
});
```

---

## 整合測試

### Infrastructure 層整合測試

測試與 Supabase 的整合（使用測試資料庫）。

```typescript
// infrastructure/repositories/supabase-account.repository.spec.ts
describe('SupabaseAccountRepository (Integration)', () => {
  let repository: SupabaseAccountRepository;
  let supabase: SupabaseClient;
  
  beforeAll(async () => {
    // 連接測試資料庫
    supabase = createClient(
      'https://test.supabase.co',
      'test-anon-key'
    );
    repository = new SupabaseAccountRepository(supabase);
    
    // 清理測試資料
    await supabase.from('accounts').delete().neq('id', '');
  });
  
  afterEach(async () => {
    // 每個測試後清理
    await supabase.from('accounts').delete().neq('id', '');
  });
  
  describe('save', () => {
    it('should save account to database', async () => {
      // Arrange
      const account = AccountAggregate.create('Test User', 'test@example.com');
      
      // Act
      await repository.save(account);
      
      // Assert
      const { data } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', account.id)
        .single();
        
      expect(data).toBeTruthy();
      expect(data.name).toBe('Test User');
    });
  });
  
  describe('findById', () => {
    it('should find existing account', async () => {
      // Arrange
      const account = AccountAggregate.create('Test User', 'test@example.com');
      await repository.save(account);
      
      // Act
      const found = await repository.findById(account.id);
      
      // Assert
      expect(found).toBeTruthy();
      expect(found!.id).toBe(account.id);
    });
    
    it('should return null for non-existent account', async () => {
      // Act
      const found = await repository.findById('non-existent-id');
      
      // Assert
      expect(found).toBeNull();
    });
  });
});
```

---

## E2E 測試

使用 Cypress 或 Playwright 進行端到端測試。

```typescript
// e2e/account-management.e2e-spec.ts
describe('Account Management', () => {
  beforeEach(() => {
    cy.visit('/accounts');
  });
  
  it('should display account list', () => {
    cy.get('.account-list').should('be.visible');
    cy.get('.account-card').should('have.length.greaterThan', 0);
  });
  
  it('should create new account', () => {
    // Click create button
    cy.get('[data-testid="create-account-btn"]').click();
    
    // Fill form
    cy.get('[data-testid="account-name"]').type('New Account');
    cy.get('[data-testid="account-email"]').type('new@example.com');
    
    // Submit
    cy.get('[data-testid="submit-btn"]').click();
    
    // Verify
    cy.get('.success-message').should('be.visible');
    cy.get('.account-card').should('contain', 'New Account');
  });
  
  it('should show validation errors', () => {
    cy.get('[data-testid="create-account-btn"]').click();
    cy.get('[data-testid="submit-btn"]').click();
    
    cy.get('.error-message').should('contain', 'Name is required');
    cy.get('.error-message').should('contain', 'Email is required');
  });
});
```

---

## 測試覆蓋率

### 覆蓋率目標

| 層級 | 目標覆蓋率 | 最低要求 |
|------|------------|----------|
| Domain | 100% | 90% |
| Application | 90% | 80% |
| Infrastructure | 80% | 70% |
| Features (Components) | 80% | 70% |
| 整體專案 | 80% | 70% |

### 執行覆蓋率報告

```bash
# 執行測試並產生覆蓋率報告
npm test -- --code-coverage

# 查看報告
open coverage/index.html
```

### 覆蓋率配置

```json
// karma.conf.js
module.exports = function(config) {
  config.set({
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    }
  });
};
```

---

## 測試最佳實踐

### 1. AAA 模式 (Arrange-Act-Assert)

```typescript
it('should do something', () => {
  // Arrange - 準備測試資料
  const input = 'test';
  const expected = 'TEST';
  
  // Act - 執行要測試的動作
  const result = transform(input);
  
  // Assert - 驗證結果
  expect(result).toBe(expected);
});
```

### 2. 測試命名

使用清楚描述性的測試名稱：

```typescript
// ✅ 正確 - 清楚描述測試內容
it('should return null when user not found', () => {});
it('should throw error when email is invalid', () => {});
it('should emit event after account created', () => {});

// ❌ 錯誤 - 不清楚的命名
it('test1', () => {});
it('works', () => {});
it('should work correctly', () => {});
```

### 3. 一個測試只驗證一件事

```typescript
// ✅ 正確 - 每個測試專注一個面向
it('should create account with correct name', () => {
  const account = AccountAggregate.create('John', 'john@example.com');
  expect(account.name).toBe('John');
});

it('should create account with correct email', () => {
  const account = AccountAggregate.create('John', 'john@example.com');
  expect(account.email.value).toBe('john@example.com');
});

// ❌ 錯誤 - 一個測試驗證太多事情
it('should create account correctly', () => {
  const account = AccountAggregate.create('John', 'john@example.com');
  expect(account.name).toBe('John');
  expect(account.email.value).toBe('john@example.com');
  expect(account.isActive).toBe(true);
  expect(account.createdAt).toBeDefined();
  // ... 更多斷言
});
```

### 4. 使用測試資料建構器

```typescript
// test-builders/account.builder.ts
export class AccountTestBuilder {
  private name = 'Default Name';
  private email = 'default@example.com';
  
  withName(name: string): this {
    this.name = name;
    return this;
  }
  
  withEmail(email: string): this {
    this.email = email;
    return this;
  }
  
  build(): AccountAggregate {
    return AccountAggregate.create(this.name, this.email);
  }
}

// 使用
it('should do something', () => {
  const account = new AccountTestBuilder()
    .withName('John')
    .withEmail('john@example.com')
    .build();
    
  // 測試邏輯
});
```

### 5. Mock 和 Stub

```typescript
// ✅ 正確 - 只 Mock 需要的部分
const mockRepo = jasmine.createSpyObj('AccountRepository', ['save']);
mockRepo.save.and.returnValue(Promise.resolve());

// ❌ 錯誤 - Mock 整個複雜物件
const mockRepo = {
  save: () => Promise.resolve(),
  findById: () => Promise.resolve(null),
  findAll: () => Promise.resolve([]),
  // ... 許多不需要的方法
};
```

### 6. 測試隔離

```typescript
// ✅ 正確 - 每個測試獨立
describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    service = new UserService(); // 每個測試都有新的 instance
  });
  
  it('test 1', () => { /* ... */ });
  it('test 2', () => { /* ... */ });
});

// ❌ 錯誤 - 測試間共享狀態
describe('UserService', () => {
  const service = new UserService(); // 共享 instance
  
  it('test 1', () => {
    service.addUser('user1'); // 影響其他測試
  });
  
  it('test 2', () => {
    expect(service.getUsers()).toHaveLength(0); // 可能失敗
  });
});
```

### 7. 避免測試實作細節

```typescript
// ✅ 正確 - 測試行為
it('should save user', async () => {
  await service.saveUser(user);
  const saved = await service.getUser(user.id);
  expect(saved).toEqual(user);
});

// ❌ 錯誤 - 測試實作細節
it('should call repository save method', async () => {
  await service.saveUser(user);
  expect(mockRepo.save).toHaveBeenCalled(); // 測試實作細節
});
```

---

## 持續整合

### CI Pipeline 檢查

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test -- --watch=false --code-coverage
      - name: Check coverage
        run: |
          if [ $(cat coverage/coverage-summary.json | jq '.total.lines.pct') -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi
```

---

## 參考資源

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**記住**: 好的測試是代碼品質的保證。投資時間撰寫測試，長期會節省除錯時間。
