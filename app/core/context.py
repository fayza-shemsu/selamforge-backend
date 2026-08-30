from contextvars import ContextVar

org_id_ctx: ContextVar[str] = ContextVar("org_id_ctx")
user_id_ctx: ContextVar[str] = ContextVar("user_id_ctx")
