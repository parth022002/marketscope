# MarketScope.io — Phase 3: Market Data Architecture & Multi-Provider Engine

## 1. Executive Summary & Principles

MarketScope.io requires an institutional-grade, multi-tier data architecture that serves real-time ticker streams, overview statistics, intraday sparklines, and deep historical time-series while upholding four core operational principles:

1. **Truth in Labeling**: Data must declare its provenance and freshness (`LIVE`, `DELAYED_15M`, `EOD`, `CLOSED`, `SYNTHETIC_DEVELOPMENT`). Synthetic or simulated fixtures must never be disguised as live exchange data.
2. **Provider Redundancy & Graceful Degradation**: Primary commercial vendors (Twelve Data, FMP, licensed Indian vendor) are wrapped in standardized adapters. If a primary vendor fails or hits rate limits, the system fails over transparently to secondary providers or historical EOD caches with clear visual status flags.
3. **Session & Calendar Awareness**: Quote states must reflect actual exchange session states. When the National Stock Exchange (NSE) closes at 15:30 IST, prices must transition to `CLOSED` or `EOD` with the exact official closing timestamp, rather than continuing to show simulated "active" fluctuations.
4. **Sub-second Delivery via Real-Time WebSockets**: Frontend clients consume real-time pricing via an asynchronous WebSocket broadcast pipeline (`/ws/v1/market-data`) rather than hammering backend REST endpoints with wasteful polling loops.

---

## 2. Multi-Provider Architecture Diagram

```
                                  +---------------------------------------+
                                  |         External Market Vendors       |
                                  |  - Twelve Data (REST / WebSocket)     |
                                  |  - Financial Modeling Prep (FMP)      |
                                  |  - Licensed Indian Vendor / TrueData  |
                                  |  - Fallback Dev Fixtures (Marked DEV) |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |      Standardized Adapter Layer       |
                                  |   - BaseMarketDataProvider (ABC)      |
                                  |   - TwelveDataProvider                |
                                  |   - FMPDataProvider                   |
                                  |   - FallbackDevProvider               |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |   Market Data Ingestion & Validation  |
                                  |   - Price Jump & Circuit Filter       |
                                  |   - Timestamp & Staleness Evaluator   |
                                  |   - Change & % Change Verifier        |
                                  |   - Market Calendar / Session Manager |
                                  +-------------------+-------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
         +-------------------------------+                         +-------------------------------+
         |    In-Memory L1 / Redis Cache |                         |   WebSocket Streaming Gateway |
         |   - Normalized Quote Snapshot |                         |   - Endpoint: /ws/v1/market-data
         |   - TTL: 2s (Live) / 1hr (EOD)|                         |   - Pub/Sub Symbol Channels   |
         |   - Instrument Metadata Cache |                         |   - Low-latency Tick Broadcast|
         +---------------+---------------+                         +---------------+---------------+
                         |                                                         |
                         v                                                         v
         +-------------------------------+                         +-------------------------------+
         |   FastAPI REST API Routes     |                         |  Next.js 15 Client Frontend   |
         |   - GET /api/v1/market/ticker |                         |   - useMarketWebSocket Hook   |
         |   - GET /api/v1/market/overview                         |   - Dynamic Tick Animations   |
         |   - GET /api/v1/data/quality  |                         |   - Status Badges (LIVE/EOD)  |
         +-------------------------------+                         +-------------------------------+
```

---

## 3. Normalized Internal Quote Model

Every external payload is normalized into the canonical `MarketQuote` data structure before caching or broadcasting:

```python
class MarketQuote(BaseModel):
    instrument_id: str                      # Canonical MarketScope Instrument UUID
    symbol: str                             # e.g. "RELIANCE", "AAPL", "NIFTY 50"
    name: str                               # e.g. "Reliance Industries Limited"
    exchange: str                           # "NSE", "BSE", "NASDAQ", "NYSE", "MCX"
    asset_class: str                        # "EQUITY", "INDEX", "COMMODITY", "CURRENCY"
    currency: str                           # "INR", "USD", "EUR"
    
    # Pricing & Precision
    price: float                            # Current or last traded price (LTP)
    open: float | None                      # Day open
    high: float | None                      # Day high
    low: float | None                       # Day low
    previous_close: float                   # Official previous session close
    change: float                           # price - previous_close (exact math)
    change_pct: float                       # ((price - previous_close) / previous_close) * 100
    volume: int | None                      # Cumulative day volume
    
    # Freshness & Session Provenance
    market_status: str                      # "OPEN", "CLOSED", "PRE_OPEN", "POST_CLOSE", "HOLIDAY"
    data_status: str                        # "LIVE", "DELAYED_15M", "EOD", "CLOSED", "SYNTHETIC_DEVELOPMENT"
    source_provider: str                    # "twelvedata", "fmp", "truedata", "synthetic_dev"
    timestamp: datetime                     # Quote timestamp provided by the exchange/vendor
    received_at: datetime                   # Timestamp when MarketScope ingested the quote
    sparkline: list[float]                  # Intraday 5-point to 20-point historical price trail
```

