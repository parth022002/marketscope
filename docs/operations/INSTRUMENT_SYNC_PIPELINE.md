# MarketScope.io — Instrument Synchronization & Data Ingestion Pipeline

## 1. Pipeline Overview

The Instrument Synchronization Pipeline maintains synchronicity between MarketScope.io's in-memory index, transactional databases, and primary exchange feeds. It ingests new IPO listings, tracks corporate ticker changes, processes stock splits, and flags delisted or suspended securities.

```
┌────────────────────────────────────────────────────────┐
│             External Exchange Ingestion Feeds          │
│   (NSE Bhavcopy, BSE Master, SEC EDGAR, Refinitiv)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│            Data Normalization & Sanitization           │
│   - Unicode normalization (NFKC)                       │
│   - ISIN checksum verification (Luhn Mod 10)           │
│   - Currency and sector taxonomy alignment             │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│        Global Instrument Master (PostgreSQL DB)        │
│   - ACID transactional consistency                     │
│   - Multi-listing & corporate action history           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│          In-Memory Token Inverted Search Index         │
│   - Sub-5ms query resolution                           │
│   - Atomic swap on reload (zero read downtime)         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Ingestion Schedule & Triggers

| Event Type | Frequency | Source Feeds | Validation Rules |
|---|---|---|---|
| **EOD Market Sync** | Daily (18:30 IST / 21:00 UTC) | NSE Bhavcopy, BSE Corporate Data | Validates OHLCV completeness and traded value |
| **Corporate Actions (Splits, Bonuses)** | Weekly (Saturdays 02:00 UTC) | Exchange circulars, SEBI disclosures | Adjusts historical candle series & share counts |
| **New Listings (IPOs)** | Daily (08:00 IST / 02:30 UTC) | Exchange pre-market circulars | Verified ISIN, scrip code, lot size, tick size |
| **Delisting / Suspension** | Immediate on notice | Exchange notices & alerts | Updates status to `DISCONTINUED_INACTIVE` |

---

## 3. Resilient Fail-Safe Protocol

1. **Pre-Computed Backup Index**:
   - The application bundles a static, verified binary index containing 122+ global and domestic blue chips.
   - If external network feeds or databases are unavailable during deployment on Render or edge containers, the engine automatically initializes with the pre-computed canonical index, guaranteeing uninterrupted uptime.

2. **Luhn Mod 10 Algorithm for ISIN Validation**:
   - Every ISIN ingested is validated against the ISO 6166 checksum standard before indexing. Invalid ISINs are quarantined for compliance review.
