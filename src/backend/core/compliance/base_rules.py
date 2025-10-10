from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
from ..plugins.plugin_manager import Plugin
from ...models.compliance import ComplianceCheck, ComplianceRule

class ComplianceRulePlugin(Plugin):
    """Base class for compliance rule plugins"""
    
    def __init__(self):
        self.rule: Optional[ComplianceRule] = None
        self.enabled: bool = True
    
    @abstractmethod
    async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
        """Execute the compliance check"""
        pass
    
    @abstractmethod
    def get_rule_definition(self) -> ComplianceRule:
        """Get the rule definition"""
        pass
    
    def initialize(self, config: Dict[str, Any]) -> None:
        """Initialize the rule with configuration"""
        self.rule = self.get_rule_definition()
        self.enabled = config.get('enabled', True)
    
    def get_name(self) -> str:
        """Get the rule name"""
        return self.rule.name if self.rule else "Unknown Rule"
    
    def get_version(self) -> str:
        """Get the rule version"""
        return "1.0.0"

class AutoFixMixin:
    """Mixin for rules that can automatically fix compliance issues"""
    
    @abstractmethod
    async def can_auto_fix(self, context: Dict[str, Any]) -> bool:
        """Check if the issue can be automatically fixed"""
        pass
    
    @abstractmethod
    async def apply_fix(self, context: Dict[str, Any]) -> bool:
        """Apply the automatic fix"""
        pass

class NotificationMixin:
    """Mixin for rules that can send notifications"""
    
    @abstractmethod
    async def should_notify(self, check_result: ComplianceCheck) -> bool:
        """Check if a notification should be sent"""
        pass
    
    @abstractmethod
    async def get_notification_message(self, check_result: ComplianceCheck) -> str:
        """Get the notification message"""
        pass

class ComplianceRuleBase(ComplianceRulePlugin):
    """Base implementation for compliance rules"""
    
    async def execute_check(self, context: Dict[str, Any]) -> ComplianceCheck:
        """Execute the compliance check with timing and error handling"""
        start_time = datetime.utcnow()
        
        try:
            result = await self.check_compliance(context)
        except Exception as e:
            result = ComplianceCheck(
                rule_id=self.rule.id,
                status="error",
                details={"error": str(e)},
                timestamp=start_time.isoformat()
            )
        
        return result

class AutoFixableRule(ComplianceRuleBase, AutoFixMixin):
    """Base class for rules that support automatic fixing"""
    
    async def execute_with_auto_fix(self, context: Dict[str, Any]) -> ComplianceCheck:
        """Execute check and attempt to fix if needed"""
        check_result = await self.execute_check(context)
        
        if (check_result.status == "failed" and 
            await self.can_auto_fix(context)):
            
            fix_success = await self.apply_fix(context)
            if fix_success:
                # Re-run check after fix
                check_result = await self.execute_check(context)
                check_result.details["auto_fixed"] = True
        
        return check_result

class NotifiableRule(ComplianceRuleBase, NotificationMixin):
    """Base class for rules that support notifications"""
    
    async def execute_with_notification(self, context: Dict[str, Any]) -> ComplianceCheck:
        """Execute check and handle notifications"""
        check_result = await self.execute_check(context)
        
        if await self.should_notify(check_result):
            notification_msg = await self.get_notification_message(check_result)
            # Notification handling would go here
            check_result.details["notification_sent"] = True
        
        return check_result