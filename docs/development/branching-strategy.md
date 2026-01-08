# Git Branching Strategy - ComplianceX

## Overview
This document defines the simplified branching model and GitHub workflow for ComplianceX development. We use a **feature-branch workflow** where all changes go through feature branches, and work types are distinguished using **GitHub labels and tags** rather than branch naming conventions.

## Branch Structure

### Main Branch

#### `main`
- **Purpose:** Production-ready code, always deployable
- **Protection:** Always protected, requires PR reviews
- **Deployable:** Yes, always
- **Merges from:** All `feature/*` branches
- **CI/CD:** Auto-deploys to production environment
- **Direct commits:** ❌ Never allowed

---

## Feature Branches

**All work happens in feature branches** - whether it's a new feature, bug fix, refactoring, or hotfix.

### Branch Naming Pattern
```
feature/{issue-number}-{short-description}
```

### Examples
```
feature/001-azure-devops-client-auth      # New feature
feature/023-fix-compliance-calculation    # Bug fix
feature/045-update-dependencies           # Maintenance
feature/067-critical-auth-vulnerability   # Hotfix
feature/089-refactor-plugin-system        # Refactoring
feature/101-add-dashboard-charts          # Enhancement
```

### Branch Lifecycle
1. **Create** from latest `main`
2. **Develop** with regular commits
3. **Push** to remote for backup and collaboration
4. **Test** locally and via CI/CD
5. **Create PR** when ready
6. **Review** and address feedback
7. **Merge** to `main` (squash or merge commit)
8. **Delete** after successful merge
9. **Tag** main if it's a release

### Key Principles
- ✅ Always branch from `main`
- ✅ Keep branches small and focused
- ✅ Merge back to `main` frequently
- ✅ Delete branch after merge
- ✅ Use GitHub labels to categorize work type
- ✅ Use git tags for releases and important milestones

---

## Work Type Classification

Instead of different branch types, we use **GitHub labels** to classify the type of work:

### GitHub Labels (Work Type)

| Label | Description | When to Use |
|-------|-------------|-------------|
| `type: feature` | New functionality | Adding new features, capabilities, or enhancements |
| `type: bugfix` | Bug fixes | Fixing incorrect behavior or errors |
| `type: hotfix` | Critical urgent fix | Production-breaking issues that need immediate attention |
| `type: refactor` | Code improvement | Restructuring code without changing functionality |
| `type: chore` | Maintenance | Dependencies, tooling, configuration updates |
| `type: docs` | Documentation | Documentation-only changes |
| `type: test` | Testing | Adding or updating tests |

### Priority Labels

| Label | Description | SLA |
|-------|-------------|-----|
| `priority: critical` | Blocking production issue | Review within 2 hours |
| `priority: high` | Important, needs attention | Review within 1 day |
| `priority: medium` | Normal priority | Review within 3 days |
| `priority: low` | Nice to have | Review when available |

---

## Branch Naming Rules

### Format
```
feature/{issue-number}-{short-description}
```

### Rules
- Always start with `feature/`
- Include GitHub issue number (3+ digits with leading zeros)
- Short description in lowercase with hyphens
- Max 50 characters total
- Be descriptive but concise

### Good Examples ✅
```
feature/001-azure-devops-client-auth
feature/023-fix-dashboard-loading
feature/045-critical-auth-patch
feature/067-update-fastapi-version
feature/089-add-unit-tests
feature/101-refactor-compliance-engine
```

### Bad Examples ❌
```
azure-integration                    # Missing feature/ prefix and number
feature/add-stuff                    # Missing issue number
feature/001-addNewStuff              # camelCase instead of hyphens
FEATURE/001-TEST                     # Uppercase
feature/very-long-description-that-goes-on-and-on-forever  # Too long
feature/1-fix                        # Issue number not zero-padded
```

---

## GitHub Integration

### Issue Tracking

Every feature branch should be linked to a GitHub issue. The issue number becomes part of the branch name.

**Status Labels:**
- `status: planned` - In roadmap/backlog
- `status: in-progress` - Being actively worked on
- `status: blocked` - Waiting on dependency or decision
- `status: review` - In code review (PR open)
- `status: ready` - Approved, ready to merge
- `status: done` - Merged and closed

**Area Labels:**
- `area: backend` - Python backend code
- `area: frontend` - React/TypeScript frontend
- `area: devops` - CI/CD, infrastructure, deployment
- `area: docs` - Documentation changes
- `area: tests` - Test-related changes

**Additional Labels:**
- `breaking-change` - Introduces breaking changes
- `dependencies` - Dependency updates
- `security` - Security-related changes
- `performance` - Performance improvements

