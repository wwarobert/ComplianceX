from typing import Dict, Any, List
from ..core.features.feature_manager import FeatureManager
from ..core.plugins.plugin_manager import PluginManager
from ..core.compliance.base_rules import ComplianceRulePlugin
from ..models.compliance import ComplianceCheck, ComplianceReport
from datetime import datetime

class ComplianceService:
    """Service for managing compliance checks and reporting"""
    
    def __init__(self):
        self.feature_manager = FeatureManager()
        self.plugin_manager = PluginManager()
        
        # Initialize plugins
        self.plugin_manager.discover_plugins("plugins.rules")
    
    async def check_project_compliance(self, project_id: str) -> ComplianceReport:
        """Check compliance for a specific project"""
        context = await self._build_project_context(project_id)
        checks = []
        
        # Get all compliance rule plugins
        rules = self.plugin_manager.get_plugins_by_type(ComplianceRulePlugin)
        
        for rule in rules:
            # Check if the rule's feature is enabled
            if not self.feature_manager.is_enabled(rule.get_name()):
                continue
            
            # Execute the compliance check
            check_result = await self._execute_rule(rule, context)
            checks.append(check_result)
        
        # Calculate overall status
        overall_status = self._calculate_overall_status(checks)
        
        return ComplianceReport(
            project_id=project_id,
            project_name=context.get('project_name', ''),
            checks=checks,
            overall_status=overall_status,
            generated_at=datetime.utcnow().isoformat()
        )
    
    async def _execute_rule(
        self,
        rule: ComplianceRulePlugin,
        context: Dict[str, Any]
    ) -> ComplianceCheck:
        """Execute a single compliance rule"""
        try:
            # Check if auto-fix is enabled for this rule
            if (hasattr(rule, 'execute_with_auto_fix') and 
                self.feature_manager.is_enabled('auto-fix')):
                return await rule.execute_with_auto_fix(context)
            
            # Check if notifications are enabled for this rule
            if (hasattr(rule, 'execute_with_notification') and 
                self.feature_manager.is_enabled('notifications')):
                return await rule.execute_with_notification(context)
            
            # Default execution
            return await rule.execute_check(context)
        except Exception as e:
            # Log the error and return a failed check
            return ComplianceCheck(
                rule_id=rule.rule.id,
                status="error",
                details={"error": str(e)},
                timestamp=datetime.utcnow().isoformat()
            )
    
    def _calculate_overall_status(self, checks: List[ComplianceCheck]) -> str:
        """Calculate overall compliance status"""
        if not checks:
            return "unknown"
        
        status_priority = {
            "error": 3,
            "failed": 2,
            "warning": 1,
            "passed": 0
        }
        
        # Get the highest priority status
        max_status = max(
            checks,
            key=lambda x: status_priority.get(x.status, 0)
        ).status
        
        return max_status
    
    async def _build_project_context(self, project_id: str) -> Dict[str, Any]:
        """Build context for compliance checking"""
        # This would fetch project details, repositories, etc.
        # Implementation would go here
        return {
            "project_id": project_id,
            "project_name": "Sample Project",
            "repositories": []
        }