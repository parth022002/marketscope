# MarketScope.io — Verified Financial News Module

## 1. Overview
The News module delivers authenticated, source-backed financial intelligence with zero synthetic generation or fabricated quotes.

## 2. Verification Architecture
- **Legitimate Primary Sources**: Direct feeds and press releases from exchanges (NSE, BSE, SEC EDGAR), regulatory authorities (SEBI, RBI, SEC), and verified financial publishers (Bloomberg, Reuters, LiveMint, Economic Times).
- **Provenance Badges**:
  - `VERIFIED_PRIMARY`: Direct regulatory filing or exchange corporate announcement.
  - `VERIFIED_NEWSWIRE`: Reputable international or domestic financial newswire.
- **Market Impact Scoring**: Algorithmic assessment of news event importance (Critical, High, Medium, Low) based on ticker association, financial materiality, and regulatory filing type.
