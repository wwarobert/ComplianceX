from abc import ABC, abstractmethod
from typing import List, Dict, Any
from ..models.compliance import ComplianceRule, ComplianceCheck

class ComplianceChecker(ABC):
    """Base class for compliance checkers"""
    
    @abstractmethod
    async def check_compliance(self, project_id: str) -> List[ComplianceCheck]:
        """Check compliance for a given project"""
        pass

class RuleEngine:
    """Engine for managing and executing compliance rules"""
    
    def __init__(self):
        self.rules: Dict[str, ComplianceRule] = {}
        self.checkers: Dict[str, ComplianceChecker] = {}
    
    def register_rule(self, rule: ComplianceRule):
        """Register a new compliance rule"""
        self.rules[rule.id] = rule
    
    def register_checker(self, rule_id: str, checker: ComplianceChecker):
        """Register a checker for a specific rule"""
        self.checkers[rule_id] = checker
    
    async def run_checks(self, project_id: str) -> List[ComplianceCheck]:
        """Run all compliance checks for a project"""
        results = []
        for rule_id, checker in self.checkers.items():
            if rule_id in self.rules and self.rules[rule_id].enabled:
                checks = await checker.check_compliance(project_id)
                results.extend(checks)
        return results