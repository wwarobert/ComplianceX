import pytest
from src.backend.core.compliance.engine import RuleEngine
from src.backend.models.compliance import ComplianceRule, ComplianceCheck

@pytest.fixture
def rule_engine():
    return RuleEngine()

@pytest.fixture
def sample_rule():
    return ComplianceRule(
        id="test-rule-1",
        name="Test Rule",
        description="A test compliance rule",
        level="error"
    )

async def test_rule_registration(rule_engine, sample_rule):
    rule_engine.register_rule(sample_rule)
    assert sample_rule.id in rule_engine.rules
    assert rule_engine.rules[sample_rule.id] == sample_rule

async def test_compliance_check_execution(rule_engine, sample_rule):
    class TestChecker:
        async def check_compliance(self, project_id: str) -> list[ComplianceCheck]:
            return [
                ComplianceCheck(
                    rule_id=sample_rule.id,
                    status="passed",
                    details={},
                    timestamp="2025-10-10T00:00:00Z"
                )
            ]
    
    rule_engine.register_rule(sample_rule)
    rule_engine.register_checker(sample_rule.id, TestChecker())
    
    results = await rule_engine.run_checks("test-project")
    assert len(results) == 1
    assert results[0].rule_id == sample_rule.id
    assert results[0].status == "passed"