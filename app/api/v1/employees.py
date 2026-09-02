import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import TenantContext, get_tenant_context, get_tenant_db
from app.core.pagination import paginate
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeOut

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", response_model=EmployeeOut)
def create_employee(
    payload: EmployeeCreate,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    existing = db.query(Employee).filter(Employee.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="employee with this email already exists")

    employee = Employee(
        org_id=ctx.org_id,
        org_unit_id=payload.org_unit_id,
        manager_id=payload.manager_id,
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        hire_date=payload.hire_date,
        base_salary_etb=payload.base_salary_etb,
        is_ethiopian_national=payload.is_ethiopian_national,
        status="active",
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.get("")
def list_employees(
    org_unit_id: Optional[uuid.UUID] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    query = db.query(Employee).filter(Employee.status != "inactive")

    if org_unit_id is not None:
        query = query.filter(Employee.org_unit_id == org_unit_id)

    result = paginate(query, page=page, page_size=page_size)
    result["items"] = [EmployeeOut.model_validate(e) for e in result["items"]]
    return result


@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(
    employee_id: uuid.UUID,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")
    return employee


@router.patch("/{employee_id}", response_model=EmployeeOut)
def update_employee(
    employee_id: uuid.UUID,
    payload: EmployeeUpdate,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: uuid.UUID,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")

    employee.status = "inactive"
    db.commit()
    return {"detail": "employee deactivated"}
