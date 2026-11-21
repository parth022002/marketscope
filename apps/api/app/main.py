import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import SessionLocal
from app.core.seed import seed_database
from app.api.routes import router

# Optional Sentry Error Telemetry Initialization
sentry_dsn = os.getenv("SENTRY_DSN", "")
if sentry_dsn:
    try:
        import sentry_sdk
        sentry_sdk.init(
            dsn=sentry_dsn,
            environment=settings.app_env,
            traces_sample_rate=1.0 if settings.app_env == "development" else 0.2,
        )
    except Exception:
        pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Optional seed on startup if database is reachable
    try:
        db = SessionLocal()
        seed_database(db)
        db.close()
    except Exception:
        pass
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.2.0",
    description="MarketScope.io Financial Research & Intelligence API (Modular Monolith)",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_env == "development" else settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "marketscope-api",
        "environment": settings.app_env,
        "database": "neon-postgresql",
    }
