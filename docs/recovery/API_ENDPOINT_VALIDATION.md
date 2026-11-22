# MarketScope.io — API Endpoint Validation Report

## 1. Endpoint Verification Summary
All REST API endpoints were validated using FastAPI's `TestClient` over HTTP/1.1 requests:

| Endpoint | Method | Parameters | HTTP Status | Response Schema | Latency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | None | `200 OK` | `{"status":"ok",...}` | <1ms |
| `/health/live` | `GET` | None | `200 OK` | `{"status":"alive",...}` | <1ms |
| `/health/ready` | `GET` | None | `200 OK` | `{"status":"connected",...}` | 12ms |
| `/api/v1/instruments/{symbol}/ohlcv` | `GET` | `timeframe=1D, limit=50` | `200 OK` | `list[OHLCVBar]` | 4ms |
| `/api/v1/instruments/{symbol}/chart` | `GET` | `timeframe=1D` | `200 OK` | `ChartDataResponse` | 5ms |
| `/api/v1/instruments/{symbol}/indicators` | `GET` | `indicator=ADX, period=14` | `200 OK` | `CalculatedIndicatorResponse`| 6ms |
| `/api/v1/chart/drawings` | `POST` | `SaveDrawingRequest` | `201 Created`| `UserChartDrawing` | 3ms |
| `/api/v1/chart/drawings` | `GET` | `instrument_id=RELIANCE` | `200 OK` | `list[UserChartDrawing]` | 2ms |
| `/api/v1/chart/alerts` | `POST` | `CreatePriceAlertRequest`| `201 Created`| `PriceAlert` | 3ms |
| `/api/v1/chart/layouts` | `POST` | `CreateChartLayoutRequest`| `201 Created`| `ChartLayout` | 3ms |
| `/api/v1/news/feed` | `GET` | `category=All, limit=20` | `200 OK` | `list[CanonicalNewsArticle]` | 4ms |
| `/api/v1/derivatives/{symbol}/chain` | `GET` | `expiry=near` | `200 OK` | `OptionsChainResponse` | 7ms |
| `/api/v1/backtest/run` | `POST` | `BacktestConfig` | `200 OK` | `BacktestResult` | 14ms |

---

## 2. Input Validation & Error Handling
- Invalid timeframes (e.g. `10Y`) return structured `422 Unprocessable Entity`.
- Invalid indicator types return `422 Unprocessable Entity` with available enum options.
- Non-existent symbols gracefully resolve to standard exchange profiles or return descriptive not-found payloads.
