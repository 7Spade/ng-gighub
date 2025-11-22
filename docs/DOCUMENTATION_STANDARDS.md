# 文件管理標準

## 概述

本文件定義 ng-gighub 專案的文件管理標準，確保文件組織符合現代化、企業級的最佳實踐。

## 文件組織原則

### 1. 根目錄文件

根目錄只保留專案必要的核心文件：

- **README.md** - 專案概述、快速開始、基本資訊
- **CONTRIBUTING.md** - 貢獻指南、開發流程、PR 規範
- **LICENSE** - 授權條款（如適用）
- **CODE_OF_CONDUCT.md** - 行為準則（如適用）
- **.gitignore** - Git 忽略規則
- **package.json** - 專案依賴與腳本

**禁止在根目錄放置：**
- 詳細的設定指南
- 架構文件
- 開發筆記
- 會議記錄
- 其他技術文件

### 2. docs/ 目錄結構

所有專案文件統一放置於 `docs/` 目錄，並按以下結構組織：

```
docs/
├── README.md                     # 文件導覽與索引
├── DOCUMENTATION_STANDARDS.md   # 本文件
├── setup/                        # 設定指南
│   ├── environment.md            # 環境設定
│   ├── supabase.md              # Supabase 設定
│   └── deployment.md            # 部署設定
├── architecture/                 # 架構設計文件
│   ├── system-overview.md       # 系統概覽
│   ├── DOMAIN_MODEL.md          # 領域模型
│   ├── FOLDER_STRUCTURE.md      # 資料夾結構
│   └── diagrams/                # 架構圖表
│       ├── erd.md               # 實體關係圖
│       └── flowchart.md         # 流程圖
├── guides/                       # 操作指南
│   ├── development.md           # 開發指南
│   ├── testing.md               # 測試指南
│   └── troubleshooting.md       # 問題排除
├── standards/                    # 開發標準
│   ├── code-style.md            # 程式碼風格
│   ├── git-workflow.md          # Git 工作流程
│   └── review-guidelines.md     # 審查準則
├── prompts/                      # AI 提示範本
│   ├── task-generation.md       # 任務生成
│   ├── code-review.md           # 程式碼審查
│   └── bug-triage.md            # 錯誤分類
├── workspace/                    # 工作區文件
│   ├── todos/                   # 任務清單
│   ├── notes/                   # 開發筆記
│   └── meeting-minutes/         # 會議記錄
└── api/                          # API 文件（未來使用）
    ├── rest-api.md              # REST API 規格
    └── graphql-schema.md        # GraphQL Schema
```

### 3. 模組內文件

應用程式模組內的 README.md 文件：

- **位置**: `src/app/{module}/README.md`
- **用途**: 說明該模組的職責、架構、使用方式
- **範圍**: 僅限模組內部的技術細節
- **連結**: 可連結到 docs/ 中的相關文件

範例：
```
src/app/core/domain/README.md       # Domain Layer 說明
src/app/core/application/README.md  # Application Layer 說明
src/app/features/README.md          # Features 概覽
```

## 文件命名規範

### 檔案命名

1. **使用小寫字母和連字符 (kebab-case)**
   - ✅ `environment-setup.md`
   - ✅ `api-documentation.md`
   - ❌ `EnvironmentSetup.md`
   - ❌ `API_Documentation.md`

2. **使用描述性名稱**
   - ✅ `supabase-database-setup.md`
   - ❌ `setup.md`
   - ❌ `doc1.md`

3. **特殊文件使用大寫**（慣例）
   - `README.md`
   - `CONTRIBUTING.md`
   - `LICENSE`
   - `CHANGELOG.md`

4. **日期格式**（會議記錄、版本文件）
   - 格式：`YYYY-MM-DD.md`
   - 範例：`2025-11-22.md`

### 目錄命名

1. **使用小寫字母和連字符**
   - ✅ `meeting-minutes/`
   - ✅ `api-specs/`
   - ❌ `MeetingMinutes/`
   - ❌ `API_Specs/`

2. **複數形式**（集合類別的目錄）
   - ✅ `guides/`
   - ✅ `diagrams/`
   - ❌ `guide/`
   - ❌ `diagram/`

## 文件內容標準

### Markdown 格式

