# Code Review Guidelines

## Overview
This document provides comprehensive guidelines for conducting effective code reviews in the ng-gighub project. Code reviews are essential for maintaining code quality, sharing knowledge, and catching issues early.

## Goals of Code Review

### Primary Goals
1. **Ensure Code Quality**: Verify code meets project standards
2. **Catch Bugs Early**: Identify potential issues before production
3. **Knowledge Sharing**: Spread understanding across the team
4. **Maintain Consistency**: Ensure codebase remains cohesive
5. **Improve Skills**: Help developers learn and grow

### Secondary Benefits
- Foster collaboration and communication
- Build shared ownership of code
- Document decisions and rationale
- Reduce technical debt

## Review Process

### For Authors (Submitting Code for Review)

#### Before Creating a PR

1. **Self-Review First**
   - Review your own changes thoroughly
   - Check for commented-out code or debug statements
   - Ensure all tests pass
   - Run linter and fix all issues

2. **Keep PRs Focused**
   - One feature or fix per PR
   - Aim for < 400 lines of changes
   - Split large changes into smaller PRs
   - Avoid mixing refactoring with feature work

3. **Write Clear PR Description**
   ```markdown
   ## What
   Brief description of changes
   
   ## Why
   Reason for the changes
   
   ## How
   High-level implementation approach
   
   ## Testing
   How changes were tested
   
   ## Screenshots
   Visual changes (if applicable)
   ```

4. **Prepare Context**
   - Link related issues or tickets
   - Explain non-obvious decisions
   - Highlight areas needing special attention
   - Note any breaking changes

#### During Review

1. **Respond Promptly**
   - Address feedback within 24 hours
   - Ask clarifying questions
   - Mark resolved conversations

2. **Be Open to Feedback**
   - Don't take criticism personally
   - Consider all suggestions carefully
   - Explain your reasoning when disagreeing
   - Thank reviewers for their time

