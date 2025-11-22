# ng-alain-gighub 參考摘要

> 從 ng-alain-gighub 專案提取的關鍵內容快速參考

**完整報告**：`docs/ng-alain-gighub-value-extraction.md`

---

## 🎯 核心價值

ng-alain-gighub 提供了一個完整的 **AI 輔助開發文件體系**範例，包含：

1. **5 個專門的 Copilot 指引檔案**（根目錄）
2. **GitHub 標準位置指引**（`.github/copilot-instructions.md`）
3. **三層架構組織**（根目錄 + .github/agents/ + .cursor/rules/）
4. **57+ 份開發文件**（架構、測試、部署、安全等）
5. **VSCode Settings 整合**

---

## 📋 立即可採用的內容

### 1. Copilot 指引檔案（根目錄）

#### `.copilot-instructions.md`（主要開發指引）
```
語言：正體中文（zh-TW）
UI：NG-ZORRO / @delon/abc 優先 → ng-gighub 改為 Angular Material
Angular：OnPush、Standalone、Signals
TypeScript：strict mode、禁止 any
認證：Supabase Auth + @delon/auth TokenService
測試：Jasmine/Karma + Playwright E2E
安全：不得寫入 secrets
Commit/PR：Conventional Commits
```

#### `.copilot-commit-message-instructions.md`
```
格式：<type>(<scope>): <subject>
類型：feat|fix|docs|style|refactor|perf|test|chore
Subject：繁體中文
Body：說明變更原因、重點、回滾步驟
Footer：關聯 issue 或 migration
```

#### `.copilot-pull-request-description-instructions.md`（10KB）
```
完整的 PR 描述模板：
- 變更目的
- 變更內容
- 技術細節
- 測試結果
- 截圖
- 相關連結
- 注意事項
- 部署檢查清單
- 審查者

包含三種 PR 類型的完整範例（新功能、Bug 修復、重構）
```

#### `.copilot-review-instructions.md`
```
10 大必檢核項目：
1. 功能正確性
2. 型別安全
3. 安全性
4. 效能
5. 可測試性
6. 可維護性
7. UI/UX
8. RLS/權限
9. 邊界條件
10. 文檔
```

#### `.copilot-test-instructions.md`（11KB）
```
測試框架：Jasmine + Karma
測試類型：元件、服務、整合
測試模式：AAA（Arrange-Act-Assert）
覆蓋率：≥ 80%
Signals 測試方法
避免的反模式
```

### 2. GitHub 標準位置

#### `.github/copilot-instructions.md`（13KB）
```
GitHub Copilot 自動查找的標準位置
包含：
- 專案願景與架構概述
- 開發規範與原則
- 認證與權限
- 測試要求
- 安全規範
- 開發工作流程
- Agent 操作限制
- 完整文件索引
```

### 3. VSCode Settings 整合

在 `.vscode/settings.json` 配置：

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": ".copilot-instructions.md" }
  ],
  "github.copilot.chat.reviewSelection.instructions": [
    { "file": ".copilot-review-instructions.md" }
  ],
  "github.copilot.chat.commitMessageGeneration.instructions": [
    { "file": ".copilot-commit-message-instructions.md" }
  ],
  "github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
    { "file": ".copilot-pull-request-description-instructions.md" }
  ],
  "github.copilot.chat.testGeneration.instructions": [
    { "file": ".copilot-test-instructions.md" }
  ]
}
```

### 4. AGENTS.md（14KB）

詳細說明 AI 輔助文件組織結構：
- 三層架構說明
- 檔案用途與目標受眾
- 使用方式
- 規則文件索引

---

## 🔑 核心開發原則

來自 ng-alain-gighub 的**四個核心原則**：

### 1. 常見做法（Common Practice）
- 遵循業界標準做法
- 參考官方文檔和最佳實踐
- 保持代碼一致性

### 2. 企業標準（Enterprise Standard）
- 代碼結構清晰
- 職責分離明確
- 錯誤處理完善
- 狀態管理規範

### 3. 符合邏輯（Logical）
- 數據流清晰
- 命名語義化
- 條件判斷合理
- 組件初始化順序正確

### 4. 符合常理（Common Sense）
- 功能真正可用
- 用戶體驗優先
- 避免過度設計
- 及時驗證

---

## 📚 重要文件清單

### 必讀（立即參考）
- `AGENTS.md` - 14KB，檔案組織結構 ⭐⭐⭐
- `.github/copilot-instructions.md` - 13KB，GitHub 標準指引 ⭐⭐
- `.copilot-pull-request-description-instructions.md` - 10KB，PR 模板 ⭐⭐
- `.copilot-test-instructions.md` - 11KB，測試指引 ⭐⭐

### 重要參考（中期採用）
- `docs/22-完整SQL表結構定義.md` - 57KB，資料表結構
- `docs/31-測試指南.md` - 23KB，詳細測試策略
- `docs/37-SHARED_IMPORTS-使用指南.md` - 17KB，共用模組
- `docs/42-開發最佳實踐指南.md` - 15KB，最佳實務示例

### 進階參考（長期採用）
- `docs/44-企業級任務系統開發指令.md` - 36KB，系統開發
- 20+ 份架構圖文件（Mermaid）
- 15+ 份開發指南
- 13 份 Tracking 文件

---

## 🔄 ng-gighub 應用策略

### Phase 1：立即採用（本 PR）
- ✅ 創建價值提取報告
- ⏳ 更新 `.github/copilot-instructions.md`（已存在，需強化）
- ⏳ 創建 `.copilot-instructions.md`
- ⏳ 創建 `.copilot-commit-message-instructions.md`
- ⏳ 更新 `.vscode/settings.json`

### Phase 2：後續 PR
- 補充其他 Copilot 指引檔案
- 創建完整的 AGENTS.md
- 建立 `.github/agents/` 目錄

### Phase 3：持續優化
- 補充核心開發文件
- 建立架構文件體系
- 補充進階主題文件

---

## ⚠️ 需要調整的差異

### UI 框架
- **ng-alain-gighub**：NG-ZORRO / @delon/abc
- **ng-gighub**：Angular Material
- **調整**：將 NG-ZORRO 改為 Angular Material

### 包管理器
- **ng-alain-gighub**：Yarn
- **ng-gighub**：npm
- **調整**：將 Yarn 指令改為 npm

### 架構
- **ng-alain-gighub**：Git-like 分支模型 + 51 張資料表
- **ng-gighub**：簡化架構
- **調整**：根據實際架構調整

---

## 🔗 參考連結

- **Repository**：https://github.com/7Spade/ng-alain-gighub
- **完整報告**：`docs/ng-alain-gighub-value-extraction.md`
- **Redis 記憶**：`ng-gighub:copilot-system:ng-alain-reference`

---

**最後更新**：2025-11-22  
**維護者**：開發團隊
