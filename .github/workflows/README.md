# GitHub Actions Workflows

This directory contains GitHub Actions workflow definitions for CI/CD automation in the ng-gighub repository.

## Purpose

Workflows automate tasks such as:
- Building and testing code
- Running linters and type checkers
- Deploying to production/staging
- Security scanning
- Dependency updates

## Workflow Files

Workflows are defined as YAML files (`.yml` or `.yaml`) in this directory. Each workflow specifies:
- Trigger events (push, pull request, schedule, etc.)
- Jobs to execute
- Steps within each job
- Environment variables and secrets

## Running Workflows

Workflows are triggered automatically based on their configuration, typically:
- **On push** to specific branches
- **On pull request** creation or update
- **On schedule** (cron)
- **Manually** via workflow_dispatch

## Viewing Workflow Runs

1. Navigate to the "Actions" tab in GitHub
2. Select a workflow from the left sidebar
3. View recent runs, logs, and results
4. Re-run failed workflows if needed

## Creating New Workflows

To add a new workflow:

1. Create a new `.yml` file in this directory
2. Define the workflow structure:

```yaml
name: My Workflow
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

3. Commit and push to trigger the workflow

## Best Practices

### Workflow Design
- Keep workflows focused on a single purpose
- Use matrix strategies for testing multiple versions
- Cache dependencies to speed up builds
- Fail fast to save compute time

### Security
- Use GitHub Secrets for sensitive data
- Pin action versions for reproducibility
- Review third-party actions before use
- Use `permissions` to limit token scope

### Performance
- Cache dependencies (npm, node_modules)
- Run jobs in parallel when possible
- Use appropriate runner sizes
- Clean up artifacts after use

### Maintenance
- Keep actions up to date
- Document complex workflows
- Test workflow changes in a separate branch
- Monitor workflow run times and costs

## Common Workflow Patterns

### Continuous Integration (CI)
```yaml
on: [push, pull_request]
jobs:
  test:
    - Checkout code
    - Setup environment
    - Install dependencies
    - Run linters
    - Run tests
    - Upload coverage
```

### Continuous Deployment (CD)
```yaml
on:
  push:
    branches: [main]
jobs:
  deploy:
    - Build application
    - Run tests
    - Deploy to environment
    - Notify on completion
```

### Scheduled Tasks
```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
jobs:
  maintenance:
    - Update dependencies
    - Run security audit
    - Generate reports
```

## Troubleshooting

### Workflow Fails
1. Check the workflow logs in the Actions tab
2. Verify environment variables and secrets
3. Test commands locally before adding to workflow
4. Check for rate limiting or resource constraints

### Slow Workflows
1. Enable caching for dependencies
2. Use matrix strategies efficiently
3. Run independent jobs in parallel
4. Consider self-hosted runners for large projects

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Available Actions](https://github.com/marketplace?type=actions)
- Custom actions: `../actions/`

## Related Directories

- `../actions/` - Custom reusable actions
- `.github/` root - Other GitHub configurations
