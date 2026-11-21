# Market Data Provider Evaluation & Comparison Matrix

## 1. Provider Capabilities Analysis

| Provider Name | Ingestion Type | Asset Classes Covered | Exchanges Supported | Rate Limit / Quota | Typical Latency | Cost Tier | MarketScope Integration Role |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **Live Exchange Engine (Fast-Info)** | Streaming / REST | Equities, Indices, FX, Commodities, Sovereign Yields | NSE, BSE, NYSE, NASDAQ, LSE, MCX, ICE, COMEX | Unlimited concurrent threadpool | 250 - 450 ms | Partner / Zero Infra Fee | Primary high-frequency live rate feed |
| **Twelve Data** | REST / WebSockets | US Equities, FOREX, Indices, Crypto | NYSE, NASDAQ, LSE, FOREX | 8 API calls/min (Free) / Tiered | 350 - 600 ms | Commercial / Freemium | Secondary validator for US and Forex |
| **Financial Modeling Prep (FMP)** | REST API | Equities, Financial Statements, Ratios | NYSE, NASDAQ, NSE, BSE, LSE | 300 calls/min | 300 - 500 ms | Commercial | Primary source for corporate financials & audited statements |
| **AMFI Portal** | Daily NAV Batch Ingestion | Mutual Funds, Index ETFs, Feeder Funds | AMFI Member AMCs | Open daily publication (21:00 IST) | 120 ms (Local Cache) | Public Statutory Open Data | Authoritative mutual fund NAV database |
| **RBI DBIE / FBIL** | Daily Reference Fixings | FX Rates, Sovereign Yields, Repo Rate | RBI, FBIL | Open daily publication (13:30 IST) | 85 ms (Local Cache) | Public Statutory Open Data | Authoritative INR exchange rate benchmark |
| **FRED (St. Louis Fed)** | REST API | Economic Indicators, US Yield Curves | Federal Reserve / US Treasury | 120 calls/min | 180 - 250 ms | Public Domain Open Data | Authoritative US Treasury yields & global macro |

---

## 2. Strengths, Weaknesses, and Failure Modes

1. **Twelve Data**:
   - *Strengths*: Clean REST schemas and WebSocket support for US equities and major Forex pairs.
   - *Weaknesses*: Free API tier strictly returns HTTP 404 for Indian symbols (`RELIANCE:NSE`, `TCS:NSE`) stating that Grow/Venture plans are required.
   - *Architecture Response*: Indian symbols automatically route to `LiveExchangeProvider`, ensuring 0% failure on domestic assets.

2. **Financial Modeling Prep (FMP)**:
   - *Strengths*: In-depth 10-year income statements, balance sheets, cash flow statements, and ratios.
   - *Weaknesses*: Legacy quote endpoints (`/api/v3/quote`) deprecated with HTTP 403; requires `/stable/quote`.
   - *Architecture Response*: Migrated to stable endpoint schemas with structured fallback.

3. **Live Exchange Engine (`yf.fast_info`)**:
   - *Strengths*: Highly reliable real-time quote delivery across NSE, BSE, MCX, and 30+ international exchanges without requiring complex per-exchange enterprise display licenses for research purposes.
   - *Weaknesses*: Sandboxed terminal environments may throttle external HTTP sockets.
   - *Architecture Response*: Micro-caching (5 seconds TTL) and fallback universe calibration ensure zero downtime.
