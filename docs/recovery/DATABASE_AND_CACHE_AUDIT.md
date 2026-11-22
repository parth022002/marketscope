# MarketScope.io — Database & Cache Infrastructure Audit

## 1. Overview
The database layer uses **SQLAlchemy 2.0** with **psycopg 3** connecting to serverless PostgreSQL (Neon). The caching layer connects to Redis when configured, with seamless non-blocking fallbacks when Redis is offline.

---

## 2. PostgreSQL Configuration & Pool Settings
- **Connection Scheme**: Modern `postgresql+psycopg://` with SSL enforcement (`sslmode=require`).
- **Connection Pooling**:
  - `pool_size=5`
  - `max_overflow=10`
  - `pool_recycle=300` (Recycles idle connections after 5 minutes to prevent stale serverless sockets)
  - `pool_pre_ping=True` (Validates connection health before issuing queries)
  - `connect_timeout=5` (Prevents worker stalls if database is sleeping)

---

## 3. Schema Tables Verified & Active
All 17 application schema tables are active in the database:
1. `instruments` (Canonical instrument master)
2. `exchange_listings` (Exchange mappings and ticker symbols)
3. `market_quotes` (Last traded prices, volume, previous close)
4. `historical_daily_bars` (Daily OHLCV historical archive)
5. `financial_statements` (Balance sheet, P&L, Cash Flow)
6. `valuation_multiples` (P/E, EV/EBITDA, P/B, Dividend Yield)
7. `news_articles` (Verified news articles)
8. `news_sources` (Publisher registry and credibility tiers)
9. `user_watchlists` (User-created watchlists)
10. `user_watchlist_items` (Instruments inside watchlists)
11. `chart_drawings` (User trendlines, channels, retracements)
12. `price_alerts` (User price threshold notifications)
13. `chart_layouts` (Multi-chart workspace arrangements)
14. `backtest_runs` (Quantitative strategy execution records)
15. `paper_trading_accounts` (Virtual cash accounts)
16. `paper_trading_positions` (Virtual open/closed positions)
17. `paper_trading_orders` (Virtual execution logs)

---

## 4. Redis Caching Behavior
- Optional caching layer: If `REDIS_URL` is unavailable or connection times out, the backend logs a telemetry message and executes direct queries.
- Zero cascading failures: Redis outages never crash the API or prevent quote delivery.
