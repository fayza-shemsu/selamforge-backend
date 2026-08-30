from fastapi import FastAPI

from app.api.v1.auth import router as auth_router
from app.api.v1.debug import router as debug_router

app = FastAPI(title="SelamForge API")

app.include_router(auth_router, prefix="/api/v1")
app.include_router(debug_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}
