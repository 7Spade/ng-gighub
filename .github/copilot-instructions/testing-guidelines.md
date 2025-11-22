# Testing Guidelines

Comprehensive testing strategy and best practices for the ng-gighub Angular project.

## Testing Philosophy

- Write tests that provide value and catch real bugs
- Aim for meaningful coverage over raw percentage targets (70%+ recommended)
- Test behavior, not implementation details
- Keep tests maintainable and readable

## Testing Stack

- **Framework**: Jasmine
- **Runner**: Karma
- **Browser**: Chrome (via karma-chrome-launcher)
- **E2E**: (To be configured as needed)

## Unit Testing

### Component Testing

```typescript
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent], // for standalone components
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display user name', () => {
    component.user = { name: 'John Doe' };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-name')?.textContent).toContain('John Doe');
  });
});
```

### Service Testing

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
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch user by id', () => {
    const mockUser = { id: '1', name: 'John' };
    
    service.getUserById('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    
    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
```

## Test Organization

### File Structure
- Test files co-located with source: `feature.component.spec.ts`
- Test helpers in `src/testing/` directory
- Mock data in separate files if reused

### Test Suites
Use `describe` blocks to group related tests:

```typescript
describe('AuthService', () => {
  describe('login', () => {
    it('should authenticate valid credentials', () => {});
    it('should reject invalid credentials', () => {});
  });
  
  describe('logout', () => {
    it('should clear user session', () => {});
  });
});
```

## What to Test

### Components
- Public methods and properties
- User interactions (clicks, inputs)
- Conditional rendering
- Data binding
- Component lifecycle hooks (if they contain logic)

### Services
- Public API methods
- HTTP requests and responses
- Error handling
- State management
- Business logic

### Pipes
- Transformation logic
- Edge cases and null handling
- Different input types

### Guards
- Route protection logic
- Authentication/authorization checks
- Redirect behavior

## Testing Best Practices

### Use Descriptive Test Names
```typescript
// Good
it('should display error message when login fails', () => {});

// Bad
it('should work', () => {});
```

### Arrange-Act-Assert Pattern
```typescript
it('should calculate total price', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = service.calculateTotal(items);
  
  // Assert
  expect(total).toBe(30);
});
```

### Mock External Dependencies
```typescript
const mockUserService = {
  getUser: jasmine.createSpy('getUser').and.returnValue(of({ id: '1' }))
};

TestBed.configureTestingModule({
  providers: [
    { provide: UserService, useValue: mockUserService }
  ]
});
```

### Test Edge Cases
- Null/undefined inputs
- Empty arrays/objects
- Boundary values
- Error conditions

### Avoid Test Interdependence
- Each test should be independent
- Use `beforeEach` for common setup
- Don't rely on test execution order

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
ng test --include='**/user.service.spec.ts'
```

## Coverage Requirements

- **Minimum**: 70% overall coverage
- **Target**: 80%+ for critical business logic
- **Focus**: Statement and branch coverage
- Coverage reports generated in `coverage/` directory

### Checking Coverage
```bash
npm run test:coverage
open coverage/index.html
```

## SSR Testing Considerations

When testing SSR-compatible code:
- Mock browser-only APIs (window, document, localStorage)
- Use `isPlatformBrowser()` checks
- Test both browser and server contexts where applicable

```typescript
it('should handle server-side rendering', () => {
  // Mock platform
  const platformId = 'server';
  
  // Test SSR-safe behavior
  expect(() => component.ngOnInit()).not.toThrow();
});
```

## E2E Testing (Future)

When implementing E2E tests:
- Focus on critical user journeys
- Test real user workflows
- Keep E2E tests separate from unit tests
- Run E2E tests in CI pipeline

## Continuous Integration

All tests must pass before merging:
- Pre-commit: Run affected tests
- Pre-push: Run full test suite
- PR: Automated test run in CI
- Merge: Requires passing tests

## Common Testing Patterns

### Testing Observables
```typescript
it('should emit values', (done) => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
    done();
  });
});

// Or use marble testing for complex scenarios
```

### Testing Form Validation
```typescript
it('should validate email format', () => {
  const emailControl = component.form.get('email');
  
  emailControl?.setValue('invalid-email');
  expect(emailControl?.hasError('email')).toBeTruthy();
  
  emailControl?.setValue('valid@email.com');
  expect(emailControl?.valid).toBeTruthy();
});
```

### Testing Async Operations
```typescript
it('should load data on init', fakeAsync(() => {
  component.ngOnInit();
  tick();
  
  expect(component.data).toBeDefined();
  expect(component.loading).toBeFalse();
}));
```

## Resources

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Testing Best Practices](https://angular.dev/guide/testing/best-practices)
