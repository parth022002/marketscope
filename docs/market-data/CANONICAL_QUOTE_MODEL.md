# MarketScope.io — Canonical Price Data Model Specification

## 1. Specification Overview

The Canonical Price Data Model defines the immutable contract for all price, candle, and ticker events processed within MarketScope.io. Implemented in `apps/api/app/domain/canonical_price.py`, this model guarantees type safety, exact decimal arithmetic, and strict data lineage.

---

## 2. Core Entities

### 2.1 CanonicalQuote

```python
class CanonicalQuote(BaseModel):
    instrument_id: str             # e.g., "in-nse-nifty_50", "us-nasdaq-aapl"
    symbol: str                    # e.g., "NIFTY 50", "AAPL"
    name: str                      # Full display name
    exchange: str                  # ISO MIC or exchange code (NSE, BSE, NASDAQ, NYSE, MCX)
    asset_class: str               # INDEX, EQUITY, COMMODITY, CURRENCY, YIELD
    currency: str                  # ISO 4217 code (INR, USD, EUR, GBP, etc.)
    price: Decimal                 # Last traded price (LTP)
    open: Decimal | None           # Session open price
    high: Decimal | None           # Session high price
    low: Decimal | None            # Session low price
    previous_close: Decimal        # Official previous session close
    change: Decimal                # Absolute price change
    change_pct: Decimal            # Percentage price change
    volume: int | None             # Traded volume in base units
    turnover: Decimal | None       # Traded turnover value in base currency
    lot_size: int                  # Trading lot unit (1 for equity, 10 for Gold MCX)
    precision: int                 # Decimal precision (2, 3, or 4)
    market_session: MarketSessionState  # PRE_MARKET, REGULAR_OPEN, POST_MARKET, CLOSED, WEEKEND
    delivery_status: DataDeliveryClassification  # REAL_TIME_EXCHANGE, DELAYED_15M, END_OF_DAY, SYNTHETIC_DEVELOPMENT
    validation_status: ValidationStatus          # VALIDATED, SUSPECT_JUMP, PROBABLE_STALE, RECONCILED
    source_provider: str           # Provider name ("live_exchange", "twelvedata", "fmp", "synthetic_dev")
    timestamp: datetime            # Exchange matching engine timestamp (UTC)
    received_at: datetime          # MarketScope platform ingestion timestamp (UTC)
    sparkline: list[Decimal]       # Chronological intraday reference points
```

### 2.2 CanonicalCandle

```python
class CanonicalCandle(BaseModel):
    instrument_id: str
    symbol: str
    exchange: str
    interval: str                  # "1m", "5m", "15m", "1h", "1D", "1W"
    open_time: datetime
    close_time: datetime
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: int
    turnover: Decimal | None
    vwap: Decimal | None
    is_closed: bool
```

---

## 3. Enum Classifications

### 3.1 DataDeliveryClassification
- `REAL_TIME_EXCHANGE`: Live tick data from exchange direct or licensed real-time redistribution pipeline (< 1 second latency).
- `DELAYED_15M`: Standard commercial delayed market data (15 to 20 minute delay).
- `END_OF_DAY`: Official daily settlement prices published after exchange close.
- `SYNTHETIC_DEVELOPMENT`: Deterministic reference data used strictly for offline development or sandbox testing.

### 3.2 ValidationStatus
- `VALIDATED`: Passed all mathematical, OHLC boundary, and anomaly checks.
- `SUSPECT_JUMP`: Price change exceeds the 35% anomaly threshold without corporate action verification.
- `PROBABLE_STALE`: Market open but quote timestamp has not moved for > 300 seconds.
- `RECONCILED`: Price verified across secondary vendor reconciliation.

---

## 4. Serialization & Type Conversion Contract

When serializing to frontend JSON payloads:
- Decimal fields are serialized as native JSON numbers (or IEEE-compliant strings when floating-point precision loss is possible).
- Timestamps are formatted in strict ISO 8601 UTC format: `YYYY-MM-DDTHH:MM:SS.sssZ`.
- Enums are serialized as uppercase string constants.
