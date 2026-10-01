import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, Integer
from sqlalchemy.dialects.postgresql import UUID

from app.core.db import Base
from app.models.base import TenantScopedModel


class OrgUnit(Base, TenantScopedModel):
    __tablename__ = "org_units"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    unit_type = Column(String, nullable=False, default="department")
    parent_unit_id = Column(UUID(as_uuid=True), ForeignKey("org_units.id"), nullable=True)
    latitude = Column(Numeric(9, 6), nullable=True)
    longitude = Column(Numeric(9, 6), nullable=True)
    allowed_radius_meters = Column(Integer, nullable=False, default=150)
    created_at = Column(DateTime, default=datetime.utcnow)
