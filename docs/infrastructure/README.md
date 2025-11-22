# 基礎設施文件

## 概述

本目錄包含 ng-gighub 專案的基礎設施相關文件，涵蓋認證、授權、角色管理及多租戶架構等企業級 SaaS 系統核心功能。

## 文件導覽

本目錄包含 **企業級 SaaS 系統** 的完整文件，涵蓋 8 大標準領域：

### 📋 核心文件

#### 1. 身份驗證與授權

**[認證與令牌管理](./authentication.md)** ⭐ 已更新
- Supabase Auth 整合
- JWT Token 生命週期管理
- **多租戶 JWT Context**（個人/組織/團隊視角）
- Context 切換流程與實作
- Refresh Token 策略
- SSR 環境下的認證處理
- Session 管理
- Multi-Factor Authentication (MFA)

**[授權與權限管理](./authorization.md)** ⭐ 已更新
- **RBAC vs ABAC 混合模型**
- RBAC 與 ABAC 優缺點比較
- 混合實作策略（兩層檢查）
- Row Level Security (RLS) 策略
- 權限檢查流程
- API 層級授權
- 前端授權控制（Guards、Directives）
- 細粒度權限控制

**[角色系統 (RBAC)](./role-based-access-control.md)**
- 角色定義與層級
- 角色與權限對應
- 動態角色管理
- 角色繼承與組合
- 實作範例

#### 2. 多租戶架構

**[多租戶架構](./multi-tenancy.md)**
- 租戶模型（Personal/Organization/Team）
- 資料隔離策略（RLS, Application Layer）
- 租戶識別與路由
- 資料分區方案
- Workspace 與 Organization 模型
- 跨租戶資源共享
- 效能優化與擴展性

**[Workspace Context Manager](../workspace/)** 
- 三種視角（個人/組織/團隊）
- Context 切換與狀態管理
- 左側欄同步切換
- 依 context 載入資源

#### 3. 資料庫 Schema 標準

**[資料庫 Schema 企業級標準](./database-schema-standards.md)** ⭐ 新增
- 命名規範（資料表、欄位、索引、約束）
- 必要欄位標準（UUID、時間戳、租戶識別、審計欄位）
- 資料類型標準（文字、數值、時間、JSON、枚舉）
- 索引策略（主鍵、外鍵、複合、部分索引）
- 約束與驗證（NOT NULL、CHECK、FOREIGN KEY）
- 多租戶隔離（4種 RLS Policy 模式）
- 審計與追蹤（審計表、Trigger）
- 效能優化（分區、Materialized Views）
- 遷移策略（向後相容、回滾）
- 完整範例與檢查清單

#### 4. 可觀察性 (Observability)

**[可觀察性](./observability.md)** ⭐ 新增
- 可觀察性三大支柱（Logs、Metrics、Traces）
- **Activity Log（活動日誌）**
  - 使用者操作追蹤
  - Activity Feed UI
- **Audit Log（審計日誌）**
  - 不可變審計記錄（雜湊鏈）
  - 自動審計 Trigger
  - RLS 保護（禁止修改/刪除）
  - 資料恢復 SQL 生成
- 錯誤追蹤與監控（Sentry 整合）
- 效能監控（API、頁面載入）
- 日誌聚合與查詢
- 告警機制
- 合規性與資料保留

#### 5. Domain 分層架構

**[Domain 分層架構實作指南](./domain-architecture.md)** ⭐ 新增
- 四層架構詳解（Domain/Application/Infrastructure/Features）
- **Repository Pattern**
  - 概念與必要性
  - Repository 介面定義
  - Repository 實作
  - Mapper 模式
- **Domain Service Pattern**
  - 使用時機
  - 跨 Aggregate 邏輯
  - 複雜業務規則
- **Supabase Client 分離**（Browser vs Server）
- 依賴反轉原則
- 完整流程範例
- 最佳實踐（DO & DON'T）
- 測試策略

#### 6. 安全與部署標準

