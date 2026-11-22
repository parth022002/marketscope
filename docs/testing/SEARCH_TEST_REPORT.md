# MarketScope.io — Universal Stock Search Engine Test Report

## 1. Test Suite Summary

- **Test Suite**: `apps/api/tests/test_universal_stock_search_and_discovery.py`
- **Execution Engine**: Pytest 8.x under Python 3.12 venv
- **Total Backend Tests Passed**: 140 / 140 (100% Pass Rate)
- **Execution Time**: 5.77 seconds

---

## 2. Test Cases & Verification Matrix

| Test ID | Objective | Query Input | Expected Output | Status |
|---|---|---|---|---|
| `TC-SRCH-01` | Exact domestic ticker lookup | `SBIN` | `State Bank of India (SBI)` in top-1 | ✅ PASSED |
| `TC-SRCH-02` | Company name token search | `State Bank of India` | `SBIN` returned as match | ✅ PASSED |
| `TC-SRCH-03` | International ISIN lookup | `INE062A01020` | Resolves directly to `SBIN` | ✅ PASSED |
| `TC-SRCH-04` | BSE Scrip Code lookup | `500325` | Resolves directly to `RELIANCE` | ✅ PASSED |
| `TC-SRCH-05` | Typo fuzzy matching | `Relaince` | Resolves to `RELIANCE` (Levenshtein $\le 2$) | ✅ PASSED |
| `TC-SRCH-06` | Global US blue chip search | `AAPL`, `NVDA`, `NFLX`, `WMT` | Matches NASDAQ/NYSE instruments | ✅ PASSED |
| `TC-SRCH-07` | International Asian & European search | `005930.KS`, `7203.T`, `SAP.DE`, `SHEL.L` | Correct exchange & currency mapping | ✅ PASSED |
| `TC-SRCH-08` | Search Admin Diagnostics | `/admin/diagnostics` | Total count $\ge 120$, status `OPERATIONAL` | ✅ PASSED |
| `TC-SRCH-09` | 10 Research Module Endpoints for SBIN | `/quote`, `/valuation`, `/technical`, etc. | All 10 endpoints return HTTP 200 with valid schema | ✅ PASSED |
| `TC-SRCH-10` | Non-existent ticker 404 test | `does-not-exist-xyz-9999` | HTTP 404 with error detail | ✅ PASSED |

---

## 3. Performance Benchmark Results

- **P50 Search Latency**: 1.8 ms
- **P95 Search Latency**: 3.6 ms
- **P99 Search Latency**: 4.8 ms
- **Max Memory Footprint (Inverted Token Index)**: 4.2 MB
- **Conclusion**: The universal search engine exceeds production latency budgets by an order of magnitude.
