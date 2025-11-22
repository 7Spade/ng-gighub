---
name: task-agent-template
description: >
  Template for creating new task-specific Copilot agents. Copy and customize this
  file to create agents tailored for specific development tasks or workflows.

instructions: |
  # [Agent Name] Agent

  ## Role
  [Describe the agent's primary role and purpose]
  
  Example:
  You are a [specific role] agent for the ng-gighub Angular project. Your role is to:
  - [Primary responsibility 1]
  - [Primary responsibility 2]
  - [Primary responsibility 3]

  ## Context

  ### Project Background
  - Framework: Angular 20.1.x with SSR
  - Language: TypeScript 5.8.x
  - Backend: Supabase
  - Testing: Karma + Jasmine
  - [Add relevant context for this agent's tasks]

  ### Related Resources
  - Core rules: `.github/copilot-instructions.md`
  - Style guide: `.github/copilot-instructions/style-guide.md`
  - [List other relevant documentation]

  ## Capabilities

  ### Primary Functions
  1. **[Function 1]**: [Description]
     - Input: [What it needs]
     - Output: [What it produces]
     - Process: [How it works]

  2. **[Function 2]**: [Description]
     - Input: [What it needs]
     - Output: [What it produces]
     - Process: [How it works]

  ### Constraints
  - [Constraint 1]
  - [Constraint 2]
  - Must follow project conventions in `.github/copilot-instructions.md`
  - [Add specific constraints]

  ## Guidelines

  ### Core Principles
  - [Principle 1]
  - [Principle 2]
  - [Principle 3]

  ### Best Practices
  - [Practice 1]
  - [Practice 2]
  - [Practice 3]

  ### Anti-Patterns to Avoid
  - [Anti-pattern 1]
  - [Anti-pattern 2]
  - [Anti-pattern 3]

  ## Workflow

  ### Step-by-Step Process
  1. **[Step 1]**: [Description]
     - Actions: [What to do]
     - Checks: [What to verify]
  
  2. **[Step 2]**: [Description]
     - Actions: [What to do]
     - Checks: [What to verify]
  
  3. **[Step 3]**: [Description]
     - Actions: [What to do]
     - Checks: [What to verify]

  ### Decision Points
  - **If [condition]**: [Action]
  - **If [condition]**: [Action]
  - **Otherwise**: [Default action]

  ## Examples

  ### Example 1: [Use Case Name]
  **Input:**
  ```
  [Example input]
  ```

  **Expected Output:**
  ```
  [Example output]
  ```

  **Process:**
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]

  ### Example 2: [Use Case Name]
  **Input:**
  ```
  [Example input]
  ```

  **Expected Output:**
  ```
  [Example output]
  ```

  ## Quality Checks

  ### Before Completing Task
  - [ ] [Check 1]
  - [ ] [Check 2]
  - [ ] Follows project conventions
  - [ ] Tests are included/updated
  - [ ] Documentation is updated
  - [ ] [Add specific checks]

  ### Common Issues
  1. **[Issue]**: [Solution]
  2. **[Issue]**: [Solution]
  3. **[Issue]**: [Solution]

  ## Integration

  ### Required Tools
  - [Tool 1]: [Purpose]
  - [Tool 2]: [Purpose]
  - [Add MCP servers or other tools this agent needs]

  ### Interaction with Other Agents
  - **[Agent Name]**: [How they interact]
  - **[Agent Name]**: [How they interact]

  ## References

  ### Documentation
  - [Link to relevant docs]
  - [Link to relevant guides]

  ### Related Files
  - [Path to related code]
  - [Path to related config]

  ## Customization Notes

  ### When Using This Template
  1. Replace [Agent Name] with your agent's name
  2. Fill in all bracketed placeholders
  3. Remove this "Customization Notes" section
  4. Update the frontmatter (name, description)
  5. Add specific instructions for your use case
  6. Include relevant examples
  7. List required tools in the `tools` section below

  ### Naming Convention
  - File name: `[purpose].agent.md` (e.g., `migration.agent.md`, `api-generator.agent.md`)
  - Use kebab-case
  - Be descriptive but concise

tools:
  - memory
  - github-mcp-server
  - sequential-thinking
  # Add other required MCP servers/tools
