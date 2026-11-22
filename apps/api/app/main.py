import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.core.seed import seed_database
from app.api.routes import router
from app.api.websocket_routes import ws_router
from app.api.derivatives_routes import derivatives_router
from app.api.backtest_routes import backtest_router
from app.api.chart_routes import chart_router
from app.api.news_routes import news_router
from app.api.calendar_routes import calendar_router
from app.api.assistant_routes import assistant_router
from app.api.quant_routes import quant_router
from app.api.universal_search_routes import router as universal_search_router
from app.core.middleware import CorrelationIdMiddleware, SecurityHeadersMiddleware

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

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(CorrelationIdMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_env == "development" else settings.cors_origins,
    allow_origin_regex=r"^https:\/\/.*\.onrender\.com$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

app.include_router(quant_router, prefix="/api/v1")
app.include_router(calendar_router, prefix="/api/v1")
app.include_router(assistant_router, prefix="/api/v1")
app.include_router(chart_router, prefix="/api/v1")
app.include_router(news_router, prefix="/api/v1")
app.include_router(derivatives_router, prefix="/api/v1")
app.include_router(backtest_router, prefix="/api/v1")
app.include_router(router, prefix="/api/v1")
app.include_router(universal_search_router)
app.include_router(ws_router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "marketscope-api",
        "environment": settings.app_env,
        "version": "0.2.0",
        "timestamp": time.time(),
    }


@app.get("/health/live")
def health_live():
    return {
        "status": "alive",
        "service": "marketscope-api",
        "timestamp": time.time(),
    }


@app.get("/health/ready")
def health_ready():
    db_status = "disconnected"
    db_latency_ms = None
    try:
        t0 = time.perf_counter()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        elapsed = (time.perf_counter() - t0) * 1000.0
        db_status = "connected"
        db_latency_ms = round(elapsed, 2)
    except Exception as e:
        db_status = f"unreachable: {type(e).__name__}"

    is_ready = (db_status == "connected") or (settings.app_env == "development")

    return {
        "status": "ready" if is_ready else "degraded",
        "service": "marketscope-api",
        "environment": settings.app_env,
        "database": {
            "status": db_status,
            "latency_ms": db_latency_ms,
        },
        "cache": "in-memory-event-bus",
        "timestamp": time.time(),
    }
