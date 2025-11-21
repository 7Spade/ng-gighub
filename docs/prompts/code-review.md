# AI Agent Code Review Prompts

## Overview
This document contains prompt templates for AI agents to perform effective code reviews, ensuring quality, security, and maintainability.

## Review Objectives

### Primary Goals
1. Identify bugs and logical errors
2. Ensure code quality and maintainability
3. Verify security best practices
4. Check performance implications
5. Validate testing coverage
6. Ensure documentation adequacy

## Prompt Templates

### Template 1: Comprehensive Code Review

```
You are an expert code reviewer for an Angular TypeScript project.

CODE TO REVIEW:
{code_diff}

CONTEXT:
- Purpose: {purpose}
- Related Files: {related_files}
- Project: ng-gighub (Angular 20 application)

Please review this code for:
1. Correctness and logic errors
2. Potential bugs and edge cases
3. Security vulnerabilities
4. Performance issues
5. Code quality and maintainability
6. Angular best practices
7. TypeScript type safety
8. Testing coverage
9. Documentation needs

For each issue found, provide:
- Severity: [CRITICAL/HIGH/MEDIUM/LOW/INFO]
- Category: [BUG/SECURITY/PERFORMANCE/QUALITY/STYLE]
- Location: Line number(s)
- Description: What's wrong
- Recommendation: How to fix
- Example: Code snippet showing the fix (if applicable)

Also provide:
- Summary of overall code quality
- Positive feedback on good practices
- Suggestions for improvement
```

### Template 2: Security-Focused Review

```
You are a security specialist reviewing code for vulnerabilities.

CODE:
{code_to_review}

CONTEXT:
- Component Type: {component_type}
- Handles User Input: {yes/no}
- Makes API Calls: {yes/no}
- Accesses Sensitive Data: {yes/no}

Check for these security issues:
1. XSS vulnerabilities (Cross-Site Scripting)
2. Injection attacks (SQL, Command, etc.)
3. Authentication/Authorization issues
4. Data exposure (sensitive data in logs, errors)
5. Insecure dependencies
6. Hardcoded credentials or secrets
7. Insecure data storage
8. Missing input validation
9. Insufficient error handling
10. CORS misconfigurations

For each finding:
- Severity: [CRITICAL/HIGH/MEDIUM/LOW]
- Vulnerability Type
- Attack Vector
- Potential Impact
- Remediation Steps
- Secure Code Example

Rate overall security posture: [SECURE/NEEDS_IMPROVEMENT/VULNERABLE]
```

### Template 3: Performance Review

```
You are a performance optimization expert reviewing code.

CODE:
{code_to_review}

CONTEXT:
- Component Type: {component_type}
- Expected Load: {load_description}
- Performance Targets: {targets}

Analyze for:
1. Algorithm efficiency (time complexity)
2. Memory usage and potential leaks
3. Unnecessary computations
4. Network request optimization
5. Rendering performance
6. Bundle size impact
7. Database query efficiency (if applicable)
8. Caching opportunities

For each issue:
- Impact: [HIGH/MEDIUM/LOW]
- Current Performance: {description}
- Optimization Opportunity: {description}
- Expected Improvement: {estimate}
- Implementation Effort: [SIMPLE/MODERATE/COMPLEX]
- Recommended Solution with code example

Provide performance score: [EXCELLENT/GOOD/NEEDS_OPTIMIZATION/POOR]
```

### Template 4: Angular-Specific Review

```
You are an Angular expert reviewing Angular-specific code patterns.

CODE:
{angular_code}

COMPONENT TYPE: {component/service/directive/pipe/module}

Review for Angular best practices:

1. Component Design
   - Single responsibility principle
   - Smart vs presentational components
   - Component size and complexity
   - Input/Output usage

2. Change Detection
   - OnPush strategy usage
   - Unnecessary change detection triggers
   - Proper use of ChangeDetectorRef

3. RxJS and Observables
   - Proper subscription management
   - Memory leak prevention
   - Operator usage
   - Error handling

4. Dependency Injection
   - Proper service scoping
   - providedIn usage
   - Circular dependencies

5. Template Best Practices
   - Structural directives usage
   - Pipe usage vs component methods
   - Event binding
   - Template reference variables

6. Lifecycle Hooks
   - Proper hook usage
   - Cleanup in ngOnDestroy
   - Initialization logic

For each finding provide:
- Pattern Issue
- Current Code
- Recommended Approach
- Reasoning
- Example Fix

Rate Angular code quality: [EXCELLENT/GOOD/ACCEPTABLE/NEEDS_WORK]
```

