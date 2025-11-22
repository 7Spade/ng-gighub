Repository-specific instructions (Copilot / Copilot Agents)

Summary
- This file is the canonical repository-specific instructions that Copilot will read.
- Keep essential rules here; link to detailed sections in ./copilot-instructions/ for longer guidelines.

Core rules (short & authoritative)
- Follow existing ESLint and Prettier configs. Always format and lint code before proposing changes.
- Prefer strict TypeScript types; avoid `any`. If `any` is used, explain why and propose alternatives.
- Use Angular best practices: DI, Services for logic, Observables + async pipe, OnPush change detection.
- All feature/fix suggestions must include tests (unit tests; e2e when appropriate) and a brief "How to test" section.
- Do not add, expose, or suggest storing secrets/API keys in repo. Use env/secrets instead.
- For large changes, open an ISSUE / RFC first and propose incremental PRs with migration steps.
- Reference CI checks: ensure lint, typecheck and unit tests pass in proposed PR.

Index to detailed guidance (in this repo)
- Style & conventions: ./copilot-instructions/style-guide.md
- Testing guidelines: ./copilot-instructions/testing-guidelines.md
- Security & sensitive data: ./copilot-instructions/security-guidelines.md
- Prompt / example responses: ./copilot-instructions/examples/prompt-examples.md

Pull request process
- Use PR templates: ./pull_request_template.md (default) or ./pull_request_template/ for specific types
- Template types: feature.md, bugfix.md, security.md, default.md
- All PRs must reference this file and follow core rules above
- See ./pull_request_template/README.md for template selection guide

How agents should use this file
- Treat the "Core rules" above as authoritative constraints.
- When generating code or PR text, include: purpose, changes summary, test steps, rollback plan, and risk level.
- If uncertain, list options and ask for confirmation before making breaking changes.
- Reference appropriate PR template based on change type.

Directory structure
- Agents: ./agents/*.agent.md (Copilot agent definitions)
- Actions: ./actions/ (custom GitHub Actions)
- Workflows: ./workflows/ (CI/CD pipelines)
- Issue templates: ./ISSUE_TEMPLATE/
- Full structure guide: ./README.md
