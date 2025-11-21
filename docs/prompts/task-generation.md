# AI Agent Task Generation Prompts

## Overview
This document contains prompt templates for AI agents to generate development tasks and break down complex requirements into actionable items.

## Core Principles

### Task Generation Guidelines
1. **Specific**: Each task should have clear, measurable outcomes
2. **Atomic**: Tasks should be small enough to complete in a reasonable time
3. **Actionable**: Tasks should clearly state what needs to be done
4. **Testable**: Tasks should include acceptance criteria
5. **Prioritized**: Tasks should have priority levels

## Prompt Templates

### Template 1: Feature Breakdown

```
You are a senior software architect helping break down a feature into development tasks.

FEATURE REQUEST:
{feature_description}

CONTEXT:
- Project: Angular 20 web application
- Tech Stack: TypeScript, Angular, RxJS
- Current State: {current_state}
- Dependencies: {dependencies}

Please break this feature down into:
1. User stories (if not already provided)
2. Technical tasks (development, testing, documentation)
3. Acceptance criteria for each task
4. Estimated complexity (Small/Medium/Large)
5. Dependencies between tasks
6. Potential risks or blockers

Format your response as a structured YAML document with:
- user_stories: List of user stories
- tasks: List of technical tasks
- dependencies: Task dependency graph
- risks: Potential issues to consider
```

### Template 2: Bug Triage and Task Creation

```
You are a technical lead helping triage and create tasks for bug fixes.

BUG REPORT:
Title: {bug_title}
Description: {bug_description}
Steps to Reproduce: {reproduction_steps}
Expected Behavior: {expected}
Actual Behavior: {actual}
Environment: {environment}

Please analyze this bug and provide:
1. Severity assessment (Critical/High/Medium/Low)
2. Root cause analysis (if determinable from description)
3. Affected components/files
4. Recommended fix approach
5. Testing strategy
6. Subtasks for fixing (if complex)

Consider:
- Impact on users
- Security implications
- Performance impact
- Backward compatibility

Format as a structured task breakdown with clear action items.
```

### Template 3: Technical Debt Identification

```
You are a code quality expert analyzing technical debt.

CODE CONTEXT:
Component/Module: {component_name}
Current Issues: {known_issues}
Code Metrics: {metrics}

Please identify:
1. Technical debt items in priority order
2. Impact of each debt item
3. Effort required to address (hours/days)
4. Benefits of addressing
5. Recommended approach for remediation
6. Individual tasks to address each debt item

Focus on:
- Code maintainability
- Performance optimization
- Security vulnerabilities
- Test coverage gaps
- Documentation gaps
- Deprecated API usage

Output as actionable tasks with clear acceptance criteria.
```

### Template 4: Epic to Tasks Conversion

```
You are a product-focused engineer converting an epic into implementable tasks.

EPIC:
Title: {epic_title}
Description: {epic_description}
Business Value: {business_value}
Success Metrics: {metrics}

Please create:
1. High-level implementation phases
2. User stories for each phase
3. Technical tasks for each story
4. Infrastructure/setup tasks
5. Testing tasks (unit, integration, e2e)
6. Documentation tasks
7. Deployment/release tasks

For each task include:
- Clear description
- Acceptance criteria
- Estimated effort (story points or hours)
- Prerequisites/dependencies
- Testing requirements
- Risk factors

Organize tasks by sprint-ready increments.
```

### Template 5: Refactoring Task Generation

```
You are a refactoring specialist creating tasks for code improvement.

REFACTORING TARGET:
File/Component: {target}
Current State: {current_issues}
Goal: {refactoring_goal}
Constraints: {constraints}

Please generate tasks for:
1. Analysis and planning
2. Test coverage improvement (if needed)
3. Incremental refactoring steps
4. Validation and testing
5. Documentation updates

Each task should:
- Be safe to perform independently
- Include rollback plan
- Have clear verification steps
- Not break existing functionality
- Include performance benchmarks (if applicable)

Ensure refactoring can be done incrementally without blocking other work.
```

## Example Outputs

### Example 1: Feature Task Breakdown

**Input**: "Add user profile editing functionality"

**Output**:
```yaml
user_stories:
  - id: US-001
    title: "As a user, I want to edit my profile information"
    description: "Users should be able to update their name, email, and bio"
    acceptance_criteria:
      - User can access profile edit form
      - Changes are validated before submission
      - Success message shown after update
      - Profile reflects changes immediately
    priority: high

tasks:
  - id: TASK-001
    title: "Create profile edit component"
    type: development
    description: "Create Angular component for profile editing"
    acceptance_criteria:
      - Component follows project structure
      - Reactive form with validation
      - Submit and cancel buttons
      - Loading states handled
    complexity: medium
    estimated_hours: 4
    dependencies: []
    
  - id: TASK-002
    title: "Implement profile update service"
    type: development
    description: "Create service method to update user profile"
    acceptance_criteria:
      - Service method updates profile via API
      - Error handling implemented
      - Response properly typed
      - Observable-based
    complexity: small
    estimated_hours: 2
    dependencies: []
    
  - id: TASK-003
    title: "Add profile edit route and navigation"
    type: development
    description: "Add routing and navigation to profile edit page"
    acceptance_criteria:
      - Route configured in routing module
      - Navigation from profile page
      - Route guards if needed
    complexity: small
    estimated_hours: 1
    dependencies: [TASK-001]
    
  - id: TASK-004
    title: "Write unit tests for profile edit"
    type: testing
    description: "Create comprehensive unit tests"
    acceptance_criteria:
      - Component tests cover all scenarios
      - Service tests cover API calls
      - Form validation tests
      - Error handling tests
      - 80%+ code coverage
    complexity: medium
    estimated_hours: 3
    dependencies: [TASK-001, TASK-002]
    
  - id: TASK-005
    title: "Update API documentation"
    type: documentation
    description: "Document profile update endpoint"
    acceptance_criteria:
      - OpenAPI spec updated
      - Request/response examples added
      - Error responses documented
    complexity: small
    estimated_hours: 1
    dependencies: [TASK-002]

dependencies:
  TASK-003: [TASK-001]
  TASK-004: [TASK-001, TASK-002]
  TASK-005: [TASK-002]

risks:
  - risk: "Profile update might conflict with concurrent updates"
    mitigation: "Implement optimistic locking or last-write-wins"
  - risk: "Email change might require re-verification"
    mitigation: "Plan for email verification flow"
  - risk: "Large profile images might cause performance issues"
    mitigation: "Implement image size limits and compression"
```

