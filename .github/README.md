# .github Directory Structure

This directory contains GitHub-specific configurations, templates, and documentation for the ng-gighub repository.

## Directory Overview

- **actions/** - Custom GitHub Actions helpers and documentation
- **agents/** - Copilot Agents definitions and templates
- **copilot-instructions/** - Detailed coding guidelines and standards
- **ISSUE_TEMPLATE/** - Issue templates for bug reports and feature requests
- **pull_request_template/** - Pull request templates for different change types
- **workflows/** - GitHub Actions CI/CD workflows

## Key Files

- **copilot-instructions.md** - Main entry point for Copilot Agents with core rules and index
- **pull_request_template.md** - Default PR template (references copilot-instructions)
- **CONTRIBUTING.md** - Contribution guidelines
- **SECURITY.md** - Security policy and vulnerability reporting
- **CODEOWNERS** - Code ownership and review assignments

## Naming & Placement Conventions

### Copilot Instructions
- **Location**: `.github/copilot-instructions.md` (root level, exact casing)
- **Purpose**: Canonical repository-specific instructions for Copilot Agents
- **Structure**: Index with core rules linking to detailed guides in `./copilot-instructions/`

### Copilot Agents
- **Location**: `.github/agents/*.agent.md`
- **Naming**: Use kebab-case with `.agent.md` extension (e.g., `review.agent.md`, `onboarding.agent.md`)
- **Templates**: Store agent templates in `.github/agents/templates/`
- **Assets**: Store agent assets in `.github/agents/assets/`

### Pull Request Templates
- **Single template**: `.github/pull_request_template.md` (default template)
- **Multiple templates**: `.github/PULL_REQUEST_TEMPLATE/` or `.github/pull_request_template/`
  - Use consistent casing (prefer lowercase `pull_request_template/`)
  - Name files descriptively: `feature.md`, `bugfix.md`, `security.md`

### Issue Templates
- **Location**: `.github/ISSUE_TEMPLATE/` (GitHub standard, uppercase)
- **Files**: `bug_report.md`, `feature_request.md`, `config.yml`

### Workflows
- **Location**: `.github/workflows/*.yml`
- **Naming**: Use descriptive kebab-case names (e.g., `ci.yml`, `deploy-prod.yml`)

### Consistency Guidelines
1. **Prefer lowercase** for directory names (except ISSUE_TEMPLATE, which is GitHub standard)
2. **Use kebab-case** for file names
3. **Avoid case-only duplicates** (don't have both `PULL_REQUEST_TEMPLATE/` and `pull_request_template/`)
4. **Keep README.md in every subdirectory** for documentation

## Integration with Copilot Agents

The `.github/copilot-instructions.md` file serves as the canonical entry point for all Copilot Agents. It contains:
- Core development rules (lint, types, testing, security)
- Links to detailed guidelines in `./copilot-instructions/`
- Instructions for PR templates and workflow usage

When creating PRs, the template references copilot-instructions to ensure consistency with project standards.

## Maintaining This Structure

- Keep each subdirectory documented with a README.md
- Update copilot-instructions when project conventions change
- Use templates consistently across the team
- Review and update agent definitions as workflows evolve

For questions about this structure or suggestions for improvements, please open an issue or discuss in the team channel.
