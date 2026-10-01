from pydantic_settings import BaseSettings
from sqlalchemy.engine import URL, make_url


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"


settings = Settings()


def normalized_database_url() -> URL:
    url = make_url(settings.database_url)
    if url.drivername in {"postgres", "postgresql"}:
        return url.set(drivername="postgresql+psycopg2")
    return url