3. **Make Requested Changes**
   - Fix issues in new commits (don't force push during review)
   - Explain what you changed
   - Request re-review after major changes

#### After Approval

1. **Merge Responsibly**
   - Ensure CI passes
   - Squash commits if needed
   - Use descriptive merge commit message
   - Delete branch after merge

### For Reviewers

#### Before Starting Review

1. **Understand the Context**
   - Read PR description thoroughly
   - Review linked issues or tickets
   - Understand the business requirements
   - Check acceptance criteria

2. **Verify Prerequisites**
   ```
   ✓ CI/CD checks passing
   ✓ Tests included and passing
   ✓ No merge conflicts
   ✓ Branch up-to-date with target
   ```

#### During Review

1. **Start with the Big Picture**
   - Does the solution make sense?
   - Is the approach appropriate?
   - Are there architectural concerns?
   - Could it be simpler?

2. **Then Review Details**
   - Code correctness
   - Edge cases handled
   - Error handling
   - Performance implications
   - Security considerations

3. **Check Testing**
   - Tests cover new code
   - Tests are meaningful
   - Edge cases tested
   - Error paths tested

4. **Review Documentation**
   - Code comments where needed
   - API documentation updated
   - README updated if needed
   - Breaking changes documented

#### Providing Feedback

1. **Be Constructive and Respectful**
   ```
   ❌ "This code is terrible"
   ✅ "Consider using a more descriptive variable name here"
   
   ❌ "You don't know what you're doing"
   ✅ "This approach might cause issues because..."
   ```

2. **Explain Your Reasoning**
   ```
   ❌ "Change this"
   ✅ "This could cause a memory leak because the subscription 
       isn't cleaned up. Consider using takeUntil() here."
   ```

3. **Offer Alternatives**
   ```
   ✅ "Instead of nested if statements, consider using 
       early returns to reduce complexity"
   ```

4. **Use the Right Tone**
   - Ask questions: "Could we use X here instead?"
   - Make suggestions: "Consider extracting this into a helper function"
   - Share knowledge: "FYI: Array.includes() is more performant here"

5. **Categorize Feedback**
   - **Blocking**: Must be fixed before merge
   - **Non-blocking**: Nice to have, not critical
   - **Question**: Seeking clarification
   - **Suggestion**: Optional improvement
   - **Nitpick**: Minor style/preference

#### Types of Comments

##### Blocking Issues
```
🚫 BLOCKING: This will cause a null pointer exception 
when user is not logged in. Add null check.
```

##### Security Concerns
```
⚠️ SECURITY: User input is not sanitized here. 
This could lead to XSS vulnerability.
```

##### Performance Issues
```
⚡ PERFORMANCE: This query will cause N+1 problem. 
Consider eager loading or batch fetching.
```

##### Suggestions
```
💡 SUGGESTION: Consider using the builder pattern 
here for better readability.
```

##### Questions
```
❓ QUESTION: Why did we choose this approach over X?
Just trying to understand the reasoning.
```

##### Praise
```
👍 NICE: Great use of the strategy pattern here!
Very clean and extensible.
```

## Review Checklist

### Code Quality
- [ ] Code is readable and maintainable
- [ ] Follows project style guidelines
- [ ] No code duplication
- [ ] Functions are single-purpose and well-named
- [ ] Appropriate use of design patterns
- [ ] No over-engineering or premature optimization

### Correctness
- [ ] Logic is correct and handles edge cases
- [ ] No obvious bugs
- [ ] Proper error handling
- [ ] Null/undefined checks where needed
- [ ] Type safety maintained (TypeScript)

### Testing
- [ ] Unit tests included for new code
- [ ] Tests are meaningful and comprehensive
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Edge cases are tested
- [ ] All tests pass

### Performance
- [ ] No unnecessary computations
- [ ] Efficient data structures used
- [ ] No memory leaks (subscriptions cleaned up)
- [ ] Large lists handled efficiently
- [ ] API calls optimized

### Security
- [ ] Input validation present
- [ ] Output sanitized
- [ ] Authentication/authorization checked
- [ ] No sensitive data in logs
- [ ] Dependencies are secure

### Angular-Specific
- [ ] Change detection strategy appropriate
- [ ] Lifecycle hooks used correctly
- [ ] Observables unsubscribed properly
- [ ] Components are reasonably sized
- [ ] Services are stateless or manage state correctly
- [ ] Templates are not overly complex

### Documentation
- [ ] Complex logic is commented
- [ ] Public APIs are documented
- [ ] README updated if needed
- [ ] Breaking changes documented

### User Experience
- [ ] UI is responsive
- [ ] Loading states handled
- [ ] Error messages are user-friendly
- [ ] Accessibility considered

## Common Issues to Look For

### Angular-Specific Issues

#### Memory Leaks
```typescript
// ❌ Bad: Subscription not cleaned up
ngOnInit() {
  this.userService.getUser().subscribe(user => {
    this.user = user;
  });
}

// ✅ Good: Using takeUntil
private destroy$ = new Subject<void>();

ngOnInit() {
  this.userService.getUser()
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => this.user = user);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

#### Change Detection
```typescript
// ❌ Bad: Calling function in template
<div>{{ calculateTotal() }}</div>

// ✅ Good: Use computed property
export class Component {
  get total(): number {
    return this.calculateTotal();
  }
}

<div>{{ total }}</div>
```

### General Issues

#### Error Handling
```typescript
// ❌ Bad: Silent failure
try {
  await api.call();
} catch (e) {
  // ignored
}

// ✅ Good: Proper error handling
try {
  await api.call();
} catch (error) {
  console.error('API call failed:', error);
  this.showErrorMessage('Failed to load data');
  throw error;
}
```

#### Null Safety
```typescript
// ❌ Bad: No null check
function getUserName(user: User): string {
  return user.name.toUpperCase();
}

// ✅ Good: With null checks
function getUserName(user: User | null): string {
  return user?.name?.toUpperCase() ?? 'Unknown';
}
```

## Review Turnaround Time

### Expected Response Times
- **Initial review**: Within 24 hours of PR creation
- **Re-review**: Within 24 hours of updates
- **Urgent fixes**: Within 4 hours (if marked as urgent)

### Priority Guidelines
1. **Critical**: Security fixes, production bugs
2. **High**: Blocking other work, releases
3. **Medium**: Regular features
4. **Low**: Documentation, minor improvements

## Review Size Guidelines

### Optimal PR Sizes
- **Small (< 100 lines)**: Quick review, prefer these
- **Medium (100-400 lines)**: Normal review
- **Large (400-1000 lines)**: Break into smaller PRs if possible
- **Extra Large (> 1000 lines)**: Should be exceptional cases only

### Handling Large PRs
- Request author to split into smaller PRs
- Review in multiple sessions
- Focus on high-risk areas first
- Consider pair programming review

## Conflict Resolution

### When You Disagree

#### As an Author
1. Ask for clarification
2. Explain your reasoning
3. Be willing to compromise
4. Escalate to team lead if needed

#### As a Reviewer
1. Explain your concerns clearly
2. Be open to discussion
3. Know when to let go of minor issues
4. Focus on what matters most

### Decision Framework
1. **Security/Correctness**: Non-negotiable
2. **Performance**: Important, discuss trade-offs
3. **Maintainability**: Important for long-term
4. **Style/Preference**: Follow team standards, otherwise flexible

## Automated Reviews

### Tools to Use
- **ESLint**: Style and code quality
- **Prettier**: Code formatting
- **SonarQube**: Code quality metrics
- **npm audit**: Security vulnerabilities
- **Tests**: Functional correctness

### Human vs Automated
- Humans: Architecture, logic, context
- Automation: Style, formatting, basic checks
- Both: Security, performance, best practices

## Review Metrics

### What to Track
- Average time to first review
- Average time to merge
- Number of comments per PR
- Approval rate
- Revert rate

### Using Metrics
- Identify bottlenecks
- Improve process
- Balance speed and quality
- Don't use for individual performance evaluation

## Best Practices

### For Everyone

1. **Be Kind and Professional**
   - Remember there's a person behind the code
   - Assume positive intent
   - Criticize code, not people

2. **Focus on What Matters**
   - Security and correctness first
   - Performance and maintainability second
   - Style and preferences last

3. **Learn Continuously**
   - Every review is a learning opportunity
   - Share knowledge generously
   - Be open to learning from others

4. **Balance Speed and Quality**
   - Don't let perfect be the enemy of good
   - Know when to approve with minor comments
   - Know when to request changes

5. **Document Important Decisions**
   - Explain non-obvious choices in comments
   - Link to relevant documentation
   - Leave breadcrumbs for future maintainers

## Examples

### Good Review Comments

```
✅ Good feedback examples:

"Great use of the Observable pattern here! One suggestion: 
consider adding error handling for the case where the API 
returns 404. We've seen this cause issues in production."

"This works, but might be hard to maintain. What do you think 
about extracting the validation logic into a separate service? 
That would make it easier to test and reuse."

"Just FYI: There's a built-in Angular pipe for this use case 
(DecimalPipe). Not blocking, but might save some code."

"Thanks for adding those tests! Could we also add a test for 
the edge case where the user array is empty?"
```

### Poor Review Comments

```
❌ Poor feedback examples:

"This is wrong." 
// Not helpful, no context

"Why didn't you use React instead?"
// Not relevant, not constructive

"I would have done it differently."
// Need to explain why

"This violates SOLID principles."
// Too vague, need specific guidance
```

## References
- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/)
- [Microsoft Code Review Guide](https://docs.microsoft.com/en-us/azure/devops/repos/git/review-code)
- [Conventional Comments](https://conventionalcomments.org/)
- [How to Make Your Code Reviewer Fall in Love with You](https://mtlynch.io/code-review-love/)
