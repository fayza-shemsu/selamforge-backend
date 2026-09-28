import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import TenantContext, get_tenant_context, get_tenant_db, require_role
from app.models.org_unit import OrgUnit
from app.schemas.org_unit import (
    OrgUnitCreate,
    OrgUnitUpdate,
    OrgUnitOut,
    OrgUnitTreeNode,
)

router = APIRouter(prefix="/org-units", tags=["org-units"])


def _validate_parent(db, parent_unit_id):
    """The parent unit must belong to the caller's own org."""
    if parent_unit_id is not None:
        if db.query(OrgUnit).filter(OrgUnit.id == parent_unit_id).first() is None:
            raise HTTPException(status_code=400, detail="parent_unit_id not found")


@router.post("", response_model=OrgUnitOut)
def create_org_unit(
    payload: OrgUnitCreate,
    ctx: TenantContext = Depends(require_role("admin")),
    db: Session = Depends(get_tenant_db),
):
    _validate_parent(db, payload.parent_unit_id)

    org_unit = OrgUnit(
        org_id=ctx.org_id,
        name=payload.name,
        unit_type=payload.unit_type,
        parent_unit_id=payload.parent_unit_id,
    )
    db.add(org_unit)
    db.commit()
    db.refresh(org_unit)
    return org_unit


@router.get("", response_model=List[OrgUnitOut])
def list_org_units(
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    return db.query(OrgUnit).all()


@router.get("/tree", response_model=List[OrgUnitTreeNode])
def get_org_unit_tree(
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    all_units = db.query(OrgUnit).all()

    nodes = {
        unit.id: OrgUnitTreeNode(
            id=unit.id,
            name=unit.name,
            unit_type=unit.unit_type,
            parent_unit_id=unit.parent_unit_id,
            children=[],
        )
        for unit in all_units
    }

    roots = []
    for unit in all_units:
        node = nodes[unit.id]
        if unit.parent_unit_id is None:
            roots.append(node)
        else:
            parent = nodes.get(unit.parent_unit_id)
            if parent:
                parent.children.append(node)

    return roots


@router.patch("/{org_unit_id}", response_model=OrgUnitOut)
def update_org_unit(
    org_unit_id: uuid.UUID,
    payload: OrgUnitUpdate,
    ctx: TenantContext = Depends(require_role("admin")),
    db: Session = Depends(get_tenant_db),
):
    org_unit = db.query(OrgUnit).filter(OrgUnit.id == org_unit_id).first()
    if not org_unit:
        raise HTTPException(status_code=404, detail="org unit not found")

    if payload.name is not None:
        org_unit.name = payload.name
    if payload.unit_type is not None:
        org_unit.unit_type = payload.unit_type
    if payload.parent_unit_id is not None:
        _validate_parent(db, payload.parent_unit_id)
        org_unit.parent_unit_id = payload.parent_unit_id

    db.commit()
    db.refresh(org_unit)
    return org_unit


@router.delete("/{org_unit_id}")
def delete_org_unit(
    org_unit_id: uuid.UUID,
    ctx: TenantContext = Depends(require_role("admin")),
    db: Session = Depends(get_tenant_db),
):
    org_unit = db.query(OrgUnit).filter(OrgUnit.id == org_unit_id).first()
    if not org_unit:
        raise HTTPException(status_code=404, detail="org unit not found")

    db.delete(org_unit)
    db.commit()
    return {"detail": "deleted"}
