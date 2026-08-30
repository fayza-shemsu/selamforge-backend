from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import TenantContext, get_tenant_context, get_tenant_db

router = APIRouter(prefix="/_debug", tags=["debug"])


@router.get("/whoami")
def whoami(
    ctx: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_tenant_db),
):
    return {"org_id": ctx.org_id, "user_id": ctx.user_id, "role": ctx.role}
