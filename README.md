# ng-gighub

**Angular 20.1 + SSR + Supabase + DDD Architecture**

This project is an enterprise-grade Angular application built with Domain-Driven Design principles, Server-Side Rendering, and Supabase backend.

## 📚 Documentation

### 開發規範 (Development Standards)
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - 整體開發規範總覽
- **[NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)** - 命名規則詳細說明
- **[CODE_STYLE.md](./CODE_STYLE.md)** - 代碼風格指南
- **[DEPENDENCY_RULES.md](./DEPENDENCY_RULES.md)** - 依賴方向規則
- **[TESTING_STANDARDS.md](./TESTING_STANDARDS.md)** - 測試規範和策略
- **[GIT_WORKFLOW.md](./GIT_WORKFLOW.md)** - Git 工作流程和 commit 規範

### 架構文檔 (Architecture)
- **[ARCHITECTURE.md](./src/app/ARCHITECTURE.md)** - DDD 架構說明
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase 設定指南
- **[ENV_SETUP.md](./ENV_SETUP.md)** - 環境變數設定

## 🚀 Quick Start

### Prerequisites
- Node.js v20.x
- npm v10.x
- Supabase project

### Installation

```bash
# Clone repository
git clone https://github.com/7Spade/ng-gighub.git
cd ng-gighub

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Development server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 🛠️ Development

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

**重要**: 請遵循 [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) 的命名規範。

### Code Quality

在提交代碼前，請執行以下檢查：

```bash
# 檢查代碼格式
npm run format:check

# 自動格式化代碼
npm run format

# 執行 ESLint
npm run lint

# 自動修復 ESLint 問題
npm run lint:fix

# 執行所有檢查（format + lint）
npm run check
```

## 🏗️ Building

建置專案：

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Server-Side Rendering

To run the SSR server:

```bash
# First, build the project
npm run build

# Then, serve with SSR
npm run serve:ssr:ng-gighub
```

## 🧪 Testing

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

### Running tests with coverage

```bash
npm test -- --code-coverage
```

詳細測試規範請參考 [TESTING_STANDARDS.md](./TESTING_STANDARDS.md)。

## 📋 Code Review Checklist

在提交 Pull Request 前，請確認：

- [ ] 代碼通過 `npm run check`（ESLint + Prettier）
- [ ] 所有測試通過 `npm test`
- [ ] Build 成功 `npm run build`
- [ ] 遵循 [命名規範](./NAMING_CONVENTIONS.md)
- [ ] 遵循 [架構分層原則](./src/app/ARCHITECTURE.md)
- [ ] 遵循 [依賴規則](./DEPENDENCY_RULES.md)
- [ ] 有適當的測試覆蓋
- [ ] Commit message 符合 [Conventional Commits](https://www.conventionalcommits.org/) 規範
- [ ] PR 使用了 [PR 模板](./.github/pull_request_template.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the [Git Workflow](./GIT_WORKFLOW.md)
4. Follow the [Coding Standards](./CODING_STANDARDS.md)
5. Write tests following [Testing Standards](./TESTING_STANDARDS.md)
6. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request using the [PR template](./.github/pull_request_template.md)

## 📖 Project Structure

```
src/app/
├── core/
│   ├── domain/         # Domain layer - Business logic core
│   ├── application/    # Application layer - Use cases (CQRS)
│   └── infrastructure/ # Infrastructure layer - Technical implementations
├── features/           # Presentation layer - UI implementation
├── shared/             # Shared modules - Cross-feature components
└── layouts/            # Layout modules - Overall page structure
```

詳細架構說明請參考 [ARCHITECTURE.md](./src/app/ARCHITECTURE.md)。

## 🔧 Technology Stack

- **Framework**: Angular 20.1.x
- **Language**: TypeScript 5.8.x
- **SSR**: @angular/ssr + Express
- **Database**: Supabase (PostgreSQL)
- **UI**: Angular Material / CDK
- **State Management**: NgRx Signal Store / RxJS
- **Testing**: Karma + Jasmine
- **Code Quality**: ESLint + Prettier
- **Architecture**: DDD + Clean Architecture + CQRS

## 📚 Learning Resources

### Internal Docs
- [Coding Standards](./CODING_STANDARDS.md)
- [Architecture Guide](./src/app/ARCHITECTURE.md)
- [Git Workflow](./GIT_WORKFLOW.md)

### External Resources
- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Supabase Documentation](https://supabase.com/docs)

## 📝 License

This project is private and proprietary.

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
