# GitHub Copilot Instructions for ng-gighub

## Project Overview
This is an Angular 20 application with Server-Side Rendering (SSR) support using Angular Universal and Express.

## Technology Stack
- **Framework**: Angular 20.1.0
- **Server**: Express 5.1.0
- **SSR**: Angular SSR (@angular/ssr)
- **Backend**: Supabase (Database, Authentication, Storage, Real-time)
- **Language**: TypeScript 5.8.2
- **Testing**: Karma + Jasmine
- **Build Tool**: Angular CLI 20.1.4

## Project Structure
- `src/app/` - Application components and modules
- `src/server.ts` - Express server configuration for SSR
- `src/main.ts` - Client-side bootstrap
- `src/main.server.ts` - Server-side bootstrap
- `public/` - Static assets
- `dist/` - Build output directory

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow Angular style guide
- Use standalone components (Angular 20 default)
- Prefer reactive programming with RxJS
- Use Prettier for HTML formatting (configured in package.json)

### Component Creation
- Use Angular CLI for scaffolding: `ng generate component component-name`
- Components should be standalone by default
- Use signal-based state management when applicable (Angular 20 feature)

### Server-Side Rendering
- The application supports SSR via Angular Universal
- Server logic is in `src/server.ts`
- Use transfer state for data that needs to be hydrated
- Be mindful of browser-only APIs (window, document, etc.)
- Check for platform (browser vs server) using `isPlatformBrowser` from `@angular/common`

### Scripts
- `npm start` - Start development server
- `npm run build` - Production build
- `npm run watch` - Development build with watch mode
- `npm test` - Run unit tests
- `npm run serve:ssr:ng-gighub` - Serve SSR build

### Testing
- Write unit tests for components, services, and pipes
- Use Karma + Jasmine testing framework
- Test files should be named `*.spec.ts`
- Ensure tests pass before committing

### Common Patterns
- Use dependency injection for services
- Implement OnInit, OnDestroy lifecycle hooks properly
- Unsubscribe from observables to prevent memory leaks
- Use async pipe in templates when possible
- Leverage Angular signals for reactive state

### Supabase Integration
- Use Supabase for backend services (database, authentication, storage, real-time)
- Initialize Supabase client in a service for dependency injection
- Handle authentication state with Supabase Auth
- Use Supabase Realtime for live data updates
- Store environment variables (API keys) in environment files
- Use Row Level Security (RLS) policies for data access control
- Leverage Supabase Storage for file uploads
- Use Supabase Edge Functions for server-side logic when needed

### SSR Considerations
When writing code that runs on both client and server:
- Avoid direct DOM manipulation
- Don't use browser-specific APIs without platform checks
- Use Angular's Renderer2 for DOM operations
- Be cautious with third-party libraries that rely on browser APIs
- Use transfer state to avoid duplicate HTTP requests

### File Naming Conventions
- Components: `component-name.ts`, `component-name.html`, `component-name.scss`
- Services: `service-name.service.ts`
- Pipes: `pipe-name.pipe.ts`
- Directives: `directive-name.directive.ts`
- Use kebab-case for file names

### Best Practices
- Keep components small and focused
- Separate business logic into services
- Use TypeScript interfaces for data models
- Implement proper error handling
- Use environment files for configuration
- Document complex logic with comments
- Optimize for Core Web Vitals when using SSR

## Additional Resources
- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
