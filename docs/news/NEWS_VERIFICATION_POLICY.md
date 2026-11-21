# MarketScope.io — News Verification & Trust Policy

## 1. Core Principle: Evidence Before Publication

MarketScope.io enforces the foundational rule:
> **Trust and accuracy take absolute precedence over speed, story volume, or click-driven engagement.**

No news item may display a "Verified" status without identifiable supporting evidence. The reputation of a publisher alone does not automatically verify factual assertions.

---

## 2. Source Credibility Tiering

Every ingestible source is evaluated against objective, published criteria:

### Tier 1 — Primary Official Disclosures
- **Criteria**: Statutory authority, legal registry filings, exchange disclosures, central bank decrees, or official audited company announcements.
- **Examples**: NSE Corporate Filings, BSE Announcements, SEBI Circulars, RBI Gazettes, SEC EDGAR 8-K/10-K, Federal Reserve Statements.
- **Evidence Weight**: Definitive ($1.0$).

### Tier 2 — Established Professional Journalism
- **Criteria**: Multi-decade editorial standards, transparent bylines, independent verification, and public correction archives.
- **Examples**: Reuters, Bloomberg, Financial Times, Wall Street Journal, Mint, Business Standard, The Economic Times.
- **Evidence Weight**: High ($0.85$).

### Tier 3 — Secondary Specialist Publications
- **Criteria**: Reputable vertical trade publications, industry research bureaus, and verified niche newsletters.
- **Examples**: SEMI Trade Association, S&P Global Commodity Insights, PV Magazine.
- **Evidence Weight**: Moderate ($0.65$).

### Tier 4 — Unverified / Social Media
- **Criteria**: Social media posts (X/Twitter, LinkedIn, Telegram), unverified blogs, rumors, anonymous leaks.
- **Status**: **STRICTLY EXCLUDED** from main news feed. Social posts are never treated as confirmation of financial events.

---

## 3. Verification Status Criteria & Transition Rules

```
                      [New Ingested Story]
                                │
          ┌─────────────────────┴─────────────────────┐
          ▼                                           ▼
[Matches Tier 1 Filing?]                   [Tier 2 Publisher Only?]
    ├── YES ──► PRIMARY_SOURCE_CONFIRMED       ├── Single ──► SINGLE_CREDIBLE_SOURCE
    └── NO                                     └── >= 2   ──► MULTIPLE_SOURCES_REPORTED
                                                                    │
                                                       [Disputed Claims Detected?]
                                                           ├── YES ──► DISPUTED
                                                           └── NO  ──► MAINTAIN STATUS
```

### Verification Status Table

| Status | Exact Requirement | UI Representation |
| :--- | :--- | :--- |
| **`PRIMARY_SOURCE_CONFIRMED`** | Matched with verifiable regulatory filing (BSE/NSE/SEBI/SEC) or official Gazette | Green badge with checkmark (`#10B981`) |
| **`MULTIPLE_SOURCES_REPORTED`** | Independently reported by $\ge 2$ Tier 2 publishers with distinct bylines | Cyan badge with dual nodes (`#06B6D4`) |
| **`SINGLE_CREDIBLE_SOURCE`** | Reported by exactly 1 Tier 2 publisher; no secondary confirmation yet | Blue badge with single node (`#3B82F6`) |
| **`DEVELOPING_STORY`** | Live event with rapidly updating disclosures; facts subject to change | Amber badge with pulsing indicator (`#F59E0B`) |
| **`DISPUTED`** | Two credible publishers report contradictory numbers, dates, or outcomes | Red-bordered badge displaying conflict |
| **`UNVERIFIED`** | Source lacks Tier 1-3 accreditation; held from general market feed | Slate grey badge (`#64748B`) |
| **`CORRECTED`** | Source published a formal correction; notice linked and diff highlighted | Orange badge with amendment timestamp |
| **`RETRACTED`** | Source formally withdrew the story; headline struck through and archived | Red strike-through banner |
