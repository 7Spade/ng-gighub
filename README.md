# ng-gighub

**Angular 20.1 + SSR + Supabase + DDD Architecture**

This project is an enterprise-grade Angular application built with Domain-Driven Design principles, Server-Side Rendering, and Supabase backend.

## 📚 Documentation

Complete documentation is available in the [docs/](./docs/) directory. See [docs/README.md](./docs/README.md) for the documentation index.

### Quick Links

- **[Development Standards](./docs/standards/)** - Coding conventions and best practices
  - [Code Style Guide](./docs/standards/code-style.md)
  - [Git Workflow](./docs/standards/git-workflow.md)
  - [Testing Standards](./docs/standards/testing-standards.md)
  - [Review Guidelines](./docs/standards/review-guidelines.md)
- **[Architecture](./docs/architecture/)** - System design and architecture
  - [System Overview](./docs/architecture/system-overview.md)
  - [Domain Model](./docs/architecture/DOMAIN_MODEL.md)
  - [Folder Structure](./docs/architecture/FOLDER_STRUCTURE.md)
- **[Setup Guides](./docs/setup/)** - Environment and service configuration
  - [Environment Setup](./docs/setup/environment.md)
  - [Supabase Setup](./docs/setup/supabase.md)
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to this project

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

### Development Server

```bash
npm start
# or
ng serve
```

The application will run on `http://localhost:4200/` and automatically reload when you modify source files.

## 🛠️ Development

### Code Generation

```bash
# Generate a new component
ng generate component component-name

# See all available schematics
ng generate --help
```

**Important**: Follow the [naming conventions](./docs/standards/naming-conventions.md) when creating new files.

### Code Quality

```bash
# Check code format
npm run format:check

# Auto-format code
npm run format

# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Run all checks (format + lint)
npm run check
```

## 🏗️ Building

```bash
# Build for production
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Server-Side Rendering

```bash
# Build the project first
npm run build

# Run SSR server
npm run serve:ssr:ng-gighub
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

For detailed testing guidelines, see [Testing Standards](./docs/standards/testing-standards.md).

## 📋 Code Review Checklist

Before submitting a Pull Request:

- [ ] Code passes `npm run check` (ESLint + Prettier)
- [ ] All tests pass with `npm test`
- [ ] Build succeeds with `npm run build`
- [ ] Follows [naming conventions](./docs/standards/naming-conventions.md)
- [ ] Follows [architecture principles](./docs/architecture/system-overview.md)
- [ ] Follows [dependency rules](./docs/standards/dependency-rules.md)
- [ ] Has appropriate test coverage
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] PR uses the [PR template](./.github/pull_request_template.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the [Git Workflow](./docs/standards/git-workflow.md)
4. Follow the [Coding Standards](./docs/standards/coding-standards.md)
5. Write tests following [Testing Standards](./docs/standards/testing-standards.md)
6. Commit changes following [Conventional Commits](https://www.conventionalcommits.org/)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request using the [PR template](./.github/pull_request_template.md)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

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

See [Architecture Documentation](./docs/architecture/) for detailed system design.

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

### Internal Documentation

- [System Architecture](./docs/architecture/system-overview.md)
- [Domain Model](./docs/architecture/DOMAIN_MODEL.md)
- [Development Standards](./docs/standards/)
- [Setup Guides](./docs/setup/)

### External Resources

- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Supabase Documentation](https://supabase.com/docs)

## 📝 License

This project is private and proprietary.

---

For more information, see the [complete documentation](./docs/README.md).
