<!-- 
⚠️ SECURITY-SENSITIVE PR ⚠️
Before submitting this PR, please review:
- Project standards: .github/copilot-instructions.md
- Security guidelines: .github/copilot-instructions/security-guidelines.md
- This template is for SECURITY FIXES - handle with care
-->

## 🔒 Security PR Checklist
- [ ] PR 保持小且單一變更（Single Responsibility）
- [ ] 已執行 `npm run lint` 並通過
- [ ] 已執行 `npm run build` 並成功
- [ ] 已執行 `npm test` 並通過
- [ ] 已新增安全測試
- [ ] 無敏感資訊在程式碼或 commit 中
- [ ] 安全問題已修復並驗證
- [ ] 相關團隊已被通知

## ⚠️ Security Advisory

### Severity Level
<!-- 根據 CVSS 或內部標準評估 -->
- [ ] 🔴 Critical (CVSS 9.0-10.0)
- [ ] 🟠 High (CVSS 7.0-8.9)
- [ ] 🟡 Medium (CVSS 4.0-6.9)
- [ ] 🟢 Low (CVSS 0.1-3.9)

### Security Issue Type
<!-- 選擇適用的類型 -->
- [ ] Authentication bypass
- [ ] Authorization issue
- [ ] SQL Injection
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF (Cross-Site Request Forgery)
- [ ] Sensitive data exposure
- [ ] Broken access control
- [ ] Security misconfiguration
- [ ] Vulnerable dependencies
- [ ] Insecure deserialization
- [ ] Other: 

### CVE / Advisory Reference
<!-- 如果有 CVE 編號或安全公告，請列出 -->
- CVE: 
- Advisory: 
- Related Issue: (Private issue #)

## Vulnerability Details

### Description
<!-- 詳細但謹慎地描述安全問題 -->
<!-- ⚠️ 避免洩露可被利用的細節 -->

### Impact
<!-- 如果被利用，會造成什麼影響 -->
**Potential Impact:**
- [ ] Data breach
- [ ] Unauthorized access
- [ ] Service disruption
- [ ] Privilege escalation
- [ ] Information disclosure
- [ ] Other: 

### Affected Components
<!-- 列出受影響的組件 -->
- Component/Service: 
- Versions affected: 
- Scope: 

### Attack Vector
<!-- 概述攻擊向量（避免詳細的 exploit 步驟）-->
- Attack complexity: [ ] Low / [ ] Medium / [ ] High
- Privileges required: [ ] None / [ ] Low / [ ] High
- User interaction: [ ] None / [ ] Required

## Fix Implementation

### Security Fix Description
<!-- 說明如何修復這個安全問題 -->

### Changes Made
<!-- 列出主要變更 -->
- 
- 
- 

### Security Measures Added
<!-- 新增的安全措施 -->
- [ ] Input validation
- [ ] Output encoding
- [ ] Authentication checks
- [ ] Authorization checks
- [ ] Rate limiting
- [ ] Encryption
- [ ] Secure configuration
- [ ] Other: 

### Dependencies Updated
<!-- 如果更新了依賴以修復漏洞 -->
- Package: `package-name`
  - From: `version-before`
  - To: `version-after`
  - Reason: [CVE-XXXX-XXXXX]

## Testing

### Security Testing
- [ ] Vulnerability confirmed before fix
- [ ] Vulnerability eliminated after fix
- [ ] Regression tests added
- [ ] Edge cases tested
- [ ] Security scan passed

### Test Scenarios
1. **原始漏洞測試**: 
2. **修復後測試**: 
3. **繞過嘗試**: 

### Security Scanning
<!-- 使用的安全掃描工具及結果 -->
- [ ] npm audit: Clean
- [ ] OWASP ZAP: No issues
- [ ] CodeQL: No alerts
- [ ] Manual security review: Passed
- [ ] Other: 

## Verification

### How to Verify Fix
<!-- 如何驗證修復（避免洩露 exploit）-->
1. 
2. 
3. 

### Verification Result
- [ ] ✓ Verified - Vulnerability fixed
- [ ] ⚠️ Partially fixed - Mitigation in place
- [ ] ✗ Not verified - Needs more testing

## Disclosure & Communication

### Disclosure Timeline
<!-- 遵循負責任的披露原則 -->
- [ ] Private disclosure to maintainers
- [ ] Fix developed and tested
- [ ] Security advisory drafted
- [ ] Fix deployed/released
- [ ] Public disclosure (after fix is widely deployed)

### Notification Plan
<!-- 誰需要被通知 -->
- [ ] Security team notified
- [ ] Product team notified
- [ ] Affected users notified (if needed)
- [ ] Security advisory published

### Credits
<!-- 如果有外部安全研究員報告，給予致謝 -->
- Reported by: 
- Credit: 

## Rollback Plan

### Emergency Rollback
<!-- 如果修復導致問題，如何快速回滾 -->
1. 
2. 

### Alternative Mitigations
<!-- 如果無法立即部署修復，有什麼臨時緩解措施 -->
- 
- 

## Breaking Changes
- [ ] 無 Breaking Changes
- [ ] 有 Breaking Changes（安全修復可能需要，請說明）

### Migration Guide
<!-- 如果有 breaking changes -->

## 檢查清單

### Security Requirements
- [ ] 漏洞已修復
- [ ] 無敏感資訊洩露
- [ ] 無 secrets 在程式碼中
- [ ] 安全測試通過
- [ ] 無新的安全問題引入
- [ ] 相關依賴已更新

### Code Quality
- [ ] 代碼通過 `npm run lint`
- [ ] 代碼通過 `npm test`
- [ ] 代碼通過 `npm run build`
- [ ] 無 TypeScript 編譯錯誤

### Testing
- [ ] 安全測試充分
- [ ] 回歸測試通過
- [ ] 邊界情況已測試
- [ ] 無副作用

### Documentation
- [ ] SECURITY.md 已更新（如需要）
- [ ] CHANGELOG 已更新（在發布後）
- [ ] 安全公告已準備（如需要）
- [ ] 內部文檔已更新

### Compliance
- [ ] 遵循 OWASP 指南
- [ ] 遵循專案安全政策
- [ ] 遵循負責任披露原則
- [ ] 符合相關法規（GDPR, etc.）

## Post-Deployment

### Monitoring
<!-- 部署後需要監控什麼 -->
- [ ] Error rates
- [ ] Security logs
- [ ] User feedback
- [ ] Attack attempts

### Follow-up Actions
<!-- 後續需要做什麼 -->
- [ ] Security advisory publication
- [ ] User notification
- [ ] Documentation update
- [ ] Training/awareness

## Additional Notes
<!-- 任何其他重要資訊 -->

### Lessons Learned
<!-- 從這個安全問題學到什麼 -->

### Prevention Measures
<!-- 如何防止類似問題再次發生 -->
- [ ] Code review process improvement
- [ ] Security testing enhancement
- [ ] Training for team
- [ ] Tool/process updates

---

## Reviewer Checklist

- [ ] 安全問題理解正確
- [ ] 修復方式適當
- [ ] 測試充分
- [ ] 無新的安全問題
- [ ] 程式碼品質良好
- [ ] 文檔完整
- [ ] 無敏感資訊洩露
- [ ] 符合安全最佳實踐

⚠️ **審查者注意**: 在 PR 合併前，確保所有安全檢查項目都已完成，並考慮是否需要二次審查。
