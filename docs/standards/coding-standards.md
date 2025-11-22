# ng-gighub 開發規範

## 概述

本文檔定義了 ng-gighub 專案的整體開發規範，旨在確保代碼品質、架構一致性和團隊協作效率。所有團隊成員必須遵守這些規範。

## 目錄

1. [架構規範](#架構規範)
2. [命名規範](#命名規範)
3. [代碼風格](#代碼風格)
4. [依賴規則](#依賴規則)
5. [測試規範](#測試規範)
6. [Git 工作流程](#git-工作流程)
7. [工具配置](#工具配置)

---

## 架構規範

### DDD 分層架構

本專案採用 **Domain-Driven Design (DDD)** 結合 **Clean Architecture**，詳細說明請參考 [ARCHITECTURE.md](./src/app/ARCHITECTURE.md)。

```
src/app/
├── core/
│   ├── domain/         # 領域層 - 業務邏輯核心（不依賴任何外部層）
│   ├── application/    # 應用層 - 用例協調（只依賴 domain）
│   └── infrastructure/ # 基礎設施層 - 技術實作（實作 domain 介面）
├── features/           # 展示層 - UI 實作（依賴 application）
├── shared/             # 共用模組 - 跨 feature 元件
└── layouts/            # 佈局模組 - 整體版面結構
```

### 模組組織原則

1. **按功能分組（Feature-based）**
   - 每個 feature 是獨立的功能模組
   - 包含該功能所需的 components, pages, state, services

2. **分層隔離**
   - Domain 層不依賴任何框架或外部庫
   - Application 層只依賴 Domain 層
   - Infrastructure 層實作 Domain 層定義的介面
   - Features 層通過 Application 層訪問業務邏輯

3. **共用原則**
   - 跨 feature 使用的 UI 元件放在 `shared/`
   - 業務邏輯共用透過 Domain 層的抽象定義
   - 技術實作共用透過 Infrastructure 層

---

## 命名規範

詳細規範請參考 [naming-conventions.md](./naming-conventions.md)。

### 快速參考

- **檔案命名**: `kebab-case`
  - Component: `user-profile.component.ts`
  - Service: `user.service.ts`
  - Interface: `user-repository.interface.ts`

- **類別命名**: `PascalCase`
  - Component: `UserProfileComponent`
  - Service: `UserService`
  - Interface: `IUserRepository` 或 `UserRepository`

- **變數/函數**: `camelCase`
  - 變數: `userName`, `isActive`
  - 函數: `getUserById()`, `validateInput()`

- **常數**: `UPPER_SNAKE_CASE`
  - `MAX_RETRY_COUNT`, `API_BASE_URL`

---

## 代碼風格

詳細規範請參考 [code-style.md](./code-style.md)。

### 自動化工具

- **ESLint**: 代碼檢查和規則強制
- **Prettier**: 代碼格式化
- **TypeScript**: 嚴格模式啟用

### 執行檢查

```bash
# 檢查代碼風格
npm run format:check

# 自動格式化
npm run format

# 執行 lint
npm run lint

# 執行 lint 並自動修復
npm run lint:fix

# 一次執行所有檢查
npm run check
```

### 關鍵原則

1. **TypeScript 嚴格模式**
   - 禁止使用 `any`（除非有充分理由）
   - 所有變數必須明確型別
   - 啟用 `strict` 模式

2. **代碼簡潔性**
   - 單一職責原則
   - 函數保持簡短（建議 < 30 行）
   - 避免過深的巢狀（建議 < 4 層）

3. **可讀性優先**
   - 有意義的變數和函數名稱
   - 適當的註解（why, not what）
   - 保持一致的代碼風格

---

## 依賴規則

詳細規範請參考 [dependency-rules.md](./dependency-rules.md)。

### 依賴方向規則

```
展示層 (Features) → 應用層 (Application) → 領域層 (Domain)
                  ↓
          基礎設施層 (Infrastructure)
```

### 禁止事項

- ❌ 領域層依賴其他任何層
- ❌ 應用層依賴基礎設施層或展示層
- ❌ 循環依賴
- ❌ Feature 之間的直接依賴

### 允許事項

- ✅ 展示層依賴應用層
- ✅ 應用層依賴領域層
- ✅ 基礎設施層實作領域層介面
- ✅ 所有層使用 shared 模組

---

## 測試規範

詳細規範請參考 [testing-standards.md](./testing-standards.md)。

### 測試策略

1. **單元測試**（Unit Tests）
   - Domain 層: 100% 覆蓋率目標
   - Application 層: Mock Repository
   - Services: 隔離測試

2. **整合測試**（Integration Tests）
   - Infrastructure 層與 Supabase 整合
   - 使用測試資料庫

3. **E2E 測試**（End-to-End Tests）
   - 關鍵使用者流程
   - 跨功能整合場景

### 測試檔案位置

- 測試檔案與被測試檔案放在同一目錄
- 命名: `*.spec.ts`
- 範例: `user.service.spec.ts`

### 執行測試

```bash
# 執行所有測試
npm test

# 執行測試並產生覆蓋率報告
npm test -- --code-coverage
```

---

## Git 工作流程

詳細規範請參考 [git-workflow.md](./git-workflow.md)。

### Branch 命名

- Feature: `feature/user-authentication`
- Bugfix: `bugfix/login-error`
- Hotfix: `hotfix/security-patch`
- Release: `release/v1.0.0`

### Commit Message 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

```
<type>(<scope>): <subject>

<body>

<footer>
```

類型（type）:
- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文檔變更
- `style`: 代碼格式（不影響代碼運行）
- `refactor`: 重構（不是新功能也不是修復）
- `test`: 測試相關
- `chore`: 建置流程或輔助工具變更

範例:
```
feat(auth): add user login functionality

- Implement login service
- Add login form component
- Integrate with Supabase auth

Closes #123
```

### Pull Request 流程

1. 建立 feature branch
2. 實作功能並撰寫測試
3. 執行 `npm run check` 確保代碼品質
4. 提交 PR（使用 PR 模板）
5. 等待 Code Review
6. 修正 Review 意見
7. 合併到主分支

---

## 工具配置

### 必需工具

1. **Node.js**: v20.x
2. **npm**: v10.x
3. **Angular CLI**: v20.x
4. **VSCode**（推薦）

### VSCode 擴充套件（推薦）

- Angular Language Service
- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code
- GitLens

### IDE 設定

VSCode 設定（`.vscode/settings.json`）:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## 代碼審查檢查清單

在提交 PR 之前，請確認：

- [ ] 代碼通過 `npm run check`（ESLint + Prettier）
- [ ] 所有測試通過 `npm test`
- [ ] Build 成功 `npm run build`
- [ ] 遵循命名規範
- [ ] 遵循架構分層原則
- [ ] 無循環依賴
- [ ] 有適當的測試覆蓋
- [ ] 有必要的註解和文檔
- [ ] Commit message 符合規範
- [ ] PR 描述清楚

---

## 違規處理

1. **自動化檢查失敗**
   - CI/CD pipeline 會自動檢查
   - 必須修復才能合併

2. **人工審查發現問題**
   - Reviewer 會留下具體建議
   - 需要修正並重新提交

3. **嚴重違規**
   - 破壞架構原則
   - 引入技術債務
   - 會被要求重新設計

---

## 學習資源

### 內部文檔
- [架構說明](./src/app/ARCHITECTURE.md)
- [命名規範](./NAMING_CONVENTIONS.md)
- [代碼風格](./CODE_STYLE.md)
- [依賴規則](./DEPENDENCY_RULES.md)
- [測試規範](./TESTING_STANDARDS.md)
- [Git 工作流程](./GIT_WORKFLOW.md)

### 外部資源
- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

## 更新記錄

- 2025-11-22: 初始版本建立

---

**注意**: 這些規範是活文檔，會隨專案發展持續更新。如有疑問或建議，請提出 Issue 討論。
