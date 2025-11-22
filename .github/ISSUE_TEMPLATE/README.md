# Issue Templates

This directory contains templates for creating GitHub issues in the ng-gighub repository.

## Available Templates

- **bug_report.md** - Template for reporting bugs and issues
- **feature_request.md** - Template for requesting new features or enhancements
- **config.yml** - Configuration for issue template chooser

## Using Templates

When creating a new issue, GitHub will present these templates as options. Choose the one that best matches your issue type.

### Bug Reports
Use this template when:
- Something isn't working as expected
- You've encountered an error
- The application behaves incorrectly

### Feature Requests
Use this template when:
- You have an idea for a new feature
- You want to suggest an enhancement
- You're proposing a change to existing functionality

## Template Guidelines

When filling out a template:
- Provide as much detail as possible
- Include steps to reproduce (for bugs)
- Add screenshots or error messages when helpful
- Reference related issues or PRs if applicable
- Follow the template structure for consistency

## Custom Templates

To add a new issue template:
1. Create a new `.md` file in this directory
2. Follow the format of existing templates
3. Add frontmatter with `name`, `about`, `title`, and `labels`
4. Update this README to document the new template

Example frontmatter:
```yaml
---
name: Template Name
about: Brief description of when to use this template
title: '[PREFIX] '
labels: 'label1, label2'
assignees: ''
---
```

## Resources

- [GitHub Issue Templates Documentation](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- Project contribution guidelines: `../CONTRIBUTING.md`
