<!-- 
Before submitting this PR, please review:
- Project standards: .github/copilot-instructions.md
- Detailed guidelines: .github/copilot-instructions/ (style, testing, security)
- This template is for NEW FEATURES - use bugfix.md for bug fixes
-->

## 🚀 Feature PR Checklist
<!-- 提交前請確認以下項目 -->
- [ ] PR 保持小且單一變更（Single Responsibility）
- [ ] 已執行 `npm run format:check` 並通過
- [ ] 已執行 `npm run lint` 並通過
- [ ] 已執行 `npm run build` 並成功
- [ ] 已新增完整的單元測試（新功能必須有測試）
- [ ] 已更新相關文檔
- [ ] 無 Breaking Changes（或已在下方詳細說明）
- [ ] 功能完整可用且經過手動測試

## Feature Description

### Feature Name
<!-- 簡短描述功能名稱 -->

### 變更內容
<!-- 列出主要新增的功能 -->
- 
- 
- 

### User Story / Use Case
<!-- 描述這個功能解決什麼用戶需求 -->
**As a** [user type]
**I want** [goal]
**So that** [benefit]

### 相關 Issue
<!-- 關聯的 Issue 編號 -->
Closes #

## Feature Details

### 動機和背景
<!-- 為什麼需要這個功能？解決了什麼問題？ -->

### 實作方式
<!-- 詳細說明功能如何實作 -->

#### 新增的組件/服務
- **組件**: 
- **服務**: 
- **模型/介面**: 
- **其他**: 

#### 架構變更
<!-- 如果有架構層面的變更請說明 -->

### 影響範圍
<!-- 這個功能影響哪些模組 -->
- [ ] Domain 層
- [ ] Application 層
- [ ] Infrastructure 層
- [ ] Features 層
- [ ] Shared 模組
- [ ] API 端點
- [ ] 資料庫 Schema
- [ ] UI/UX
- [ ] 路由
- [ ] 測試
- [ ] 文檔
- [ ] 配置

## Screenshots / Demo
<!-- 如果是 UI 功能，請提供截圖或 GIF -->
### Before
<!-- 功能新增前的狀態（如適用）-->

### After
<!-- 功能新增後的效果 -->

## Testing

### 測試策略
- [ ] 單元測試（必須）
- [ ] 整合測試
- [ ] E2E 測試
- [ ] 手動測試

### 測試場景
<!-- 列出測試的主要場景 -->
1. 
2. 
3. 

### 測試覆蓋率
- 新增測試數量: 
- 測試覆蓋率: % (目標 ≥ 70%)

### 手動測試步驟
<!-- 如何手動驗證這個功能 -->
1. 
2. 
3. 

## Performance Impact
<!-- 這個功能對效能的影響 -->
- [ ] 無明顯效能影響
- [ ] 效能已優化（請說明）
- [ ] 需要效能測試（請說明原因）

### Bundle Size Impact
<!-- 對打包大小的影響 -->
- 預估增加大小: 
- 是否需要 lazy loading: 

## Breaking Changes
<!-- 如果有破壞性變更，請詳細說明 -->
- [ ] 無 Breaking Changes
- [ ] 有 Breaking Changes（請在下方說明）

### Migration Guide
<!-- 如果有 breaking changes，提供遷移指南 -->

## Rollback Plan
<!-- 如果功能出問題，如何回滾 -->
1. 
2. 

## 檢查清單

### 代碼品質
- [ ] 代碼通過 `npm run lint`
- [ ] 代碼通過 `npm run format:check`
- [ ] 代碼通過 `npm test`
- [ ] 代碼通過 `npm run build`
- [ ] 無 TypeScript 編譯錯誤
- [ ] 無 console.log 或 debugger 語句

### Angular Best Practices
- [ ] 使用 Dependency Injection
- [ ] 業務邏輯在 Services 中
- [ ] 使用 Observables + async pipe
- [ ] 使用 OnPush change detection
- [ ] SSR 相容（如適用）

### 測試
- [ ] 新功能有完整的單元測試
- [ ] 測試覆蓋率達標
- [ ] 邊界情況已測試
- [ ] 錯誤處理已測試

### 文檔
- [ ] 更新 README（如需要）
- [ ] 新增 JSDoc 註解
- [ ] 更新 API 文檔（如適用）
- [ ] 更新用戶文檔（如適用）

### 安全性
- [ ] 沒有硬編碼的敏感資訊
- [ ] 輸入驗證已實作
- [ ] 遵循安全最佳實踐

### UX/UI (如適用)
- [ ] 符合設計規範
- [ ] 響應式設計
- [ ] 無障礙性考量
- [ ] 載入狀態顯示
- [ ] 錯誤訊息友善

## Additional Notes
<!-- 任何其他需要 reviewer 注意的事項 -->

## Dependencies
<!-- 是否新增或更新了依賴 -->
- [ ] 無新增依賴
- [ ] 新增依賴（請列出並說明原因）

### New Dependencies
<!-- 如果新增了依賴，請列出 -->

---

## Reviewer Checklist

- [ ] 功能符合需求
- [ ] 代碼品質良好
- [ ] 測試充分
- [ ] 文檔完整
- [ ] 無安全問題
- [ ] 效能可接受
- [ ] UI/UX 合理（如適用）
