# 開發規範實施指南

## 概述

本文檔提供 ng-gighub 開發規範的快速實施指南，幫助團隊成員快速上手。

---

## 🎯 核心規範檔案

### 必讀文檔（按優先順序）

1. **[../standards/coding-standards.md](../standards/coding-standards.md)** ⭐⭐⭐
   - 開始這裡！整體規範總覽
   - 涵蓋所有關鍵領域
   - 包含檢查清單

2. **[../architecture/system-overview.md](../architecture/system-overview.md)** ⭐⭐⭐
   - DDD 架構說明
   - 分層原則和依賴規則
   - 資料流設計

3. **[../standards/naming-conventions.md](../standards/naming-conventions.md)** ⭐⭐
   - 命名規範詳細說明
   - 包含大量範例

4. **[../standards/code-style.md](../standards/code-style.md)** ⭐⭐
   - 代碼風格指南
   - TypeScript, Angular, HTML, SCSS

5. **[../standards/git-workflow.md](../standards/git-workflow.md)** ⭐⭐
   - Git 工作流程
   - Commit message 規範
   - PR 流程

6. **[../standards/dependency-rules.md](../standards/dependency-rules.md)** ⭐
   - 依賴規則詳細說明
   - 進階架構主題

7. **[../standards/testing-standards.md](../standards/testing-standards.md)** ⭐
   - 測試策略和標準
   - 測試覆蓋率要求

---

## 🚀 快速開始（新成員）

### Day 1: 環境設定

1. **安裝必要工具**
   ```bash
   # Node.js v20.x
   # npm v10.x
   # Git
   ```

2. **Clone 專案**
   ```bash
   git clone https://github.com/7Spade/ng-gighub.git
   cd ng-gighub
   npm install
   ```

3. **設定 IDE（推薦 VSCode）**
   
   安裝擴充套件：
   - Angular Language Service
   - ESLint
   - Prettier - Code formatter
   - EditorConfig for VS Code
   - GitLens

   VSCode 設定（`.vscode/settings.json`）：
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

4. **閱讀核心文檔**
   - [ ] [../standards/coding-standards.md](../standards/coding-standards.md)
   - [ ] [../architecture/system-overview.md](../architecture/system-overview.md)
   - [ ] [../standards/git-workflow.md](../standards/git-workflow.md)

### Day 2-3: 熟悉架構

1. **理解 DDD 分層**
   ```
   Domain → Application → Infrastructure
                ↓
            Features
   ```

2. **瀏覽現有代碼**
   - 查看 `src/app/core/domain/` - 業務邏輯
   - 查看 `src/app/core/application/` - 用例
   - 查看 `src/app/features/` - UI 實作

3. **執行專案**
   ```bash
   npm start
   # 開啟 http://localhost:4200
   ```

### Week 1: 第一個任務

1. **選擇小型任務**
   - 建議從修復小 bug 或添加小功能開始

2. **遵循流程**
   ```bash
   # 1. 建立分支
   git checkout -b feature/my-first-task
   
   # 2. 開發並測試
   # ...
   
   # 3. 檢查代碼品質
   npm run check
   
   # 4. Commit（遵循 Conventional Commits）
   git commit -m "feat(scope): description"
   
   # 5. 推送並建立 PR
   git push origin feature/my-first-task
   ```

3. **學習從 Code Review**
   - 接受 Reviewer 的反饋
   - 理解為什麼需要修改
   - 記住常見問題避免重複

---

## 📋 日常開發檢查清單

### 開始工作前
- [ ] 從 `develop` 建立新分支
- [ ] 拉取最新代碼 `git pull origin develop`
- [ ] 確認 Issue 需求清楚

### 開發過程中
- [ ] 遵循命名規範
- [ ] 遵循架構分層
- [ ] 撰寫測試
- [ ] 定期 commit（小步提交）
- [ ] 保持分支與 develop 同步

### 提交 PR 前
- [ ] `npm run check` 通過
- [ ] `npm test` 通過
- [ ] `npm run build` 成功
- [ ] 自我 Code Review
- [ ] 填寫 PR 模板
- [ ] 檢查 commit messages
- [ ] 確認沒有 console.log 或 debugger

---

## 🛠️ 常用命令

### 代碼品質
```bash
# 檢查所有問題
npm run check

# 格式化代碼
npm run format

# 修復 lint 問題
npm run lint:fix
```