1. **標題層級**
   - 每個文件只有一個 H1 (`#`)
   - 使用層級結構 (H1 → H2 → H3)
   - 不跳過層級

2. **程式碼區塊**
   - 指定語言：` ```typescript`
   - 縮排使用空格，與周圍文字一致

3. **連結**
   - 內部連結使用相對路徑
   - 外部連結使用完整 URL
   - 連結文字具描述性

4. **清單**
   - 使用 `-` 作為無序清單符號（一致性）
   - 使用 `1.` 作為有序清單符號
   - 清單項目後空一行再接下一個區塊

### 文件結構

每個主要文件應包含：

1. **標題** - 文件主題
2. **概述** - 簡短說明文件目的（1-2 段）
3. **目錄** - 長文件（>200 行）應包含目錄
4. **主要內容** - 分章節組織
5. **相關連結** - 連結到相關文件
6. **維護資訊** - 最後更新日期、維護者（可選）

範例：
```markdown
# 文件標題

## 概述
簡短說明...

## 目錄
- [章節 1](#章節-1)
- [章節 2](#章節-2)

## 章節 1
內容...

## 章節 2
內容...

## 相關連結
- [相關文件](./related.md)

---
**最後更新**: 2025-11-22  
**維護者**: Development Team
```

### 圖表標準

1. **優先使用 Mermaid**
   - 文字格式，版本控制友善
   - GitHub/GitLab 原生支援
   - AI 友善格式

2. **圖表類型**
   - 流程圖：Mermaid flowchart
   - ERD：Mermaid ER diagram
   - 序列圖：Mermaid sequence diagram
   - 狀態圖：Mermaid state diagram

3. **圖表位置**
   - 複雜圖表：獨立檔案於 `diagrams/` 目錄
   - 簡單圖表：內嵌於相關文件中

## 文件維護流程

### 建立新文件

1. **確定文件類型與位置**
   - 參考「文件組織原則」選擇正確目錄
   - 使用標準命名規範

2. **使用範本**（如適用）
   - 參考同類型的現有文件
   - 遵循文件結構標準

3. **建立文件**
   - 撰寫內容
   - 添加必要的連結
   - 更新父目錄的 README.md 或索引

4. **提交變更**
   - 提交訊息清楚說明新增的文件
   - 在 PR 中說明文件目的

### 更新文件

1. **即時更新**
   - 程式碼變更時同步更新文件
   - 不留下過時的資訊

2. **定期審查**
   - 每季度審查架構文件
   - 每月審查工作區文件
   - 每週審查任務清單

3. **版本標記**
   - 重大更新時更新「最後更新」日期
   - 重要變更可記錄變更歷史

### 歸檔文件

1. **何時歸檔**
   - 功能已廢棄
   - 文件已過時且不再相關
   - 被新文件取代

2. **歸檔流程**
   - 移至 `docs/archive/` 對應子目錄
   - 在原位置留下連結指向歸檔版本
   - 更新所有引用該文件的連結

3. **歸檔結構**
   ```
   docs/archive/
   ├── deprecated-features/
   ├── old-architecture/
   └── previous-versions/
   ```

## 連結管理

### 內部連結

1. **使用相對路徑**
   ```markdown
   [架構概覽](./architecture/system-overview.md)
   [設定指南](../setup/environment.md)
   ```

2. **連結到特定章節**
   ```markdown
   [安裝步驟](./setup/environment.md#安裝-nodejs)
   ```

3. **檢查連結有效性**
   - 文件移動時更新所有連結
   - PR 審查時驗證連結

### 外部連結

1. **使用完整 URL**
   ```markdown
   [Angular 文件](https://angular.dev)
   ```

2. **定期檢查**
   - 每季度檢查外部連結有效性
   - 更新失效的連結

## AI 友善文件格式

為了讓 AI Agent 更有效使用文件：

1. **結構化內容**
   - 使用清晰的標題層級
   - 段落簡潔明瞭
   - 使用清單和表格組織資訊

2. **程式碼範例**
   - 完整、可執行的範例
   - 包含必要的 import 和 context
   - 註解說明關鍵步驟

3. **明確的指示**
   - 使用「必須」、「應該」、「可以」等明確詞彙
   - 提供 Do/Don't 範例
   - 說明預期結果

4. **連結上下文**
   - 文件間相互引用
   - 提供「相關文件」區塊
   - 使用一致的術語

## 文件審查清單

提交文件變更前，確認以下項目：

### 內容
- [ ] 文件內容準確、最新
- [ ] 語法正確、表達清晰
- [ ] 程式碼範例可執行
- [ ] 包含必要的範例和說明

### 格式
- [ ] 遵循 Markdown 格式規範
- [ ] 標題層級正確
- [ ] 程式碼區塊有語言標記
- [ ] 清單格式一致

### 結構
- [ ] 文件位於正確目錄
- [ ] 檔案命名符合規範
- [ ] 包含必要的章節（標題、概述等）
- [ ] 長文件有目錄

### 連結
- [ ] 內部連結使用相對路徑
- [ ] 所有連結有效
- [ ] 相關文件互相引用
- [ ] 更新了索引文件（如需要）

### 維護
- [ ] 更新「最後更新」日期（如適用）
- [ ] 歸檔了被取代的舊文件
- [ ] 更新了受影響的其他文件

## 工具與資源

### 編輯器設定

**VS Code 建議擴充套件：**
- Markdown All in One
- Markdown Preview Enhanced
- Mermaid Preview
- markdownlint

**設定檔 (.vscode/settings.json)：**
```json
{
  "markdown.extension.toc.levels": "2..6",
  "markdown.extension.list.indentationSize": "adaptive",
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.wordWrap": "on"
  }
}
```

### 驗證工具

1. **連結檢查**
   ```bash
   # 檢查所有 markdown 檔案的連結
   find docs -name "*.md" -exec grep -H "\[.*\](.*.md)" {} \;
   ```

2. **Markdown Lint**
   ```bash
   # 使用 markdownlint-cli
   npx markdownlint-cli docs/**/*.md
   ```

### 線上資源

- [Markdown Guide](https://www.markdownguide.org/)
- [Mermaid Documentation](https://mermaid.js.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

## 範例文件

### 標準設定指南範本

```markdown
# {功能} 設定指南

## 概述
簡短說明本指南的目的和適用情況。

## 前置需求
- 需求 1
- 需求 2

## 安裝步驟

### 1. 步驟標題
詳細說明...

\`\`\`bash
# 範例指令
npm install package-name
\`\`\`

### 2. 下一步驟
...

## 配置

### 配置檔案
\`\`\`json
{
  "setting": "value"
}
\`\`\`

### 環境變數
| 變數名 | 說明 | 預設值 |
|--------|------|--------|
| VAR_1  | ...  | ...    |

## 驗證
說明如何驗證設定是否正確...

## 常見問題

### 問題 1
**現象**: ...
**解決方案**: ...

## 相關連結
- [相關文件](./related.md)

---
**最後更新**: 2025-11-22
```

### 標準架構文件範本

```markdown
# {系統/模組} 架構

## 概述
系統的高層次說明...

## 架構圖
\`\`\`mermaid
graph TD
    A[Component A] --> B[Component B]
    B --> C[Component C]
\`\`\`

## 組件說明

### Component A
**職責**: ...
**技術**: ...
**介面**: ...

### Component B
...

## 資料流

1. 步驟 1
2. 步驟 2

## 設計決策

### 決策 1: {標題}
**背景**: ...
**決策**: ...
**理由**: ...
**影響**: ...

## 技術棧
| 類別 | 技術 | 版本 |
|------|------|------|
| ... | ... | ... |

## 相關文件
- [文件 A](./doc-a.md)

---
**最後更新**: 2025-11-22
```

## 文件品質指標

維持高品質文件的指標：

1. **完整性** - 涵蓋所有必要主題
2. **準確性** - 資訊正確且最新
3. **清晰性** - 表達清楚易懂
4. **可尋性** - 容易找到需要的資訊
5. **一致性** - 格式和風格一致
6. **可維護性** - 易於更新和維護

## 總結

遵循這些標準可以確保 ng-gighub 專案的文件：
- 組織良好、易於導覽
- 對開發者和 AI Agent 都友善
- 易於維護和更新
- 符合企業級專案的最佳實踐

---

**版本**: 1.0.0  
**最後更新**: 2025-11-22  
**維護者**: Development Team

如有任何疑問或建議，請開啟 issue 或聯繫團隊。
