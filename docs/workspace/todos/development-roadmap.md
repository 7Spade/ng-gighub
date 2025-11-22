# ng-gighub 開發路線圖

**建立日期**: 2025-11-22  
**狀態**: Active

## 📋 目前狀態

### 已完成項目 ✅

- [x] 專案初始化（Angular 20.1 + SSR）
- [x] Supabase 整合設定
- [x] 基礎架構設計（DDD + Clean Architecture + CQRS）
- [x] 文檔結構建立
- [x] 開發規範制定
- [x] Git 工作流程定義
- [x] 文檔整理與組織（2025-11-22）

### 文檔整理成果

- 根目錄檔案精簡：僅保留 README.md 和 CONTRIBUTING.md
- 開發規範文檔統一移至 `docs/standards/`
- 修正所有文檔引用路徑
- 建立清晰的文檔導覽結構

## 🎯 下一步開發工作

### Phase 1: Core Infrastructure (Week 1-2) 🚧

#### 1.1 基礎設施層建置
- [ ] 設定 Domain Layer 基礎結構
  - [ ] AggregateRoot 基礎類別
  - [ ] Entity 基礎類別
  - [ ] ValueObject 基礎類別
  - [ ] DomainEvent 基礎類別
  - [ ] Result<T, E> 型別
- [ ] 設定 Application Layer 基礎結構
  - [ ] Command 基礎介面
  - [ ] Query 基礎介面
  - [ ] CommandHandler 基礎介面
  - [ ] QueryHandler 基礎介面
- [ ] 設定 Infrastructure Layer 基礎結構
  - [ ] Repository 基礎介面
  - [ ] Supabase Repository 基礎實作
  - [ ] Mapper 基礎類別
  - [ ] 錯誤處理機制

**優先級**: 🔴 High  
**預估工時**: 3-5 天  
**複雜度**: 7/10

#### 1.2 開發工具配置
- [ ] 設定單元測試框架與範例
- [ ] 建立 E2E 測試基礎架構
- [ ] 配置 CI/CD pipeline
- [ ] 設定開發環境 Docker 容器（可選）

**優先級**: 🟡 Medium  
**預估工時**: 2-3 天  
**複雜度**: 5/10

### Phase 2: Account Aggregate (Week 3-4)

#### 2.1 Account Domain Layer
- [ ] 實作 Account 聚合根
  - [ ] AccountId, Username, Email 值對象
  - [ ] AccountProfile 實體
  - [ ] AccountType 列舉
  - [ ] Account 業務邏輯與驗證
  - [ ] Account 領域事件
- [ ] 實作 AccountRepository 介面
- [ ] 實作 AccountFactory（可選）

**優先級**: 🔴 High  
**預估工時**: 3-4 天  
**複雜度**: 8/10

#### 2.2 Account Application Layer
- [ ] Commands
  - [ ] CreateAccountCommand & Handler
  - [ ] UpdateAccountProfileCommand & Handler
  - [ ] DeactivateAccountCommand & Handler
- [ ] Queries
  - [ ] GetAccountByIdQuery & Handler
  - [ ] GetAccountByUsernameQuery & Handler
  - [ ] ListAccountsQuery & Handler
- [ ] DTOs
  - [ ] AccountDTO
  - [ ] CreateAccountDTO
  - [ ] UpdateAccountProfileDTO

**優先級**: 🔴 High  
**預估工時**: 4-5 天  
**複雜度**: 7/10

#### 2.3 Account Infrastructure Layer
- [ ] Supabase Account Repository 實作
- [ ] Account Mapper 實作
- [ ] 資料庫 Migration（accounts table）
- [ ] 設定 RLS policies

**優先級**: 🔴 High  
**預估工時**: 2-3 天  
**複雜度**: 6/10

#### 2.4 Account UI Layer
- [ ] Account 功能模組
- [ ] Account 列表組件
- [ ] Account 詳細資訊組件
- [ ] Account 建立/編輯表單
- [ ] Account 服務（連接 Application Layer）

**優先級**: 🟡 Medium  
**預估工時**: 4-5 天  
**複雜度**: 6/10

### Phase 3: Organization Aggregate (Week 5-6)

#### 3.1 Organization Domain Layer
- [ ] 實作 Organization 聚合根
- [ ] OrganizationMember 實體
- [ ] OrganizationSettings 值對象
- [ ] Organization 領域事件

**優先級**: 🔴 High  
**預估工時**: 3-4 天  
**複雜度**: 8/10

#### 3.2 Organization Application & Infrastructure
- [ ] Commands & Handlers（Create, Update, AddMember, RemoveMember）
- [ ] Queries & Handlers（GetById, List, GetMembers）
- [ ] Supabase Repository 實作
- [ ] 資料庫 Migration

**優先級**: 🔴 High  
**預估工時**: 4-5 天  
**複雜度**: 7/10

#### 3.3 Organization UI Layer
- [ ] Organization 功能模組
- [ ] Organization 管理介面
- [ ] Member 管理介面

**優先級**: 🟡 Medium  
**預估工時**: 3-4 天  
**複雜度**: 6/10

### Phase 4: Team Aggregate (Week 7-8)

#### 4.1 Team Domain Layer
- [ ] 實作 Team 聚合根
- [ ] TeamMember 實體
- [ ] TeamPermission 值對象
- [ ] Team 領域事件

**優先級**: 🟡 Medium  
**預估工時**: 3-4 天  
**複雜度**: 7/10

