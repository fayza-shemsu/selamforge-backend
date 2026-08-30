from dataclasses import dataclass

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.core.context import org_id_ctx, user_id_ctx
from app.core.security import decode_token

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
