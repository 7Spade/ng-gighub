# Core / Domain 層

## 概述

Domain 層是 DDD 架構的核心，包含業務邏輯的本質與規則。這一層應該：

- **不依賴** 任何外部框架或基礎設施
- **純粹表達** 業務領域的概念與規則
- **高度可測試** 且不需要外部依賴

## 資料夾結構

### shared/
共享的領域基礎元件

- **base/**: 基礎抽象類別
  - `aggregate-root.base.ts` - 聚合根基礎類別
  - `entity.base.ts` - 實體基礎類別
  - `value-object.base.ts` - 值物件基礎類別
  - `domain-event.base.ts` - 領域事件基礎類別

- **types/**: 共用型別定義
  - `result.ts` - Result monad，用於封裝操作結果
  - `either.ts` - Either monad，表示兩種可能的結果
  - `unique-id.ts` - 唯一識別碼型別

- **errors/**: 領域錯誤定義
  - `domain-error.ts` - 領域錯誤基礎類別
  - `validation-error.ts` - 驗證錯誤類別

### account/
Account 聚合根 - 代表系統中的各種帳號（User, Organization, Bot）

- **aggregates/**: 聚合根定義
  - `account.aggregate.ts` - 抽象帳號聚合根
  - `user-account.aggregate.ts` - 使用者帳號聚合根
  - `organization-account.aggregate.ts` - 組織帳號聚合根
  - `bot-account.aggregate.ts` - 機器人帳號聚合根

- **entities/**: 帳號相關實體
  - `account-profile.entity.ts` - 帳號個人資料
  - `account-settings.entity.ts` - 帳號設定

- **value-objects/**: 值物件
  - `account-id.vo.ts` - 帳號識別碼
  - `account-type.vo.ts` - 帳號類型
  - `account-name.vo.ts` - 帳號名稱
  - `username.vo.ts` - 使用者名稱
  - `email.vo.ts` - Email 地址
  - `account-role.vo.ts` - 帳號角色

- **events/**: 領域事件
  - `account-created.event.ts` - 帳號建立事件
  - `account-switched.event.ts` - 帳號切換事件
  - `account-updated.event.ts` - 帳號更新事件
  - `account-deleted.event.ts` - 帳號刪除事件

- **repositories/**: Repository 介面
  - `account.repository.interface.ts` - 帳號 repository 介面

- **services/**: 領域服務
  - `account-domain.service.ts` - 帳號領域服務
  - `account-factory.service.ts` - 帳號工廠服務
  - `account-validator.service.ts` - 帳號驗證服務

- **specifications/**: 規格模式
  - `can-switch-account.spec.ts` - 可否切換帳號規格
  - `can-delete-account.spec.ts` - 可否刪除帳號規格

### organization/
Organization 聚合根 - 代表組織實體，管理成員與團隊

包含類似的子資料夾結構：aggregates, entities, value-objects, events, repositories, services

### team/
Team 聚合根 - 代表團隊實體，管理團隊成員

包含類似的子資料夾結構：aggregates, entities, value-objects, events, repositories, services

### repository/
Repository 聚合根 - 代表程式碼倉庫實體

包含類似的子資料夾結構：aggregates, entities, value-objects, events, repositories, services

## DDD 核心概念

### 聚合根 (Aggregate Root)
- 聚合的入口點，負責維護聚合內的不變條件
- 外部只能透過聚合根來修改聚合內的實體
- 聚合根之間透過 ID 引用，而非直接物件引用

### 實體 (Entity)
- 具有唯一識別碼的物件
- 透過識別碼來判斷同一性，而非屬性值
- 可變的，狀態會隨時間改變

### 值物件 (Value Object)
- 不可變的物件，透過屬性值來判斷相等性
- 沒有唯一識別碼
- 封裝驗證邏輯與業務規則

### 領域事件 (Domain Event)
- 記錄領域中發生的重要業務事件
- 不可變，發生後不應被修改
- 用於聚合之間的鬆耦合通訊

### 領域服務 (Domain Service)
- 處理跨越多個聚合或不屬於單一聚合的業務邏輯
- 無狀態，純粹處理邏輯
- 不應該持有領域物件的狀態

### Repository 介面
- 定義聚合根的持久化操作
- 只在 Domain 層定義介面
- 實作在 Infrastructure 層

## 使用原則

1. **保持純粹性**: Domain 層不應依賴任何外部框架或 UI 邏輯
2. **充分封裝**: 領域物件應該保護自己的不變條件
3. **表達業務**: 程式碼應該反映業務專家的語言（Ubiquitous Language）
4. **測試優先**: Domain 邏輯應該容易測試，不需要外部依賴
5. **避免貧血模型**: 領域物件應該包含行為，而非只是資料容器
