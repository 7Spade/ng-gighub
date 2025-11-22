# Prompt Examples for Copilot

Example prompts and expected responses for working with GitHub Copilot in the ng-gighub project.

## Component Generation

### Prompt
```
Create a new Angular standalone component called UserCard that displays user profile information.
The component should:
- Accept a User object as input
- Display user name, email, and avatar
- Use Angular Material Card component
- Follow OnPush change detection strategy
- Include unit tests
```

### Expected Response
Copilot should generate:
- `user-card.component.ts` with standalone component
- `user-card.component.html` template
- `user-card.component.scss` styles
- `user-card.component.spec.ts` with basic tests
- Proper imports and decorators
- OnPush change detection configured

## Service Creation

### Prompt
```
Create a UserService that:
- Fetches user data from Supabase
- Implements CRUD operations (create, read, update, delete)
- Uses RxJS Observables
- Includes proper error handling
- Has TypeScript interfaces for User type
- Includes unit tests with HttpTestingController
```

### Expected Response
Copilot should generate:
- Service with Supabase client injection
- Typed Observable methods
- Error handling with catchError
- User interface definition
- Comprehensive unit tests

## Testing

### Prompt
```
Write unit tests for the AuthService login method that:
- Tests successful login with valid credentials
- Tests failed login with invalid credentials
- Tests network errors
- Mocks the Supabase auth client
- Uses fakeAsync and tick for async testing
```

### Expected Response
Complete test suite with:
- Proper test setup and teardown
- Mocked dependencies
- Assertions for success and error cases
- Async handling

## Refactoring

### Prompt
```
Refactor this component to use OnPush change detection and async pipe:
[paste component code]

Ensure:
- Observables are used instead of subscriptions
- Template uses async pipe
- Change detection is OnPush
- No memory leaks
```

### Expected Response
- Refactored component with OnPush
- Template using async pipe
- Observables properly chained
- No manual subscriptions in component

## Bug Fixing

### Prompt
```
This component has a memory leak due to unmanaged subscriptions.
Fix it by:
- Using async pipe where possible
- Implementing OnDestroy for manual subscriptions
- Using takeUntil pattern for cleanup
```

### Expected Response
- Identified subscriptions
- Implementation of cleanup strategy
- Updated template to use async pipe
- OnDestroy lifecycle hook if needed

## Supabase Integration

### Prompt
```
Create a StorageService that wraps Supabase Storage and:
- Uploads files to a specific bucket
- Downloads files with signed URLs
- Lists files in a bucket
- Deletes files
- Handles errors appropriately
- Works with SSR (checks platform)
- Includes comprehensive tests
```

### Expected Response
- Service with Supabase storage methods
- Platform checks for SSR compatibility
- Error handling
- TypeScript types for responses
- Unit tests with mocked Supabase client

## Form Handling

### Prompt
```
Create a reactive form for user registration with:
- Email field (required, valid email)
- Password field (required, min 8 characters)
- Confirm password (must match password)
- Custom validator for password match
- Display validation errors in template
- Submit handler with loading state
```

### Expected Response
- FormGroup with validators
- Custom password match validator
- Template with validation messages
- Disabled submit button logic
- Loading state management

## Routing

### Prompt
```
Set up routing for the following routes:
- /home (public)
- /dashboard (requires authentication)
- /profile/:id (requires authentication)
- /login (redirects if authenticated)

Include:
- Route guards for authentication
- Lazy loading for dashboard and profile
- Route parameters handling
```

### Expected Response
- Route configuration with guards
- Lazy loading implementation
- Auth guard service
- Redirect logic

## Best Practices Examples

### Following Core Rules

**Prompt:**
```
Review this code and suggest improvements following project standards:
[paste code]

Focus on:
- TypeScript strict types
- Angular best practices
- Observable patterns
- OnPush change detection
```

**Expected Response:**
- Specific suggestions with explanations
- Code examples showing improvements
- References to style guide sections
- Test recommendations

### Security-Focused Prompt

**Prompt:**
```
Review this authentication code for security issues:
[paste code]

Check for:
- Secret exposure
- Input validation
- XSS vulnerabilities
- Proper error handling
```

**Expected Response:**
- Security concerns identified
- Specific fixes with code examples
- References to security guidelines
- Testing recommendations

## Tips for Effective Prompts

### Be Specific
```
// Vague
"Create a user component"

// Specific
"Create a UserProfile standalone component that displays user details (name, email, avatar) from a User input property, uses OnPush change detection, and includes unit tests"
```

### Reference Project Standards
```
"Following the project's style guide and Angular best practices, create..."
```

### Include Testing Requirements
```
"...and include comprehensive unit tests with at least 80% coverage"
```

### Specify Dependencies
```
"Use Angular Material components and Supabase client for data fetching"
```

### Request SSR Compatibility
```
"Ensure SSR compatibility by checking platform before using browser APIs"
```

## Common Scenarios

### Scenario 1: New Feature
```
I need to add a comments feature. Create:
1. Comment model interface
2. CommentService with CRUD operations using Supabase
3. CommentListComponent to display comments
4. CommentFormComponent for adding/editing
5. Integration tests

Follow project structure and standards.
```

### Scenario 2: Bug Fix
```
Users report that the profile page doesn't update after editing.
Investigate and fix:
- Check change detection strategy
- Verify Observable chains
- Ensure proper state management
- Add tests to prevent regression
```

### Scenario 3: Performance Optimization
```
The user list page is slow with 1000+ items.
Optimize by:
- Implementing virtual scrolling
- Using OnPush change detection
- Lazy loading user avatars
- Adding pagination or infinite scroll
- Profiling before and after
```

### Scenario 4: Migration
```
Migrate this component from using NgModules to standalone:
[paste component code]

Ensure:
- All imports are correct
- Tests still pass
- No breaking changes to consumers
```

## Anti-Patterns to Avoid

### Don't Ask For
```
// Too vague
"Make it better"

// No context
"Fix this bug" [without code]

// Violates standards
"Add this API key to the code: sk_live_..."

// Missing requirements
"Create a form" [without specifying fields, validation, etc.]
```

## Resources

- Always reference `.github/copilot-instructions.md` for core rules
- Check relevant detailed guides in `./copilot-instructions/`
- Review existing code for patterns and conventions
- Run lint and tests before finalizing changes
