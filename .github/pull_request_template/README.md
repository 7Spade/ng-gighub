# Pull Request Templates

This directory contains multiple PR templates for different types of changes in the ng-gighub repository.

## Available Templates

When creating a pull request, you can select a specific template by adding a query parameter to the PR URL:

- **default.md** - General purpose PR template
- **feature.md** - Template for new features
- **bugfix.md** - Template for bug fixes
- **security.md** - Template for security-related changes

## Using Templates

### Default Template
The default template (`../pull_request_template.md`) is used automatically when creating a PR without specifying a template.

### Specific Template
To use a specific template, add `?template=<name>.md` to the PR creation URL:

```
https://github.com/7Spade/ng-gighub/compare/main...your-branch?template=feature.md
```

Or select from the template dropdown when creating a PR on GitHub.

## Template Structure

Each template includes:
- **PR Checklist** - Pre-submission verification items
- **PR Type** - Category selection
- **Change Description** - What and why
- **Change Details** - Implementation approach
- **Testing** - How changes were tested
- **Checklist** - Code quality, architecture, testing, documentation
- **Security** - Security considerations
- **Performance** - Performance impact
- **Review Checklist** - For reviewers

## When to Use Each Template

### Default Template
- General changes that don't fit other categories
- Mixed changes (e.g., refactoring + documentation)
- Small improvements or updates

### Feature Template
- New functionality or capabilities
- User-facing enhancements
- New components, services, or modules
- API additions

### Bugfix Template
- Fixing broken functionality
- Resolving errors or issues
- Correcting unexpected behavior
- Addressing regression issues

### Security Template
- Security vulnerabilities fixes
- Authentication/authorization changes
- Secrets management updates
- Security policy updates
- Dependency security patches

## Template Guidelines

When filling out a PR template:

1. **Complete all sections** - Don't skip checklist items
2. **Be thorough** - Provide context and reasoning
3. **Reference standards** - Link to `.github/copilot-instructions.md` for project rules
4. **Include tests** - Document test coverage and approaches
5. **Add screenshots** - For UI changes, include before/after images
6. **Link issues** - Reference related issues with `Closes #123` or `Fixes #456`
7. **Self-review** - Check all items before requesting review

## Core Standards Reference

All PRs must adhere to the standards in `.github/copilot-instructions.md`:
- Follow ESLint and Prettier configs
- Use strict TypeScript types
- Apply Angular best practices (DI, Services, Observables, OnPush)
- Include tests (unit tests; e2e when appropriate)
- No secrets in code
- Large changes require RFC/issue first
- Ensure CI checks pass (lint, typecheck, tests)

## Creating Custom Templates

To add a new PR template:

1. Create a new `.md` file in this directory
2. Follow the structure of existing templates
3. Include all essential sections
4. Add checklist items specific to that change type
5. Update this README to document the new template

## Template Maintenance

- Review templates periodically to ensure they're up-to-date
- Update checklists as project standards evolve
- Remove obsolete sections
- Add new sections as needed
- Keep templates concise but comprehensive

## Resources

- [GitHub PR Templates Documentation](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
- Project copilot instructions: `../ copilot-instructions.md`
- Contribution guidelines: `../CONTRIBUTING.md`
- Coding standards: `../copilot-instructions/`
