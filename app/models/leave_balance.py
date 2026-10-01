import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.db import Base
from app.models.base import TenantScopedModel


class LeaveBalance(Base, TenantScopedModel):
    __tablename__ = "leave_balances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, index=True)
    accrued_days = Column(Numeric(6, 2), nullable=False, default=0)
    used_days = Column(Numeric(6, 2), nullable=False, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
