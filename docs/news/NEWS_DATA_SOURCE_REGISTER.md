# MarketScope.io — Official News Source & Primary Disclosure Register

## 1. Registry Overview

MarketScope.io categorizes all financial information sources into an authoritative hierarchical registry. The platform enforces a strict priority of **Primary Official Disclosures > Established Professional Journalism > Secondary Specialist Publications**.

Every registered source is assigned an immutable `source_id`, a credibility tier, an access protocol, permitted usage rights, and monitored refresh intervals.

---

## 2. Primary Official Institutional Disclosures (Tier 1)

### A. Indian Regulatory & Market Infrastructure Institutions

| Source ID | Institution Name | Regulatory Scope | Ingestion Interface | Format | Permitted Usage | Refresh Cycle |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| `src_in_nse_corp` | National Stock Exchange of India (NSE) | Corporate announcements, financial results, board meetings | Official Announcements Public RSS / JSON API | JSON / XML | Metadata, headline, filing link, short disclosure summary | 3 minutes |
| `src_in_bse_corp` | BSE India Limited | Equity disclosures, corporate actions, voting outcomes | Corporate Announcements Feed | XML / RSS | Headline, security code, filing link, categorized extract | 3 minutes |
| `src_in_sebi` | Securities & Exchange Board of India (SEBI) | Regulatory circulars, board orders, consultation papers | Official Press Release & Circulars RSS | RSS / PDF | Full public regulatory text, circular number, legal link | 15 minutes |
| `src_in_rbi` | Reserve Bank of India (RBI) | Monetary policy outcomes, banking notifications, FX circulars | RBI Official Press Releases Feed | RSS / HTML | Monetary statements, statistical tables, official governor speeches | 5 minutes |
| `src_in_pib` | Press Information Bureau (PIB) | Government of India economic and cabinet decisions | Ministry of Finance & Commerce PIB RSS | RSS / XML | Official government press releases, policy communiqués | 10 minutes |
| `src_in_mcx` | Multi Commodity Exchange (MCX) | Commodity circulars, margin changes, delivery schedules | MCX Member Notices Public Feed | HTML / RSS | Public exchange notices and delivery dates | 15 minutes |

### B. United States & International Primary Institutions

| Source ID | Institution Name | Jurisdiction | Ingestion Interface | Format | Permitted Usage | Refresh Cycle |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| `src_us_sec` | SEC EDGAR System | United States | SEC Public Submissions RSS / JSON API | JSON / RSS | 10-K, 10-Q, 8-K filings metadata, accession links | 5 minutes |
| `src_us_fed` | Federal Reserve Board of Governors | United States | Federal Reserve Press Releases RSS | RSS / XML | FOMC statements, discount rate notices, policy minutes | 5 minutes |
| `src_us_treasury` | US Department of the Treasury | United States | Treasury Press Center RSS | RSS / XML | Debt issuance schedules, economic policy releases | 15 minutes |
| `src_us_bls` | US Bureau of Labor Statistics | United States | Economic News Releases RSS | RSS / XML | CPI, PPI, Non-Farm Payrolls official data releases | 15 minutes |
| `src_eu_ecb` | European Central Bank (ECB) | Eurozone | ECB Monetary Policy RSS Feed | RSS / XML | Policy rate decisions, economic bulletins | 15 minutes |
| `src_uk_boe` | Bank of England (BoE) | United Kingdom | BoE News & Publications RSS | RSS / XML | Monetary Policy Committee decisions, financial stability | 15 minutes |

---

## 3. Reputable Financial News Publishers (Tier 2)

All Tier 2 publishers are ingested strictly via permitted public syndication feeds or licensed API partners. In full compliance with intellectual property standards, MarketScope displays **original headlines, verified publication timestamps, publisher attribution, short grounded extracts, and direct hyperlinks to the publisher's original article**. Full articles are never reproduced without dedicated bilateral licensing.

| Source ID | Publisher Name | Country | Channel Scope | Integration Method | Content Rights Status |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `src_pub_reuters` | Reuters Financial Wire | Global / UK | Markets, central banks, commodities, global macro | Permitted Syndication / Licensed API | ATTRIBUTION_REQUIRED |
| `src_pub_mint` | Mint (HT Media) | India | Indian corporate news, economy, policy, startups | Authorized Financial RSS Feed | ATTRIBUTION_REQUIRED |
| `src_pub_bs` | Business Standard | India | Indian banking, markets, fiscal policy, results | Official Public RSS Feed | ATTRIBUTION_REQUIRED |
| `src_pub_et` | The Economic Times | India | Corporate announcements, indices, policy updates | Financial RSS Feed | ATTRIBUTION_REQUIRED |
| `src_pub_moneycontrol`| Moneycontrol (Network18)| India | Stock market news, corporate earnings, IPOs | Permitted Market RSS Feed | ATTRIBUTION_REQUIRED |
| `src_pub_cnbc` | CNBC International | US / Global | Wall Street, Fed, global technology, energy | Syndicated Business RSS | ATTRIBUTION_REQUIRED |
| `src_pub_bbc_biz` | BBC Business | UK / Global | International trade, macroeconomics, industry | BBC Business RSS Feed | ATTRIBUTION_REQUIRED |
| `src_pub_ft` | Financial Times | UK / Global | Global capital markets, banking, European policy | Permitted Headline RSS / API | ATTRIBUTION_REQUIRED |

---

## 4. News Aggregation Platforms & APIs (Tier 3)

| Source ID | Aggregator Name | Coverage Scope | API Protocol | Commercial License Status |
| :--- | :--- | :--- | :--- | :--- |
| `src_agg_fmp` | Financial Modeling Prep (FMP) | Global equity press releases, SEC filings, earnings transcripts | Authenticated REST API | APPROVED_FOR_PRODUCTION |
| `src_agg_twelvedata`| Twelve Data | Global market news & cryptocurrency intelligence | Authenticated REST API | APPROVED_FOR_PRODUCTION |
| `src_agg_gnews` | GNews Financial Aggregator | Multi-publisher financial search | REST API | APPROVED_WITH_RESTRICTIONS |

---

## 5. Source Health & Availability Monitoring

Every registered source connector reports automated operational telemetry:
- **`status`**: `HEALTHY`, `DEGRADED`, `DOWN`, or `BLOCKED_PENDING_CREDENTIALS`
- **`last_successful_fetch`**: ISO 8601 UTC timestamp
- **`last_error_message`**: Exact HTTP status or parse exception
- **`latency_ms`**: Ingestion response time
- **`articles_ingested_24h`**: Total verified stories processed
