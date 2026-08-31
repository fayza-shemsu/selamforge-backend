from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class OrgUnitCreate(BaseModel):
    name: str
    unit_type: str = "department"
    parent_unit_id: Optional[UUID] = None


class OrgUnitUpdate(BaseModel):
    name: Optional[str] = None
    unit_type: Optional[str] = None
    parent_unit_id: Optional[UUID] = None


class OrgUnitOut(BaseModel):
    id: UUID
    name: str
    unit_type: str
    parent_unit_id: Optional[UUID] = None

    class Config:
        from_attributes = True


class OrgUnitTreeNode(BaseModel):
    id: UUID
    name: str
    unit_type: str
    parent_unit_id: Optional[UUID] = None
    children: List["OrgUnitTreeNode"] = []


OrgUnitTreeNode.model_rebuild()
