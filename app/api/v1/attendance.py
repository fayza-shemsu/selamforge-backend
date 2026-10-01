from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import TenantContext, get_tenant_context, get_tenant_db
from app.models.attendance_log import AttendanceLog
from app.models.employee import Employee
from app.models.org_unit import OrgUnit
from app.services.geo import haversine_meters
from app.schemas.attendance import ClockInRequest, ClockOutRequest, AttendanceLogOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


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

    if employee.org_unit_id is not None and payload.geofence_lat is not None and payload.geofence_lng is not None:
        org_unit = db.query(OrgUnit).filter(OrgUnit.id == employee.org_unit_id).first()
        if org_unit and org_unit.latitude is not None and org_unit.longitude is not None:
            distance = haversine_meters(
                float(org_unit.latitude),
                float(org_unit.longitude),
                float(payload.geofence_lat),
                float(payload.geofence_lng),
            )
            if distance > org_unit.allowed_radius_meters:
                raise HTTPException(
                    status_code=422,
                    detail=f"clock-in location is {distance:.0f}m from the allowed site, which only permits {org_unit.allowed_radius_meters}m",
                )

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
