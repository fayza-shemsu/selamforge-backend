from dataclasses import dataclass
from typing import Generator

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import event
from sqlalchemy.orm import Session, with_loader_criteria

from app.core.context import org_id_ctx, user_id_ctx
from app.core.db import SessionLocal
from app.core.security import decode_token
from app.models.base import TenantScopedModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


@dataclass
class TenantContext:
    org_id: str
    user_id: str
    role: str


def get_tenant_context(token: str = Depends(oauth2_scheme)) -> TenantContext:
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="invalid or expired token")

    org_id = payload["org_id"]
    user_id = payload["sub"]
    role = payload.get("role", "employee")

    org_id_ctx.set(org_id)
    user_id_ctx.set(user_id)

    return TenantContext(org_id=org_id, user_id=user_id, role=role)


def get_tenant_db(ctx: TenantContext = Depends(get_tenant_context)) -> Generator[Session, None, None]:
    session = SessionLocal()
    org_id = ctx.org_id  # plain str, safe for SQLAlchemy lambda caching

    @event.listens_for(session, "do_orm_execute")
    def _add_tenant_filter(execute_state):
        if execute_state.is_select:
            execute_state.statement = execute_state.statement.options(
                with_loader_criteria(
                    TenantScopedModel,
                    lambda cls: cls.org_id == org_id,
                    include_aliases=True,
                )
            )

    try:
        yield session
    finally:
        session.close()
