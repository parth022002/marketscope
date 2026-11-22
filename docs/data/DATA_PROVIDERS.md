# MarketScope.io — Data Providers Register

## 1. Authorized Data Providers
MarketScope.io integrates with verified global and domestic financial data providers:

| Provider | Supported Asset Classes | Update Cadence | Key Endpoints Used |
| :--- | :--- | :--- | :--- |
| **TwelveData** | Global Equities, FX, Cryptos, Indices | Real-time / 15-min delayed | `/time_series`, `/price`, `/quote` |
| **Financial Modeling Prep (FMP)** | Equities, Financial Statements, Ratios | EOD / Real-time US | `/profile`, `/income-statement`, `/balance-sheet-statement` |
| **AlphaVantage** | Equities, Technical Indicators, FX | 15-min delayed / EOD | `/query?function=TIME_SERIES_DAILY` |
| **Official Exchange Disclosures** | Corporate Announcements, Filings | Real-time / Periodic | NSE / BSE Corporate Feeds & SEC EDGAR |

## 2. Failover & Fallback Mechanism
If an upstream provider quota is exhausted or encounters downtime:
1. System logs the provider failure with error telemetry.
2. The pipeline queries the secondary provider.
3. If both providers fail, the system serves the last authenticated close from the PostgreSQL database with an explicit `CALIBRATED_EOD` provenance tag.
