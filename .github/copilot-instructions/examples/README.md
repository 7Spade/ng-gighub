# Copilot Prompt Examples

This directory contains example prompts and expected responses for working effectively with GitHub Copilot in the ng-gighub project.

## Contents

- **prompt-examples.md** - Comprehensive collection of prompt examples for various development scenarios

## How to Use These Examples

1. **Read through examples** to understand effective prompt patterns
2. **Adapt prompts** to your specific needs
3. **Reference project standards** in your prompts (style guide, testing guidelines, etc.)
4. **Include testing requirements** to ensure Copilot generates tests alongside code
5. **Be specific** about requirements, dependencies, and expected behavior

## Effective Prompt Patterns

### Include Context
- Reference project conventions and standards
- Specify which technologies to use (Angular, Supabase, Material, etc.)
- Mention SSR compatibility when needed

### Be Specific
- List exact requirements and acceptance criteria
- Specify file names and component names
- Include validation rules and error handling

### Request Tests
- Always ask for unit tests
- Specify coverage requirements
- Request specific test scenarios

## Contributing Examples

When adding new examples:
- Include both the prompt and expected response
- Explain why the prompt is effective
- Show anti-patterns to avoid
- Link to relevant guidelines in `../`

## Quick Reference

For quick access to core rules and detailed guidelines, see:
- `../../copilot-instructions.md` - Core rules and index
- `../style-guide.md` - Coding conventions
- `../testing-guidelines.md` - Testing standards
- `../security-guidelines.md` - Security best practices