### 開發
```bash
# 啟動開發伺服器
npm start

# Build
npm run build

# 測試
npm test

# SSR
npm run serve:ssr:ng-gighub
```

### Git
```bash
# 建立分支
git checkout -b feature/new-feature

# 同步 develop
git rebase develop

# 提交
git commit -m "feat(scope): description"

# 推送
git push origin feature/new-feature
```

---

## 💡 常見問題

### Q1: 我的代碼不符合格式怎麼辦？

```bash
# 自動格式化
npm run format

# 自動修復 lint 問題
npm run lint:fix
```

### Q2: 不確定如何命名？

查看 [命名規範](../standards/naming-conventions.md)，裡面有詳細的範例。

基本規則：
- 檔案：`kebab-case`
- 類別：`PascalCase`
- 變數/函數：`camelCase`
- 常數：`UPPER_SNAKE_CASE`

### Q3: 不知道代碼應該放在哪一層？

參考 [系統架構概覽](../architecture/system-overview.md)：

- 純業務邏輯 → `core/domain/`
- 用例協調 → `core/application/`
- 資料庫/API → `core/infrastructure/`
- UI 元件 → `features/`
- 共用元件 → `shared/`

### Q4: Commit message 怎麼寫？

遵循 Conventional Commits：

```
<type>(<scope>): <subject>

<body>

<footer>
```

常用 types:
- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文檔
- `refactor`: 重構
- `test`: 測試
- `chore`: 雜項

範例：
```
feat(auth): add user login functionality

Implement user login with email and password.

Closes #123
```

### Q5: PR 被退回怎麼辦？

1. 仔細閱讀 Reviewer 的意見
2. 理解為什麼需要修改
3. 修改代碼
4. 再次執行 `npm run check`
5. 推送更新
6. 回覆 Reviewer 說明修改

### Q6: 測試覆蓋率不夠怎麼辦？

```bash
# 查看覆蓋率報告
npm test -- --code-coverage
open coverage/index.html
```

參考 [測試規範](../standards/testing-standards.md) 了解如何撰寫測試。

---

## 📚 學習路徑

### 初級（Week 1-2）
1. ✅ 環境設定
2. ✅ 閱讀 [編碼規範](../standards/coding-standards.md)
3. ✅ 理解基本架構
4. ✅ 學習 Git 工作流程
5. ✅ 完成第一個小任務

### 中級（Week 3-4）
1. ✅ 深入理解 DDD 架構
2. ✅ 掌握依賴規則
3. ✅ 撰寫單元測試
4. ✅ 獨立完成功能開發

### 高級（Month 2+）
1. ✅ 設計新功能架構
2. ✅ Code Review 他人代碼
3. ✅ 優化系統性能
4. ✅ 指導新成員

---

## 🎓 推薦學習資源

### 內部資源
- 所有 .md 規範文檔
- 現有代碼範例
- Team 知識分享

### 外部資源
- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 🤝 獲得幫助

遇到問題時：

1. **查閱文檔**
   - 先查看相關的規範文檔
   - 搜尋關鍵字

2. **查看範例**
   - 現有代碼中尋找類似實作
   - 參考測試案例

3. **詢問團隊**
   - 在 Slack/Teams 提問
   - 標註相關領域的專家
   - 附上具體的代碼範例

4. **建立 Issue**
   - 如果是規範不清楚
   - 使用 Issue 模板
   - 詳細描述問題

---

## ✅ 成功指標

一個月後，你應該能夠：

- [ ] 獨立建立符合規範的分支
- [ ] 撰寫符合架構原則的代碼
- [ ] 代碼第一次提交就通過所有檢查
- [ ] 撰寫有意義的測試
- [ ] 撰寫清楚的 commit messages
- [ ] 理解並接受 Code Review 反饋
- [ ] 幫助其他新成員

---

## 🎯 記住

### 三個核心原則

1. **一致性比完美更重要**
   - 團隊統一的風格勝過個人喜好

2. **質量是每個人的責任**
   - 不要想著「之後再修」
   - 第一次就做對

3. **持續學習和改進**
   - 規範會持續演進
   - 保持開放心態
   - 分享你的經驗

---

**歡迎加入 ng-gighub 團隊！🎉**

如有任何問題或建議，請隨時提出 Issue 或聯繫團隊成員。