### Branch Protection Rules (main)

**As an open source project, we balance protection with maintainer flexibility:**

**Recommended Settings:**
- ✅ Require pull request before merging
- ⚠️ Require approvals: **Optional** (maintainers can self-merge if needed)
  - Recommended for external contributors
  - Maintainers use judgment for their own PRs
- ✅ Require status checks to pass before merging
  - All tests pass
  - Code linting passes
  - Build succeeds
- ✅ Require branches to be up to date before merging
- ⚠️ Dismiss stale reviews on new commits: **Recommended** but not required
- ⚠️ Require conversation resolution: **Recommended** but not required
- ⚠️ Require signed commits: **Optional** (good security practice)
- ⚠️ Do not require approvals for repository maintainers
  - Allows maintainers to merge critical fixes quickly
  - Encourages self-review discipline

**Restrictions:**
- Allow deletions: ❌ No
- Allow force pushes: ❌ No (except for maintainers in rare cases)

**For Contributors:**
- External PRs welcome and will be reviewed by maintainers
- First-time contributors may need more detailed review
- All PRs must pass CI/CD checks regardless of author

**For Maintainers:**
- Use best judgment on self-merging
- Self-review thoroughly before merging own code
- Seek peer review for complex or breaking changes
- Fast-track critical hotfixes when needed

### Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Description
<!-- Brief description of changes -->

## Type of Change
- [ ] Feature - New functionality
- [ ] Bugfix - Fixing incorrect behavior
- [ ] Hotfix - Critical production issue
- [ ] Refactor - Code improvement without functionality change
- [ ] Chore - Maintenance, dependencies, tooling
- [ ] Docs - Documentation only
- [ ] Test - Adding or updating tests

## Related Issues
Closes #[issue_number]
<!-- Link to the GitHub issue this PR addresses -->

## Changes Made
- 
- 

## Testing Done
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] All tests pass locally

## Checklist
- [ ] Code follows project naming conventions
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or documented in PR)
- [ ] Feature roadmap updated (if applicable)

## For External Contributors
- [ ] I have read the CONTRIBUTING.md guide
- [ ] My PR addresses a single concern
- [ ] I have tested my changes thoroughly

## For Maintainers Only
- [ ] Self-reviewed code thoroughly
- [ ] Considered if peer review is needed
- [ ] Updated version if releasing
- [ ] No console.log or debug code
- [ ] All tests pass locally
- [ ] Feature roadmap updated (if applicable)

## Screenshots (if applicable)

## Additional Notes
```

### Issue Templates

Create `.github/ISSUE_TEMPLATE/`:

**1. feature_request.md**
```markdown
---
name: Feature Request
about: Suggest a new feature
labels: type: feature
---

## Feature Description
<!-- Clear description of the feature -->

## Use Case
<!-- Why is this feature needed? -->

## Proposed Solution
<!-- How should it work? -->

## Alternatives Considered
<!-- Other approaches you've thought about -->

## Additional Context
<!-- Screenshots, mockups, etc. -->
```

**2. bug_report.md**
```markdown
---
name: Bug Report
about: Report a bug
labels: type: bugfix
---

## Bug Description
<!-- Clear description of the bug -->

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
<!-- What should happen? -->

## Actual Behavior
<!-- What actually happens? -->

## Environment
- Version:
- Browser (if frontend):
- OS:

## Screenshots/Logs
<!-- If applicable -->

## Additional Context
```

---

## GitHub Projects for Tracking

### Project Board Setup

**Columns:**
1. **Backlog** - All new issues
2. **Planned** - Prioritized for upcoming work
3. **In Progress** - Currently being worked on
4. **Review** - In PR review
5. **Done** - Merged and deployed

**Automation:**
- New issues → Backlog
- Issue assigned → Planned
- PR opened → In Progress
- PR approved → Review
- PR merged → Done

### Milestones

Use GitHub Milestones for grouping related features:

```
Milestone: Phase 1 - Azure DevOps Integration
  - feature/001-azure-devops-client-auth
  - feature/002-azure-devops-repo-data
  - feature/003-azure-devops-policies
  - feature/004-api-integration

Milestone: Phase 2 - Additional Rules
  - feature/005-pr-policy-rule
  - feature/006-build-validation-rule
  - feature/007-security-scanning-rule

Milestone: v1.0.0 Release
  - All Phase 1 features
  - Core functionality complete
