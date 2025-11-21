# ng-gighub DDD 架構說明

## 專案架構概覽

本專案採用 **Domain-Driven Design (DDD)** 架構，結合 **Clean Architecture** 原則，將應用程式分為四個主要層級。

## 📁 資料夾結構

```
src/app/
├── core/                          # 核心層
│   ├── domain/                    # 領域層 - 業務邏輯的核心
│   ├── application/               # 應用層 - 用例協調
│   └── infrastructure/            # 基礎設施層 - 技術實作
├── features/                      # 功能層 - UI 展示
├── shared/                        # 共用模組
└── layouts/                       # 佈局模組
```

## 🏗️ 架構層級

### 1. Core / Domain 層（領域層）
**路徑**: `src/app/core/domain/`

**職責**:
- 包含業務邏輯的本質與規則
- 定義領域模型：聚合根、實體、值物件
- 發布領域事件
- 不依賴任何外部框架

**包含**:
- **4 個聚合根**: Account, Organization, Team, Repository
- **共享元件**: 基礎類別、型別、錯誤處理

[詳細說明](./core/domain/README.md)

### 2. Core / Application 層（應用層）
**路徑**: `src/app/core/application/`

**職責**:
- 實作應用程式用例（Use Cases）
- 採用 CQRS 模式（Commands 與 Queries 分離）
- 協調領域物件執行業務流程
- 將領域物件轉換為 DTO

**包含**:
- Commands & Command Handlers（寫入操作）
- Queries & Query Handlers（讀取操作）
- DTOs（資料傳輸物件）
- Application Services

[詳細說明](./core/application/README.md)

### 3. Core / Infrastructure 層（基礎設施層）
**路徑**: `src/app/core/infrastructure/`

**職責**:
- 實作技術細節
- Repository 實作（使用 Supabase）
- 外部服務整合（Email, Storage）
- 事件發布與處理
- 認證與授權

**包含**:
- Supabase Repositories & Mappers
- Query Services
- Event Bus
- Auth Services
- External Services

[詳細說明](./core/infrastructure/README.md)

### 4. Features 層（展示層）
**路徑**: `src/app/features/`

**職責**:
- 使用者介面實作
- Angular Components（Pages & Components）
- 狀態管理（Stores）
- 路由配置

**包含**:
- **4 個功能模組**: account, organization, team, repository
- 每個模組包含: pages, components, state

[詳細說明](./features/README.md)

### 5. Shared 模組
**路徑**: `src/app/shared/`

**職責**:
- 跨 feature 共用的 UI 元件
- Directives、Pipes、工具函數

**包含**:
- Components（loading, error, empty-state）
- Directives（permission, role）
- Pipes（dateFormat, truncate）
- Utils（validators, formatters）

[詳細說明](./shared/README.md)

### 6. Layouts 模組
**路徑**: `src/app/layouts/`

**職責**:
- 定義應用程式整體佈局
- 提供一致的使用者體驗

**包含**:
- Default Layout（header, sidebar, footer）
- Auth Layout（登入、註冊頁面）

[詳細說明](./layouts/README.md)

## 🎯 設計原則

### 依賴規則（Dependency Rule）
```
展示層 → 應用層 → 領域層
       ↓
   基礎設施層
```

- **領域層**: 不依賴任何外部層
- **應用層**: 只依賴領域層
- **基礎設施層**: 依賴領域層（實作介面）
- **展示層**: 依賴應用層

### SOLID 原則
- **單一職責**: 每個類別只有一個變更的理由
- **開放封閉**: 對擴展開放，對修改封閉
- **里氏替換**: 子類別可以替換父類別
- **介面隔離**: 不強迫實作不需要的介面
- **依賴反轉**: 依賴抽象而非具體實作

### DDD 核心概念
- **聚合根**: 聚合的入口，維護不變條件
- **實體**: 有唯一識別碼的物件
- **值物件**: 不可變，透過屬性值判斷相等
- **領域事件**: 記錄重要的業務事件
- **Repository**: 聚合根的持久化介面

## 🔄 資料流

### Command 流程（寫入）
```
Component → Application Service → Command Handler 
  → Domain Aggregate → Repository → Database
```

### Query 流程（讀取）
```
Component → Application Service → Query Handler 
  → Query Service → Database → DTO
```

## 📚 開發指南

### 新增功能的步驟

1. **領域層**: 定義聚合根、實體、值物件、事件
2. **應用層**: 建立 Command/Query 與對應的 Handler
3. **基礎設施層**: 實作 Repository、Mapper、Schema
4. **展示層**: 建立 Page、Component、State

### 命名規範

- **聚合根**: `[Name]Aggregate`
- **實體**: `[Name]Entity`
- **值物件**: `[Name]` (加 `.vo.ts` 後綴)
- **事件**: `[Name]Event`
- **Command**: `[Action][Subject]Command`
- **Query**: `[Action][Subject]Query`
- **DTO**: `[Name]Dto`
- **Component**: `[name].component.ts`

### 測試策略

- **領域層**: 單元測試，測試業務邏輯
- **應用層**: 單元測試，mock Repository
- **基礎設施層**: 整合測試，使用測試資料庫
- **展示層**: 單元 + E2E 測試

## 🛠️ 技術棧

- **框架**: Angular 20.1
- **語言**: TypeScript 5.8
- **資料庫**: Supabase (PostgreSQL)
- **狀態管理**: NgRx Signal Store / RxJS
- **UI**: Angular Material
- **測試**: Karma + Jasmine

## 📖 相關文件

- [Domain Layer README](./core/domain/README.md)
- [Application Layer README](./core/application/README.md)
- [Infrastructure Layer README](./core/infrastructure/README.md)
- [Features Layer README](./features/README.md)
- [Shared Module README](./shared/README.md)
- [Layouts Module README](./layouts/README.md)

## 🎓 學習資源

- [Domain-Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Angular Architecture Guide](https://angular.dev/style-guide)

---

**注意**: 目前所有檔案都是架構骨架，包含 TODO 註解，需要根據實際業務需求填入具體實作。
