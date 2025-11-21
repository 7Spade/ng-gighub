# Core / Application 層

## 概述

Application 層實作應用程式的用例(Use Cases)，協調 Domain 層的物件來完成業務流程。這一層採用 **CQRS (Command Query Responsibility Segregation)** 模式，將讀取與寫入操作分離。

## 職責

- **協調領域物件**: 呼叫 Domain 層的聚合根、服務來執行業務邏輯
- **處理事務**: 管理資料庫事務的邊界
- **轉換資料**: 將領域物件轉換為 DTO (Data Transfer Object)
- **驗證輸入**: 驗證來自展示層的輸入
- **發布事件**: 觸發領域事件的發布

## CQRS 模式

### Commands (命令)
- 代表**變更系統狀態**的意圖
- 命名使用祈使句，如：`CreateUserAccount`, `UpdateAccount`, `DeleteAccount`
- 由 Command Handler 處理
- 可能會改變資料庫狀態
- 回傳執行結果（成功/失敗）

### Queries (查詢)
- 代表**讀取資料**的意圖
- 命名使用疑問句，如：`GetCurrentAccount`, `ListAccessibleAccounts`
- 由 Query Handler 處理
- **不應**改變系統狀態（無副作用）
- 回傳 DTO 物件

## 資料夾結構

### account/
處理帳號相關的用例

- **commands/**: 命令定義
  - `create-user-account.command.ts` - 建立使用者帳號
  - `create-organization.command.ts` - 建立組織
  - `switch-account.command.ts` - 切換帳號
  - 等等...

- **commands/handlers/**: 命令處理器
  - `create-user-account.handler.ts` - 處理建立使用者帳號
  - 等等...

- **queries/**: 查詢定義
  - `get-current-account.query.ts` - 取得當前帳號
  - `list-accessible-accounts.query.ts` - 列出可存取的帳號
  - 等等...

- **queries/handlers/**: 查詢處理器
  - `get-current-account.handler.ts` - 處理取得當前帳號
  - 等等...

- **dto/**: 資料傳輸物件
  - `account.dto.ts` - 帳號 DTO
  - `user-account.dto.ts` - 使用者帳號 DTO
  - 等等...

- **services/**: 應用服務
  - `account-application.service.ts` - 帳號應用服務
  - `account-switcher.service.ts` - 帳號切換服務

### organization/
處理組織相關的用例

包含類似的結構：commands, queries, handlers, dto, services

### team/
處理團隊相關的用例

包含類似的結構：commands, queries, handlers, dto, services

### repository/
處理倉庫相關的用例

包含類似的結構：commands, queries, handlers, dto, services

### shared/
共用的應用層元件

- **interfaces/**: 共用介面
  - `command-handler.interface.ts` - Command Handler 介面
  - `query-handler.interface.ts` - Query Handler 介面

- **base/**: 基礎類別
  - `base-command.ts` - Command 基礎類別
  - `base-query.ts` - Query 基礎類別

## 使用範例

### Command 流程
```typescript
// 1. 建立 Command
const command = new CreateUserAccountCommand({
  username: 'john_doe',
  email: 'john@example.com'
});

// 2. 執行 Handler
const handler = new CreateUserAccountHandler(accountRepository, eventPublisher);
const result = await handler.execute(command);

// 3. 處理結果
if (result.isSuccess) {
  // 成功處理
} else {
  // 錯誤處理
}
```

### Query 流程
```typescript
// 1. 建立 Query
const query = new GetCurrentAccountQuery({ userId: '123' });

// 2. 執行 Handler
const handler = new GetCurrentAccountHandler(queryService);
const accountDto = await handler.execute(query);

// 3. 使用 DTO
console.log(accountDto.username);
```

## 設計原則

1. **單一職責**: 每個 Handler 只處理一個 Command 或 Query
2. **依賴注入**: Handler 透過建構子注入所需的 Repository 或 Service
3. **不含業務邏輯**: 複雜的業務邏輯應在 Domain 層，Application 層只協調
4. **事務邊界**: Command Handler 通常是事務的邊界
5. **DTO 轉換**: 永不直接將領域物件暴露給展示層
6. **錯誤處理**: 使用 Result 或 Either 型別來處理錯誤，避免例外拋出

## 與其他層的關係

- **依賴 Domain 層**: 使用聚合根、實體、值物件、Repository 介面
- **被 Features 層使用**: 展示層元件注入 Application Service 來執行用例
- **不依賴 Infrastructure**: 透過介面與 Infrastructure 層互動