---

## 4. Provider Adapter Contract

All provider integrations adhere to the standard `MarketDataProvider` abstract interface:

```python
from abc import ABC, abstractmethod
from typing import Sequence

class MarketDataProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns unique identifier for the provider (e.g., 'twelvedata')."""
        pass

    @abstractmethod
    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote:
        """Fetch real-time or delayed quote for a single instrument."""
        pass

    @abstractmethod
    async def get_batch_quotes(self, symbols: Sequence[str]) -> list[MarketQuote]:
        """Fetch quotes in batch to optimize network efficiency and rate limits."""
        pass

    @abstractmethod
    async def get_historical_bars(
        self, symbol: str, interval: str = "1D", limit: int = 30
    ) -> list[dict]:
        """Fetch historical OHLCV bars for charts and sparklines."""
        pass

    @abstractmethod
    async def health_check(self) -> dict[str, Any]:
        """Verify API key validity, latency, and current credit quota."""
        pass
```

---

## 5. Caching & Rate-Limit Preservation Strategy

Market data vendors enforce strict rate limits:
- Twelve Data Basic / Free: 8 calls per minute, 800 per day.
- Financial Modeling Prep Starter: 300 calls per minute.
- Indian exchange feeds: Polling must not duplicate requests within tick intervals.

### Tiered Cache Strategy:
1. **L1 In-Memory Cache (FastAPI Process)**:
   - TTL: 2 seconds during active trading hours for frequently accessed indices (`NIFTY 50`, `SENSEX`, `NASDAQ 100`).
   - TTL: 60 seconds for individual equity quotes.
   - TTL: 300 seconds (5 minutes) for market breadth and sector statistics.
   - TTL: 86400 seconds (24 hours) for closed / EOD quotes on weekends and after market close.
2. **L2 Redis Cache (Shared Cluster)**:
   - Retains last valid quote for every instrument with key `marketscope:quote:{canonical_symbol}`.
   - If upstream vendor is temporarily unreachable, the L2 cached quote is returned with `data_status="EOD"` or `data_status="DELAYED_15M"` and a `stale=True` flag rather than failing the user request.
3. **Throttling & Batching**:
   - Backend ticker requests are aggregated across connected clients. The backend queries Twelve Data or FMP in batches (e.g. `symbols=AAPL,NVDA,MSFT`), cutting external HTTP round-trips by up to 90%.

---

## 6. WebSocket Streaming Architecture

### 6.1 Gateway Design (`/ws/v1/market-data`)
- FastAPI native WebSocket route with connection manager.
- Supports client subscriptions:
  ```json
  // Client to Server: Subscribe
  {
    "action": "subscribe",
    "symbols": ["NIFTY 50", "RELIANCE", "AAPL", "USD/INR"]
  }
  ```
- Streaming Broadcast:
  - Asynchronous background worker pushes quote updates to subscribers whenever prices tick or on an interval (2 to 5 seconds during market hours).
  - Broadcasts include exact timestamps and data status tags:
  ```json
  {
    "type": "tick",
    "symbol": "RELIANCE",
    "price": 2945.80,
    "change": 15.60,
    "change_pct": 0.53,
    "volume": 6842000,
    "currency": "INR",
    "market_status": "OPEN",
    "data_status": "DELAYED_15M",
    "timestamp": "2026-11-21T10:15:32Z",
    "provider": "twelvedata"
  }
  ```
- Client Heartbeat & Auto-reconnect:
  - 30-second ping/pong keepalive.
  - Client hook handles network disconnection with exponential backoff (`min: 1s, max: 15s`).
