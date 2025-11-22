# 基礎設施文件

## 概述

本目錄包含 ng-gighub 專案的基礎設施相關文件，涵蓋認證、授權、角色管理及多租戶架構等企業級 SaaS 系統核心功能。

## 文件導覽

### 核心文件

1. **[系統基礎設施概覽](./overview.md)**
   - 整體架構圖
   - 技術棧說明
   - 關鍵設計決策

2. **[認證與令牌管理](./authentication.md)**
   - Supabase Auth 整合
   - JWT Token 生命週期管理
   - Refresh Token 策略
   - SSR 環境下的認證處理
   - Session 管理

3. **[授權與權限管理](./authorization.md)**
   - 權限模型設計
   - Row Level Security (RLS) 策略
   - 權限檢查流程
   - API 層級授權
   - 前端授權控制

4. **[角色系統 (RBAC)](./role-based-access-control.md)**
   - 角色定義與層級
   - 角色與權限對應
   - 動態角色管理
   - 角色繼承與組合
   - 實作範例

5. **[多租戶架構](./multi-tenancy.md)**
   - 租戶隔離策略
   - 資料分區方案
   - Workspace 與 Organization 模型
   - 跨租戶資源共享
   - 效能與擴展性考量

6. **[安全最佳實踐](./security-best-practices.md)**
   - OWASP Top 10 防護
   - 資料加密
   - 安全標頭配置
   - API 安全
   - 審計日誌

### 實作範例

- **[AuthService 實作範例](./implementation-examples/auth-service.example.ts)**
- **[Auth Guard 實作範例](./implementation-examples/auth-guard.example.ts)**
- **[RLS Policies SQL](./implementation-examples/rls-policies.sql)**
- **[Role Management 實作範例](./implementation-examples/role-management.example.ts)**

## 技術棧

| 類別 | 技術 | 版本 | 說明 |
|------|------|------|------|
| 前端框架 | Angular | 20.1.x | 含 SSR 支援 |
| 語言 | TypeScript | 5.8.x | 強型別語言 |
| 後端服務 | Supabase | Latest | PostgreSQL + Auth + Storage |
| 認證 | Supabase Auth | Latest | JWT-based authentication |
| 資料庫 | PostgreSQL | 15.x | 透過 Supabase 託管 |
| ORM/Client | @supabase/supabase-js | Latest | Supabase 客戶端 |

## 快速開始

### 1. 環境設定

參考 [環境設定指南](../setup/environment.md) 配置開發環境。

### 2. Supabase 設定

參考 [Supabase 設定指南](../setup/supabase.md) 配置資料庫與認證服務。

### 3. 認證流程實作

詳見 [認證與令牌管理](./authentication.md) 文件。

### 4. 權限控制實作

詳見 [授權與權限管理](./authorization.md) 文件。

### 5. 角色系統實作

詳見 [角色系統 (RBAC)](./role-based-access-control.md) 文件。

## 架構原則

### 1. 安全優先 (Security First)

- 預設拒絕 (Deny by Default)
- 最小權限原則 (Principle of Least Privilege)
- 深度防禦 (Defense in Depth)

### 2. 可擴展性 (Scalability)

- 水平擴展支援
- 資料庫查詢優化
- 快取策略

### 3. 可維護性 (Maintainability)

- 清晰的分層架構
- 完整的測試覆蓋
- 詳細的文件說明

### 4. 效能 (Performance)

- SSR 優化
- 資料預載入
- 懶加載策略

## 開發工作流程

### 新增功能時的安全檢查清單

- [ ] 定義所需權限
- [ ] 實作 RLS policies
- [ ] 新增前端 Guard
- [ ] 實作後端權限檢查
- [ ] 撰寫單元測試
- [ ] 撰寫整合測試
- [ ] 安全審查
- [ ] 文件更新

## 相關文件

- [架構設計文件](../ARCHITECTURE_DESIGN.md)
- [領域模型](../architecture/DOMAIN_MODEL.md)
- [資料庫 Schema](../architecture/diagrams/erd.md)
- [API 規格](../api/)

## 常見問題

### Q: 如何在 SSR 環境下處理認證？

參考 [認證與令牌管理 - SSR 考量](./authentication.md#ssr-環境下的認證處理)。

### Q: 如何實作細粒度權限控制？

參考 [授權與權限管理 - 細粒度權限](./authorization.md#細粒度權限控制)。

### Q: 多租戶如何確保資料隔離？

參考 [多租戶架構 - 資料隔離](./multi-tenancy.md#資料隔離策略)。

### Q: 如何處理角色繼承？

參考 [角色系統 - 角色繼承](./role-based-access-control.md#角色繼承)。

## 貢獻指南

更新基礎設施文件時，請確保：

1. 遵循 [文件管理標準](../DOCUMENTATION_STANDARDS.md)
2. 更新相關的實作範例
3. 更新本索引文件
4. 在 PR 中說明變更原因

## 維護資訊

---
**最後更新**: 2025-11-22  
**維護者**: Development Team  
**版本**: 1.0.0

如有問題或建議，請開啟 issue 或聯繫團隊。
