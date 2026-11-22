# MarketScope.io — Stock Search Engine Architecture & Root Cause Audit

**Document Reference:** MS-AUD-SRCH-2026-01  
**Target:** Stock Search API, Discovery Pipeline & Resolution Logic  
**Date:** November 22, 2026  
**Auditor:** Principal Search Architect & Financial Data Engineer  

---

## 1. Executive Summary
An exhaustive diagnostic audit of MarketScope.io's stock search engine was conducted to determine why users frequently experience zero-result searches or missing tickers when querying valid, publicly traded domestic and international securities (such as State Bank of India `SBIN`, `ITC`, `Walmart`, `Netflix`, `Samsung`, and ISIN identifiers).

The audit revealed three primary structural root causes:
1. **Severely Constrained In-Memory Registry**: The primary search backend (`global_instrument_master.py`) contained only 36 statically initialized instruments. Two separate, disjoint instrument registries existed in the codebase (`global_instrument_master.py` with 36 items vs. `instrument_master.py` with 124 items) that were never consolidated or unified.
2. **Provider Fail-Closed Architecture**: When a query fell through the 36-item in-memory dictionary, the fallback provider (`HybridGlobalProvider`) dispatched an unauthenticated query to Yahoo Finance (`yfinance`). Upstream Yahoo Finance endpoints returned `HTTP Error 403: Request not allowed by policy` due to missing bot-detection headers and rate-limiting, causing the search pipeline to fail closed and return 0 results.
3. **Identifier Normalization Mismatch**: Search queries for ISINs (e.g. `INE062A01020`), company aliases ("State Bank of India", "L&T", "Alphabet"), and exchange-prefixed tickers (`RELIANCE.NS`, `500325`) failed token parsing and were discarded by strict substring comparators.

---

## 2. Detailed Technical Audit Findings

### 2.1 The Two Disjoint Registries
| Registry Component | File Location | Populated Instrument Count | Connected to Search Endpoint (`/instruments/search`)? |
| :--- | :--- | :--- | :--- |
| `GlobalInstrumentMasterService` | `apps/api/app/engine/global_instrument_master.py` | 36 instruments | **Yes (Primary)** |
| `UniversalInstrumentMaster` | `apps/api/app/engine/instrument_master.py` | 124 instruments | **No (Bypassed)** |

*Impact:* More than 70% of pre-configured equities (such as US large caps and emerging market tickers in `instrument_master.py`) were unreachable from the main `/instruments/search` endpoint because the route handler only inspected `global_instrument_master`.

### 2.2 Fallback Probe Failure & yfinance 403 Blocking
When `global_instrument_master.search(q)` returned empty, `routes.py` attempted a fallback via:
```python
fallback_items = provider.search_instruments(q)
```
Inside `HybridGlobalProvider.search_instruments(q)`:
- Dispatches `yf.Ticker(clean_upper).info`.
- In sandboxed, CI, and serverless production environments, Yahoo Finance systematically returns:
  `HTTP Error 403: Request to GET /v10/finance/quoteSummary/... on query2.finance.yahoo.com not allowed by policy`.
- The exception was trapped in an empty logger block (`logger.debug`), resulting in an empty fallback list `[]`.
- No secondary or canonical reference fallback was invoked.

### 2.3 Identifier Resolution Gaps
1. **ISIN Queries**: The system expected 12-character alphanumeric ISINs (e.g., `INE002A01018`, `US0378331005`) to be indexed, but the in-memory dictionary only matched ISINs on the 36 static entries. Any valid unindexed ISIN query was passed to `yf.Ticker("INE002A01018")`, which is not a valid Yahoo Finance ticker, returning 0 results.
2. **Exchange Code Stripping**: Queries like `RELIANCE.NS` or `RELIANCE.BO` failed because the search matcher searched for the literal string `RELIANCE.NS` against symbol `RELIANCE`, failing equality checks.
3. **BSE Scrip Codes**: Numeric 6-digit scrip codes (e.g., `500325` for Reliance, `500112` for SBIN) had no resolution mapping to canonical instruments.

---

## 3. Mandatory Remediation Strategy
1. **Consolidate and Expand Global Instrument Master**: Unify `global_instrument_master` and `universal_instrument_master` into a high-capacity, indexed registry covering the NSE 500, BSE 200, S&P 500, Nasdaq 100, and major global blue-chips (1,000+ canonical instruments).
2. **Resilient Multi-Provider Discovery**: Implement a multi-layered provider adapter that never fails closed on upstream HTTP 403s. If an external provider is blocked, synthesize canonical profile data from verified exchange registries.
3. **Universal Identifier Normalizer**: Support ISIN, CUSIP, SEDOL, FIGI, ticker aliases, and exchange suffixes (`.NS`, `.BO`, `.L`, `.DE`).
4. **Weighted Multi-Strategy Search Ranking**: Implement $Score(q,i) = w_1 E + w_2 P + w_3 N + w_4 A + w_5 X + w_6 C$ ranking so exact ticker and ISIN matches always precede fuzzy matches.
