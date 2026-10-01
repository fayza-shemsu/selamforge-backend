from datetime import date, datetime, time, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import TenantContext, get_tenant_context, get_tenant_db
from app.core.pagination import paginate
from app.models.attendance_log import AttendanceLog
from app.models.employee import Employee
from app.schemas.attendance import ClockInRequest, ClockOutRequest, AttendanceLogOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("")
def list_attendance(
    employee_id: Optional[UUID] = Query(default=None),
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    query = db.query(AttendanceLog)
    if employee_id is not None:
        query = query.filter(AttendanceLog.employee_id == employee_id)
    if from_date is not None:
        query = query.filter(
            AttendanceLog.clock_in_at >= datetime.combine(from_date, time.min)
        )
    if to_date is not None:
        query = query.filter(
            AttendanceLog.clock_in_at < datetime.combine(to_date + timedelta(days=1), time.min)
        )

    result = paginate(
        query.order_by(AttendanceLog.clock_in_at.desc()),
        page=page,
        page_size=page_size,
    )
    result["items"] = [AttendanceLogOut.model_validate(item) for item in result["items"]]
    return result


@router.post("/clock-in", response_model=AttendanceLogOut)
def clock_in(
    payload: ClockInRequest,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")

    open_log = (
        db.query(AttendanceLog)
        .filter(
            AttendanceLog.employee_id == payload.employee_id,
            AttendanceLog.clock_out_at.is_(None),
        )
        .first()
    )
    if open_log:
        raise HTTPException(status_code=409, detail="employee already clocked in")

    log = AttendanceLog(
        org_id=ctx.org_id,
        employee_id=payload.employee_id,
        clock_in_at=datetime.utcnow(),
        geofence_lat=payload.geofence_lat,
        geofence_lng=payload.geofence_lng,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.post("/clock-out", response_model=AttendanceLogOut)
def clock_out(
    payload: ClockOutRequest,
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="employee not found")

    open_log = (
        db.query(AttendanceLog)
        .filter(
            AttendanceLog.employee_id == payload.employee_id,
            AttendanceLog.clock_out_at.is_(None),
        )
        .order_by(AttendanceLog.clock_in_at.desc())
        .first()
    )
    if not open_log:
        raise HTTPException(status_code=409, detail="employee is not clocked in")

    open_log.clock_out_at = datetime.utcnow()
    db.commit()
    db.refresh(open_log)
    return open_log
