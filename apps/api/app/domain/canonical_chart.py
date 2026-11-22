"""
MarketScope.io — Canonical Charting, OHLCV & Technical Analysis Domain Models
Defines immutable data contracts for OHLCV bars, chart timeframes, indicator parameters,
drawing objects, and price alerts.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class ChartTimeframe(str, Enum):
    M1 = "1m"
    M3 = "3m"
    M5 = "5m"
    M10 = "10m"
    M15 = "15m"
    M30 = "30m"
    M45 = "45m"
    H1 = "1H"
    H2 = "2H"
    H4 = "4H"
    D1 = "1D"
    W1 = "1W"
    MO1 = "1M"
    MO3 = "3M"
    MO6 = "6M"
    Y1 = "1Y"
    Y5 = "5Y"
    ALL = "ALL"


class ChartType(str, Enum):
    CANDLESTICK = "CANDLESTICK"
    HOLLOW_CANDLES = "HOLLOW_CANDLES"
    BAR = "BAR"
    LINE = "LINE"
    AREA = "AREA"
    BASELINE = "BASELINE"
    HEIKIN_ASHI = "HEIKIN_ASHI"


class IndicatorType(str, Enum):
    SMA = "SMA"
    EMA = "EMA"
    VWAP = "VWAP"
    BOLLINGER = "BOLLINGER"
    RSI = "RSI"
    MACD = "MACD"
    SUPERTREND = "SUPERTREND"
    ATR = "ATR"
    STOCHASTIC = "STOCHASTIC"
    OBV = "OBV"


class DrawingToolType(str, Enum):
    CROSSHAIR = "crosshair"
    TREND_LINE = "trend_line"
    HORIZONTAL_LINE = "horizontal_line"
    VERTICAL_LINE = "vertical_line"
    RAY = "ray"
    EXTENDED_LINE = "extended_line"
    RECTANGLE = "rectangle"
    PARALLEL_CHANNEL = "parallel_channel"
    FIBONACCI_RETRACEMENT = "fibonacci_retracement"
    PRICE_RANGE = "price_range"
    DATE_RANGE = "date_range"
    TEXT_ANNOTATION = "text_annotation"
    ARROW = "arrow"
    BRUSH = "brush"


class OHLCVBar(BaseModel):
    time: int | str  # Unix timestamp in seconds (int) or ISO date string (YYYY-MM-DD)
    open: float
    high: float
    low: float
    close: float
    volume: float = 0.0


class ChartDataResponse(BaseModel):
    instrument_id: str
    symbol: str
    exchange: str
    currency: str
    timeframe: str
    data_status: str  # "LIVE", "DELAYED_15M", "EOD", "HISTORICAL", "SYNTHETIC"
    data_source: str
    last_timestamp: str
    exchange_timezone: str = "Asia/Kolkata"
    bars: list[OHLCVBar] = Field(default_factory=list)


class IndicatorParameter(BaseModel):
    name: str
    value: float | int | str


class TechnicalIndicatorConfig(BaseModel):
    indicator_type: IndicatorType
    is_visible: bool = True
    color: str = "#22D3EE"
    line_width: int = 2
    period: int = 14
    parameters: dict[str, Any] = Field(default_factory=dict)
    panel: str = "main"  # "main" (overlay) or "sub" (separate pane)


class IndicatorDataPoint(BaseModel):
    time: int | str
    values: dict[str, float]  # e.g., {"sma": 2540.2} or {"macd": 12.4, "signal": 10.1, "histogram": 2.3}


class CalculatedIndicatorResponse(BaseModel):
    symbol: str
    indicator_type: IndicatorType
    timeframe: str
    data: list[IndicatorDataPoint] = Field(default_factory=list)


class UserChartDrawing(BaseModel):
    drawing_id: str
    instrument_id: str
    user_id: str = "default_user"
    timeframe: str = "1D"
    tool_type: DrawingToolType
    points: list[dict[str, Any]] = Field(default_factory=list)  # e.g. [{"time": 1700000000, "price": 2500.0}]
    style: dict[str, Any] = Field(default_factory=dict)  # e.g. {"color": "#3B82F6", "lineWidth": 2}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PriceAlertCondition(str, Enum):
    CROSS_ABOVE = "CROSS_ABOVE"
    CROSS_BELOW = "CROSS_BELOW"
    PCT_CHANGE_ABOVE = "PCT_CHANGE_ABOVE"
    PCT_CHANGE_BELOW = "PCT_CHANGE_BELOW"
    VOLUME_ABOVE = "VOLUME_ABOVE"


class PriceAlert(BaseModel):
    alert_id: str
    instrument_id: str
    symbol: str
    user_id: str = "default_user"
    condition_type: PriceAlertCondition
    target_value: float
    current_value: float | None = None
    is_active: bool = True
    triggered_at: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    note: str | None = None
