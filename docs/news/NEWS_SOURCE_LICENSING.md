# MarketScope.io — News Source Licensing & Content Rights Policy

## 1. Compliance Statement & Legal Boundaries

MarketScope.io operates as an institutional financial research and market intelligence platform. It is committed to strict adherence to the **Copyright Act, 1957 (India)**, the **Digital Personal Data Protection (DPDP) Act, 2023**, the **US Digital Millennium Copyright Act (DMCA)**, and global fair-use doctrines.

Under no circumstances does MarketScope.io:
1. Bypass publisher paywalls, access controls, or subscriber authentication gates.
2. Defeat CAPTCHAs, bot-detection scripts, or cloud-edge security measures.
3. Scrape or extract proprietary full-text articles without explicit contractual agreement.
4. Reproduce copyrighted journalism in full.
5. Strip or obscure original author, photographer, or publisher attribution.
6. Fabricate quotes, citations, or synthetic replacements for gated content.

---

## 2. Licensing Status Classifications

Every connected news source in the platform's database is governed by an explicit `license_status`:

| License Status | Legal Interpretation | Platform Ingestion & Display Rules |
| :--- | :--- | :--- |
| **`APPROVED_FOR_PRODUCTION`** | Fully licensed via commercial API contract or public institutional open-data mandate. | Unrestricted ingestion, search indexing, entity mapping, and grounded summary generation. |
| **`APPROVED_WITH_RESTRICTIONS`**| Public RSS or syndication feed permitted for headline, snippet, and link display. | Display restricted to: Original headline, verified publication date, publisher attribution, short factual summary ($\le 60\text{ words}$), and mandatory direct external link. |
| **`FREE_NONCOMMERCIAL_ONLY`** | Source terms restrict usage to non-profit or personal educational contexts. | Permitted in local staging and sandbox testing; restricted from public commercial display. |
| **`COMMERCIAL_LICENCE_REQUIRED`**| Publisher requires bilateral commercial redistribution licensing agreement. | Ingestion disabled or held in staging pending procurement of commercial license credentials. |
| **`ATTRIBUTION_REQUIRED`** | Public feed permitted provided prominent publisher attribution is rendered. | Display requires publisher name, source link, and verification badge. No deep framing or full-text caching. |
| **`LICENCE_UNVERIFIED`** | Legal review of terms of service is pending. | Connector disabled in production until legal clearance is logged in `news_source_licenses`. |
| **`DISABLED`** | Connector deactivated due to publisher request, upstream change, or terms violation. | Ingestion completely halted; historical records preserved with retraction/archive flags. |

---

## 3. Publisher Rights & Fair Dealing Framework

### A. Public Official Disclosures (Government & Regulators)
Official publications from statutory bodies (SEBI, RBI, PIB, Ministry of Finance, US Federal Reserve, SEC EDGAR) constitute public legal records. These are ingested for full factual analysis, public reference citations, and regulatory transparency without copyright infringement.

### B. Commercial Journalism (Reuters, Mint, Bloomberg, FT, etc.)
1. **Headline & Short Grounded Summary**: Treated under fair dealing provisions for financial reporting, review, and public commentary.
2. **Direct Linkage**: Every displayed story provides a direct clickable link (`rel="noopener noreferrer"`) driving user traffic directly to the publisher's authoritative domain.
3. **Publisher Take-Down Procedure**: MarketScope maintains an automated DMCA/Copyright contact protocol. Legitimate removal requests are executed within 4 hours by flagging the record as `DISABLED_BY_PUBLISHER_REQUEST`.
