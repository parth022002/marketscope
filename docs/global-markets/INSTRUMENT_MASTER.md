# Universal Instrument Master Registry

## 1. Catalog Architecture

The Universal Instrument Master (`apps/api/app/engine/instrument_master.py`) indexes **124+ production instruments across 20 standardized asset classes**.

Each entry maintains:
1. **Authoritative Canonical ID**: Unique identifier formatted as `inst_<country>_<ticker>`.
2. **Multi-Symbol Alias Indexing**: Primary symbol, Bloomberg/Reuters ticker, Yahoo Finance ticker, exchange ticker, and BSE Scrip code.
3. **Exchange Binding**: Binding to exchange ISO MIC code, country, and region.
4. **Resident Regulatory Route**: Evaluated against SEBI, RBI LRS, FEMA, and IFSCA rules.
5. **Price Precision & Tick Size**: Financial precision (e.g., INR 0.05 tick, COMEX 0.01 tick, Sovereign Yield 0.001%).
6. **Data Delivery & Licensing Mode**: Direct streaming, poll REST 5s, official release, or daily NAV.

---

## 2. 20 Standardized Asset Classes Coverage

```
                                    Universal Asset Classes (20)
       +-------------------------+-------------------------+-------------------------+
       |   EQUITIES & INDICES    |       DERIVATIVES       |     FIXED INCOME        |
       |  - EQUITY               |  - FUTURE               |  - GOVERNMENT_BOND      |
       |  - INDEX                |  - OPTION               |  - CORPORATE_BOND       |
       |  - ETF                  |                         |  - TREASURY_BILL        |
       |  - REIT                 |                         |  - YIELD_CURVE          |
       |  - INVIT                |                         |  - SGB                  |
       +-------------------------+-------------------------+-------------------------+
       |   COMMODITIES & FX      |   FUNDS & RETIREMENT    |     MACRO & CAPITAL     |
       |  - COMMODITY            |  - MUTUAL_FUND          |  - INTEREST_RATE        |
       |  - CURRENCY             |  - PENSION_INDICATOR    |  - ECONOMIC_INDICATOR   |
       |                         |                         |  - IPO                  |
       |                         |                         |  - OTHER                |
       +-------------------------+-------------------------+-------------------------+
```

---

## 3. Representative Universal Instruments Catalog

### 3.1 Domestic Indian Equities (NSE / BSE)
- **RELIANCE** (INE002A01018, BSE: 500325, NSE: RELIANCE) — Energy & Telecom Conglomerate
- **TCS** (INE467B01029, BSE: 532540, NSE: TCS) — IT Services & Consulting
- **HDFCBANK** (INE040A01034, BSE: 500180, NSE: HDFCBANK) — Private Banking Leader
- **INFY** (INE009A01021, BSE: 500209, NSE: INFY) — Global Enterprise IT
- **ICICIBANK** (INE090A01021, BSE: 532174, NSE: ICICIBANK) — Retail & Corporate Banking
- **BHARTIARTL** (INE397D01024, BSE: 532454, NSE: BHARTIARTL) — Telecommunications
- **SBIN** (INE062A01020, BSE: 500112, NSE: SBIN) — Public Sector Banking
- **KOTAKBANK**, **AXISBANK**, **BAJFINANCE**, **TITAN**, **ASIANPAINT**, **SUNPHARMA**, **MARUTI**, **M&M**, **TATAMOTORS**, **TATASTEEL**, **POWERGRID**, **NTPC**, **ULTRACEMCO**, **ADANIENT**, **ADANIPORTS**

### 3.2 US & Global Equities (NYSE / NASDAQ / LSE / XETRA / TSE)
- **AAPL** (US0378331005, NASDAQ: AAPL) — Consumer Electronics & Ecosystem
- **MSFT** (US5949181045, NASDAQ: MSFT) — Enterprise Cloud & Productivity
- **NVDA** (US67066G1040, NASDAQ: NVDA) — Accelerated Computing & AI Infrastructure
- **GOOGL** (US02079K3059, NASDAQ: GOOGL) — Search, Cloud & AI Systems
- **AMZN** (US0231351067, NASDAQ: AMZN) — E-Commerce & AWS Cloud
- **META** (US30303M1027, NASDAQ: META) — Social Technologies & Meta AI
- **TSLA** (US88160R1014, NASDAQ: TSLA) — Electric Vehicles & Autonomy
- **AVGO**, **QCOM**, **AMD**, **INTC**, **CRM**, **ORCL**, **ADBE**, **BRK-B**, **JPM**, **V**, **MA**, **WMT**, **PG**, **JNJ**, **UNH**, **LLY**
- **AZN.L** (AstraZeneca, LSE), **SAP.DE** (SAP SE, XETRA), **7203.T** (Toyota Motor, TSE)

### 3.3 Exchange-Traded Funds & Feeder Funds
- **NIFTYBEES** (Nippon India Nifty 50 ETF, NSE)
- **SETFNIF50** (SBI Nifty 50 ETF, NSE)
- **MON100** (Motilal Oswal Nasdaq 100 ETF, NSE)
- **SPY** (SPDR S&P 500 ETF Trust, NYSE Arca)
- **QQQ** (Invesco QQQ Trust Series 1, NASDAQ)
- **SMH** (VanEck Semiconductor ETF, NASDAQ)
- **AMFI 148529** (Edelweiss US Technology Equity Off-shore Feeder Fund)
- **AMFI 120344** (Franklin India Feeder - Templeton European Opportunities)
- **AMFI 119041** (PGIM India Global Equity Opportunities Fund)

### 3.4 Commodities & FX Benchmarks
- **GOLD-MCX** (MCX 10g 24K), **SILVER-MCX** (MCX 1kg), **CRUDEOIL-MCX** (MCX 100 bbl)
- **GC=F** (COMEX Gold $ / oz), **SI=F** (COMEX Silver $ / oz)
- **BZ=F** (ICE Brent Crude $ / bbl), **CL=F** (NYMEX WTI Crude $ / bbl), **NG=F** (NYMEX Natural Gas)
- **USD/INR**, **EUR/INR**, **GBP/INR**, **JPY(100)/INR** (RBI Official Daily Reference Rates)
- **DXY** (US Dollar Index), **EUR/USD**, **GBP/USD**, **USD/AED**

### 3.5 Sovereign Fixed Income & Debt Curves
- **India Sovereign Yields**: 3M, 6M, 1Y, 2Y, 3Y, 5Y, 10Y Benchmark (6.78%), 14Y, 30Y (7.02%)
- **US Sovereign Yields**: 1M, 3M, 6M, 1Y, 2Y, 5Y, 10Y Benchmark (4.42%), 30Y (4.65%)
- **Global Yields**: Germany 10Y Bund, UK 10Y Gilt, Japan 10Y JGB
- **Sovereign Gold Bonds**: SGB 2024-25 Series I, SGB 2023-24 Series IV, SGB 2020-21 Series VI
