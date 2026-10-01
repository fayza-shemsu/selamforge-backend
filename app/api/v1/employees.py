import csv
import io
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.deps import TenantContext, get_tenant_context, get_tenant_db, require_role
from app.core.pagination import paginate
from app.core.events import emit_event
from app.models.employee import Employee
from app.models.org_unit import OrgUnit
from app.models.leave_balance import LeaveBalance
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeOut

router = APIRouter(prefix="/employees", tags=["employees"])


def _validate_refs(db, manager_id, org_unit_id):
    """The manager and org unit must belong to the caller's own org."""
    if manager_id is not None:
        if db.query(Employee).filter(Employee.id == manager_id).first() is None:
            raise HTTPException(status_code=400, detail="manager_id not found")
    if org_unit_id is not None:
        if db.query(OrgUnit).filter(OrgUnit.id == org_unit_id).first() is None:
            raise HTTPException(status_code=400, detail="org_unit_id not found")


@router.post("", response_model=EmployeeOut)
def create_employee(
    payload: EmployeeCreate,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    existing = db.query(Employee).filter(Employee.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="employee with this email already exists")

    _validate_refs(db, payload.manager_id, payload.org_unit_id)

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
    db.flush()  # assigns employee.id without committing yet

    emit_event(
        db,
        org_id=ctx.org_id,
        event_type="employee.created",
        source_module="employees",
        payload={"employee_id": str(employee.id)},
    )

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
    _validate_refs(db, update_data.get("manager_id"), update_data.get("org_unit_id"))
    for field, value in update_data.items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: uuid.UUID,
    ctx: TenantContext = Depends(require_role("admin")),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")

    employee.status = "inactive"
    db.commit()
    return {"detail": "employee deactivated"}


@router.get("/{employee_id}/reports-chain")
def get_reports_chain(
    employee_id: uuid.UUID,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")

    chain = []
    seen = {employee.id}
    current = employee

    max_depth = 20
    for _ in range(max_depth):
        if current.manager_id is None:
            break
        if current.manager_id in seen:
            raise HTTPException(status_code=400, detail="cycle detected in manager chain")

        manager = db.query(Employee).filter(Employee.id == current.manager_id).first()
        if manager is None:
            break

        chain.append(EmployeeOut.model_validate(manager))
        seen.add(manager.id)
        current = manager
    else:
        raise HTTPException(status_code=400, detail="manager chain exceeds maximum depth")

    return {"employee_id": employee_id, "chain": chain}


@router.get("/{employee_id}/direct-reports")
def get_direct_reports(
    employee_id: uuid.UUID,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    reports = db.query(Employee).filter(Employee.manager_id == employee_id).all()
    return {"employee_id": employee_id, "direct_reports": [EmployeeOut.model_validate(r) for r in reports]}


# ---- CSV import (Day 14) ----------------------------------------------------

MAX_IMPORT_BYTES = 2 * 1024 * 1024
MAX_IMPORT_ROWS = 1000


def _parse_employee_csv(text, known_units, known_employees, existing_emails):
    """Validate every CSV row. Returns (valid_payloads, errors).

    Row numbers are file line numbers: the header is row 1, the first data row is row 2.
    """
    reader = csv.DictReader(io.StringIO(text))
    reader.fieldnames = [name.strip() for name in (reader.fieldnames or [])]

    required = [name for name, field in EmployeeCreate.model_fields.items() if field.is_required()]
    missing = [name for name in required if name not in reader.fieldnames]
    if missing:
        raise HTTPException(
            status_code=400,
            detail="missing required column(s): " + ", ".join(missing),
        )

    valid, errors = [], []
    seen_in_file = set()
    processed = 0
    for raw_row in reader:
        row_number = reader.line_num
        processed += 1
        if processed > MAX_IMPORT_ROWS:
            raise HTTPException(status_code=413, detail=f"too many rows (max {MAX_IMPORT_ROWS})")

        # A blank cell means "not provided": required fields then report "Field required"
        # and optional fields fall back to their defaults.
        cleaned = {
            key: value.strip()
            for key, value in raw_row.items()
            if key and isinstance(value, str) and value.strip()
        }
        if not cleaned:
            continue

        try:
            payload = EmployeeCreate.model_validate(cleaned)
        except ValidationError as exc:
            for err in exc.errors():
                errors.append({
                    "row": row_number,
                    "field": ".".join(str(part) for part in err["loc"]) or "row",
                    "message": err["msg"],
                })
            continue

        problems = []
        email_key = payload.email.lower()
        if email_key in existing_emails:
            problems.append(("email", "an employee with this email already exists"))
        elif email_key in seen_in_file:
            problems.append(("email", "duplicate of an earlier row in this file"))
        if payload.manager_id is not None and str(payload.manager_id) not in known_employees:
            problems.append(("manager_id", "manager_id not found"))
        if payload.org_unit_id is not None and str(payload.org_unit_id) not in known_units:
            problems.append(("org_unit_id", "org_unit_id not found"))

        if problems:
            for field, message in problems:
                errors.append({"row": row_number, "field": field, "message": message})
            continue

        seen_in_file.add(email_key)
        valid.append(payload)

    return valid, errors


@router.post("/import")
def import_employees(
    file: UploadFile = File(...),
    ctx: TenantContext = Depends(require_role("admin")),
    db: Session = Depends(get_tenant_db),
):
    """Bulk-create employees from a CSV file.

    Valid rows are committed in one transaction. Invalid rows are returned as
    {row, field, message} and never block the valid ones.
    """
    raw = file.file.read(MAX_IMPORT_BYTES + 1)
    if len(raw) > MAX_IMPORT_BYTES:
        raise HTTPException(status_code=413, detail="file too large (max 2 MB)")
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="file must be a UTF-8 encoded CSV")

    # Tenant-filtered queries: only this org's units and employees are visible here.
    known_units = {str(unit.id) for unit in db.query(OrgUnit).all()}
    employees = db.query(Employee).all()
    known_employees = {str(e.id) for e in employees}
    existing_emails = {e.email.lower() for e in employees}

    try:
        valid, errors = _parse_employee_csv(text, known_units, known_employees, existing_emails)
    except csv.Error:
        raise HTTPException(status_code=400, detail="could not parse the CSV file")

    for payload in valid:
        employee = Employee(
            id=uuid.uuid4(),
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
        emit_event(
            db,
            org_id=ctx.org_id,
            event_type="employee.created",
            source_module="employees",
            payload={"employee_id": str(employee.id)},
        )

    db.commit()
    return {"created": len(valid), "errors": errors}


@router.get("/{employee_id}/leave-balance")
def get_leave_balance(
    employee_id: uuid.UUID,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")

    balance = db.query(LeaveBalance).filter(LeaveBalance.employee_id == employee_id).first()
    if not balance:
        raise HTTPException(status_code=404, detail="leave balance not found")

    accrued = float(balance.accrued_days)
    used = float(balance.used_days)
    return {
        "employee_id": str(employee_id),
        "accrued_days": round(accrued, 2),
        "used_days": round(used, 2),
        "remaining_days": round(accrued - used, 2),
    }