### Template 5: Test Coverage Review

```
You are a testing expert reviewing test coverage and quality.

CODE UNDER TEST:
{source_code}

EXISTING TESTS:
{test_code}

Evaluate:
1. Test Coverage
   - Line coverage percentage
   - Branch coverage
   - Edge cases covered
   - Error paths tested

2. Test Quality
   - Test clarity and naming
   - AAA pattern (Arrange, Act, Assert)
   - Test independence
   - Mock usage appropriateness
   - Assertion quality

3. Missing Tests
   - Untested scenarios
   - Edge cases not covered
   - Error conditions not tested
   - Integration points not tested

4. Test Maintainability
   - Test code duplication
   - Test setup complexity
   - Test data management
   - Test documentation

Provide:
- Coverage Assessment: [COMPREHENSIVE/ADEQUATE/INSUFFICIENT/MISSING]
- Missing Test Cases: List specific scenarios
- Test Quality Issues: List problems with existing tests
- Recommended Test Additions: Specific test cases to add
- Example Test Implementation for key missing cases
```

## Example Review Outputs

### Example 1: Component Review

**Code Submitted**:
```typescript
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
    });
  }
}
```

**AI Review Output**:
```markdown
## Code Review Summary
Overall Quality: NEEDS_IMPROVEMENT
Issues Found: 4 (1 High, 2 Medium, 1 Low)

---

### Issue 1: Memory Leak - Unsubscribed Observable
**Severity**: HIGH
**Category**: BUG
**Location**: Lines 10-12

**Problem**: 
The subscription in ngOnInit is never unsubscribed, causing a memory leak.

**Recommendation**: 
Use takeUntil pattern with a destroy subject.

**Fixed Code**:
```typescript
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

### Issue 2: Missing Error Handling
**Severity**: MEDIUM
**Category**: QUALITY
**Location**: Lines 10-12, 15-18

**Problem**: 
No error handling for failed API calls. Users won't see errors.

**Recommendation**: 
Add error handling to show user-friendly messages.

**Fixed Code**:
```typescript
ngOnInit() {
  this.userService.getUsers()
    .pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Failed to load users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        return of([]);
      })
    )
    .subscribe(users => {
      this.users = users;
    });
}
```

---

### Issue 3: Type Safety - Undefined Array
**Severity**: MEDIUM
**Category**: BUG
**Location**: Line 7

**Problem**: 
`users` is declared but not initialized, could cause runtime errors.

**Recommendation**: 
Initialize as empty array.

**Fixed Code**:
```typescript
users: User[] = [];
```

---

### Issue 4: Missing Change Detection Strategy
**Severity**: LOW
**Category**: PERFORMANCE
**Location**: Component decorator

**Problem**: 
Not using OnPush change detection strategy for better performance.

**Recommendation**: 
Add OnPush change detection since component only updates on explicit changes.

**Fixed Code**:
```typescript
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

---

## Positive Observations
✅ Good use of dependency injection
✅ Appropriate use of observables
✅ Clear method naming

## Additional Suggestions
1. Consider adding loading state to show spinner during API calls
2. Add confirmation dialog before deleting user
3. Consider implementing optimistic updates for better UX
4. Add unit tests for component logic
```

### Example 2: Security Review

**Code Submitted**:
```typescript
export class CommentComponent {
  @Input() comment: string;
  
  get formattedComment(): string {
    return this.comment.replace(/\n/g, '<br>');
  }
}
```

