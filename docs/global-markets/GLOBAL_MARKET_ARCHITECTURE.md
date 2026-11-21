# MarketScope.io — Global Market Architecture & Universal Integration

## 1. Architectural Mission & Overview

MarketScope.io is designed from first principles as an **India-first, globally comprehensive financial intelligence and market research platform**. 

The architecture bridges the domestic Indian investor's perspective with institutional global market coverage across 20 standardized asset classes, spanning domestic equities, international benchmarks, exchange-traded derivatives, sovereign debt yield curves, foreign exchange, commodities, and collective investment schemes (AMFI Mutual Funds, ETFs, REITs, InvITs).

```
+---------------------------------------------------------------------------------------+
|                                    MarketScope.io Web Client                          |
|  - Multi-Asset Global Markets Hub (/markets)      - Real-Time Dynamic Ticker (110s)   |
|  - Technical Benchmark Charting                   - Interactive Sector Tree-Map       |
|  - Resident Indian Regulatory Access Badges       - Provider Health Monitor (/admin)  |
+---------------------------------------------------------------------------------------+
                                           |  REST API / WebSockets
                                           v
+---------------------------------------------------------------------------------------+
|                                 MarketScope API Gateway                               |
|                  FastAPI / Pydantic v2 / Rate Limiting / DPDP Compliance              |
+---------------------------------------------------------------------------------------+
        |                                   |                                   |
        v                                   v                                   v
+-----------------------+       +-----------------------+       +-----------------------+
| Authoritative Masters |       |  Market Data Engine   |       | Regulatory Compliance |
| - Exchange Registry   |       | - Live Fast-Info Feed |       | - RBI LRS ($250k/FY)  |
|   (30+ Global MICs)   |       | - Twelve Data Gateway |       | - FEMA 1999 Stance    |
| - Instrument Master   |       | - FMP Ingestion       |       | - SEBI Non-Brokerage  |
|   (124+ Multi-Asset)  |       | - Open Data (FRED/RBI)|       | - GIFT City IFSC SEZ  |
+-----------------------+       +-----------------------+       +-----------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                Authoritative Data Sources                             |
|  NSE/BSE (Direct/Live) | NYSE/NASDAQ (Fast-Info) | MCX (Multi-Commodity) | AMFI Official |
|  RBI DBIE / FBIL Rates | FRED / US Treasury      | ICE / NYMEX / COMEX   | CBOE VIX      |
+---------------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Pillars

### 2.1 Multi-Tier Fallback Ingestion Pipeline
To eliminate single-provider failure risks, MarketScope executes a multi-tier resolution strategy:
1. **Tier 1 (Direct Live Feed):** High-frequency execution using real-time quotes from local exchange gateways. Sub-second quote refresh, micro-caching to prevent rate throttling.
2. **Tier 2 (Commercial Redistribution Gateways):** Secondary validation through Twelve Data and Financial Modeling Prep (FMP) for global corporate actions, balance sheets, and EOD reconciliations.
3. **Tier 3 (Government & Statutory Open Data):** Direct authoritative ingestion from AMFI (Mutual Fund NAVs at 21:00 IST), RBI DBIE/FBIL (Rupee Reference Rates at 13:30 IST), and Federal Reserve Bank of St. Louis FRED (Sovereign yield curves & macro indicators).
4. **Tier 4 (Hardened Fallback Universe):** In the event of network disruption, synthetic demo rates are strictly and transparently flagged (`data_status: "SYNTHETIC_DEMO"`). No estimated or closed prices are ever passed as live market quotes.

### 2.2 Resident Indian Investment Access Classification
Every instrument indexed in MarketScope carries an authoritative regulatory status evaluated dynamically by `InvestmentAccessEngine`:
- **`DOMESTIC_ACCESS`**: Normal domestic Demat & trading account via SEBI-registered brokers.
- **`INTERNATIONAL_ACCESS_SUBJECT_TO_LRS`**: Accessible under the RBI Liberalised Remittance Scheme up to USD 250,000 per financial year per resident individual. Strict 20% TCS above ₹7L, mandatory Schedule FA filing. Strictly cash/no leverage.
- **`ACCESS_VIA_IFSC_ROUTE`**: Dollar-denominated trading through IFSCA-registered brokers in GIFT City SEZ.
- **`ACCESS_VIA_DOMESTIC_FUND`**: Investment via domestic AMCs in INR through feeder funds and international ETFs, exempt from individual LRS caps but subject to the overall RBI industry limit of USD 7 Billion.
- **`RESEARCH_ONLY`**: Instruments strictly restricted for resident remittance (e.g. offshore derivatives, offshore binary/forex leverage) under FEMA 1999. Displayed exclusively for macroeconomic intelligence.

### 2.3 Strict Non-Brokerage Stance
MarketScope.io is an independent market intelligence and analytical research platform. It does not solicit deposits, provide portfolio management services, execute trades, or hold client collateral.
