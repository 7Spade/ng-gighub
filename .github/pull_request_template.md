## PR 類型
<!-- 請勾選適用的類型 -->
- [ ] 🚀 新功能 (Feature)
- [ ] 🐛 Bug 修復 (Bugfix)
- [ ] 📝 文檔更新 (Documentation)
- [ ] 🎨 代碼風格/格式化 (Style)
- [ ] ♻️ 重構 (Refactor)
- [ ] ⚡ 性能優化 (Performance)
- [ ] ✅ 測試相關 (Test)
- [ ] 🔧 建置/工具相關 (Build/Tools)
- [ ] 🔥 緊急修復 (Hotfix)

## 變更描述
<!-- 簡要描述此 PR 的變更內容 -->

### 變更內容
<!-- 列出主要變更 -->
- 

### 相關 Issue
<!-- 關聯的 Issue 編號，例如: Closes #123, Fixes #456 -->
Closes #

## 變更詳情

### 動機和背景
<!-- 為什麼需要這個變更？解決了什麼問題？ -->

### 實作方式
<!-- 簡述如何實作這個變更 -->

### 影響範圍
<!-- 這個變更影響哪些模組或功能？ -->
- [ ] Domain 層
- [ ] Application 層
- [ ] Infrastructure 層
- [ ] Features 層
- [ ] Shared 模組
- [ ] 測試
- [ ] 文檔
- [ ] 配置

## 測試

### 測試類型
<!-- 請勾選已執行的測試 -->
- [ ] 單元測試
- [ ] 整合測試
- [ ] E2E 測試
- [ ] 手動測試

### 測試說明
<!-- 描述如何測試這些變更 -->

### 測試覆蓋率
<!-- 如果適用，提供測試覆蓋率資訊 -->
- 新增測試數量: 
- 測試覆蓋率: %

## 檢查清單

### 代碼品質
- [ ] 代碼通過 `npm run lint`
- [ ] 代碼通過 `npm run format:check`
- [ ] 代碼通過 `npm test`
- [ ] 代碼通過 `npm run build`
- [ ] 無 TypeScript 編譯錯誤
- [ ] 無 console.log 或 debugger 語句（除非必要）

### 架構和規範
- [ ] 遵循 [架構原則](../docs/architecture/system-overview.md)
- [ ] 遵循 [命名規範](../docs/standards/naming-conventions.md)
- [ ] 遵循 [代碼風格](../docs/standards/code-style.md)
- [ ] 遵循 [依賴規則](../docs/standards/dependency-rules.md)
- [ ] 無循環依賴
- [ ] 依賴方向正確（由外向內）

### 測試
- [ ] 新增適當的單元測試
- [ ] 更新相關測試（如果修改現有功能）
- [ ] 所有測試通過
- [ ] 測試覆蓋率達標（至少 70%）

### 文檔
- [ ] 更新相關文檔（如果需要）
- [ ] 添加 JSDoc 註解（對於複雜邏輯）
- [ ] 更新 README（如果需要）
- [ ] 更新 CHANGELOG（如果適用）

### 安全性
- [ ] 沒有硬編碼的敏感資訊（API keys, passwords 等）
- [ ] 沒有引入已知的安全漏洞
- [ ] 適當的錯誤處理和驗證

### 性能
- [ ] 考慮了性能影響
- [ ] 沒有明顯的性能問題
- [ ] 適當使用 Angular 的 ChangeDetection 策略

### Git
- [ ] Commit messages 符合 [Conventional Commits](https://www.conventionalcommits.org/) 規範
- [ ] 分支從最新的 `develop` 建立
- [ ] 已解決所有合併衝突

## 截圖/錄影
<!-- 如果是 UI 變更，請提供截圖或錄影 -->

## 破壞性變更
<!-- 如果有破壞性變更，請詳細說明 -->
- [ ] 此 PR 包含破壞性變更

<!-- 如果有，請說明： -->
<!-- - 什麼會被破壞 -->
<!-- - 遷移指南 -->
<!-- - 向後兼容的替代方案（如果有） -->

## 額外資訊
<!-- 任何其他需要 reviewer 知道的資訊 -->

## Reviewer 注意事項
<!-- 提醒 reviewer 需要特別注意的地方 -->

---

## Review Checklist（給 Reviewer）

- [ ] 代碼邏輯正確
- [ ] 符合專案規範
- [ ] 沒有明顯的 bugs 或安全問題
- [ ] 測試充分且有意義
- [ ] 性能考量合理
- [ ] 文檔清楚完整
- [ ] PR 描述清楚
- [ ] Commit 歷史整潔

<!-- 
感謝您的貢獻！🎉
請確保所有檢查項目都已完成後再請求 review。
-->