**AI Security Review**:
```markdown
## Security Review

**Overall Security Rating**: VULNERABLE

---

### CRITICAL: XSS Vulnerability
**Severity**: CRITICAL
**Type**: Cross-Site Scripting (XSS)
**Location**: formattedComment getter

**Vulnerability**:
The component returns raw HTML with user content, which is vulnerable to XSS attacks if the template uses innerHTML or [innerHTML] binding.

**Attack Vector**:
An attacker could inject malicious script:
```javascript
comment = "Hello<script>alert('XSS')</script>World"
```

**Impact**:
- Arbitrary JavaScript execution
- Session hijacking
- Data theft
- Malicious redirects

**Remediation**:

**Option 1**: Use Angular's built-in sanitization
```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class CommentComponent {
  @Input() comment: string;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  get formattedComment(): SafeHtml {
    const withBreaks = this.comment.replace(/\n/g, '<br>');
    return this.sanitizer.sanitize(SecurityContext.HTML, withBreaks) || '';
  }
}
```

**Option 2**: Use CSS for line breaks (RECOMMENDED)
```typescript
// Component
export class CommentComponent {
  @Input() comment: string;
}

// Template
<div class="comment-text">{{ comment }}</div>

// CSS
.comment-text {
  white-space: pre-wrap;
}
```

**Testing**:
Add security test to verify XSS protection:
```typescript
it('should sanitize malicious content', () => {
  component.comment = '<script>alert("xss")</script>';
  expect(component.formattedComment).not.toContain('<script>');
});
```

---

## Recommendations
1. ✅ Implement Option 2 (CSS approach) - simplest and safest
2. ✅ Add Content Security Policy headers
3. ✅ Review all user input handling in application
4. ✅ Add automated security testing
```

## Review Quality Guidelines

### Effective Reviews Include
1. **Specific Location**: Line numbers or code sections
2. **Clear Description**: What's wrong and why
3. **Severity Assessment**: How critical is the issue
4. **Actionable Feedback**: How to fix it
5. **Code Examples**: Show the correct way
6. **Positive Feedback**: Recognize good practices

### Review Tone
- Professional and constructive
- Educational, not condescending
- Focus on code, not person
- Explain reasoning
- Offer alternatives

### Prioritization
1. **CRITICAL**: Security vulnerabilities, data loss risks
2. **HIGH**: Bugs, memory leaks, major performance issues
3. **MEDIUM**: Code quality, maintainability, minor bugs
4. **LOW**: Style issues, suggestions, optimizations
5. **INFO**: Educational notes, best practices

## Integration Instructions

### Using AI Review in CI/CD

```yaml
# Example GitHub Actions workflow
name: AI Code Review

on: [pull_request]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run AI Code Review
        run: |
          # Pass diff to AI review prompt
          git diff origin/main...HEAD > changes.diff
          # Call AI service with review prompt
          ai-review --prompt review-template.md --code changes.diff
```

### Review Checklist Integration

```markdown
## Code Review Checklist
- [ ] No security vulnerabilities
- [ ] No memory leaks
- [ ] Error handling present
- [ ] Tests included
- [ ] Documentation updated
- [ ] Performance acceptable
- [ ] Follows style guide
- [ ] No breaking changes
```

## Best Practices for AI-Assisted Reviews

### Do
- ✅ Use AI for initial pass, human for final review
- ✅ Focus AI on specific areas (security, performance)
- ✅ Validate AI findings before commenting
- ✅ Use AI to learn and improve skills
- ✅ Combine AI feedback with human judgment

### Don't
- ❌ Blindly trust all AI suggestions
- ❌ Replace human code review entirely
- ❌ Ignore context AI might miss
- ❌ Use AI feedback without understanding
- ❌ Skip manual testing of critical paths

## Metrics and Improvement

### Track
- Issues found by AI vs missed
- False positive rate
- Time saved in review process
- Developer satisfaction with AI feedback
- Bug escape rate to production

### Improve
- Refine prompts based on feedback
- Add domain-specific rules
- Update with new best practices
- Train AI on project-specific patterns

## References
- OWASP Top 10 Security Risks
- Angular Security Guide
- Google TypeScript Style Guide
- Code Review Best Practices
- Static Analysis Tools Comparison