#### 4.2 Team Application & Infrastructure
- [ ] Commands & Handlers
- [ ] Queries & Handlers
- [ ] Supabase Repository 實作
- [ ] 資料庫 Migration

**優先級**: 🟡 Medium  
**預估工時**: 4-5 天  
**複雜度**: 7/10

#### 4.3 Team UI Layer
- [ ] Team 功能模組
- [ ] Team 管理介面
- [ ] Team Member 管理

**優先級**: 🟡 Medium  
**預估工時**: 3-4 天  
**複雜度**: 6/10

### Phase 5: Repository Aggregate (Week 9-10)

#### 5.1 Repository Domain Layer
- [ ] 實作 Repository 聚合根
- [ ] RepositorySettings 值對象
- [ ] RepositoryPermission 實體
- [ ] Repository 領域事件

**優先級**: 🟡 Medium  
**預估工時**: 3-4 天  
**複雜度**: 8/10

#### 5.2 Repository Application & Infrastructure
- [ ] Commands & Handlers
- [ ] Queries & Handlers
- [ ] Supabase Repository 實作
- [ ] 資料庫 Migration

**優先級**: 🟡 Medium  
**預估工時**: 4-5 天  
**複雜度**: 7/10

#### 5.3 Repository UI Layer
- [ ] Repository 功能模組
- [ ] Repository 列表與詳細資訊
- [ ] Repository 權限管理

**優先級**: 🟡 Medium  
**預估工時**: 3-4 天  
**複雜度**: 6/10

### Phase 6: Event System & Integration (Week 11-12)

#### 6.1 領域事件系統
- [ ] Event Bus 實作
- [ ] Event Store（可選）
- [ ] Event Handlers 註冊機制
- [ ] 跨聚合事件處理

**優先級**: 🟡 Medium  
**預估工時**: 3-4 天  
**複雜度**: 8/10

#### 6.2 聚合間整合
- [ ] Organization ↔ Team 整合
- [ ] Team ↔ Repository 整合
- [ ] Account ↔ Organization/Team 整合
- [ ] 權限系統整合測試

**優先級**: 🔴 High  
**預估工時**: 4-5 天  
**複雜度**: 9/10

### Phase 7: UI/UX Enhancement (Week 13-14)

#### 7.1 使用者體驗優化
- [ ] 統一 UI 組件庫
- [ ] Loading 與 Error 狀態處理
- [ ] 表單驗證與錯誤訊息
- [ ] 響應式設計優化

**優先級**: 🟢 Low  
**預估工時**: 3-4 天  
**複雜度**: 5/10

#### 7.2 效能優化
- [ ] Component OnPush 策略
- [ ] Lazy Loading 模組
- [ ] SSR 優化
- [ ] 圖片與資源優化

**優先級**: 🟡 Medium  
**預估工時**: 2-3 天  
**複雜度**: 6/10

### Phase 8: Testing & Documentation (Week 15-16)

#### 8.1 測試完善
- [ ] 單元測試覆蓋率達 80%+
- [ ] 整合測試（Application Layer）
- [ ] E2E 測試主要流程
- [ ] 效能測試與優化

**優先級**: 🔴 High  
**預估工時**: 4-5 天  
**複雜度**: 7/10

#### 8.2 文檔完善
- [ ] API 文檔完整化
- [ ] 使用者指南
- [ ] 部署指南
- [ ] 故障排除指南

**優先級**: 🟡 Medium  
**預估工時**: 2-3 天  
**複雜度**: 4/10

## 📊 專案里程碑

### Milestone 1: Infrastructure Ready (Week 2)
- 基礎設施層完成
- 開發工具配置完成
- 可開始實作聚合根

### Milestone 2: Account MVP (Week 4)
- Account 聚合根完整實作
- 基本 CRUD 功能可用
- UI 基本可互動

### Milestone 3: Core Aggregates Complete (Week 10)
- 四個核心聚合根全部完成
- 基本功能可用
- 資料庫結構穩定

### Milestone 4: Production Ready (Week 16)
- 所有功能完成
- 測試覆蓋率達標
- 文檔完整
- 可部署到生產環境

## 🔧 技術債務追蹤

### 需要改進項目
- [ ] 待定：根據實作過程中發現的問題更新

### 已解決項目
- [x] 文檔組織混亂 → 已在 2025-11-22 完成整理

## 📝 決策記錄

### 2025-11-22: 文檔重組
**背景**: 根目錄有過多技術文檔，結構混亂，引用錯誤  
**決策**: 將所有技術文檔移至 docs/ 子目錄，根目錄只保留 README.md 和 CONTRIBUTING.md  
**影響**: 所有文檔引用需要更新，但結構更清晰，符合現代專案標準

### 待補充
根據開發進度補充重要的架構或技術決策

## 🎯 當前焦點（本週）

**Week of 2025-11-22**:
- ✅ 完成文檔整理
- 🔄 開始 Phase 1.1: 基礎設施層建置
- 📋 規劃 Domain Layer 基礎結構實作細節

## 📞 聯絡與協作

- **專案倉庫**: [7Spade/ng-gighub](https://github.com/7Spade/ng-gighub)
- **文檔問題**: 在 GitHub Issues 中標記 `documentation`
- **開發問題**: 在 GitHub Issues 中標記 `development`

---

**最後更新**: 2025-11-22  
**維護者**: Development Team

此路線圖會隨專案進度持續更新。