```

---

## Git Tags

Git tags are used for marking **releases** and **important milestones** on the `main` branch.

### Release Tags

**Format:**
```
v{major}.{minor}.{patch}[-{prerelease}]
```

**Tag Types:**

| Type | Format | Example | When to Use |
|------|--------|---------|-------------|
| **Stable Release** | `v{major}.{minor}.{patch}` | `v1.2.3` | Production-ready releases |
| **Pre-release** | `v{version}-alpha.{n}` | `v2.0.0-alpha.1` | Early testing versions |
| **Beta** | `v{version}-beta.{n}` | `v2.0.0-beta.2` | Feature-complete testing |
| **Release Candidate** | `v{version}-rc.{n}` | `v2.0.0-rc.1` | Final testing before release |

### Semantic Versioning

Following [SemVer 2.0.0](https://semver.org/):

- **MAJOR** (v**1**.0.0 → v**2**.0.0): Breaking changes, incompatible API changes
- **MINOR** (v1.**0**.0 → v1.**1**.0): New features, backwards-compatible
- **PATCH** (v1.0.**0** → v1.0.**1**): Bug fixes, backwards-compatible

### When to Tag

Tag `main` after merging a feature branch when:
- ✅ Completing a release milestone
- ✅ Deploying to production
- ✅ After a critical hotfix
- ✅ Marking a stable version

**Don't tag:**
- ❌ Individual feature branches
- ❌ Standard Feature Development

```bash
# 1. Create GitHub issue first (e.g., #001)
# 2. Apply labels: type: feature, area: backend, priority: high

# 3. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/001-azure-devops-client-auth

# 4. Make changes and commit regularly
git add src/backend/services/devops/
git commit -m "feat: add Azure DevOps client base class"

git add tests/backend/test_devops_client.py
git commit -m "test: add unit tests for DevOps client"

# 5. Push to remote regularly
git push -u origin feature/001-azure-devops-client-auth

# 6. Keep branch updated with main
git checkout main
git pull origin main
git checkout feature/001-azure-devops-client-auth
git rebase main  # or: git merge main

# 7. Create PR via GitHub UI
# - Reference issue: "Closes #001"
# - Apply same labels to PR
# - Request reviewers

# 8. After PR approval and merge
git checkout main
git pull origin main
git branch -d feature/001-azure-devops-client-auth

# 9. Tag if it's a release
git tag -a v1.1.0 -m "Release v1.1.0: Azure DevOps integration"
git push origin v1.1.0
```

### Critical Hotfix Workflow

```bash
# 1. Create urgent GitHub issue (e.g., #023)
# 2. Apply labels: type: hotfix, priority: critical

# 3. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/023-fix-auth-vulnerability

# 4. Fix the issue with minimal changes
git add src/backend/services/auth.py
git commit -m "fix: patch authentication vulnerability (CVE-2026-XXXX)"

# 5. Push and create PR immediately
git push -u origin feature/023-fix-auth-vulnerability

# 6. Fast-track review (notify team on Slack/Teams)

# 7. After merge, tag patch version immediately
git checkout main
git pull origin main
git tag -a v1.2.1 -m "Hotfix v1.2.1: Critical authentication vulnerability"
git push origin v1.2.1

# 8. Deploy to production immediately
# 9. Delete branch
git branch -d feature/023-fix-auth-vulnerability
```

### Bug Fix Workflow

```bash
# 1. Create issue #045: "Dashboard loading spinner stuck"
# 2. Apply labels: type: bugfix, area: frontend, priority: medium

# 3. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/045-fix-dashboard-loading

# 4. Fix bug and add regression test
git add src/frontend/components/dashboard/ComplianceDashboard.tsx
git commit -m "fix: resolve infinite loading state in dashboard"

git add tests/frontend/ComplianceDashboard.test.tsx
git commit -m "test: add test for loading state timeout"

# 5. Push and create PR
git push -u origin feature/045-fix-dashboard-loading

# 6. Standard review process

# 7. After merge, clean up
git checkout main
git pull origin main
git branch -d feature/045-fix-dashboard-loading

# Note: Bug fixes typically don't require immediate tagging
# unless they're critical or part of a release cycle
```

### Dependency Update Workflow

```bash
# 1. Create issue #067: "Update FastAPI to 0.110.0"
# 2. Apply labels: type: chore, dependencies, area: backend

# 3. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/067-update-fastapi

# 4. Update dependency and test
git add requirements.txt
git commit -m "chore: update FastAPI to 0.110.0"

# Run full test suite
pytest tests/

# 5. Push and create PR
git push -u origin feature/067-update-fastapi

# 6. After merge, may tag if part of release
git checkout main
git pull origin main
git branch -d feature/067-update-fastapi
- ✅ Tag message/release notes
- ✅ GPG signature (if configured)

