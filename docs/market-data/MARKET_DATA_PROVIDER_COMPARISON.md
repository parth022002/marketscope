# MarketScope.io — Market Data Provider Research & Evaluation

**Document Version:** 1.0.0  
**Classification:** Financial Market Data Sourcing & Commercial Rights Analysis  
**Audience:** Quantitative Architecture, Legal/Compliance, Product Engineering

---

## 1. Executive Overview

MarketScope.io requires accurate, multi-asset market data covering:
1. **Indian Capital Markets**: NSE Indices (NIFTY 50, Bank Nifty, Midcap, Sectorals), BSE Indices (SENSEX, BSE 500), and top NSE/BSE listed equities.
2. **International Equities & Benchmarks**: US Indices (NASDAQ, S&P 500, Dow Jones), European Benchmarks (FTSE, DAX), Asian Benchmarks (Nikkei, Hang Seng), and US Mega-Cap equities.
3. **Commodities & Energy**: International Benchmarks (Brent Crude, WTI, Gold Spot, Silver Spot) and Domestic Futures (MCX Gold, MCX Silver).
4. **Foreign Exchange & Sovereign Yields**: USD/INR, EUR/INR, GBP/INR, DXY, US 10Y Yield, and India 10Y G-Sec Yield.

Under financial market regulations (SEBI in India, SEC/FINRA in the US, ESMA in the EU), market data is proprietary intellectual property owned by the respective exchanges. Commercial redistribution and public website display require explicit contractual entitlement agreements.

---

## 2. Indian Market Data Providers

### 2.1 NSE Data & Analytics Limited (Official Exchange Subsidiary)
* **Website**: https://www.nseindia.com/ | https://www.nse.in/static/market-data/real-time-data-subscription
* **Entity**: 100% subsidiary of the National Stock Exchange of India (NSE).

#### Data Products & Tiers:
| Product Level | Data Content | Latency / Frequency | Commercial Use Case |
| :--- | :--- | :--- | :--- |
| **Level 1 (L1)** | Best Bid / Best Ask (LTP), Daily Volume, Open, High, Low, Previous Close | Real-time (streaming or 1-second snapshots) | Ideal for public display ticker, stock overview, and basic watchlists. |
| **Level 2 (L2)** | 5-deep market depth (top 5 buy & sell orders with quantities) | Streaming tick-by-tick | Professional trading terminals, depth visualization. |
| **Level 3 (L3)** | 20-deep market depth or full order book | Sub-millisecond tick-by-tick | Algorithmic trading, quantitative fund routing. |
| **Snapshot Data** | 1-second, 5-second, or 1-minute interval snapshots | Periodic interval refresh | Lower bandwidth cost; optimal for research platforms. |
| **15-Minute Delayed** | L1 quotes delayed by minimum 15 minutes | 15-minute scheduled offset | Free/low-cost public redistribution under NSE standard delayed agreement. |
| **End of Day (EOD)** | Official closing prices, Bhavcopy, VWAP, Delivery % | T+0 daily at 18:30 IST | Fundamental ratios, historical OHLCV charts, screener databases. |

#### Licensing & Redistribution Terms:
- **Display License**: Requires an **NSE Market Data Vendor Agreement (Non-Brokerage Display)**.
- **Redistribution Fees**: Direct exchange feeds require an annual license fee (approx. ₹15–25 Lakhs/year for L1 real-time redistribution) plus per-user variable fees or fixed display caps.
- **Delayed Redistribution**: Highly cost-effective; permitted under delayed vendor agreements with explicit "NSE Delayed 15M" visual attribution.

---

### 2.2 BSE Data Services (Bombay Stock Exchange)
* **Website**: https://www.bseindia.com/ | https://marketdata.bseindia.com/
* **Entity**: BSE Limited Market Data Division.

#### Data Products & Tiers:
- **SENSEX & BSE Sectorals**: Real-time broadcast and 15-minute delayed feeds.
- **BSE Equity L1 & L2**: Real-time multicast feed and API data services.
- **Corporate Announcements & Filings**: XML/JSON feed of corporate board meetings, quarterly financial results, shareholding patterns, and AGM notices.
- **Bhavcopy & Historical**: Official daily closing files with 10+ years of verified corporate actions (bonus, split, rights).

#### Licensing Considerations:
- BSE offers separate vendor packages for "Website / Media Display" versus "Algorithmic / Automated Execution".
- For MarketScope's research platform, BSE Corporate Action feeds combined with L1 Index snapshots provide the highest compliance-to-cost ratio.

---

### 2.3 Authorized Indian Market Data Vendors (Intermediaries)
Direct exchange connectivity requires substantial telecommunications and audit infrastructure (leased lines at colocation facilities). Authorized vendors aggregate exchange lines and provide developer-friendly REST/WebSocket APIs with bundled redistribution licenses:

1. **TrueData (TrueData India)**:
   - SEBI/NSE/BSE authorized market data vendor.
   - Ultra-low latency WebSocket & REST API for NSE (Cash, F&O, Currency) and MCX.
   - Offers institutional and enterprise redistribution tiers.
2. **Global Financial Datafeeds (GFDL / AccuData)**:
   - Authorized vendor for NSE, BSE, MCX real-time and historical ticks.
   - Provides HTTP REST and TCP/WebSocket streaming APIs.
3. **Tickertape / Smallcase Gateway**:
   - Institutional white-label financial data provider powering Indian fintechs.
   - Specializes in pre-computed fundamental ratios, MMI (Market Mood Index), and EOD metrics.

---

## 3. Global Market Data Providers

