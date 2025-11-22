# Copilot Memory - ng-gighub 開發原則知識庫

## 📖 概述

`memory.jsonl` 是本專案的核心知識庫文件，以 JSONL (JSON Lines) 格式儲存，供 MCP (Model Context Protocol) agents 查詢和遵循專案的開發原則、架構規範、代碼風格等。

## 📊 統計資訊

- **總行數**: 76
- **實體數量**: 33
- **關係數量**: 43
- **格式**: JSONL (每行一個 JSON 物件)

## 🏗️ 結構說明

### Entity (實體)

實體表示一個概念或規範，包含：
- `entityName`: 實體名稱
- `entityType`: 實體類型
- `observations`: 觀察陣列（規則、事實、原則）

**實體類型統計**:
- `architecture-layer`: 4 (Domain, Application, Infrastructure, Features)
- `naming-convention`: 4 (Files, Classes, Variables, Database)
- `standards`: 4 (Testing, Enterprise-Branding, Consistency, Quality-Gates)
- `domain-aggregate`: 4 (Account, Organization, Team, Repository)
- `ddd-pattern`: 4 (Value Object, Domain Event, Repository, Specification)
- `code-standards`: 3 (TypeScript, HTML, SCSS)
- `architecture-pattern`: 2 (DDD-Architecture, CQRS-Pattern)
- `code-pattern`: 2 (Result-Type, Mapper)
- 其他: project, framework-standards, architecture-rules, process, backend-integration, framework-pattern

### Relation (關係)

關係表示實體間的連結：
- `from`: 起始實體
- `to`: 目標實體
- `relationType`: 關係類型 (adopts, follows, uses, includes, contains, implements, depends-on, requires, applies-to, enforces)

## 🔍 查詢範例

### 查詢專案資訊

```python
import json

with open('copilot/memory.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line.strip())
        if obj.get('entityName') == 'ng-gighub-project':
            print(obj['observations'])
            break
```

### 查詢 Component 命名規範

```python
with open('copilot/memory.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line.strip())
        if obj.get('entityName') == 'Naming-Files':
            for obs in obj['observations']:
                if 'Component' in obs:
                    print(obs)
```

### 查詢 Domain Layer 規則

```python
with open('copilot/memory.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line.strip())
        if obj.get('entityName') == 'Domain-Layer':
            print(f"位置: {obj['observations'][0]}")
            for obs in obj['observations']:
                if '依賴' in obs:
                    print(f"  - {obs}")
```

## 📚 主要內容

### 1. 專案身分識別
- **ng-gighub-project**: 專案核心資訊、技術棧、版本

### 2. 架構層 (Architecture Layers)
- **Domain-Layer**: 領域層規範與依賴規則
- **Application-Layer**: 應用層職責與 CQRS 實作
- **Infrastructure-Layer**: 基礎設施層與 Supabase 整合
- **Features-Layer**: 展示層與 Angular Components

### 3. 代碼風格 (Code Style)
- **Code-Style-TypeScript**: TypeScript 代碼規範
- **Code-Style-Angular**: Angular 框架標準
- **Code-Style-HTML**: HTML 模板風格
- **Code-Style-SCSS**: SCSS 樣式規範

### 4. 命名規範 (Naming Conventions)
- **Naming-Files**: 檔案命名規則 (kebab-case)
- **Naming-Classes**: 類別命名規則 (PascalCase)
- **Naming-Variables**: 變數命名規則 (camelCase)
- **Naming-Database**: 資料庫命名規則 (snake_case)

### 5. DDD 模式 (Domain-Driven Design)
- **Aggregate-Account**: Account 聚合根
- **Aggregate-Organization**: Organization 聚合根
- **Aggregate-Team**: Team 聚合根
- **Aggregate-Repository**: Repository 聚合根
- **Value-Object-Pattern**: Value Object 模式
- **Domain-Event-Pattern**: Domain Event 模式
- **Repository-Pattern**: Repository 模式
- **Specification-Pattern**: Specification 模式

### 6. 架構模式 (Architecture Patterns)
- **DDD-Architecture**: DDD + Clean Architecture + CQRS
- **CQRS-Pattern**: Command Query Responsibility Segregation
- **Dependency-Rules-Core**: 依賴反轉與層間依賴規則

### 7. 代碼模式 (Code Patterns)
- **Result-Type-Pattern**: Result<T, E> 錯誤處理
- **Mapper-Pattern**: Domain ↔ Database 轉換
- **Signal-State-Management**: Angular Signals 狀態管理

### 8. 品質保證 (Quality Assurance)
- **Enterprise-Branding**: 企業級標準
- **Consistency-Rules**: 一致性規則
- **Quality-Gates**: 質量閘門
- **Testing-Standards**: 測試標準
- **Git-Workflow**: Git 工作流程

### 9. 整合 (Integrations)
- **Supabase-Integration**: Supabase 後端整合

## 🔗 關係網路

主要關係鏈：

```
ng-gighub-project
  ├─ adopts → DDD-Architecture
  │            ├─ includes → Domain-Layer
  │            ├─ includes → Application-Layer
  │            ├─ includes → Infrastructure-Layer
  │            ├─ includes → Features-Layer
  │            └─ implements → CQRS-Pattern
  ├─ follows → Enterprise-Branding
  │            ├─ requires → Consistency-Rules
  │            └─ enforces → Quality-Gates
  └─ uses → Supabase-Integration
```

## 🛠️ 維護指南

### 新增實體

```jsonl
{"entityName":"New-Entity","entityType":"standards","observations":["規則1","規則2","規則3"]}
```

### 新增關係

```jsonl
{"from":"Entity-A","to":"Entity-B","relationType":"depends-on"}
```

### 驗證格式

```bash
python3 -c "
import json
with open('copilot/memory.jsonl', 'r') as f:
    for i, line in enumerate(f, 1):
        try:
            json.loads(line)
        except json.JSONDecodeError as e:
            print(f'Line {i}: {e}')
"
```

## 📖 參考文檔

相關專案文檔：
- [CODING_STANDARDS.md](../CODING_STANDARDS.md) - 整體開發規範
- [NAMING_CONVENTIONS.md](../NAMING_CONVENTIONS.md) - 命名規則
- [CODE_STYLE.md](../CODE_STYLE.md) - 代碼風格
- [DEPENDENCY_RULES.md](../DEPENDENCY_RULES.md) - 依賴規則
- [TESTING_STANDARDS.md](../TESTING_STANDARDS.md) - 測試規範
- [GIT_WORKFLOW.md](../GIT_WORKFLOW.md) - Git 工作流程
- [docs/ARCHITECTURE_DESIGN.md](../docs/ARCHITECTURE_DESIGN.md) - 架構設計

## 🤖 MCP Agent 使用

此 memory.jsonl 文件設計供 MCP (Model Context Protocol) agents 使用：

1. **查詢開發原則**: "這個專案的 Component 命名規範是什麼？"
2. **檢查架構規範**: "Domain Layer 可以依賴哪些層？"
3. **驗證代碼風格**: "TypeScript 中應該使用 const 還是 let？"
4. **理解 DDD 模式**: "Value Object 的特性是什麼？"
5. **遵循測試標準**: "Domain Layer 的測試覆蓋率目標是多少？"

Agents 可透過解析 JSONL 格式快速查詢相關規範，確保產出的代碼符合專案標準。

## 🔄 更新記錄

- **2025-11-22**: 初始版本建立，包含 33 個實體和 43 個關係
- 涵蓋專案身分、架構層、代碼風格、命名規範、DDD 模式、品質保證等

---

**維護者**: Development Team  
**最後更新**: 2025-11-22