### Example 2: Bug Fix Task

**Input**: "Users getting 500 error when submitting form with special characters"

**Output**:
```yaml
bug_analysis:
  severity: high
  type: data_validation
  affected_components:
    - user-form.component.ts
    - user.service.ts
    - backend API endpoint
  
  root_cause: "Special characters not being properly escaped before API submission"
  
  fix_approach: "Implement input sanitization on frontend and backend"

tasks:
  - id: BUG-001
    title: "Reproduce and document bug"
    description: "Create test case that reproduces the issue"
    acceptance_criteria:
      - Reproduction steps documented
      - Test case added that fails
      - Console errors captured
    estimated_hours: 1
    
  - id: BUG-002
    title: "Implement input sanitization"
    description: "Add proper escaping for special characters"
    acceptance_criteria:
      - Special characters properly escaped
      - Unicode characters handled
      - No change in UX
      - Backwards compatible
    estimated_hours: 2
    dependencies: [BUG-001]
    
  - id: BUG-003
    title: "Add validation tests"
    description: "Add tests for special character handling"
    acceptance_criteria:
      - Tests cover various special characters
      - Edge cases tested
      - All tests pass
    estimated_hours: 2
    dependencies: [BUG-002]
    
  - id: BUG-004
    title: "Update validation documentation"
    description: "Document input validation rules"
    acceptance_criteria:
      - Validation rules documented
      - Examples provided
      - API docs updated
    estimated_hours: 1
    dependencies: [BUG-002]

testing_strategy:
  - Test with various special characters: & < > " ' / \
  - Test with Unicode characters
  - Test with very long inputs
  - Test with empty inputs
  - Test with only special characters

security_considerations:
  - Check for XSS vulnerabilities
  - Validate on both client and server
  - Use allowlist approach if possible
```

## Best Practices for Task Generation

### 1. Use Clear Action Verbs
- ✅ "Create", "Implement", "Add", "Update", "Fix", "Test"
- ❌ "Work on", "Look at", "Handle", "Deal with"

### 2. Include Context
- Why this task exists
- What it accomplishes
- How it fits into larger goal

### 3. Make Tasks Independent
- Minimize dependencies
- Allow parallel work when possible
- Clear prerequisites

### 4. Define "Done"
- Acceptance criteria
- Testing requirements
- Documentation requirements

### 5. Estimate Reasonably
- Break large tasks into smaller ones
- Include buffer for unknowns
- Consider complexity factors

## Prompt Refinement Tips

### For Better Outputs
1. **Provide Context**: Include relevant technical details
2. **Specify Format**: Request structured output (YAML, JSON, Markdown)
3. **Set Constraints**: Mention time, resource, or technical constraints
4. **Request Reasoning**: Ask for "why" not just "what"
5. **Iterate**: Refine prompts based on output quality

### Common Issues and Solutions

**Issue**: Tasks too vague
**Solution**: Request specific acceptance criteria in prompt

**Issue**: Tasks too large
**Solution**: Ask to break down into smaller increments

**Issue**: Missing dependencies
**Solution**: Explicitly ask for dependency analysis

**Issue**: No testing tasks
**Solution**: Always include testing in task generation prompt

## Integration with Project Tools

### YAML Format for Automation
```yaml
tasks:
  - id: string
    title: string
    description: string
    type: enum [development, testing, documentation, deployment]
    status: enum [todo, in_progress, done]
    priority: enum [low, medium, high, critical]
    estimated_hours: number
    assignee: string
    dependencies: array[task_id]
    acceptance_criteria: array[string]
    labels: array[string]
```

### JSON Format for API Integration
```json
{
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Task title",
      "description": "Task description",
      "type": "development",
      "status": "todo",
      "priority": "high",
      "estimatedHours": 4,
      "dependencies": [],
      "acceptanceCriteria": []
    }
  ]
}
```

## Metrics and Feedback

### Track Task Quality
- Completion rate
- Time to complete vs estimate
- Rework rate
- Blocker frequency

### Improve Prompts Based On
- Task clarity feedback
- Estimation accuracy
- Dependency correctness
- Coverage completeness

## References
- User Story Writing Guide
- Estimation Techniques (Story Points, T-shirt sizing)
- Task Decomposition Strategies
- Agile Planning Best Practices
