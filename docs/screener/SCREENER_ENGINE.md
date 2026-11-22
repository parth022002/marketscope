# MarketScope.io — Universal Screener Engine Architecture
## Multi-Factor Stock Screening, Preset Strategies & CSV Ingestion

---

## 1. Engine Design & In-Memory Indexing

The Screener Engine (`apps/api/app/engine/screener_engine.py`) performs high-throughput filtering across the entire canonical stock universe:
- **Index Traversal**: Queries the `GlobalInstrumentMaster` across 37 exchanges and thousands of listed tickers.
- **Combined Factor Scoring**: Evaluates criteria across 5 core dimensions:
  1. *Exchange & Geography*: Exchange code (NSE, BSE, NASDAQ, NYSE), country code.
  2. *Market Capitalization*: Numerical bounds in Crores/Millions and categorization (Large Cap, Mid Cap, Small Cap, Micro Cap).
  3. *Valuation Multiples*: P/E, P/B, Dividend Yield.
  4. *Profitability & Solvency*: ROE %, Operating Margin %, Debt-to-Equity.
  5. *Technicals & Channels*: RSI 14 bounds, Proximity to 52-week High (%).

---

## 2. API Endpoints
- `GET /api/v1/screener/presets`: Returns curated thematic screens (Quality Compounders, Undervalued Dividend Leaders, 52-Week High Breakouts, Deep Value, RSI Oversold).
- `POST /api/v1/screener/run`: Executes criteria query and returns ranked result items with sorting.
