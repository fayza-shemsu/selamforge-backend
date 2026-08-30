from jose import jwt, JWTError
from app.core.config import settings


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        raise ValueError("invalid token")

    if "org_id" not in payload or "sub" not in payload:
        raise ValueError("token missing org_id or sub claim")

    return payload
