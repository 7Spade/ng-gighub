# ng-gighub

基於 Angular 20.1 的現代化 Web 應用程式，採用 Domain-Driven Design (DDD) + Clean Architecture + CQRS 架構模式，結合 Server-Side Rendering (SSR) 與 Supabase 後端服務。

## 📖 文件導覽

- **[貢獻指南](CONTRIBUTING.md)** - 如何參與專案開發
- **[文件索引](docs/README.md)** - 完整文件導覽
- **[環境設定](docs/setup/environment.md)** - 環境變數設定指南
- **[Supabase 設定](docs/setup/supabase.md)** - Supabase 資料庫與儲存設定
- **[架構概覽](docs/architecture/system-overview.md)** - 系統架構設計
- **[程式碼風格](docs/standards/code-style.md)** - 編碼規範

## 🚀 快速開始

### 前置需求

- Node.js 20.x 或更高版本
- npm (隨 Node.js 安裝)
- Supabase 專案帳號

### 安裝步驟

1. **Clone 專案**
   ```bash
   git clone https://github.com/7Spade/ng-gighub.git
   cd ng-gighub
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定環境變數**
   ```bash
   cp .env.example .env
   # 編輯 .env 檔案，填入你的 Supabase 憑證
   ```
   詳見 [環境設定指南](docs/setup/environment.md)

4. **啟動開發伺服器**
   ```bash
   npm start
   # 或
   ng serve
   ```

應用程式將在 `http://localhost:4200/` 執行。修改原始碼時，應用程式會自動重新載入。

## 開發伺服器

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 建置

建置專案：

```bash
npm run build
# 或
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 測試

執行單元測試：

```bash
npm test
# 或
ng test
```

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## SSR 伺服器

執行 Server-Side Rendering 伺服器：

```bash
npm run serve:ssr:ng-gighub
```

需要先執行 `npm run build` 建置專案。

## 專案架構

本專案採用 **Domain-Driven Design (DDD) + Clean Architecture + CQRS** 架構模式：

```
src/app/
├── core/                    # 核心層
│   ├── domain/             # 領域層（業務邏輯）
│   ├── application/        # 應用層（用例、Commands/Queries）
│   └── infrastructure/     # 基礎設施層（資料存取、外部服務）
├── features/               # 功能模組（UI 組件）
├── layouts/                # 版面配置
└── shared/                 # 共用元件與工具
```

詳細架構說明請參考：
- [系統架構概覽](docs/architecture/system-overview.md)
- [領域模型設計](docs/architecture/DOMAIN_MODEL.md)
- [資料夾結構詳解](docs/architecture/FOLDER_STRUCTURE.md)

## 技術棧

| 類別 | 技術 | 版本 |
|------|------|------|
| 框架 | Angular | 20.1.x |
| 語言 | TypeScript | 5.8.x |
| SSR | @angular/ssr + Express | 20.1.x |
| 後端 | Supabase | Latest |
| 樣式 | SCSS | - |
| 測試 | Jasmine + Karma | - |
| UI 元件庫 | Angular Material | 20.1.x |

## 開發規範

- 遵循 [Angular Style Guide](https://angular.dev/style-guide)
- 參考 [程式碼風格指南](docs/standards/code-style.md)
- 遵守 [Git 工作流程](docs/standards/git-workflow.md)
- 查看 [審查準則](docs/standards/review-guidelines.md)

## 貢獻

歡迎貢獻！請參閱 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何參與專案開發。

## 授權

[待補充授權資訊]

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
