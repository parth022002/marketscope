# MarketScope.io — Data Provider Capability Register
## Ingestion Capabilities, Update Latency & Asset Coverage

---

## 1. Authorized Data Provider Inventory

| Provider ID | Provider Name | Tier | Supported Asset Classes | Supported Exchanges | Latency / Lag | Streaming Capable | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `twelvedata` | TwelveData Financial | Enterprise Tier | Equities, Indices, FX, Crypto | NSE, BSE, NASDAQ, NYSE, LSE | Sub-second WebSocket | YES | ACTIVE |
| `fmp` | Financial Modeling Prep | Pro Tier | Global Equities, Financial Statements | Global (37 Exchanges) | 15-min delayed / EOD | NO | ACTIVE |
| `alphavantage` | Alpha Vantage | Developer Tier | Global Equities, Macro Indicators | US, Global | EOD & 15m Delayed | NO | ACTIVE |
| `live_exchange_nse` | NSE Direct Scraper | Scraped Gateway | Indian Equities, Indices, Options | NSE | 1-min poll | NO | ACTIVE |
| `live_exchange_bse` | BSE Direct Scraper | Scraped Gateway | Indian Equities, Debt, SME | BSE | 1-min poll | NO | ACTIVE |
| `rbi_dbie` | Reserve Bank of India | Official Regulatory | Sovereign Yields, FX Reference, Repo | RBI / India Interbank | Daily 13:30 IST | NO | ACTIVE |
| `sec_edgar` | US SEC EDGAR | Official Primary | 10-K, 10-Q, 8-K Filings | NASDAQ, NYSE | Instant on submission | NO | ACTIVE |
| `mca_india` | Ministry of Corporate Affairs | Official Primary | Annual Returns, MCA Filings | Indian Corporate Entities | Daily EOD | NO | ACTIVE |

---

## 2. Dynamic Fallback & Redundancy

If an external real-time feed encounters network timeouts or rate limits:
1. System transitions automatically to `DELAYED_15M` cached state.
2. In-memory OHLCV fallback engine serves calibrated exchange settlement candles.
3. User UI displays amber freshness pill badge indicating exact data provenance.