**[安全最佳實踐](./security-best-practices.md)**
- OWASP Top 10 防護
- 資料加密
- 安全標頭配置
- API 安全
- RLS 永遠開啟
- Edge Functions 使用 service role
- Rate Limiting
- 環境變數管理
- Supabase 專案安全設定

#### 7. SaaS 產品功能

**[SaaS 產品功能](./saas-features.md)** ⭐ 新增
- **邀請系統**
  - Email 邀請流程
  - 邀請連結與 token
  - 邀請狀態管理
  - 角色預設
- **權限矩陣 (Permission Matrix)**
  - Workspace/Organization/Team 角色
  - 資源操作權限表
  - 權限檢查服務
  - UI: 權限矩陣管理
- **計費機制 (Stripe)**
  - 訂閱方案（Free/Pro/Enterprise）
  - Stripe 整合
  - Edge Functions
  - 發票管理
- 使用量追蹤與限額
- 租戶管理與配額

#### 8. 系統概覽

**[系統基礎設施概覽](./overview.md)**
- 整體架構圖
- 技術棧說明
- 關鍵設計決策
- 資料流與安全架構
- 監控與維護

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

### 新手閱讀順序

#### Phase 1: 理解整體架構
1. [系統基礎設施概覽](./overview.md) - 了解整體架構
2. [多租戶架構](./multi-tenancy.md) - 理解租戶模型

#### Phase 2: 認證與授權
3. [認證與令牌管理](./authentication.md) - JWT 與多租戶 Context
4. [授權與權限管理](./authorization.md) - RBAC/ABAC 混合模型
5. [角色系統](./role-based-access-control.md) - 角色定義

#### Phase 3: 資料層
6. [資料庫 Schema 標準](./database-schema-standards.md) - 資料庫設計規範
7. [Domain 分層架構](./domain-architecture.md) - Repository & Domain Service

#### Phase 4: SaaS 功能
8. [SaaS 產品功能](./saas-features.md) - 邀請、權限矩陣、計費
9. [可觀察性](./observability.md) - 日誌、監控、審計

#### Phase 5: 安全與部署
10. [安全最佳實踐](./security-best-practices.md) - 安全標準

### 開發者快速查詢

| 我想要... | 參考文件 | 章節 |
|----------|----------|------|
| 實作登入功能 | [認證與令牌管理](./authentication.md) | 登入流程 |
| 切換工作區視角 | [認證與令牌管理](./authentication.md) | 多租戶 JWT Context |
| 檢查使用者權限 | [授權與權限管理](./authorization.md) | 權限檢查流程 |
| 設定 RLS Policy | [授權與權限管理](./authorization.md) | RLS |
| 設計資料表 | [資料庫 Schema 標準](./database-schema-standards.md) | 完整指南 |
| 實作 Repository | [Domain 分層架構](./domain-architecture.md) | Repository Pattern |
| 建立邀請系統 | [SaaS 產品功能](./saas-features.md) | 邀請系統 |
| 整合 Stripe | [SaaS 產品功能](./saas-features.md) | 計費機制 |
| 記錄使用者操作 | [可觀察性](./observability.md) | Activity Log |
| 審計資料變更 | [可觀察性](./observability.md) | Audit Log |

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

### 企業級 SaaS 標準檢查清單

開發新功能時，請確保符合以下 8 大企業級標準：

#### ✅ 1. 身份驗證與授權
- [ ] 所有 API 端點需要認證
- [ ] 使用 JWT Token 攜帶 workspace context
- [ ] 支援三種視角（Personal/Organization/Team）
- [ ] 實作 Context 切換機制
- [ ] Refresh Token 自動更新
- [ ] SSR 環境兼容（Browser/Server Client 分離）

#### ✅ 2. 多租戶架構
- [ ] 資料表包含租戶識別欄位（workspace_id/organization_id/team_id）
- [ ] 啟用 Row Level Security (RLS)
- [ ] RLS Policy 確保資料隔離
- [ ] 租戶間資料不可互相存取
- [ ] URL 路由包含租戶識別（/:workspaceSlug/...）

