# Coding Style Guide

This document defines coding style conventions for the ng-gighub Angular project.

## TypeScript Style

### General Principles
- Follow the [Angular Style Guide](https://angular.dev/style-guide)
- Use strict TypeScript settings (as configured in `tsconfig.json`)
- Prefer `const` over `let`; avoid `var`
- Use meaningful, descriptive names for variables, functions, and classes

### Type Usage
- **Prefer explicit types** over `any`
- If `any` is necessary, document why and consider `unknown` as an alternative
- Use TypeScript interfaces for data structures
- Leverage union types and type guards for type safety

### Naming Conventions
- **Classes**: PascalCase (e.g., `UserService`, `AuthGuard`)
- **Interfaces**: PascalCase with descriptive names (e.g., `UserProfile`, `ApiResponse`)
- **Variables/Functions**: camelCase (e.g., `getUserById`, `isAuthenticated`)
- **Constants**: UPPER_SNAKE_CASE for global constants (e.g., `API_BASE_URL`)
- **Private members**: Prefix with underscore optional, prefer TypeScript `private` keyword

## Angular Conventions

### Components
- **Prefix**: `app-` (configured in `angular.json`)
- **File naming**: `feature-name.component.ts`
- **Selector**: kebab-case (e.g., `app-user-profile`)
- Use standalone components where appropriate
- Keep components focused on presentation logic

### Services
- **Suffix**: `Service` (e.g., `UserService`, `AuthService`)
- Use Dependency Injection
- Keep business logic in services, not components
- Use RxJS Observables for asynchronous operations

### Change Detection
- Prefer `OnPush` change detection strategy for performance
- Use `async` pipe in templates to handle Observables
- Avoid manual change detection triggers unless necessary

## SCSS/Styling

### Structure
- Global styles: `src/styles.scss`
- Component styles: Co-located with components
- Use SCSS variables for colors, spacing, and typography

### Best Practices
- Keep component styles under 4KB (warning) / 8KB (error) as per build budgets
- Use Angular Material theming when applicable
- Follow BEM or similar methodology for class naming
- Avoid `!important` unless absolutely necessary

## Code Formatting

### Prettier Configuration
- HTML files use Angular parser (see `package.json`)
- Run `npm run format:check` before committing
- Auto-format on save (recommended in IDE)

### ESLint
- Run `npm run lint` before submitting PRs
- Fix all errors; warnings should be addressed or justified
- Follow configured ESLint rules strictly

## File Organization

### Project Structure
```
src/
  app/
    core/          # Singleton services, guards, interceptors
    shared/        # Shared components, directives, pipes
    features/      # Feature modules
      feature-name/
        components/
        services/
        models/
```

### Import Order
1. Angular core imports
2. Angular common imports
3. Third-party libraries
4. Application imports (relative)

## Comments and Documentation

### When to Comment
- Complex algorithms or business logic
- Non-obvious workarounds
- Public API methods (JSDoc)
- TODO/FIXME with issue number

### JSDoc for Public APIs
```typescript
/**
 * Retrieves user profile by ID
 * @param userId - The unique identifier for the user
 * @returns Observable of UserProfile
 * @throws {Error} If user is not found
 */
getUserProfile(userId: string): Observable<UserProfile> {
  // implementation
}
```

## Best Practices

### Performance
- Lazy load feature modules
- Use trackBy with *ngFor
- Avoid expensive computations in templates
- Unsubscribe from Observables (or use async pipe)

### Security
- Never commit API keys or secrets
- Use environment variables for configuration
- Sanitize user input
- Follow OWASP guidelines

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
