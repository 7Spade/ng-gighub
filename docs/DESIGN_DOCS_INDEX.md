# 設計文件總覽

本專案採用 **Domain-Driven Design (DDD)** + **Clean Architecture** + **CQRS** 架構模式，本文件提供設計文件的導覽與快速參考。

## 🎓 推薦閱讀順序

**新手？** 請先閱讀 **[開發學習路徑](./LEARNING_PATH.md)** ⭐

學習路徑會按照 Level 0-4 的順序，引導您逐步理解本頁列出的所有設計文件。

---

## 📚 文件索引

### 核心設計文件

1. **[架構設計文件](ARCHITECTURE_DESIGN.md)** - 主要設計文件
   - 架構概覽與目標
   - 核心概念與設計模式（DDD, CQRS, Repository Pattern）
   - 四層架構詳解（Domain/Application/Infrastructure/Features）
   - 聚合根設計概述
   - 資料流與互動圖
   - 技術棧說明
   - 開發規範與最佳實踐
   - 16 週實作路線圖

2. **[資料夾結構](architecture/FOLDER_STRUCTURE.md)** - 完整目錄組織
   - 專案根目錄結構
   - src/ 目錄結構
   - Domain Layer 完整結構（200+ 檔案）
   - Application Layer 完整結構（150+ 檔案）
   - Infrastructure Layer 完整結構（80+ 檔案）
   - Features Layer 完整結構（160+ 檔案）
   - 檔案與資料夾命名規範

3. **[領域模型](architecture/DOMAIN_MODEL.md)** - 領域設計詳解
   - 四個核心聚合根詳細設計
   - 實體（Entities）定義
   - 值對象（Value Objects）與驗證規則
   - 領域事件（Domain Events）
   - 業務規則總覽
   - 領域關係圖（Mermaid ERD）
   - 領域服務職責

### 補充文件

4. **[系統概覽](architecture/system-overview.md)** - 技術架構總覽
5. **[Supabase 設定](setup/supabase.md)** - 資料庫與後端設定
6. **[環境設定](setup/environment.md)** - 開發環境設定

---

## 🏗️ 架構快速參考

### 四層架構

```
Features Layer (展示層)
    ↓ depends on
Application Layer (應用層)
    ↓ depends on
Domain Layer (領域層) ← 核心，不依賴任何層
    ↑ implemented by
Infrastructure Layer (基礎設施層)
```

### 核心聚合根

1. **Account** - 帳戶（User/Organization/Bot）
2. **Organization** - 組織管理
3. **Team** - 團隊管理
4. **Repository** - 倉庫與權限管理

### 設計模式

- **DDD**: 領域驅動設計，業務邏輯在領域層
- **CQRS**: 命令查詢職責分離，讀寫分離
- **Repository Pattern**: 抽象資料存取層
- **Event-Driven**: 領域事件驅動解耦
- **Dependency Inversion**: 依賴反轉原則

---

## 🚀 快速開始

### 1. 閱讀順序（新成員）

1. 閱讀 [架構設計文件](ARCHITECTURE_DESIGN.md) 第 1-2 章（架構概覽與核心概念）
2. 閱讀 [領域模型](architecture/DOMAIN_MODEL.md) 第 1 章（領域概覽）
3. 選擇一個聚合根深入閱讀（建議從 Account 開始）
4. 閱讀 [資料夾結構](architecture/FOLDER_STRUCTURE.md) 了解程式碼組織
5. 查看實作路線圖（架構設計文件第 8 章）

### 2. 開發指南（開發者）

**實作新功能前：**
1. 確認功能屬於哪個聚合根
2. 閱讀該聚合根的領域模型定義
3. 確認需要的 Commands/Queries
4. 查看資料夾結構，找到對應的檔案位置
5. 遵循開發規範（架構設計文件第 7 章）

**程式碼位置參考：**
- Domain 邏輯：`src/app/core/domain/{aggregate}/`
- Commands/Queries：`src/app/core/application/{aggregate}/`
- 資料存取：`src/app/core/infrastructure/persistence/`
- UI 組件：`src/app/features/{feature}/`

### 3. 設計決策（架構師）

關鍵設計決策已存入專案記憶（Redis）：
- `ng-gighub:architecture:pattern` - 架構模式
- `ng-gighub:architecture:aggregates` - 聚合根定義
- `ng-gighub:architecture:cqrs` - CQRS 模式
- `ng-gighub:architecture:events` - 事件驅動
- `ng-gighub:architecture:repository-pattern` - 倉儲模式
- `ng-gighub:architecture:value-objects` - 值對象設計

---

## 📋 檢查清單

### 實作新聚合根

- [ ] 定義聚合根類別（extends AggregateRoot）
- [ ] 定義相關實體（extends Entity）
- [ ] 定義值對象（extends ValueObject）
- [ ] 定義領域事件（extends DomainEvent）
- [ ] 定義 Repository 接口
- [ ] 定義領域服務（如需要）
- [ ] 實作 Commands & Handlers
- [ ] 實作 Queries & Handlers
- [ ] 定義 DTOs
- [ ] 實作 Supabase Repository
- [ ] 建立 Mapper
- [ ] 撰寫單元測試
- [ ] 建立 UI 組件

### Code Review 重點

- [ ] Domain Layer 不依賴外層
- [ ] 值對象有完整驗證邏輯
- [ ] 聚合根維護一致性
- [ ] Commands 使用 Result<T, E> 回傳
- [ ] Queries 回傳 DTO 而非領域對象
- [ ] 領域事件命名使用過去式
- [ ] Repository 實作完整的錯誤處理
- [ ] Component 使用 OnPush 策略
- [ ] 遵循檔案命名規範