```bash
# Good: Annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Avoid: Lightweight tag (no metadata)
git tag v1.0.0
```

### Viewing Tags

```bash
# List all tags
git tag

# List tags matching pattern
git tag -l "v1.*"

# Show tag details
git show v1.2.0

# List tags with messages
git tag -n
```

### Tag Naming for Special Cases

| Type | Format | Example | Purpose |
|------|--------|---------|---------|
| Release | `v{x}.{y}.{z}` | `v1.2.3` | Official releases |
| Milestone | `milestone-{name}` | `milestone-phase1-complete` | Mark project phases |
| Hotfix | `v{x}.{y}.{z}` | `v1.2.4` | Critical fixes (patch bump) |
| Deployment | `deploy-{env}-{date}` | `deploy-prod-20260108` | Track deployments (optional) |

---

## Workflow Examples

### Feature Development

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/001-azure-devops-client-auth

# 2. Make changes and commit
git add .
git commit -m "feat: implement Azure DevOps authentication"

# 3. Push to remote regularly
git push -u origin feature/001-azure-devops-client-auth

# 4. Keep branch updated with main
git checkout main
git pull origin main
git checkout feature/001-azure-devops-client-auth
git rebase main  # or merge main

# 5. Create PR via GitHub UI when ready

# 6. After merge, delete local branch
git checkout main
git pull origin main
git branch -d feature/001-azure-devops-client-auth
```

### Hotfix Workflow
### Branch Pattern (Single Type)
```
feature/{issue-number}-{short-description}
```

**All work uses feature branches.** Work type is identified by GitHub labels.

| Work Type | Branch Pattern | Label | Priority Label | Example |
|-----------|---------------|-------|----------------|---------|
| New Feature | `feature/{#}-{desc}` | `type: feature` | Any | `feature/001-azure-devops-client` |
| Bug Fix | `feature/{#}-{desc}` | `type: bugfix` | `priority: medium` | `feature/045-fix-dashboard-bug` |
| Critical Fix | `feature/{#}-{desc}` | `type: hotfix` | `priority: critical` | `feature/023-fix-auth-vulnerability` |
| Refactoring | `feature/{#}-{desc}` | `type: refactor` | Any | `feature/067-refactor-plugin-system` |
| Maintenance | `feature/{#}-{desc}` | `type: chore` | `priority: low` | `feature/089-update-dependencies` |
| Documentation | `feature/{#}-{desc}` | `type: docs` | Any | `feature/101-api-documentation` |

### Git Tags (Releases Only)

| Tag Type | Format | Example | When |
|----------|--------|---------|------|
| Stable | `v{x}.{y}.{z}` | `v1.2.3` | Production release |
| Pre-release | `v{x}.{y}.{z}-{type}.{n}` | `v2.0.0-beta.1` | Testing version |
| Hotfix | `v{x}.{y}.{z}` | `v1.2.4` | After critical fix (patch bump)
git add .
git commit -m "fix: patch authentication vulnerability"

# 3. Update version and create PR
# (Fast-track review)

# 4. After merge, tag the release
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix: Authentication vulnerability"
git push origin v1.0.1
```

---

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat(devops): add Azure DevOps client authentication
fix(api): resolve timeout on compliance check endpoint
docs(readme): update installation instructions
chore(deps): upgrade fastapi to 0.104.1
```

---

## Best Practices

### Do ✅
- Create small, focused branches
- Commit often with clear messages
- Keep branches short-lived (< 1 week if possible)
- Rebase or merge from main regularly
- Delete branches after merge
- Link PRs to issues
- Request reviews from relevant team members
- Test locally before pushing
- Update documentation with code changes

### Don't ❌
- Commit directly to main
- Create long-lived feature branches
- Mix multiple features in one branch
- Force push to shared branches
- Leave stale branches unmerged
- Skip code reviews
- Merge without passing CI/CD
- Use generic commit messages

---

## Quick Reference

| Branch Type | Pattern | Created From | Merged To | Label |
|------------|---------|--------------|-----------|-------|
| Feature | `feature/{#}-{desc}` | main | main | `type: feature` |
| Bugfix | `bugfix/{#}-{desc}` | main | main | `type: bugfix` |
| Hotfix | `hotfix/{ver}-{desc}` | main | main + develop | `type: hotfix` |
| Release | `release/{ver}` | develop | main + develop | `type: release` |
| Request | `request/{#}-{desc}` | main | main | `type: request` |
| Chore | `chore/{desc}` | main | main | `type: chore` |

---

## References
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Trunk Based Development](https://trunkbaseddevelopment.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
