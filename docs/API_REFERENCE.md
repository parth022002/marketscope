# MarketScope.io — REST & WebSocket API Reference

**Base URL:** `https://marketscope-api.onrender.com`  
**API Prefix:** `/api/v1`  
**WebSocket URL:** `wss://marketscope-api.onrender.com/ws/market`  
**OpenAPI Specification:** `/docs` (Interactive Swagger UI) and `/openapi.json`  

---

## 1. Health & System Diagnostics

### `GET /api/v1/health`
Checks health of API, Database, and Cache.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "database": "connected",
  "timestamp": "2026-11-23T14:15:00Z"
}
```

---

## 2. Market Data & Quotes

### `GET /api/v1/market/quote/{symbol}`
Retrieves real-time quote for a specific ticker (e.g., `NIFTY_50`, `TMPV.NS`, `AAPL`).

### `GET /api/v1/market/db-quotes`
Retrieves all persisted live market quotes stored in the Neon PostgreSQL database.

### `POST /api/v1/market/sync-live`
Forces an immediate synchronization of real-time quotes from upstream providers to Neon DB.

### `GET /api/v1/market/overview`
Retrieves institutional market summary across Indices, Equities, Commodities, Currencies, and Fixed Income.

---

## 3. Stock Research & Financials

### `GET /api/v1/research/dossier/{symbol}`
Generates a comprehensive research dossier:
- Company Profile, Management, Sector, Exchange
- Multi-Year Income Statement, Balance Sheet, Cash Flow Statement
- Valuation Ratios (P/E, EV/EBITDA, P/B, Dividend Yield)
- Solvency & Profitability Metrics (ROCE, ROE, Debt-to-Equity, Current Ratio)
- Peer Comparison Multiples

---

## 4. Charting & Technical Indicators

### `GET /api/v1/chart/package/{symbol}?interval={1d|1h|15m}&indicators=SMA,EMA,RSI,MACD,BB`
Returns structured OHLCV candlestick records with pre-computed technical indicators:
- Simple Moving Averages (`SMA_20`, `SMA_50`, `SMA_200`)
- Exponential Moving Averages (`EMA_9`, `EMA_21`)
- Relative Strength Index (`RSI_14`)
- MACD Line, Signal Line, and Histogram
- Bollinger Bands (`Upper`, `Middle`, `Lower`)
- Average True Range (`ATR`) and Supertrend

---

## 5. Q-Intelligence & Quantitative Scoring

### `GET /api/v1/q-intelligence/score/{symbol}`
Returns composite 0–100 quantitative multi-factor score:
- Fundamental Factor Score (35%)
- Growth Factor Score (25%)
- Momentum & Technical Factor Score (20%)
- Sentiment & Macro Factor Score (20%)
- Categorical Signal: `STRONG_BUY`, `BUY`, `NEUTRAL`, `REDUCE`, `SELL`

---

## 6. AI Financial Assistant

### `POST /api/v1/ai/chat`
Conversational financial copilot with strict RAG grounding, citations, and PII protection.
- **Request Body:**
```json
{
  "message": "Analyze Reliance Industries Q2 earnings growth versus peers",
  "symbol": "RELIANCE.NS",
  "history": []
}
```

---

## 7. Screener & Filtering

### `POST /api/v1/screener/filter`
Executes multi-parameter screening query across thousands of global and Indian instruments:
- Filter criteria: Market Cap range, P/E ratio, ROCE, ROE, Sector, Region.

---

## 8. WebSocket Stream (`/ws/market`)

- **Protocol:** WebSocket (`wss://`)
- **Subscription Message:**
```json
{ "action": "subscribe", "symbols": ["NIFTY_50", "RELIANCE.NS", "AAPL"] }
```
- **Broadcasting Event:**
```json
{
  "type": "tick",
  "symbol": "NIFTY_50",
  "price": 25349.65,
  "change": 160.85,
  "percentChange": 0.64,
  "timestamp": "2026-11-23T14:15:30Z"
}
```
