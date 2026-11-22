# Data and Provider Audit
**Platform:** MarketScope.io  
**Evaluation Date:** November 2026  
**Auditor:** Data Governance & Market Infrastructure Specialist  

---

## 1. Data Provider Inventory & Rights Matrix

| Provider / Source | Data Domain | Delivery Mode | Provenance Classification | Current Permitted Usage | License State | Status |
|---|---|---|---|---|---|---|
| **NSE (National Stock Exchange of India)** | Indian Equities, Indices, Derivatives | Official Disclosures & Calibrated Feeds | Primary Official Exchange | Research, End-of-Day Display, Derived Metrics | `FREE_WITH_RESTRICTIONS` | `VALIDATED` |
| **BSE (Bombay Stock Exchange)** | SENSEX, Indian Equities | Official Regulatory Disclosures | Primary Official Exchange | Educational & Research Display, Calibrated EOD | `FREE_WITH_RESTRICTIONS` | `VALIDATED` |
| **MCX (Multi Commodity Exchange)** | Bullion (Gold, Silver), Energy, Metals | Dual Session Exchange Feeds | Primary Commodity Exchange | Session State Resolution, Calibrated Quotes | `FREE_WITH_RESTRICTIONS` | `VALIDATED` |
| **Reserve Bank of India (RBI)** | Monetary Policy Rates, Banking Holidays (NI Act) | Statutory Gazette Disclosures | Central Bank Public Domain | Public Domain Educational & Research Citation | `FREE_PUBLIC_USE_VERIFIED` | `VALIDATED` |
| **SEBI (Securities & Exchange Board of India)** | Regulatory Circulars, Press Releases | Statutory Regulatory Gazette | Public Regulatory Body | Public Disclosure Citation with Direct Links | `FREE_PUBLIC_USE_VERIFIED` | `VALIDATED` |
| **US SEC EDGAR** | US Corporate 10-K, 10-Q Filings | Public Regulatory API | Government Open Data | Open Public Access with Standard Rate Limits | `FREE_PUBLIC_USE_VERIFIED` | `VALIDATED` |
| **US Federal Reserve (FRED) & US Treasury** | Policy Rates, Yield Curves, Macro Data | Public Open Data APIs | Central Bank Open Data | Open Public Domain Display with Attribution | `FREE_PUBLIC_USE_VERIFIED` | `VALIDATED` |
| **Financial Modeling Prep (FMP)** | International Quotes, Fundamentals | Commercial API | Third-Party Aggregator | Internal Testing / Evaluation Key | `COMMERCIAL_SUBSCRIPTION_REQUIRED` | `CONNECTED` (Key Configured) |
| **TwelveData** | Global Indices, Forex, Crypto | Commercial API | Third-Party Aggregator | Free Developer Tier / Testing | `FREE_WITH_RESTRICTIONS` | `CONNECTED` (Key Configured) |
| **Groq Cloud API** | LLaMA 3.3 70B AI Inference | Cloud AI API | AI Inference Provider | Developer API Tier (Zero Model Training on Data) | `FREE_WITH_RESTRICTIONS` | `CONNECTED` |
| **Google Gemini API** | Gemini 1.5 Flash Reasoning | Cloud AI API | AI Inference Provider | Enterprise Cloud Terms | `COMMERCIAL_SUBSCRIPTION_REQUIRED` | `CONNECTED` |

---

## 2. Data Freshness Taxonomy
All platform metrics and quotes strictly report one of seven unambiguous freshness states:
1. `LIVE`: Continuous real-time streaming feed (< 1 second latency).
2. `DELAYED`: Standard exchange-mandated 15-minute delayed dissemination.
3. `END_OF_DAY`: Official closing prices determined via closing auction.
4. `HISTORICAL`: Immutable archival records from past financial quarters or trading sessions.
5. `CALIBRATED_EOD`: Calibrated baseline figures verified against official closing gazettes.
6. `STALE`: Cached record older than standard refresh window; requires automated re-fetch.
7. `UNAVAILABLE`: Feed offline or market closed without available quotes.
