# Branch Protection Rule Plugin

## Overview
The Branch Protection Rule plugin ensures that repositories have proper branch protection rules configured for main branches. It can automatically fix non-compliant settings and notify relevant stakeholders.

## Features
- Checks branch protection settings
- Validates review requirements
- Ensures required status checks
- Auto-fixes missing protection rules
- Sends notifications for violations

## Configuration

### Feature Flag
```yaml
features:
  branch-protection:
    enabled: true
    description: "Enforces branch protection rules on repositories"
    parameters:
      required_reviewers: 1
      require_code_owner_reviews: true
      enforce_admins: true
```

### Settings
```yaml
rules:
  branch-protection:
    protected_branches:
      - main
      - master
      - release/*
    required_checks:
      - build
      - test
    auto_fix: true
    notification:
      recipients:
        - repository_owners
        - project_admins
```

## Implementation Details

### Rule Definition
```python
def get_rule_definition(self) -> ComplianceRule:
    return ComplianceRule(
        id="branch-protection",
        name="Branch Protection Rule",
        description="Ensures main branch has required protection rules",
        level="error"
    )
```

### Compliance Check
```python
async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
    repository = context.get('repository')
    protection_settings = await self._get_branch_protection(repository)
    
    if not protection_settings:
        return ComplianceCheck(
            rule_id=self.rule.id,
            status="failed",
            details={
                "message": "No branch protection rules found",
                "repository": repository
            },
            timestamp=datetime.utcnow().isoformat()
        )
```

### Auto-Fix Implementation
```python
async def apply_fix(self, context: Dict[str, Any]) -> bool:
    repository = context.get('repository')
    protection_settings = {
        "required_status_checks": {
            "strict": True,
            "contexts": ["continuous-integration"]
        },
        "enforce_admins": True,
        "required_pull_request_reviews": {
            "dismissal_restrictions": {},
            "dismiss_stale_reviews": True,
            "require_code_owner_reviews": True,
            "required_approving_review_count": 1
        }
    }
    
    success = await self._update_branch_protection(
        repository,
        "main",
        protection_settings
    )
    
    return success
```

## Usage Examples

### Basic Check
```python
# Get compliance service
compliance_service = ComplianceService()

# Check specific repository
result = await compliance_service.check_project_compliance("project-id")
```

### With Auto-Fix
```python
# Enable auto-fix in features.yaml
features:
  auto-fix:
    enabled: true
    parameters:
      require_approval: false

# Check will automatically attempt to fix issues
result = await compliance_service.check_project_compliance("project-id")
```

### With Notifications
```python
# Enable notifications in features.yaml
features:
  notifications:
    enabled: true
    parameters:
      email_notifications: true

# Check will send notifications for violations
result = await compliance_service.check_project_compliance("project-id")
```

## API Reference

### Endpoints

#### GET /api/v1/compliance/branch-protection/{repository_id}
Check branch protection rules for a specific repository.

**Parameters:**
- `repository_id`: string (required) - Repository ID

**Response:**
```json
{
    "rule_id": "branch-protection",
    "status": "passed",
    "details": {
        "repository": "repo-name",
        "protection_rules": {
            "require_pull_request": true,
            "required_reviewers": 1,
            "dismiss_stale_reviews": true
        }
    },
    "timestamp": "2025-10-10T00:00:00Z"
}
```

## Testing

### Unit Tests
```python
async def test_branch_protection_check():
    rule = BranchProtectionRule()
    context = {
        "repository": "test-repo",
        "branch": "main"
    }
    
    result = await rule.check_compliance(context)
    assert result.status in ["passed", "failed"]
```

### Integration Tests
```python
async def test_branch_protection_integration():
    rule = BranchProtectionRule()
    context = {
        "repository": "real-repo",
        "branch": "main"
    }
    
    result = await rule.check_compliance(context)
    if result.status == "failed":
        can_fix = await rule.can_auto_fix(context)
        if can_fix:
            fixed = await rule.apply_fix(context)
            assert fixed is True
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure PAT has sufficient permissions
   - Check repository access

2. **Auto-Fix Failures**
   - Verify admin access
   - Check policy constraints
   - Review API limits

3. **Notification Issues**
   - Validate email configurations
   - Check notification permissions
   - Verify recipient lists

## Best Practices

1. **Configuration**
   - Use organization-wide settings
   - Document custom rules
   - Version control settings

2. **Monitoring**
   - Track fix success rates
   - Monitor API usage
   - Log notification delivery

3. **Maintenance**
   - Regular permission reviews
   - Update protection rules
   - Keep documentation current