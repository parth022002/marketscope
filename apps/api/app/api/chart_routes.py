"""
MarketScope.io — Charting, OHLCV & Technical Analysis API Routes
Provides endpoints for interactive historical OHLCV bars, technical indicators,
user drawings persistence, and price alerts.
"""

import uuid
from typing import Any
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.domain.canonical_chart import (
    OHLCVBar,
    ChartDataResponse,
    IndicatorType,
    CalculatedIndicatorResponse,
    UserChartDrawing,
    DrawingToolType,
    PriceAlert,
    PriceAlertCondition,
)
from app.engine.historical_data_service import historical_data_service
from app.engine.technical_indicators import TechnicalIndicatorsEngine

chart_router = APIRouter(prefix="", tags=["Charting & Technical Intelligence"])

# In-memory repositories for drawing annotations and alerts
DRAWINGS_STORE: dict[str, UserChartDrawing] = {}
ALERTS_STORE: dict[str, PriceAlert] = {}


# ─────────────────────────────────────────────────────────────────────────────
# 1. Chart & OHLCV Bar Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@chart_router.get(
    "/instruments/{symbol}/ohlcv",
    response_model=list[OHLCVBar],
    summary="Get Historical OHLCV Bars",
)
async def get_instrument_ohlcv(
    symbol: str,
    timeframe: str = Query("1D", description="Timeframe interval (e.g. 1m, 5m, 15m, 1H, 1D, 1W, 1M, 1Y)"),
    limit: int = Query(120, ge=10, le=1000, description="Number of bars to retrieve"),
):
    """Returns validated historical OHLCV candles formatted for financial chart canvases."""
    data = historical_data_service.get_chart_data(symbol=symbol, timeframe=timeframe, limit=limit)
    return data.bars


@chart_router.get(
    "/instruments/{symbol}/chart",
    response_model=ChartDataResponse,
    summary="Get Complete Instrument Chart Package",
)
async def get_instrument_chart_data(
    symbol: str,
    timeframe: str = Query("1D", description="Timeframe interval"),
    limit: int = Query(120, ge=10, le=1000, description="Bar limit"),
):
    """Returns full chart payload including exchange timezone, data freshness status, and bars."""
    return historical_data_service.get_chart_data(symbol=symbol, timeframe=timeframe, limit=limit)


# ─────────────────────────────────────────────────────────────────────────────
# 2. Technical Indicators Calculation Endpoint
# ─────────────────────────────────────────────────────────────────────────────

@chart_router.get(
    "/instruments/{symbol}/indicators",
    response_model=CalculatedIndicatorResponse,
    summary="Calculate Technical Indicator Series",
)
async def get_instrument_indicator(
    symbol: str,
    indicator: IndicatorType = Query(IndicatorType.SMA, description="Indicator type"),
    timeframe: str = Query("1D", description="Chart timeframe"),
    period: int = Query(14, ge=2, le=200, description="Primary period"),
    limit: int = Query(120, ge=20, le=500, description="Historical bar sample size"),
):
    """Calculates mathematical indicator data points from verified historical OHLCV bars."""
    bars = historical_data_service.generate_calibrated_series(symbol=symbol, timeframe=timeframe, limit=limit)

    data_points = []
    if indicator == IndicatorType.SMA:
        data_points = TechnicalIndicatorsEngine.calculate_sma(bars, period=period)
    elif indicator == IndicatorType.EMA:
        data_points = TechnicalIndicatorsEngine.calculate_ema(bars, period=period)
    elif indicator == IndicatorType.VWAP:
        data_points = TechnicalIndicatorsEngine.calculate_vwap(bars)
    elif indicator == IndicatorType.BOLLINGER:
        data_points = TechnicalIndicatorsEngine.calculate_bollinger_bands(bars, period=period)
    elif indicator == IndicatorType.RSI:
        data_points = TechnicalIndicatorsEngine.calculate_rsi(bars, period=period)
    elif indicator == IndicatorType.MACD:
        data_points = TechnicalIndicatorsEngine.calculate_macd(bars)
    elif indicator == IndicatorType.SUPERTREND:
        data_points = TechnicalIndicatorsEngine.calculate_supertrend(bars, period=period)
    elif indicator == IndicatorType.ATR:
        data_points = TechnicalIndicatorsEngine.calculate_atr(bars, period=period)
    elif indicator == IndicatorType.STOCHASTIC:
        data_points = TechnicalIndicatorsEngine.calculate_stochastic(bars, k_period=period)
    elif indicator == IndicatorType.OBV:
        data_points = TechnicalIndicatorsEngine.calculate_obv(bars)

    return CalculatedIndicatorResponse(
        symbol=symbol.upper(),
        indicator_type=indicator,
        timeframe=timeframe,
        data=data_points,
    )


