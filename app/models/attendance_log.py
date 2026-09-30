import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.db import Base
from app.models.base import TenantScopedModel


class AttendanceLog(Base, TenantScopedModel):
    __tablename__ = "attendance_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, index=True)
    clock_in_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    clock_out_at = Column(DateTime, nullable=True)
    geofence_lat = Column(Numeric(9, 6), nullable=True)
    geofence_lng = Column(Numeric(9, 6), nullable=True)
