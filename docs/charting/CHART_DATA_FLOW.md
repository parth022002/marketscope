# MarketScope.io — Chart Data Flow & Pipeline Architecture

## 1. End-to-End Data Ingestion & Presentation Flow
The MarketScope charting data pipeline connects canonical market providers, persistent database models, FastAPI streaming endpoints, and the browser-side Lightweight Charts canvas.

```
+-------------------------------------------------------------------------------+
|                      External Market Data Providers                           |
|       (NSE / BSE Bhavcopy, Alpha Vantage, Polygon.io, Stooq Engine)           |
+-------------------------------------------------------------------------------+
                                        | Raw Market Feed / EOD Snapshots
                                        v
+-------------------------------------------------------------------------------+
|                       Market Data Validation & Calibration                    |
|  - High >= max(Open, Close) & Low <= min(Open, Close)                         |
|  - Volume >= 0 non-negative constraint                                        |
|  - Ascending monotonic timestamp sorting & deduplication                     |
+-------------------------------------------------------------------------------+
                                        | Calibrated OHLCV Records
                                        v
+-------------------------------------------------------------------------------+
|               Backend Historical Service & Timeframe Resampling               |
|  - Intraday Aggregation: 1m, 5m, 15m, 30m, 1H, 4H                            |
|  - Daily / Macro Aggregation: 1D, 1W, 1M, 1Y                                  |
|  - Headless Indicator Computation Service (Python Pandas / NumPy)            |
+-------------------------------------------------------------------------------+
                                        | JSON REST Endpoint
                                        v
+-------------------------------------------------------------------------------+
|                                FastAPI Server                                 |
|  GET /api/v1/instruments/{symbol}/chart?timeframe={tf}&limit={limit}         |
+-------------------------------------------------------------------------------+
                                        | HTTP / JSON Transfer (< 50ms)
                                        v
+-------------------------------------------------------------------------------+
|                              Next.js Web Frontend                             |
|  - api.ts: getInstrumentChart(symbol, timeframe)                              |
|  - lib/indicators.ts: Client-Side Instant Dynamic Indicator Engine            |
|  - lightweight-charts: High-performance HTML5 Canvas Rendering               |
+-------------------------------------------------------------------------------+
```

---

## 2. Dynamic Timeframe Aggregation
When a user switches from Daily (`1D`) to Intraday (`5m`) or Weekly (`1W`):
1. **Intraday**: Formats timestamps as integer UTC seconds (`UTCTimestamp`), preserving sub-day session timing (09:15 to 15:30 IST for NSE/BSE).
2. **Daily/Weekly/Monthly**: Formats timestamps as ISO `YYYY-MM-DD` strings, mapping cleanly to standard calendar bars.
3. **Volume Alignment**: Volume for multi-period bars represents the direct arithmetic sum of component interval volumes ($\sum V_i$), while Open is $O_1$ and Close is $C_n$.
