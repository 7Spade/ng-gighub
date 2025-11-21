# Code Style Guide

## Overview
This document defines the coding standards and style guidelines for the ng-gighub project to ensure consistency and maintainability across the codebase.

## General Principles

### Core Values
1. **Consistency**: Follow established patterns and conventions
2. **Readability**: Write code that is easy to understand
3. **Maintainability**: Make code easy to modify and extend
4. **Simplicity**: Prefer simple solutions over complex ones
5. **Performance**: Write efficient code without premature optimization

## TypeScript/JavaScript Standards

### Naming Conventions

#### Variables and Functions
```typescript
// Use camelCase for variables and functions
const userName = 'John';
const calculateTotal = (items: Item[]): number => { };

// Use descriptive names
// Bad
const d = new Date();
const calc = (a, b) => a + b;

// Good
const currentDate = new Date();
const calculateSum = (firstNumber, secondNumber) => firstNumber + secondNumber;
```

#### Classes and Interfaces
```typescript
// Use PascalCase for classes and interfaces
class UserService { }
interface UserProfile { }

// Prefix interfaces with 'I' only if necessary for clarity
interface IUserRepository { } // Only when needed
```

#### Constants
```typescript
// Use UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
```

#### Private Members
```typescript
// Use underscore prefix for private members (optional)
class UserService {
  private _cache: Map<string, User>;
  
  private _validateUser(user: User): boolean { }
}
```

### Code Formatting

#### Indentation
- Use 2 spaces for indentation (not tabs)
- Configure your editor to use spaces

#### Line Length
- Maximum line length: 100 characters
- Break long lines at logical points

#### Semicolons
- Always use semicolons at the end of statements

#### Quotes
```typescript
// Prefer single quotes for strings
const message = 'Hello, world!';

// Use backticks for template literals
const greeting = `Hello, ${name}!`;
```

#### Spacing
```typescript
// Add spaces around operators
const sum = a + b;

// Add space after keywords
if (condition) { }
for (let i = 0; i < 10; i++) { }

// No space before function parentheses
function doSomething() { }
const arrow = () => { };
```

### Type Annotations

```typescript
// Always specify return types for functions
function getUserName(id: string): string {
  return 'John';
}

// Use explicit types for variables when type inference isn't clear
const count: number = 0;
const users: User[] = [];

// Prefer interfaces over type aliases for object shapes
interface User {
  id: string;
  name: string;
}

// Use type aliases for unions, intersections, and primitives
type Status = 'pending' | 'approved' | 'rejected';
```

### Error Handling

```typescript
// Use try-catch for async operations
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error(`User fetch failed: ${error.message}`);
  }
}

// Create custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Angular Standards

### Component Structure

```typescript
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // 1. Inputs
  @Input() userId!: string;
  
  // 2. Outputs
  @Output() userUpdated = new EventEmitter<User>();
  
  // 3. Public properties
  user?: User;
  
  // 4. Private properties
  private destroy$ = new Subject<void>();
  
  // 5. Constructor with dependency injection
  constructor(
    private userService: UserService,
    private router: Router
  ) { }
  
  // 6. Lifecycle hooks
  ngOnInit(): void {
    this.loadUser();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 7. Public methods
  updateUser(): void { }
  
  // 8. Private methods
  private loadUser(): void { }
}
```

### Component Naming
- Use kebab-case for selectors: `app-user-profile`
- Use PascalCase for class names: `UserProfileComponent`
- Suffix component classes with `Component`

### Service Structure

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = '/api/users';
  
  constructor(private http: HttpClient) { }
  
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
```

### Template Guidelines

```html
<!-- Use meaningful template reference variables -->
<input #usernameInput type="text">

<!-- Use async pipe for observables -->
<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>

<!-- Use trackBy for ngFor -->
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>

<!-- Keep templates simple, move logic to component -->
<!-- Bad -->
<div *ngIf="user && user.isActive && user.role === 'admin'">

<!-- Good -->
<div *ngIf="isAdminUser()">
```

### Style Guidelines

```scss
// Use BEM naming convention
.user-profile {
  &__header {
    // header styles
  }
  
  &__content {
    // content styles
  }
  
  &--compact {
    // modifier styles
  }
}

// Scope styles to component
:host {
  display: block;
}

// Use CSS variables for theming
.button {
  background-color: var(--primary-color);
  color: var(--text-color);
}
```

## Testing Standards

### Unit Tests

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch user by id', () => {
    const mockUser: User = { id: '1', name: 'John' };
    
    service.getUser('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    
    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
});
```

### Test Naming
- Use descriptive test names: `should fetch user by id`
- Follow AAA pattern: Arrange, Act, Assert

## Documentation

### Code Comments

```typescript
/**
 * Calculates the total price including tax and discount.
 * 
 * @param basePrice - The base price before calculations
 * @param taxRate - Tax rate as a decimal (e.g., 0.08 for 8%)
 * @param discount - Optional discount as a decimal
 * @returns The final calculated price
 */
function calculateTotal(
  basePrice: number,
  taxRate: number,
  discount: number = 0
): number {
  // Apply discount first
  const discountedPrice = basePrice * (1 - discount);
  
  // Then apply tax
  return discountedPrice * (1 + taxRate);
}
```

### JSDoc Comments
- Use JSDoc for public APIs
- Document parameters, return values, and exceptions
- Keep comments up-to-date with code changes

## Best Practices

### DRY (Don't Repeat Yourself)
- Extract common code into reusable functions/services
- Use composition over inheritance

### SOLID Principles
- **S**ingle Responsibility: Each class should have one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable for base types
- **I**nterface Segregation: Many specific interfaces over one general interface
- **D**ependency Inversion: Depend on abstractions, not concretions

### Performance
- Use OnPush change detection where possible
- Unsubscribe from observables in ngOnDestroy
- Use trackBy with ngFor
- Lazy load routes and modules

### Security
- Never trust user input
- Sanitize HTML content
- Use Angular's built-in XSS protection
- Validate data on both client and server

## Tools and Automation

### Prettier
Configure Prettier for automatic formatting:
```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

### ESLint
Use ESLint for code quality checks:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended"
  ]
}
```

## References
- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
