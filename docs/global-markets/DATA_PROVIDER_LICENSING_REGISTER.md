# Market Data Provider Licensing & Compliance Register

## 1. Statutory Licensing Framework

MarketScope.io maintains a strict compliance register ensuring all ingested financial market data satisfies domestic and international regulatory boundaries:
- **Non-Brokerage Research Exemption**: Data redistributed across MarketScope is strictly non-transactional and non-advisory. No order routing, trade matching, or investment execution occurs.
- **SEBI Display Standards**: Market data displayed for Indian instruments carries appropriate timestamping (`data_status: "LIVE"`, `"DELAYED_15M"`, or `"OFFICIAL_EOD"`). Derivatives screens carry mandatory statutory risk disclosure warnings.
- **Digital Personal Data Protection Act (DPDP Act 2023)**: User watchlist and research dossier data is isolated per workspace with full export (`/api/v1/workspace/dpdp/export`) and cryptographically verified deletion rights (`/api/v1/workspace/dpdp/purge`).

---

## 2. Provider Licensing Matrix

| Provider / Channel | Formal Licensing Tier | Permitted Use Case | Attribution & Display Requirement | Status |
|:---|:---|:---|:---|:---:|
| **Live Exchange Direct Engine** | Commercial Research & Display | Real-time quote aggregation and technical charting | Attribution displayed on ticker and hub | ACTIVE |
| **Twelve Data** | Developer / Commercial Display | US equities, major indices, and cross currencies | Attribution to Twelve Data API | ACTIVE |
| **Financial Modeling Prep** | Developer / Commercial | Fundamental data, audited financial filings, balance sheets | Attribution to FMP / SEC filings | ACTIVE |
| **AMFI India Portal** | Statutory Public Data | Daily scheme NAVs, AUM, and scheme categorization | AMFI attribution and daily valuation timestamp | ACTIVE |
| **RBI DBIE / FBIL** | Statutory Public Benchmark | Rupee reference rates and government bond fixings | FBIL / RBI official rate benchmark citation | ACTIVE |
| **Federal Reserve (FRED)** | Open Government Data | US Treasury yields, inflation, and policy rate series | FRED citation and release calendar note | ACTIVE |

---

## 3. Licensing Restrictions & Operational Rules
1. **Redistribution Rights**: MarketScope displays consolidated financial indicators directly to logged-in research users; sub-licensing or white-label resale of raw data feeds to third parties is strictly prohibited.
2. **Synthetic Flagging**: If a provider connection fails, synthetic fallback data is explicitly marked as `SYNTHETIC_DEMO`. Falsification of synthetic data as genuine live exchange quotes is strictly prohibited by platform code assertions.