# ─────────────────────────────────────────────────────────────────────────────
# 3. Chart Drawing Tools Persistence
# ─────────────────────────────────────────────────────────────────────────────

class SaveDrawingRequest(BaseModel):
    instrument_id: str
    timeframe: str = "1D"
    tool_type: DrawingToolType
    points: list[dict[str, Any]]
    style: dict[str, Any] = {}


@chart_router.get(
    "/chart/drawings",
    response_model=list[UserChartDrawing],
    summary="Get User Chart Drawings",
)
async def get_user_drawings(
    instrument_id: str = Query(..., description="Instrument identifier"),
    timeframe: str | None = Query(None, description="Filter by chart timeframe"),
):
    """Retrieves saved annotations and geometric drawings for an instrument."""
    results = [
        d for d in DRAWINGS_STORE.values()
        if d.instrument_id.lower() == instrument_id.lower()
        and (timeframe is None or d.timeframe == timeframe)
    ]
    return results


@chart_router.post(
    "/chart/drawings",
    response_model=UserChartDrawing,
    status_code=status.HTTP_201_CREATED,
    summary="Save Chart Drawing Annotation",
)
async def save_user_drawing(payload: SaveDrawingRequest):
    """Persists a trend line, horizontal line, Fibonacci tool, or rectangle annotation."""
    drawing_id = f"draw_{uuid.uuid4().hex[:12]}"
    drawing = UserChartDrawing(
        drawing_id=drawing_id,
        instrument_id=payload.instrument_id,
        timeframe=payload.timeframe,
        tool_type=payload.tool_type,
        points=payload.points,
        style=payload.style,
    )
    DRAWINGS_STORE[drawing_id] = drawing
    return drawing


@chart_router.delete(
    "/chart/drawings/{drawing_id}",
    summary="Delete Chart Drawing",
)
async def delete_user_drawing(drawing_id: str):
    """Removes a specific drawing annotation."""
    if drawing_id in DRAWINGS_STORE:
        del DRAWINGS_STORE[drawing_id]
        return {"status": "success", "message": f"Drawing {drawing_id} deleted"}
    raise HTTPException(status_code=404, detail="Drawing not found")


# ─────────────────────────────────────────────────────────────────────────────
# 4. Price Alerts Management
# ─────────────────────────────────────────────────────────────────────────────

class CreateAlertRequest(BaseModel):
    instrument_id: str
    symbol: str
    condition_type: PriceAlertCondition
    target_value: float
    note: str | None = None


@chart_router.get(
    "/alerts",
    response_model=list[PriceAlert],
    summary="Get Active Price Alerts",
)
async def get_user_alerts(
    symbol: str | None = Query(None, description="Filter by ticker symbol"),
):
    """Returns active and triggered price alerts."""
    alerts = list(ALERTS_STORE.values())
    if symbol:
        alerts = [a for a in alerts if a.symbol.upper() == symbol.upper()]
    return alerts


@chart_router.post(
    "/alerts",
    response_model=PriceAlert,
    status_code=status.HTTP_201_CREATED,
    summary="Create Price Alert",
)
async def create_user_alert(payload: CreateAlertRequest):
    """Creates a price alert condition (crossing above/below, % change, or volume)."""
    alert_id = f"alt_{uuid.uuid4().hex[:10]}"
    alert = PriceAlert(
        alert_id=alert_id,
        instrument_id=payload.instrument_id,
        symbol=payload.symbol.upper(),
        condition_type=payload.condition_type,
        target_value=payload.target_value,
        note=payload.note,
    )
    ALERTS_STORE[alert_id] = alert
    return alert


@chart_router.delete(
    "/alerts/{alert_id}",
    summary="Delete Price Alert",
)
async def delete_user_alert(alert_id: str):
    """Deletes a price alert."""
    if alert_id in ALERTS_STORE:
        del ALERTS_STORE[alert_id]
        return {"status": "success", "message": f"Alert {alert_id} deleted"}
    raise HTTPException(status_code=404, detail="Alert not found")
