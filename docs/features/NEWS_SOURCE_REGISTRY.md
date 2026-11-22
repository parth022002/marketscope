# News Source Registry Specification

## 1. Source Credibility Tiers
The News Source Registry categorizes every media outlet, regulatory body, and data provider into four distinct credibility tiers:

| Tier | Category Name | Description & Representative Sources | Verification Weight |
|---|---|---|---|
| **Tier 1** | Primary Official Disclosures | Regulatory bodies, statutory filings, exchange feeds: NSE, BSE, SEBI, RBI, Ministry of Finance, PIB, US SEC EDGAR, Federal Reserve, Bank of England. | 1.00 (Authoritative) |
| **Tier 2** | Established Financial Journalism | Reputable institutional financial journalism with formal editorial boards: Bloomberg, Reuters, Financial Times, The Economic Times, Business Standard, Mint. | 0.85 (High Credibility) |
| **Tier 3** | Secondary Industry Press | Specialized industry publications, sector newsletters, press wire distributors: PR Newswire, Business Wire, AutoCar Pro, PharmaBiz. | 0.60 (Requires Corroboration) |
| **Tier 4** | Unverified / Social Media | Unverified social media posts, anonymous forums, non-institutional blogs. | Excluded from primary feed |

## 2. Source Metadata Schema
Every entry in the source registry records:
- `source_id`: Unique canonical identifier (e.g. `src-rbi-press`, `src-nse-filings`).
- `name`: Human-readable publisher name.
- `tier`: Credibility tier (`TIER_1_PRIMARY_OFFICIAL`, `TIER_2_ESTABLISHED_JOURNALISM`, `TIER_3_SECONDARY_INDUSTRY`).
- `base_url`: Official domain for verifying external links.
- `country`: Sovereign jurisdiction (India, United States, United Kingdom, Global).
- `license_type`: Data usage and syndication permissions (Permissive, Public Domain, Fair Use Attribution).
