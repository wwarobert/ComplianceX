from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ...services.compliance_service import ComplianceService
from ...models.compliance import ComplianceReport

router = APIRouter(prefix="/api/v1/compliance")

async def get_compliance_service():
    """Dependency injection for ComplianceService"""
    return ComplianceService()

@router.get("/check/{project_id}", response_model=ComplianceReport)
async def check_project_compliance(
    project_id: str,
    compliance_service: ComplianceService = Depends(get_compliance_service)
):
    """Check compliance for a specific project"""
    try:
        report = await compliance_service.check_project_compliance(project_id)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check compliance: {str(e)}"
        )

@router.get("/rules", response_model=List[dict])
async def get_compliance_rules(
    compliance_service: ComplianceService = Depends(get_compliance_service)
):
    """Get all available compliance rules"""
    rules = [
        {
            "id": rule.rule.id,
            "name": rule.rule.name,
            "description": rule.rule.description,
            "level": rule.rule.level,
            "enabled": rule.enabled
        }
        for rule in compliance_service.plugin_manager.get_plugins_by_type(
            ComplianceRulePlugin
        )
    ]
    return rules