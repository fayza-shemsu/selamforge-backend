import uuid
from datetime import datetime, date

from sqlalchemy import Column, String, Date, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.db import Base
from app.models.base import TenantScopedModel


class Employee(Base, TenantScopedModel):
    __tablename__ = "employees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_unit_id = Column(UUID(as_uuid=True), ForeignKey("org_units.id"), nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    hire_date = Column(Date, nullable=False)
    base_salary_etb = Column(Numeric(12, 2), nullable=False)
    is_ethiopian_national = Column(Boolean, nullable=False, default=True)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
