from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ClockInRequest(BaseModel):
    employee_id: UUID
    geofence_lat: Optional[Decimal] = None
    geofence_lng: Optional[Decimal] = None


class ClockOutRequest(BaseModel):
    employee_id: UUID


class AttendanceLogOut(BaseModel):
    id: UUID
    employee_id: UUID
    clock_in_at: datetime
    clock_out_at: Optional[datetime] = None
    geofence_lat: Optional[Decimal] = None
    geofence_lng: Optional[Decimal] = None

    class Config:
        from_attributes = True
