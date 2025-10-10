from typing import List, Dict, Any
from pydantic import BaseModel

class ComplianceRule(BaseModel):
    """Base model for compliance rules"""
    id: str
    name: str
    description: str
    level: str
    enabled: bool = True
    
    class Config:
        from_attributes = True

class ComplianceCheck(BaseModel):
    """Model for compliance check results"""
    rule_id: str
    status: str
    details: Dict[str, Any]
    timestamp: str
    
    class Config:
        from_attributes = True

class ComplianceReport(BaseModel):
    """Model for compliance reports"""
    project_id: str
    project_name: str
    checks: List[ComplianceCheck]
    overall_status: str
    generated_at: str
    
    class Config:
        from_attributes = True