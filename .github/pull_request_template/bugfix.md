<!-- 
Before submitting this PR, please review:
- Project standards: .github/copilot-instructions.md
- This template is for BUG FIXES - use feature.md for new features
-->

## 🐛 Bugfix PR Checklist
- [ ] PR 保持小且單一變更（Single Responsibility）
- [ ] 已執行 `npm run format:check` 並通過
- [ ] 已執行 `npm run lint` 並通過
- [ ] 已執行 `npm run build` 並成功
- [ ] 已新增回歸測試（防止 bug 再次出現）
- [ ] Bug 已修復並經過驗證
- [ ] 已手動測試修復效果

## Bug Description

### Bug Summary
<!-- 簡短描述 bug -->

### 相關 Issue
<!-- 關聯的 Bug Report Issue -->
Fixes #

### Severity
<!-- Bug 的嚴重程度 -->
- [ ] 🔥 Critical (系統無法使用)
- [ ] 🔴 High (主要功能受影響)
- [ ] 🟡 Medium (次要功能受影響)
- [ ] 🟢 Low (輕微問題)

## Bug Details

### 症狀
<!-- 描述 bug 的表現 -->
**What happened:**

**What should happen:**

### 重現步驟
<!-- 如何重現這個 bug -->
1. 
2. 
3. 

### 環境資訊
<!-- Bug 出現的環境 -->
- **Browser/Platform**: 
- **Version**: 
- **Specific conditions**: 

### Screenshots/Logs
<!-- 提供錯誤截圖或日誌 -->
#### Before (Bug)

#### After (Fixed)

## Root Cause Analysis

### 問題根源
<!-- 詳細說明 bug 的根本原因 -->

### 為什麼會發生
<!-- 分析為什麼這個 bug 沒有被更早發現 -->

### 影響範圍
<!-- Bug 影響哪些功能或用戶 -->

## Fix Implementation

### 修復方式
<!-- 詳細說明如何修復這個 bug -->

### 變更的檔案
<!-- 列出主要修改的檔案 -->
- 
- 

### 程式碼變更
<!-- 簡述關鍵的程式碼變更 -->

## Testing

### 回歸測試
<!-- 新增的測試以防止 bug 復發 -->
- [ ] 已新增測試覆蓋 bug 場景
- [ ] 測試失敗於 bug 修復前
- [ ] 測試通過於 bug 修復後

### 測試場景
1. **原始 bug 場景**: 
2. **邊界情況**: 
3. **相關功能測試**: 

### 手動驗證
<!-- 如何手動驗證修復 -->
1. 
2. 
3. 

**Result**: [ ] ✓ Verified / [ ] ✗ Not Verified

## Side Effects Check

### 潛在影響
<!-- 這個修復可能影響的其他功能 -->
- [ ] 已檢查相關功能
- [ ] 無副作用
- [ ] 有副作用（請在下方說明）

### 相關功能測試
<!-- 列出測試過的相關功能 -->
- [ ] 功能 A
- [ ] 功能 B
- [ ] 功能 C

## Prevention

### 為何沒被測試覆蓋
<!-- 分析為什麼現有測試沒發現這個 bug -->

### 改進措施
<!-- 如何避免類似 bug 再次發生 -->
- [ ] 新增測試覆蓋
- [ ] 改進測試策略
- [ ] 更新文檔
- [ ] 程式碼審查改進
- [ ] 其他: 

## Performance Impact
- [ ] 無效能影響
- [ ] 效能改善
- [ ] 需要效能測試（請說明）

## Breaking Changes
- [ ] 無 Breaking Changes
- [ ] 有 Breaking Changes（請詳細說明）

## Rollback Plan
<!-- 如果修復導致問題，如何回滾 -->
1. 
2. 

## 檢查清單

### 代碼品質
- [ ] 代碼通過 `npm run lint`
- [ ] 代碼通過 `npm run format:check`
- [ ] 代碼通過 `npm test`
- [ ] 代碼通過 `npm run build`
- [ ] 無 TypeScript 編譯錯誤

### 修復驗證
- [ ] Bug 已修復
- [ ] 手動測試通過
- [ ] 新增回歸測試
- [ ] 相關功能未受影響
- [ ] 無新的 bug 產生

### 測試
- [ ] 新增針對 bug 的測試
- [ ] 測試覆蓋邊界情況
- [ ] 所有現有測試通過
- [ ] 相關功能已測試

### 文檔
- [ ] 更新 CHANGELOG
- [ ] 更新相關文檔（如需要）
- [ ] 新增註解說明修復原因（如需要）

### 安全性
- [ ] 修復未引入安全問題
- [ ] 輸入驗證正確
- [ ] 錯誤處理適當

## Additional Notes
<!-- 任何其他需要 reviewer 注意的事項 -->

### Known Limitations
<!-- 如果有已知的限制或妥協，請說明 -->

### Future Improvements
<!-- 未來可以改進的地方 -->

---

## Reviewer Checklist

- [ ] Bug 確實被修復
- [ ] 修復方式合理
- [ ] 回歸測試充分
- [ ] 無副作用
- [ ] 程式碼品質良好
- [ ] 無新的安全問題
