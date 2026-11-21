# MarketScope.io — News Correction, Retraction & Audit Policy

## 1. Transparency Commitment: No Silent Rewrites

In financial intelligence, errors in reported figures, dates, or corporate disclosures can lead to flawed research conclusions.

MarketScope.io enforces a strict policy:
> **Never silently delete, overwrite, or hide historical reporting errors.**

When an external publisher, regulatory agency, or internal fact-checker issues an amendment, the system maintains a complete, inspectable **Correction Audit History**.

---

## 2. Correction Workflow & State Machine

```
[Original Article Ingested: Version 1.0]
                   │
                   ▼
[Publisher Issues Clarification / Correction]
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│  Correction Processing Engine                          │
│  ├── Preserve Version 1.0 in news_article_versions     │
│  ├── Create Version 2.0 with amended text              │
│  ├── Compute & Store Diff (Original vs Corrected)      │
│  ├── Assign VerificationStatus = CORRECTED             │
│  └── Post Timestamped Notice in Correction History     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
[UI Renders Prominent Correction Banner & Version Diff Drawer]
```

---

## 3. Retraction Handling

If a publisher or regulatory body formally retracts a story (e.g. false acquisition rumor or erroneous earnings leak):
1. **Never Hard Deleted**: The article record is preserved in the database to prevent link breakage (`404`) and preserve evidentiary lineage.
2. **Visual Treatment**:
   - Verification status is permanently set to `RETRACTED`.
   - The headline is rendered with a strikethrough: e.g. ~~*Erroneous Acquisition Report*~~.
   - A bold red alert banner displays the publisher's official retraction statement and link.
   - The story is immediately excluded from real-time ticker feeds, company dossiers, and search rankings.

---

## 4. User Dispute & Correction Reporting Workflow

Users can report factual discrepancies using the `/api/v1/news/report` endpoint:
- **Categories**: Incorrect Financial Figure, Misattributed Entity, Broken Evidence Link, Outdated Status, Missing Correction.
- **SLA**: Administrative investigation initiated within 2 hours during market hours.
- **Resolution**: If validated, a `NewsCorrection` entry is created and the reporting user is notified.
