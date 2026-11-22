# MarketScope.io — Global Instrument Coverage & Market Inventory Audit

**Document Reference:** MS-AUD-COV-2026-02  
**Target:** Global Market Exchange Coverage, Instrument Typology & Universe Completeness  
**Date:** November 22, 2026  
**Auditor:** Financial Data Engineer & Market Structure Specialist  

---

## 1. Overview of Supported vs. Configured Universe
A market-by-market audit of MarketScope.io was performed to contrast advertised exchange coverage against actual resolvable instrument records in the platform.

```
+-----------------------------------------------------------------------------------+
|                        Coverage Audit Summary                                      |
+-----------------------------------------------------------------------------------+
| Market Region     | Exchanges Declared | Populated Records | Completeness Ratio   |
| India             | NSE, BSE           | 18 stocks         | 1.8% (Target: 1,000) |
| United States     | NASDAQ, NYSE       | 12 stocks         | 2.4% (Target: 500)   |
| United Kingdom    | LSE                | 2 stocks          | 2.0% (Target: 100)   |
| Germany / Europe  | XETRA, EURONEXT    | 2 stocks          | 2.0% (Target: 100)   |
| Japan             | TSE                | 1 stock           | 1.0% (Target: 100)   |
| Hong Kong / Asia  | HKEX, TWSE         | 1 stock           | 1.0% (Target: 100)   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Market-Specific Coverage Gaps

### 2.1 Indian Equities (NSE & BSE)
- **Top 50 Nifty Gaps**: Missing marquee leaders including State Bank of India (`SBIN`), ITC (`ITC`), Larsen & Toubro (`LT`), Bajaj Finance (`BAJFINANCE`), Maruti Suzuki (`MARUTI`), Sun Pharma (`SUNPHARMA`), Bharti Airtel (`BHARTIARTL`), Wipro (`WIPRO`), HCL Technologies (`HCLTECH`), Axis Bank (`AXISBANK`), and Kotak Mahindra Bank (`KOTAKBANK`).
- **BSE Dual Listings**: While BSE was registered as an exchange, 90% of Indian equities only had NSE listings populated, causing BSE-specific scrip code lookups (`500325`, `500112`) to return zero results.
- **SME & Emerging Tech Equities**: Absence of high-volume digital and consumer growth stocks (`ZOMATO`, `PAYTM`, `POLICYBZR`, `NYKAA`, `SWIGGY`).
- **ETFs, REITs & InvITs**: `NIFTYBEES`, `GOLDBEES`, `EMBASSY`, `MINDSPACE` REITs were unmapped.

### 2.2 US Equities (NASDAQ, NYSE)
- **Mega-Cap Tech**: While Apple (`AAPL`), Microsoft (`MSFT`), Google (`GOOGL`), and Nvidia (`NVDA`) were present in `instrument_master.py`, missing from `global_instrument_master.py` were Netflix (`NFLX`), Meta (`META`), Amazon (`AMZN`), Berkshire Hathaway (`BRK.B`), and Eli Lilly (`LLY`).
- **S&P 500 Sector Leaders**: Critical financial institutions (JPMorgan Chase `JPM`, Visa `V`), consumer staples (Walmart `WMT`, Procter & Gamble `PG`), and energy majors (ExxonMobil `XOM`) lacked canonical master entries.

### 2.3 International Equities (LSE, XETRA, TSE, HKEX)
- Asian benchmarks: Samsung Electronics (`005930.KS`), Toyota Motor (`7203.T`), Alibaba (`9988.HK`), and Tencent (`0700.HK`) lacked resilient fallback schemas when third-party market data APIs failed.
- European leaders: Shell (`SHEL.L`), AstraZeneca (`AZN.L`), SAP (`SAP.DE`), ASML (`ASML.AS`), and LVMH (`MC.PA`) were missing from live lookup.

---

## 3. Target Instrument Universe Blueprint
To achieve true institutional-grade coverage, MarketScope.io must integrate a canonical registry of **at least 500+ prominent global securities** structured with:
- Dual-exchange mappings (NSE + BSE).
- Verified ISIN identifiers for all Indian and US equities.
- Industry and sector taxonomic tags matching GICS standards.
- Fallback financial statements and valuation models for offline/sandboxed resilience.