### 3.1 Twelve Data
* **Website**: https://twelvedata.com/
* **Coverage**: US Equities (NASDAQ, NYSE), Indian Equities & Indices (NSE, BSE), Major World Indices (DAX, FTSE, Nikkei), Forex, Crypto, Commodities.
* **Delivery Modes**:
  - **REST API**: Batch quotes, historical OHLCV intervals (1m to 1M), technical indicators, market state.
  - **WebSocket API**: Bidirectional streaming for real-time tickers and quotes with sub-second latency.
* **Entitlement & Pricing**:
  - Free Tier: 8 credits/min (suited for development only).
  - Commercial Pro/Enterprise: 800–5000+ API credits/min, dedicated WebSocket streams.
  - *Indian Equities*: Available with 15-minute delay on standard plans; real-time requires Indian exchange add-on pack.
* **Evaluation for MarketScope**:
  - **Selected as Primary Global & Multi-Asset Streaming Provider**. Highly compatible with our Node/Python backend.

---

### 3.2 Financial Modeling Prep (FMP)
* **Website**: https://financialmodelingprep.com/
* **Coverage**: Comprehensive US & Global equities, institutional financial statements (10-K, 10-Q, Annual BSE/NSE filings), SEC filings, earnings transcripts, corporate profiles.
* **Delivery Modes**: REST API with high rate limits (up to 300 requests/minute).
* **Evaluation for MarketScope**:
  - **Selected as Primary Provider for Financial Statements, Corporate Profiles, and Fundamental Multiples (P/E, ROE, ROCE, Debt/Equity)**.
  - Less optimal for sub-second real-time streaming, but best-in-class for fundamental balance sheet lineage and ratios.

---

### 3.3 Institutional High-End Providers (Nasdaq Data Link, LSEG, Bloomberg, FactSet)
* **Nasdaq Data Link**: Excellent for economic indicators, commodities, and US equities; high enterprise pricing.
* **LSEG (formerly Refinitiv)**: Gold standard for multi-asset institutional terminal data; requires multi-year enterprise contracts ($20k–$50k+/year).
* **Bloomberg Enterprise Data**: Benchmark terminal feed; cost-prohibitive for early-stage platform deployment ($25k+/terminal/year).

---

## 4. Multi-Provider Comparison Matrix

| Evaluation Criteria | Twelve Data | Financial Modeling Prep (FMP) | TrueData (India Authorized) | NSE Direct Data & Analytics | LSEG / Refinitiv |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Indian Equities (NSE/BSE)** | Supported (EOD & Delayed) | Supported (Company Profiles & Statements) | Full Real-Time (Tick-by-Tick & L1/L2) | Native Official Feed | Global Coverage |
| **Indian Indices (NIFTY/SENSEX)** | Supported | Limited | Full Real-Time | Native Official Feed | Real-time |
| **US Equities (NASDAQ/NYSE)** | Real-Time & Historical | Real-Time & Historical | Not Covered | Not Covered | Full Institutional |
| **Global Indices (S&P, DAX, Nikkei)**| Extensive | Standard | Not Covered | Not Covered | Comprehensive |
| **Commodities (Brent, Gold, MCX)** | International Benchmark | EOD Spot | Domestic MCX Real-Time | Select Derivatives | Full Global |
| **Forex (USD/INR, EUR/USD)** | Real-Time Streaming | Daily Spot | Real-Time Currency Futures | NSE FX Derivatives | Interbank FX |
| **WebSocket Streaming** | Native WebSocket | No (REST Only) | Native TCP / WebSocket | Multicast UDP / TCP | Robust Feed |
| **Historical OHLCV Bars** | 1m, 5m, 1h, 1D, 1W | 1m, 5m, 1D, 1W | 1m to Daily | Raw Ticks / EOD Bhavcopy | Full Tick History |
| **Financial Statements Lineage** | Basic | Comprehensive (Income, Balance, Cash Flow) | None | Corporate Filings XML | Full Fundamentals |
| **Public Display Permissions** | Yes (With Commercial Plan) | Yes (With Commercial Plan) | Yes (Redistribution Tier) | Requires Vendor Agreement | Requires Display License |
| **Monthly Cost Tier** | $79 – $499 / mo | $99 – $299 / mo | ₹10,000 – ₹50,000 / mo | ₹1.5L – ₹2.5L / mo + Audit | $2,000 – $5,000+ / mo |
| **Primary Platform Role** | **Multi-Asset Real-Time Ticker & Global Quotes** | **Fundamental Statements & Balance Sheet Lineage** | **Dedicated Indian Real-Time Provider (Phase 7 Production)** | **Enterprise Scale Long-term** | **Enterprise Institutional Tier** |

---

## 5. Architecture Recommendation

To achieve 100% accuracy, cost efficiency, and legal compliance, MarketScope must implement a **Tiered Hybrid Architecture**:

1. **Tier 1 (Global Quotes, Forex & Indices)**: **Twelve Data** via WebSocket and REST snapshot reconciliation.
2. **Tier 2 (Company Fundamentals & Statements)**: **Financial Modeling Prep (FMP)** for audited financial statements and ratios.
3. **Tier 3 (Authoritative Indian Real-Time)**: Authorized Indian Market Data Vendor (**TrueData** or direct NSE L1 delayed/snapshot agreement) for production Indian equity ticks.
4. **Tier 4 (Development & Offline Resilience)**: Clearly identified **Deterministic Simulation Provider** strictly flagged as `SYNTHETIC_DEVELOPMENT` when no network access or third-party keys are available. **Never disguised as live market data.**
