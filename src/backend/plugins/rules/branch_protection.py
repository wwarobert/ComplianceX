from typing import Dict, Any
from ...core.compliance.base_rules import AutoFixableRule
from ...models.compliance import ComplianceRule, ComplianceCheck
from datetime import datetime

class BranchProtectionRule(AutoFixableRule):
    """Rule to check and enforce branch protection settings"""
    
    def get_rule_definition(self) -> ComplianceRule:
        return ComplianceRule(
            id="branch-protection",
            name="Branch Protection Rule",
            description="Ensures main branch has required protection rules",
            level="error"
        )
    
    async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
        repository = context.get('repository')
        if not repository:
            return ComplianceCheck(
                rule_id=self.rule.id,
                status="error",
                details={"error": "No repository provided in context"},
                timestamp=datetime.utcnow().isoformat()
            )
        
        # Check branch protection settings
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
        
        # Validate protection settings
        required_settings = {
            "require_pull_request": True,
            "required_reviewers": 1,
            "dismiss_stale_reviews": True,
            "require_code_owner_reviews": True,
            "require_status_checks": True
        }
        
        missing_settings = [
            setting for setting, required_value in required_settings.items()
            if protection_settings.get(setting) != required_value
        ]
        
        if missing_settings:
            return ComplianceCheck(
                rule_id=self.rule.id,
                status="failed",
                details={
                    "message": "Branch protection rules are insufficient",
                    "missing_settings": missing_settings,
                    "repository": repository
                },
                timestamp=datetime.utcnow().isoformat()
            )
        
        return ComplianceCheck(
            rule_id=self.rule.id,
            status="passed",
            details={
                "message": "Branch protection rules are properly configured",
                "repository": repository
            },
            timestamp=datetime.utcnow().isoformat()
        )
    
    async def can_auto_fix(self, context: Dict[str, Any]) -> bool:
        # Check if we have necessary permissions to update branch protection
        repository = context.get('repository')
        if not repository:
            return False
        
        try:
            # Check repository admin permissions
            has_permission = await self._check_admin_permission(repository)
            return has_permission
        except Exception:
            return False
    
    async def apply_fix(self, context: Dict[str, Any]) -> bool:
        repository = context.get('repository')
        if not repository:
            return False
        
        try:
            # Apply branch protection settings
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
                },
                "restrictions": None
            }
            
            success = await self._update_branch_protection(
                repository,
                "main",
                protection_settings
            )
            
            return success
        except Exception:
            return False
    
    async def _get_branch_protection(self, repository: str) -> Dict[str, Any]:
        """Get branch protection settings from Azure DevOps API"""
        # Implementation would go here
        pass
    
    async def _check_admin_permission(self, repository: str) -> bool:
        """Check if current user has admin permissions"""
        # Implementation would go here
        pass
    
    async def _update_branch_protection(
        self,
        repository: str,
        branch: str,
        settings: Dict[str, Any]
    ) -> bool:
        """Update branch protection settings via Azure DevOps API"""
        # Implementation would go here
        pass