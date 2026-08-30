import uuid
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID


class TenantScopedModel:
    org_id = Column(UUID(as_uuid=True), ForeignKey("orgs.id"), nullable=False, index=True)
