# MarketScope.io — Instrument Mapping Rules & Disambiguation Policy

## 1. Overview

In financial markets, ticker symbols frequently collide across exchanges and share classes. For instance:
- `TCS` may refer to Tata Consultancy Services on the National Stock Exchange of India, or The Container Store on the New York Stock Exchange.
- `TATAMOTORS` vs `TATAMTRDVR`: Differential Voting Right shares issued by Tata Motors.
- `RELIANCE` vs `RPOWER` vs `RHFL`: Entities within the broader Reliance business ecosystems.

MarketScope.io implements strict, non-ambiguous resolution rules to ensure users are never misrouted or shown incorrect financial statements.

---

## 2. Priority Resolution Cascade

When resolving a query $q$:

```
1. Is $q$ an exact ISIN format? (12 alphanumeric characters, starting with country code)
   └── YES ──▶ Direct lookup in ISIN registry -> Return unique instrument.
2. Is $q$ a 6-digit numeric string?
   └── YES ──▶ Direct lookup in BSE scrip directory -> Return BSE instrument.
3. Is $q$ prefixed or suffixed with an explicit exchange? (e.g., "NSE:SBIN", "SBIN.NS", "AAPL:NASDAQ")
   └── YES ──▶ Parse exchange + symbol -> Match specific exchange listing.
4. Does $q$ match multiple active listings?
   └── YES ──▶ Trigger Disambiguation Protocol (requires_disambiguation = true).
5. Does $q$ have an exact primary ticker match?
   └── YES ──▶ Return primary active equity listing.
6. Does $q$ match company name tokens?
   └── YES ──▶ Rank by market cap and name similarity score.
7. Does $q$ match within Levenshtein edit distance <= 2?
   └── YES ──▶ Return top fuzzy suggestion with match_reason = "TYPO_FUZZY".
```

---

## 3. Disambiguation Protocol

When two or more distinct instruments share identical or near-identical tickers:
1. The backend API `/api/v1/instruments/resolve` returns:
   ```json
   {
     "query": "TCS",
     "resolved": false,
     "requires_disambiguation": true,
     "resolution_message": "Multiple listings found for 'TCS'. Please choose the appropriate exchange listing.",
     "candidates": [
       {
         "instrument_id": "in-nse-tcs",
         "symbol": "TCS",
         "company_name": "Tata Consultancy Services Ltd",
         "exchange_code": "NSE",
         "isin": "INE467B01029",
         "country": "India"
       },
       {
         "instrument_id": "us-nyse-tcs",
         "symbol": "TCS",
         "company_name": "The Container Store Group",
         "exchange_code": "NYSE",
         "isin": "US21075N1072",
         "country": "United States"
       }
     ]
   }
   ```
2. The user interface renders an interactive selection dialog allowing the user to select their desired listing, preserving analytical integrity.

---

## 4. Ticker Suffix Normalization Table

| Input Suffix | Standardized Exchange | Example Input | Standardized Instrument ID |
|---|---|---|---|
| `.NS`, `.NSE` | `NSE` | `RELIANCE.NS` | `in-nse-reliance` |
| `.BO`, `.BSE` | `BSE` | `500325.BO` | `in-bse-500325` |
| `.O`, `.OQ`, `.NAS` | `NASDAQ` | `AAPL.OQ` | `us-nasdaq-aapl` |
| `.N`, `.NYS` | `NYSE` | `JPM.N` | `us-nyse-jpm` |
| `.L`, `.LSE` | `LSE` | `SHEL.L` | `uk-lse-shel` |
| `.DE`, `.F` | `XETRA` | `SAP.DE` | `de-xetra-sap` |
| `.T`, `.TYO` | `TSE` | `7203.T` | `jp-tse-7203` |
| `.KS`, `.KRX` | `KRX` | `005930.KS` | `kr-krx-005930` |
