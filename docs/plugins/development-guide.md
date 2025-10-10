# Plugin Development Guide

## Overview

ComplianceX uses a plugin-based architecture that allows developers to extend its functionality by creating new compliance rules, checks, and integrations. This guide will walk you through the process of creating new plugins.

## Plugin Types

### 1. Compliance Rule Plugins
Base classes:
- `ComplianceRulePlugin`: Basic compliance rule
- `AutoFixableRule`: Rules that can automatically fix issues
- `NotifiableRule`: Rules that can send notifications

### 2. Integration Plugins
For integrating with external systems and services.

## Creating a New Compliance Rule

### 1. Basic Structure
```python
from typing import Dict, Any
from ...core.compliance.base_rules import ComplianceRulePlugin
from ...models.compliance import ComplianceRule, ComplianceCheck
from datetime import datetime

class MyComplianceRule(ComplianceRulePlugin):
    def get_rule_definition(self) -> ComplianceRule:
        return ComplianceRule(
            id="my-rule",
            name="My Compliance Rule",
            description="Description of what this rule checks",
            level="error"  # or "warning"
        )
    
    async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
        # Implement compliance check logic here
        pass
```

### 2. Adding Auto-Fix Capability
```python
from ...core.compliance.base_rules import AutoFixableRule

class MyFixableRule(AutoFixableRule):
    async def can_auto_fix(self, context: Dict[str, Any]) -> bool:
        # Determine if the issue can be fixed automatically
        return True
    
    async def apply_fix(self, context: Dict[str, Any]) -> bool:
        # Implement fix logic here
        return True
```

### 3. Adding Notifications
```python
from ...core.compliance.base_rules import NotifiableRule

class MyNotifiableRule(NotifiableRule):
    async def should_notify(self, check_result: ComplianceCheck) -> bool:
        # Determine if notification should be sent
        return check_result.status == "failed"
    
    async def get_notification_message(self, check_result: ComplianceCheck) -> str:
        # Create notification message
        return f"Compliance check failed: {check_result.details.get('message')}"
```

## Plugin Development Best Practices

### 1. Context Usage
```python
async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
    # Always validate context
    if not self._validate_context(context):
        return ComplianceCheck(
            rule_id=self.rule.id,
            status="error",
            details={"error": "Invalid context"},
            timestamp=datetime.utcnow().isoformat()
        )
    
    # Use context safely
    project = context.get('project', {})
    repository = context.get('repository', {})
```

### 2. Error Handling
```python
async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
    try:
        # Your check logic here
        result = await self._perform_check(context)
        return result
    except Exception as e:
        return ComplianceCheck(
            rule_id=self.rule.id,
            status="error",
            details={"error": str(e)},
            timestamp=datetime.utcnow().isoformat()
        )
```

### 3. Performance Considerations
```python
async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
    # Cache expensive operations
    cache_key = f"{self.rule.id}:{context['project_id']}"
    cached_result = await self._get_cache(cache_key)
    if cached_result:
        return cached_result
    
    # Implement check logic
    result = await self._perform_check(context)
    
    # Cache result
    await self._set_cache(cache_key, result)
    return result
```

## Testing Plugins

### 1. Unit Tests
```python
import pytest
from datetime import datetime
from your_plugin import YourComplianceRule

@pytest.fixture
def rule():
    return YourComplianceRule()

@pytest.fixture
def context():
    return {
        "project_id": "test-project",
        "repository": "test-repo"
    }

async def test_rule_check(rule, context):
    result = await rule.check_compliance(context)
    assert result.status in ["passed", "failed", "error"]
    assert result.rule_id == rule.rule.id
```

### 2. Integration Tests
```python
async def test_rule_integration(rule, live_context):
    # Test with real Azure DevOps connection
    result = await rule.check_compliance(live_context)
    assert result.status != "error"
    
    if result.status == "failed" and isinstance(rule, AutoFixableRule):
        can_fix = await rule.can_auto_fix(live_context)
        if can_fix:
            fix_result = await rule.apply_fix(live_context)
            assert fix_result is True
```

## Configuration

### 1. Feature Flags
Add to `config/features.yaml`:
```yaml
features:
  your-feature:
    enabled: true
    description: "Description of your feature"
    parameters:
      param1: value1
      param2: value2
```

### 2. Settings
Add to `config/settings.yaml`:
```yaml
plugins:
  your-plugin:
    setting1: value1
    setting2: value2
```

## Deployment

### 1. Plugin Registration
```python
# In src/backend/api/main.py
from .plugins.your_plugin import YourComplianceRule

plugin_manager.register_plugin(YourComplianceRule())
```

### 2. Documentation
1. Add plugin documentation in `docs/plugins/`
2. Update API documentation if adding new endpoints
3. Update user guide with new features

## Examples

### 1. Complete Rule Example
```python
class RepositoryPolicyRule(AutoFixableRule, NotifiableRule):
    def get_rule_definition(self) -> ComplianceRule:
        return ComplianceRule(
            id="repo-policy",
            name="Repository Policy Check",
            description="Ensures repository policies are compliant",
            level="error"
        )
    
    async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
        try:
            repo = context.get('repository')
            policies = await self._get_repo_policies(repo)
            
            violations = self._check_policies(policies)
            
            if violations:
                return ComplianceCheck(
                    rule_id=self.rule.id,
                    status="failed",
                    details={
                        "violations": violations,
                        "repository": repo
                    },
                    timestamp=datetime.utcnow().isoformat()
                )
            
            return ComplianceCheck(
                rule_id=self.rule.id,
                status="passed",
                details={"repository": repo},
                timestamp=datetime.utcnow().isoformat()
            )
        except Exception as e:
            return ComplianceCheck(
                rule_id=self.rule.id,
                status="error",
                details={"error": str(e)},
                timestamp=datetime.utcnow().isoformat()
            )
```

### 2. Test Example
```python
class TestRepositoryPolicyRule:
    @pytest.fixture
    def rule(self):
        return RepositoryPolicyRule()
    
    @pytest.fixture
    def context(self):
        return {
            "repository": "test-repo",
            "policies": {
                "require_review": True,
                "reviewers_count": 2
            }
        }
    
    async def test_check_compliance(self, rule, context):
        result = await rule.check_compliance(context)
        assert result.status == "passed"
        
    async def test_failed_compliance(self, rule, context):
        context["policies"]["require_review"] = False
        result = await rule.check_compliance(context)
        assert result.status == "failed"
        assert "violations" in result.details
```