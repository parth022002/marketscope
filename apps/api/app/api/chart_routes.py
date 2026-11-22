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
    ChartLayout,
    ChartLayoutType,
)
from app.engine.historical_data_service import historical_data_service
from app.engine.technical_indicators import TechnicalIndicatorsEngine

chart_router = APIRouter(prefix="", tags=["Charting & Technical Intelligence"])

# In-memory repositories for drawing annotations, layouts, and alerts
DRAWINGS_STORE: dict[str, UserChartDrawing] = {}
ALERTS_STORE: dict[str, PriceAlert] = {}
LAYOUTS_STORE: dict[str, ChartLayout] = {}


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
    elif indicator == IndicatorType.WMA:
        data_points = TechnicalIndicatorsEngine.calculate_wma(bars, period=period)
    elif indicator == IndicatorType.HMA:
        data_points = TechnicalIndicatorsEngine.calculate_hma(bars, period=period)
    elif indicator == IndicatorType.STOCH_RSI:
        data_points = TechnicalIndicatorsEngine.calculate_stoch_rsi(bars, rsi_period=period)
    elif indicator == IndicatorType.CCI:
        data_points = TechnicalIndicatorsEngine.calculate_cci(bars, period=period)
    elif indicator == IndicatorType.WILLIAMS_R:
        data_points = TechnicalIndicatorsEngine.calculate_williams_r(bars, period=period)
    elif indicator == IndicatorType.ICHIMOKU:
        data_points = TechnicalIndicatorsEngine.calculate_ichimoku(bars)
    elif indicator == IndicatorType.KELTNER:
        data_points = TechnicalIndicatorsEngine.calculate_keltner(bars, ema_period=period)
    elif indicator == IndicatorType.CMF:
        data_points = TechnicalIndicatorsEngine.calculate_cmf(bars, period=period)
    elif indicator == IndicatorType.ADX:
        data_points = TechnicalIndicatorsEngine.calculate_adx(bars, period=period)

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


# ─────────────────────────────────────────────────────────────────────────────
# 5. Multi-Chart Layout Persistence
# ─────────────────────────────────────────────────────────────────────────────

class SaveLayoutRequest(BaseModel):
    name: str = "My Custom Layout"
    layout_type: ChartLayoutType = ChartLayoutType.SINGLE
    active_symbols: list[str] = ["NIFTY", "RELIANCE"]
    indicators: list[dict[str, Any]] = []
    timeframe: str = "1D"


@chart_router.get(
    "/chart/layouts",
    response_model=list[ChartLayout],
    summary="Get User Saved Chart Layouts",
)
async def get_user_chart_layouts(user_id: str = "default_user"):
    """Returns all saved multi-chart layouts for the user."""
    # Ensure default workspace exists
    if not LAYOUTS_STORE:
        default_layout = ChartLayout(
            layout_id="layout_default",
            user_id="default_user",
            name="Default Workspace",
            layout_type=ChartLayoutType.SINGLE,
            active_symbols=["NIFTY"],
            timeframe="1D",
        )
        LAYOUTS_STORE[default_layout.layout_id] = default_layout

    return [l for l in LAYOUTS_STORE.values() if l.user_id == user_id]


@chart_router.post(
    "/chart/layouts",
    response_model=ChartLayout,
    status_code=status.HTTP_201_CREATED,
    summary="Save Chart Layout Workspace",
)
async def save_user_chart_layout(payload: SaveLayoutRequest, user_id: str = "default_user"):
    """Persists a multi-chart layout configuration."""
    layout_id = f"layout_{uuid.uuid4().hex[:10]}"
    layout = ChartLayout(
        layout_id=layout_id,
        user_id=user_id,
        name=payload.name,
        layout_type=payload.layout_type,
        active_symbols=payload.active_symbols,
        indicators=payload.indicators,
        timeframe=payload.timeframe,
    )
    LAYOUTS_STORE[layout_id] = layout
    return layout


@chart_router.delete(
    "/chart/layouts/{layout_id}",
    summary="Delete Chart Layout",
)
async def delete_user_chart_layout(layout_id: str):
    """Deletes a saved layout."""
    if layout_id in LAYOUTS_STORE:
        del LAYOUTS_STORE[layout_id]
        return {"status": "success", "message": f"Layout {layout_id} deleted"}
    raise HTTPException(status_code=404, detail="Layout not found")