---

## 🔍 常見問題

### Q1: 如何決定某個概念應該是實體還是值對象？

**實體（Entity）**：
- 有唯一識別符
- 生命週期中屬性可能改變
- 通過 ID 識別（而非屬性值）
- 範例：AccountProfile, OrganizationMember

**值對象（Value Object）**：
- 沒有唯一識別符
- 不可變（建立後不改變）
- 通過屬性值識別
- 封裝驗證邏輯
- 範例：Email, Username, AccountId

### Q2: Command 和 Query 的區別？

**Command（命令）**：
- 改變系統狀態
- 回傳 Result<void, Error>
- 可能產生領域事件
- 範例：CreateAccountCommand, UpdateMemberRoleCommand

**Query（查詢）**：
- 只讀取，不改變狀態
- 回傳 Result<DTO, Error>
- 不產生領域事件
- 可以優化查詢效能（直接查 DB）
- 範例：GetAccountByIdQuery, ListMembersQuery

### Q3: 何時使用領域服務（Domain Service）？

當業務邏輯：
- 跨越多個聚合根
- 不自然地屬於任何單一聚合根
- 需要協調多個聚合根的行為

範例：
- `AccountFactory` - 建立不同類型帳戶
- `MemberManagementService` - 處理複雜的成員管理邏輯
- `PermissionManagementService` - 計算跨多個實體的權限

### Q4: 聚合之間如何通訊？

**原則：聚合之間透過 ID 引用，而非直接持有對象**

通訊方式：
1. **Commands/Queries**: Application Layer 協調多個聚合的操作
2. **領域事件**: 一個聚合產生事件，其他聚合訂閱並反應
3. **最終一致性**: 不同聚合的資料可能短暫不一致，透過事件最終達成一致

範例：
```typescript
// ❌ 錯誤：聚合直接持有另一個聚合
class Organization {
  teams: Team[]  // 不好的做法
}

// ✅ 正確：透過 ID 引用
class Organization {
  teamIds: TeamId[]  // 好的做法
}

// 需要完整的 Team 資料時，透過 Repository 查詢
const teams = await teamRepository.findByIds(organization.teamIds);
```

### Q5: 如何測試領域邏輯？

**單元測試重點：**
- 值對象的驗證邏輯
- 聚合根的業務規則
- 領域服務的邏輯
- 使用 Mock 隔離依賴

**範例：**
```typescript
describe('Username', () => {
  it('should reject username shorter than 3 characters', () => {
    const result = Username.create('ab');
    expect(result.isFailure).toBe(true);
  });

  it('should accept valid username', () => {
    const result = Username.create('john-doe');
    expect(result.isSuccess).toBe(true);
  });
});
```

---

## 📊 文件統計

| 文件 | 檔案大小 | 行數 | 主要內容 |
|------|----------|------|----------|
| ARCHITECTURE_DESIGN.md | 34KB | 1,233 | 完整架構設計 |
| FOLDER_STRUCTURE.md | 33KB | 685 | 資料夾組織 |
| DOMAIN_MODEL.md | 25KB | 928 | 領域模型詳解 |
| **總計** | **92KB** | **2,846** | 三份核心文件 |

預估專案檔案數：**630+ 個檔案**
- Domain Layer: ~200 個檔案
- Application Layer: ~150 個檔案
- Infrastructure Layer: ~80 個檔案
- Features Layer: ~160 個檔案
- Shared/Layouts: ~40 個檔案

---

## 🛠️ 技術棧總覽

| 類別 | 技術 | 版本 |
|------|------|------|
| 框架 | Angular | 20.1.x |
| 語言 | TypeScript | 5.8.x |
| SSR | @angular/ssr + Express | 20.1.x / 5.1.x |
| 後端 | Supabase | 2.84.x |
| 狀態管理 | RxJS + Signals | 7.8.x / built-in |
| UI 框架 | Angular Material | 20.1.x |
| 測試 | Jasmine + Karma | 5.8.x / 6.4.x |

---

## 📅 實作時程（參考）

完整時程請參考 [架構設計文件第 8 章](ARCHITECTURE_DESIGN.md#8-實作路線圖)

**簡要版本：**
- **Phase 1-2** (Week 1-4): 基礎設施 + Account 聚合根
- **Phase 3** (Week 5-6): Organization 聚合根
- **Phase 4** (Week 7-8): Team 聚合根
- **Phase 5** (Week 9-10): Repository 聚合根
- **Phase 6** (Week 11-12): Event System 整合
- **Phase 7** (Week 13-14): UI 優化
- **Phase 8** (Week 15-16): 測試與文件

---

## 🔗 相關連結

### 內部文件
- [專案 README](../README.md)
- [貢獻指南](../CONTRIBUTING.md)
- [Supabase 設定](setup/supabase.md)
- [環境設定](setup/environment.md)
- [實作總結](IMPLEMENTATION_SUMMARY.md)
- [文件管理標準](DOCUMENTATION_STANDARDS.md)

### 外部參考
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Angular Documentation](https://angular.dev)
- [Supabase Documentation](https://supabase.com/docs)

---

## 📝 文件維護

### 更新時機
- 新增聚合根時
- 修改核心架構決策時
- 調整資料夾結構時
- 新增重要設計模式時

### 文件版本
- **當前版本**: 1.0.0
- **最後更新**: 2025-11-21
- **維護者**: Development Team

---

**注意**: 本文件系統基於 DDD + Clean Architecture 最佳實踐設計，適合中大型 Angular 專案。實際實作時可根據專案需求調整。
