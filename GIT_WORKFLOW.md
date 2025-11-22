# Git 工作流程 (Git Workflow)

## 概述

本文檔定義 ng-gighub 專案的 Git 工作流程、分支策略和 commit 規範。

---

## 目錄

1. [分支策略](#分支策略)
2. [Commit Message 規範](#commit-message-規範)
3. [Pull Request 流程](#pull-request-流程)
4. [代碼審查](#代碼審查)
5. [發布流程](#發布流程)

---

## 分支策略

### 主要分支

- **`main`**: 生產環境分支，永遠保持穩定可部署
- **`develop`**: 開發分支，整合最新功能

### 輔助分支

- **Feature branches**: 功能開發分支
- **Bugfix branches**: 修復 bug 分支
- **Hotfix branches**: 緊急修復分支
- **Release branches**: 發布準備分支

### 分支命名規範

```
feature/[issue-number]-[short-description]
bugfix/[issue-number]-[short-description]
hotfix/[issue-number]-[short-description]
release/v[version-number]
```

**範例**:
```
feature/123-user-authentication
feature/456-add-dark-mode
bugfix/789-fix-login-error
hotfix/101-critical-security-patch
release/v1.2.0
```

---

## Commit Message 規範

### Conventional Commits

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type（類型）

| Type | 說明 | 範例 |
|------|------|------|
| `feat` | 新功能 | `feat(auth): add user login` |
| `fix` | 修復 bug | `fix(api): handle null response` |
| `docs` | 文檔變更 | `docs(readme): update installation guide` |
| `style` | 代碼格式（不影響邏輯） | `style(app): fix indentation` |
| `refactor` | 重構（不是新功能也不是修復） | `refactor(service): simplify user fetch` |
| `perf` | 性能優化 | `perf(list): optimize rendering` |
| `test` | 測試相關 | `test(auth): add login tests` |
| `build` | 建置系統或依賴變更 | `build(deps): upgrade Angular to 20.1` |
| `ci` | CI 配置變更 | `ci(github): add test workflow` |
| `chore` | 其他雜項變更 | `chore(git): add .gitignore entry` |
| `revert` | 回退先前的 commit | `revert: feat(auth): add user login` |

### Scope（範圍）

Scope 指明變更影響的範圍：

- `auth` - 認證相關
- `account` - 帳戶功能
- `team` - 團隊功能
- `repo` - 倉庫功能
- `org` - 組織功能
- `ui` - UI 元件
- `api` - API 相關
- `db` - 資料庫相關
- `config` - 配置相關

### Subject（主題）

- 使用現在式、祈使句（"add" 而非 "added" 或 "adds"）
- 不要大寫首字母
- 結尾不加句號
- 簡短描述（建議 50 字元內）

### Body（內文）

- 可選，提供更詳細的說明
- 解釋**為什麼**要做這個變更，而非**如何**做
- 與 subject 空一行
- 每行建議 72 字元內

### Footer（頁尾）

- 可選，用於引用 Issue 或說明破壞性變更
- 格式: `Closes #123` 或 `Fixes #456`
- 破壞性變更: `BREAKING CHANGE: ...`

### 完整範例

```
feat(auth): add user registration functionality

Implement user registration with email verification.
Users can now sign up using email and password, and will
receive a verification link via email.

- Add registration form component
- Implement email verification service
- Add user registration API endpoint

Closes #123
```

```
fix(api): handle null response from user service

Previously, the app would crash when the user service
returned null. Now we properly handle this case and
show an appropriate error message.

Fixes #456
```

```
docs(readme): update installation instructions

Add detailed steps for setting up Supabase and
configuring environment variables.
```

```
refactor(service): simplify user data fetching

Reduce code duplication by extracting common logic
into a shared utility function.
```

### Breaking Changes（破壞性變更）

當變更不向後兼容時，必須在 footer 註明：

```
feat(api): change user endpoint response format

BREAKING CHANGE: The user API now returns { data, meta }
instead of a flat object. Clients must update their code.

Before: GET /api/users returns { id, name, email }
After: GET /api/users returns { data: { id, name, email }, meta: {} }
```

---

## Pull Request 流程

### 1. 建立 Feature Branch

```bash
# 從 develop 建立新分支
git checkout develop
git pull origin develop
git checkout -b feature/123-add-user-profile
```

### 2. 開發功能

```bash
# 進行開發
# ...

# Commit 變更
git add .
git commit -m "feat(profile): add user profile page"
```

### 3. 保持分支更新

```bash
# 定期同步 develop 分支
git checkout develop
git pull origin develop
git checkout feature/123-add-user-profile
git rebase develop
```

### 4. 推送到遠端

```bash
git push origin feature/123-add-user-profile
```

### 5. 建立 Pull Request

- 在 GitHub 上建立 PR
- 使用 PR 模板填寫資訊
- 指派 Reviewers
- 添加適當的 Labels

### 6. 代碼審查

- 等待 Review
- 根據反饋修改代碼
- 推送更新

### 7. 合併

- 確保 CI 通過
- 獲得至少 1 個 Approval
- 由 Reviewer 或自己合併

### 8. 清理

```bash
# 刪除本地分支
git branch -d feature/123-add-user-profile

# 刪除遠端分支（如果 GitHub 未自動刪除）
git push origin --delete feature/123-add-user-profile
```

---

## 代碼審查

### Pull Request 檢查清單

提交 PR 前，確認：

- [ ] 代碼通過所有測試（`npm test`）
- [ ] 代碼通過 lint 檢查（`npm run lint`）
- [ ] 代碼格式正確（`npm run format:check`）
- [ ] Build 成功（`npm run build`）
- [ ] 遵循命名規範
- [ ] 遵循架構分層原則
- [ ] 無循環依賴
- [ ] 有適當的測試覆蓋
- [ ] 有必要的註解和文檔
- [ ] Commit message 符合規範
- [ ] PR 描述清楚

### Reviewer 檢查清單

審查時，注意：

- [ ] 代碼邏輯正確
- [ ] 符合專案規範和最佳實踐
- [ ] 沒有明顯的 bugs 或安全問題
- [ ] 測試充分且有意義
- [ ] 性能考量合理
- [ ] 錯誤處理適當
- [ ] 沒有硬編碼的敏感資訊
- [ ] 註解清楚且必要
- [ ] 沒有不必要的代碼或註解
- [ ] 變更範圍合理（不過大也不過小）

### Review 反饋原則

- 具體明確，指出具體位置和問題
- 友善建設性，避免批評性語言
- 提供替代方案或建議
- 區分「必須修改」和「建議優化」
- 及時回應和跟進

---

## 發布流程

### 版本號規範

遵循 [Semantic Versioning](https://semver.org/)：

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: 破壞性變更
- **MINOR**: 新功能（向後兼容）
- **PATCH**: Bug 修復（向後兼容）

範例: `v1.2.3`

### Release 流程

#### 1. 建立 Release Branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

#### 2. 更新版本號

```bash
# 更新 package.json 版本號
npm version 1.2.0 --no-git-tag-version

# Commit 版本變更
git add package.json package-lock.json
git commit -m "chore(release): bump version to 1.2.0"
```

#### 3. 最終測試

```bash
# 執行完整測試套件
npm test -- --code-coverage
npm run lint
npm run build

# 手動測試關鍵功能
```

#### 4. 合併到 main

```bash
# 推送 release branch
git push origin release/v1.2.0

# 建立 PR: release/v1.2.0 → main
# 審查並合併
```

#### 5. 建立 Tag

```bash
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

#### 6. 合併回 develop

```bash
git checkout develop
git merge main
git push origin develop
```

#### 7. 發布說明

在 GitHub Releases 建立發布說明，包含：

- 新功能列表
- Bug 修復列表
- 破壞性變更（如有）
- 升級指南（如有）
- 已知問題（如有）

### Hotfix 流程

緊急修復直接從 main 分支：

```bash
# 1. 建立 hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# 2. 修復問題
# ...

# 3. Commit
git commit -m "fix(security): patch XSS vulnerability"

# 4. 測試
npm test
npm run build

# 5. 合併到 main
git checkout main
git merge hotfix/security-patch

# 6. 建立 tag
git tag -a v1.2.1 -m "Hotfix: security patch"
git push origin main --tags

# 7. 合併回 develop
git checkout develop
git merge main
git push origin develop

# 8. 刪除 hotfix branch
git branch -d hotfix/security-patch
```

---

## 常見命令

### 日常開發

```bash
# 查看狀態
git status

# 查看變更
git diff

# 暫存所有變更
git add .

# 暫存特定檔案
git add path/to/file

# Commit
git commit -m "feat(scope): description"

# 推送
git push origin branch-name

# 拉取最新變更
git pull origin develop
```

### 分支操作

```bash
# 查看所有分支
git branch -a

# 建立並切換分支
git checkout -b feature/new-feature

# 切換分支
git checkout branch-name

# 刪除本地分支
git branch -d branch-name

# 強制刪除本地分支
git branch -D branch-name

# 刪除遠端分支
git push origin --delete branch-name
```

### 同步與合併

```bash
# Rebase（保持線性歷史）
git rebase develop

# Merge（保留完整歷史）
git merge develop

# 解決衝突後
git add .
git rebase --continue
# 或
git merge --continue

# 放棄 rebase/merge
git rebase --abort
git merge --abort
```

### 撤銷與修改

```bash
# 撤銷未暫存的變更
git checkout -- path/to/file

# 撤銷已暫存的變更
git reset HEAD path/to/file

# 修改最後一次 commit
git commit --amend

# 撤銷最後一次 commit（保留變更）
git reset --soft HEAD~1

# 撤銷最後一次 commit（丟棄變更）
git reset --hard HEAD~1
```

### 查看歷史

```bash
# 查看 commit 歷史
git log

# 簡潔的 commit 歷史
git log --oneline

# 圖形化顯示
git log --graph --oneline --all

# 查看特定檔案的歷史
git log -- path/to/file

# 查看特定 commit
git show commit-hash
```

---

## Git 配置建議

### 全域配置

```bash
# 設定使用者資訊
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 設定預設編輯器
git config --global core.editor "code --wait"

# 設定預設分支名稱
git config --global init.defaultBranch main

# 啟用顏色輸出
git config --global color.ui auto

# 設定 pull 策略
git config --global pull.rebase true
```

### 專案配置

```bash
# 設定行尾符號（跨平台開發）
git config core.autocrlf input  # Mac/Linux
git config core.autocrlf true   # Windows
```

---

## 常見問題

### Q: 如何修改已推送的 commit message？

```bash
# 修改最後一次 commit
git commit --amend
git push origin branch-name --force-with-lease

# 修改更早的 commit（使用 interactive rebase）
git rebase -i HEAD~3  # 修改最近 3 個 commits
# 將要修改的 commit 標記為 'reword'
git push origin branch-name --force-with-lease
```

### Q: 如何合併多個 commits？

```bash
git rebase -i HEAD~3  # 合併最近 3 個 commits
# 將後續的 commits 標記為 'squash' 或 's'
git push origin branch-name --force-with-lease
```

### Q: 如何解決合併衝突？

```bash
# 1. 拉取最新變更
git pull origin develop

# 2. 查看衝突檔案
git status

# 3. 手動編輯衝突檔案，解決衝突標記
# <<<<<<<, =======, >>>>>>>

# 4. 標記為已解決
git add conflicted-file

# 5. 完成合併
git commit  # 或 git rebase --continue
```

### Q: 不小心 commit 到錯誤的分支怎麼辦？

```bash
# 1. 記下 commit hash
git log

# 2. 切換到正確的分支
git checkout correct-branch

# 3. Cherry-pick 該 commit
git cherry-pick commit-hash

# 4. 回到錯誤的分支，撤銷 commit
git checkout wrong-branch
git reset --hard HEAD~1
```

---

## 參考資源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

**記住**: Git 工作流程的目的是讓團隊協作更順暢，而非製造障礙。根據專案需求靈活調整。
