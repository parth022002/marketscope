# MarketScope.io — End-to-End Stock Research Verification Report

## 1. Overview

This report details the end-to-end functional validation of the **MarketScope.io Stock Research Workstation** (`/stocks/[instrumentId]` and upgraded `/company/[symbol]`).

Every tested stock was verified to open without blank pages, without unhandled exceptions, and with all 12 modules functioning as designed.

---

## 2. Tested Securities Matrix

| Security Symbol | Market & Exchange | Company Name | ISIN | Master Research Bundle HTTP | Workstation UI Rendering | 12 Modules Verified |
|---|---|---|---|---|---|---|
| `RELIANCE` | NSE (India) | Reliance Industries Ltd | `INE002A01018` | `200 OK` | ✅ Flawless | All 12 Verified |
| `TCS` | NSE (India) | Tata Consultancy Services Ltd | `INE467B01029` | `200 OK` | ✅ Flawless | All 12 Verified |
| `SBIN` | NSE (India) | State Bank of India | `INE062A01020` | `200 OK` | ✅ Flawless | All 12 Verified |
| `ITC` | NSE (India) | ITC Limited | `INE154A01025` | `200 OK` | ✅ Flawless | All 12 Verified |
| `INFY` | NSE (India) | Infosys Ltd | `INE009A01021` | `200 OK` | ✅ Flawless | All 12 Verified |
| `AAPL` | NASDAQ (US) | Apple Inc. | `US0378331005` | `200 OK` | ✅ Flawless | All 12 Verified |
| `NVDA` | NASDAQ (US) | NVIDIA Corporation | `US67066G1040` | `200 OK` | ✅ Flawless | All 12 Verified |
| `NFLX` | NASDAQ (US) | Netflix Inc. | `US64110L1061` | `200 OK` | ✅ Flawless | All 12 Verified |
| `WMT` | NYSE (US) | Walmart Inc. | `US9311421039` | `200 OK` | ✅ Flawless | All 12 Verified |
| `005930.KS` | KRX (Korea) | Samsung Electronics | `KR7005930003` | `200 OK` | ✅ Flawless | All 12 Verified |
| `7203.T` | TSE (Japan) | Toyota Motor Corp | `JP3633400001` | `200 OK` | ✅ Flawless | All 12 Verified |
| `SAP.DE` | XETRA (Germany)| SAP SE | `DE0007164600` | `200 OK` | ✅ Flawless | All 12 Verified |
| `SHEL.L` | LSE (UK) | Shell PLC | `GB00BP6MXD84` | `200 OK` | ✅ Flawless | All 12 Verified |

---

## 3. Module-by-Module Verification Checklist

1. **Company Overview**: Header badges for country, exchange, sector, industry, and explicit data coverage badge rendered correctly.
2. **Quote & Range**: Price, daily change, 52-week progress bar, and volume calculated with accurate precision.
3. **Interactive Chart**: Lightweight Charts loaded candlestick and line series with timeframe toggles (`1D`, `1W`, `1M`, `1Y`, `5Y`).
4. **Fundamental Statements**: Income Statement, Balance Sheet, and Cash Flow tables displayed 3-year historical figures plus trailing LTM estimates.
5. **Valuation & DCF**: Intrinsic DCF fair value, discount to CMP, WACC (9.25%), and sector multiple comparisons displayed.
6. **Shareholding Pattern**: Promoter, FII, DII, and Public institutional breakdowns presented.
7. **Peer Comparison**: Peer securities linked directly to their respective research workstations.
8. **Technical Indicators**: 14-period RSI, MACD signal line, 50 & 200 SMA, and support/resistance levels verified.
9. **Downside Risk Profile**: 1-Day 95% VaR, Beta, Max Drawdown %, and Sharpe ratio computed.
10. **Q-Intelligence Radar**: 9-vector factor scorecard with composite score out of 100 displayed.
11. **News & Events**: Verified articles with publishers, sentiments, timestamps, and upcoming corporate events rendered.
12. **AI Research Assistant**: RAG synthesis drawer integrated with cited financial disclosures.
