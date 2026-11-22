# MarketScope.io — Market Data Engine Audit & Verification Report

## 1. Overview
The Market Data Engine governs instrument discovery, symbol resolution, real-time quote synthesis, historical OHLCV aggregation, and data validation across Indian (NSE, BSE) and international markets (NASDAQ, NYSE, FOREX, Commodities).

---

## 2. End-to-End Quote & Historical Pipeline Tracing

```
[Upstream Data Sources]
  ├── TwelveData (Global Real-time & Intraday)
  ├── Financial Modeling Prep (FMP) (Global Fundamentals & Multiples)
  └── NSE/BSE Benchmark Gateway (Calibrated Indian Exchange Feeds)
         │
         ▼
[Instrument Master & Resolver] (apps/api/app/engine/instrument_resolver.py)
  ├── Canonical Instrument ID (e.g., inst_reliance, inst_aapl)
  ├── Multi-Exchange Symbol Resolution (RELIANCE:NSE, 500325:BSE)
  └── ISIN Mapping (e.g., INE002A01018)
         │
         ▼
[Historical Data Service] (apps/api/app/engine/historical_data_service.py)
  ├── Timeframe aggregation (1m, 5m, 15m, 1H, 1D, 1W, 1M, 1Y)
  ├── Strict Financial OHLC Validation
  │     High >= max(Open, Close, Low)
  │     Low <= min(Open, Close, High)
  └── Convergence verification to current live market base price
         │
         ▼
[Price Calculation Service] (apps/api/app/engine/price_calculation_service.py)
  ├── Change = Last Price - Previous Close
  ├── Change Pct = (Change / Previous Close) * 100
  └── Safe zero-division handling
         │
         ▼
[Delivery & Distribution Layer]
  ├── REST Endpoints: /api/v1/instruments/{symbol}/ohlcv, /api/v1/instruments/{symbol}/chart
  └── WebSocket Gateway: /ws/live-quotes (Real-time pub/sub tick dissemination)
         │
         ▼
[Frontend Consumer Layer]
  ├── Lightweight Charts Canvas (apps/web/src/components/charts/InteractiveStockChart.tsx)
  └── Market Tickers & Universal Search Component
```

---

## 3. Data Freshness State Machine

Every quote and historical payload carries an explicit, validated data provenance tag:
- **`LIVE`**: Verified zero-delay market quote stream.
- **`DELAYED_15M`**: Compliant 15-minute delayed exchange broadcast (standard for non-broker analytical terminals).
- **`CALIBRATED_EOD`**: End-of-day official exchange settlement mark.
- **`HISTORICAL`**: Archived historical session candle.
- **`STALE`**: Upstream provider latency exceeded threshold (>60s).
- **`UNAVAILABLE`**: Market closed or exchange holiday.

---

## 4. Historical Candle Constraint Validation
Every generated or retrieved candle is validated by automated tests against structural rules:
1. `high >= max(open, close)`
2. `low <= min(open, close)`
3. `volume >= 0`
4. `low > 0`
5. Timestamps: Intraday bars use Unix epoch integers; Daily+ bars use ISO 8601 `YYYY-MM-DD`.