#### ✅ 3. Workspace Context Manager
- [ ] 使用 WorkspaceContextService 管理當前視角
- [ ] 左側欄依 context 動態切換
- [ ] 依 context 載入對應資源（Blueprint/Task/Log）
- [ ] Context 變更時清除相關快取
- [ ] Context Guard 保護需要特定視角的路由

#### ✅ 4. 資料庫 Schema 標準
- [ ] 使用 UUID 作為主鍵
- [ ] 包含 created_at, updated_at 時間戳
- [ ] 包含 created_by 審計欄位
- [ ] 遵循命名規範（snake_case）
- [ ] 外鍵建立對應索引
- [ ] 複合查詢建立複合索引
- [ ] CHECK 約束驗證業務規則
- [ ] 重要資料表建立審計 Trigger

#### ✅ 5. 可觀察性
- [ ] 重要操作記錄到 activity_logs
- [ ] 資料變更記錄到 audit_logs
- [ ] 錯誤追蹤整合 Sentry
- [ ] API 請求效能監控
- [ ] 使用者行為追蹤
- [ ] 異常告警設定

#### ✅ 6. Domain 分層架構
- [ ] 不在 Component 中直接呼叫 Supabase
- [ ] 使用 Repository Pattern 存取資料
- [ ] Domain Service 處理跨 Aggregate 邏輯
- [ ] 使用 Mapper 轉換 Domain ↔ Persistence
- [ ] Infrastructure Layer 實作 Domain Interface
- [ ] 依賴反轉原則（依賴抽象而非具體）

#### ✅ 7. 安全與部署
- [ ] RLS Policy 永遠啟用
- [ ] Edge Functions 使用 service role（謹慎）
- [ ] 實作 Rate Limiting
- [ ] 敏感資料加密儲存
- [ ] 環境變數正確配置
- [ ] CORS 設定正確
- [ ] CSP 標頭設定
- [ ] 輸入驗證與清理

#### ✅ 8. SaaS 產品功能
- [ ] 邀請系統（如需多成員協作）
- [ ] 權限矩陣定義角色權限
- [ ] 計費機制（如為付費功能）
- [ ] 使用量追蹤與限額檢查
- [ ] 租戶配額管理

### 新增功能的完整檢查清單

#### 設計階段
- [ ] 使用 sequential-thinking 規劃步驟
- [ ] 使用 software-planning-tool 設計架構
- [ ] 使用 github MCP 檢查相關程式碼
- [ ] 使用 supabase MCP 查詢 schema
- [ ] 使用 redis MCP 儲存設計決策

#### 資料庫設計
- [ ] 遵循 [資料庫 Schema 標準](./database-schema-standards.md)
- [ ] 建立 migration 檔案
- [ ] 定義 RLS Policies
- [ ] 建立必要索引
- [ ] 建立審計 Trigger

#### 程式碼實作
- [ ] Domain Layer: 定義 Aggregate、Value Objects、Repository Interface
- [ ] Infrastructure Layer: 實作 Repository、Mapper
- [ ] Application Layer: 實作 Command/Query Handlers
- [ ] Features Layer: 實作 Components、Pages

#### 權限與安全
- [ ] 定義所需權限
- [ ] 實作 RLS policies
- [ ] 新增前端 Guard
- [ ] 實作後端權限檢查
- [ ] 記錄敏感操作到 audit_logs

#### 測試
- [ ] 撰寫單元測試（Domain Layer）
- [ ] 撰寫整合測試（Repository）
- [ ] 撰寫 E2E 測試（使用者流程）
- [ ] 安全測試（權限檢查）

#### 文件
- [ ] 更新相關文件
- [ ] 新增程式碼註解
- [ ] 更新 API 文件（如有）
- [ ] 更新 README

#### 部署前
- [ ] `npm run build` 成功
- [ ] `npm test` 全部通過
- [ ] `npm run serve:ssr:ng-gighub` 正常運行
- [ ] Code Review 通過
- [ ] 安全審查通過

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
