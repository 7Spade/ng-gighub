# Workspace Documentation

## 概述

本目錄包含 ng-gighub 專案中 Workspace (工作區) 功能的所有相關文件。

## 文件列表

### 📘 [Space Management 完整開發計畫](./SPACE_MANAGEMENT_DEVELOPMENT_PLAN.md)
**最新更新**: 2025-11-22

完整的 Space Management System 開發計畫文件，包含：
- 系統架構設計（DDD + Clean Architecture + CQRS）
- 領域模型詳解（WorkspaceAggregate, Entities, Value Objects, Domain Events）
- 資料庫設計（Schema, RLS Policies, Indexes, Triggers）
- Application Layer 設計（Commands, Queries, DTOs, Handlers）
- Infrastructure Layer 設計（Repository, Mapper, Query Service）
- Features Layer 設計（Components, Pages, State Management）
- 路由與導航設計
- 狀態管理設計（NgRx Signal Store + Hierarchical Context Service）
- 權限與安全設計（Role-based Permissions, Guards, Directives）
- 12 週實作階段規劃
- 測試策略（Unit, Integration, E2E）
- 部署與監控

**適用對象**: 開發團隊、架構師、專案經理

### 📋 [專案狀態](./PROJECT_STATUS.md)
追蹤 Workspace 功能的當前實作狀態與進度

### 📝 [實作指南](./IMPLEMENTATION_GUIDE.md)
實作 Workspace 功能的具體步驟與最佳實踐

### 📊 [開發路線圖](./todos/development-roadmap.md)
Workspace 功能的開發里程碑與任務追蹤

### 📓 [會議記錄](./meeting-minutes/)
Workspace 相關的會議記錄與決策

## 快速開始

### 新成員閱讀順序

1. **先讀**: [Space Management 完整開發計畫](./SPACE_MANAGEMENT_DEVELOPMENT_PLAN.md) 的前 3 章
   - 專案概覽
   - 系統架構
   - 領域模型設計

2. **理解現有實作**: 查看 `src/app/core/domain/workspace/` 目錄
   - WorkspaceAggregate 已完成
   - Value Objects, Entities, Events 已完成
   - Repository Interface 已完成

3. **查看資料庫**: 使用 Supabase MCP 查看：
   - `workspaces` table
   - `workspace_members` table
   - `workspace_resources` table

4. **下一步開發**: 參考開發計畫的 Phase 1-2
   - Infrastructure Layer 實作
   - Application Layer 實作

### 開發者工作流程

```bash
# 1. 查看當前狀態
cat docs/workspace/PROJECT_STATUS.md

# 2. 選擇任務
cat docs/workspace/todos/development-roadmap.md

# 3. 參考開發計畫
# 閱讀相關章節，例如：
# - Phase 1: Infrastructure Layer
# - Phase 2: Application Layer

# 4. 實作功能
# 遵循 DDD + Clean Architecture 原則

# 5. 測試
npm test

# 6. 更新文件
# 更新 PROJECT_STATUS.md 和相關文件
```

## 架構概覽

### 層級結構

```
Features Layer (UI)
    ↓ depends on
Application Layer (Use Cases)
    ↓ depends on
Domain Layer (Business Logic) ✅ 已完成
    ↑ implemented by
Infrastructure Layer (Technical Details)
```

### 核心概念

- **WorkspaceAggregate**: 工作區聚合根，管理工作區生命週期
- **WorkspaceType**: personal | organization
- **MemberRole**: owner | admin | member | viewer
- **Workspace Context**: 共享的工作區上下文，提供給所有子組件

### 資料庫

使用 Supabase (PostgreSQL) 儲存：
- workspaces: 工作區主表
- workspace_members: 成員關聯
- workspace_resources: 資源關聯（team, repository, project 等）

所有表都啟用 Row Level Security (RLS)

## 設計決策

### ADR-001: NgRx Signal Store
使用 NgRx Signal Store 進行狀態管理，與 Angular Signals 完美整合。

### ADR-002: Hierarchical Context Service
使用 Angular 的 Hierarchical Injector 提供 Workspace Context，避免全域狀態污染。

### ADR-003: RLS for Security
使用 Supabase RLS 實現資料庫層級的安全控制。

詳細內容請參考 [Space Management 完整開發計畫](./SPACE_MANAGEMENT_DEVELOPMENT_PLAN.md) 的第 14.3 節。

## 實作進度

### ✅ 已完成
- Domain Layer 完整實作
  - WorkspaceAggregate
  - Value Objects (WorkspaceId, WorkspaceType, WorkspaceSlug, MemberRole)
  - Entities (WorkspaceMember, WorkspaceResource)
  - Domain Events (8 個事件)
  - Repository Interface

### 🔲 待實作
- Infrastructure Layer (Phase 1)
- Application Layer (Phase 2)
- Features Layer (Phase 3-4)
- State Management (Phase 4)
- Permissions & Security (Phase 5)
- Routing & Navigation (Phase 6)
- Polish & Optimization (Phase 7)
- Testing & Documentation (Phase 8)

## 相關連結

### 內部文件
- [專案 README](../../README.md)
- [架構設計文件](../ARCHITECTURE_DESIGN.md)
- [領域模型文件](../architecture/DOMAIN_MODEL.md)
- [Supabase 設定](../setup/supabase.md)

### 外部資源
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Angular Documentation](https://angular.dev)
- [Supabase Documentation](https://supabase.com/docs)

## 貢獻

### 新增功能
1. 參考開發計畫選擇任務
2. 遵循 DDD + Clean Architecture 原則
3. 撰寫測試
4. 更新相關文件

### 更新文件
1. 保持文件與實作同步
2. 記錄設計決策（ADR）
3. 更新進度狀態
4. 補充範例程式碼

## 支援

如有問題或建議：
1. 查閱 [Space Management 完整開發計畫](./SPACE_MANAGEMENT_DEVELOPMENT_PLAN.md)
2. 檢查 [專案狀態](./PROJECT_STATUS.md)
3. 查看相關 GitHub Issues
4. 聯繫開發團隊

---

**Last Updated**: 2025-11-22  
**Version**: 1.0.0  
**Maintainers**: Development Team
