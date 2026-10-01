from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.debug import router as debug_router
from app.api.v1.org_units import router as org_units_router
from app.api.v1.employees import router as employees_router
from app.api.v1.attendance import router as attendance_router
from app.services.scheduler import start_scheduler

app = FastAPI(title="SelamForge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(debug_router, prefix="/api/v1")
app.include_router(org_units_router, prefix="/api/v1")
app.include_router(employees_router, prefix="/api/v1")
app.include_router(attendance_router, prefix="/api/v1")


@app.on_event("startup")
def _start_scheduler():
    start_scheduler()


@app.get("/health")
def health():
    return {"status": "ok"}
