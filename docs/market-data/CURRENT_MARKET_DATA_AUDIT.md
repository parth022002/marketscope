# MarketScope.io — Existing Market Data Infrastructure Audit

**Document Version:** 1.0.0  
**Classification:** Institutional Financial Data Audit  
**Author:** Market Data Systems Architecture & Quantitative Engineering  
**Scope:** Complete Codebase Review (Backend FastAPI, Frontend Next.js, External Providers, Database & Cache)

---

## 1. Executive Summary

An exhaustive audit of the MarketScope.io codebase was conducted to determine why market rates displayed on the website are incorrect, outdated, inconsistent, or not updated to the latest available values.

The audit revealed that **the platform currently operates on a hybrid mixture of hardcoded static Python objects, client-side fallback arrays, and uncoordinated external REST lookups**. While API keys for commercial providers (Financial Modeling Prep and Twelve Data) are present in the environment configuration, they are only queried on ad-hoc company searches and were **never wired into the continuous market ticker, market overview, index snapshots, or mover tables**.

Crucially, **static fixture prices were tagged with misleading `data_status="LIVE"` labels**, creating the visual illusion of real-time trading when in fact no real-time stream was active.

---

## 2. Identified Defect Catalog (15 Core Dimensions)

The following 15 defect categories were specifically investigated and documented across the codebase:

| Defect ID | Defect Category | Existing Code Occurrence | Severity | Root Cause & Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | **Hardcoded Prices** | `apps/api/app/engine/market_intelligence.py`<br>`apps/web/src/components/MarketTicker.tsx` | **CRITICAL** | `CANONICAL_TICKER_ITEMS` in Python and `FALLBACK_TICKERS` in TypeScript contain hardcoded prices (e.g., NIFTY 50 = `24480.20`, SENSEX = `80365.10`, BRENT = `74.65`). These never change regardless of market moves. |
| **DEF-02** | **Synthetic Data Displayed as Live** | `CANONICAL_TICKER_ITEMS`<br>`MarketTicker.tsx` | **CRITICAL** | Static numbers are explicitly assigned `data_status="LIVE"`, violating financial transparency standards and misleading users into believing they represent live ticks. |
| **DEF-03** | **External API Returning Delayed Data** | `apps/api/app/providers/hybrid_provider.py` | **HIGH** | Twelve Data free-tier and standard FMP keys return 15-minute delayed data for NSE and US indices, but the backend did not consistently stamp or convey the delay window to the client. |
| **DEF-04** | **Wrong Exchange Queried** | `apps/api/app/providers/hybrid_provider.py` | **HIGH** | Ticker queries without explicit exchange suffixes defaulted to US exchanges (NASDAQ/NYSE), causing collisions with Indian tickers or indices. |
| **DEF-05** | **Incorrect Instrument Symbols** | `apps/api/app/engine/market_intelligence.py` | **HIGH** | Commodities are keyed as `"GOLD MCX"` and `"BRENT CRUDE"` instead of standardized exchange contracts (`MCX:GOLD`, `ICE:B`). |
| **DEF-06** | **NSE and BSE Symbols Confused** | `apps/api/app/engine/calculations.py` | **MEDIUM** | Reliance and Tata Motors were mapped without distinguishing dual-listing scrip codes between NSE (`RELIANCE`) and BSE (`500325`). |
| **DEF-07** | **Currency Mixing** | `MarketOverviewCard.tsx`<br>`TopCompaniesTable.tsx` | **HIGH** | Global instruments (in USD) and Indian equities (in INR) were presented in unified tables without strict normalization or currency conversion warnings. |
| **DEF-08** | **Incorrect Rounding** | `apps/web/src/components/MarketTicker.tsx` | **MEDIUM** | Yields and FX (USD/INR = `84.42`) were formatted using standard 2-decimal floats rather than financial standard 4-decimal pips for FX and 3-decimal basis points for sovereign yields. |
| **DEF-09** | **Incorrect Percentage Change Calculation** | `apps/api/app/engine/market_intelligence.py` | **CRITICAL** | Percentage change in static fixtures was manually hardcoded (`0.46%`) rather than mathematically calculated against an official Previous Close reference. |
| **DEF-10** | **Over-Cached Market Data** | `apps/web/src/lib/api.ts` | **MEDIUM** | Frontend fetch calls inconsistently alternated between `cache: "no-store"` and Next.js default static page prerendering, causing some pages to show days-old build snapshots. |
| **DEF-11** | **Disconnected / Missing WebSockets** | `apps/api/app/main.py`<br>`apps/web/src/` | **CRITICAL** | There was **zero WebSocket implementation** on the backend. No `/ws` route existed; all updates depended on one-time HTTP REST fetches upon page mount. |
| **DEF-12** | **Silent API Request Failures** | `apps/api/app/providers/hybrid_provider.py` | **HIGH** | `_get_commercial_profile` wrapped network requests in generic `except Exception: pass`, logging only debug statements and silently falling back without alerting downstream consumers. |
| **DEF-13** | **Incorrect Timestamp Interpretation** | `apps/api/app/engine/market_intelligence.py` | **HIGH** | Timestamps were generated via `datetime.now(timezone.utc)` at request time rather than recording the actual exchange execution timestamp (`exchange_timestamp`). |
| **DEF-14** | **Stale Data After Provider Failure** | `apps/web/src/components/MarketTicker.tsx` | **CRITICAL** | If the backend was unreachable, the frontend silently fell back to `FALLBACK_TICKERS` with no error banner or stale data indicator. |
| **DEF-15** | **Frontend Showing Stale Cached Values** | Next.js SSG Pages | **HIGH** | Routes prerendered statically during `next build` embedded build-time market snapshots into static HTML, serving stale prices until the next application redeployment. |

---

## 3. Inventory of Existing Code Artifacts

### 3.1 Backend Providers & Engines
- `apps/api/app/engine/market_intelligence.py`:
  - Contains `CANONICAL_TICKER_ITEMS`: 16 hardcoded objects covering Nifty 50, Sensex, Bank Nifty, Nifty IT, Midcap 100, BSE 500, Nasdaq 100, S&P 500, Dow Jones, Brent Crude, Gold, Silver, USD/INR, EUR/INR, US 10Y, India 10Y G-Sec.
  - Contains `CANONICAL_TOP_COMPANIES`: 16 static company objects with hardcoded prices and market caps.
  - Contains static `MarketBreadth` (34 advances, 16 declines) and static `MarketMood` (`64/100`).
- `apps/api/app/providers/hybrid_provider.py`:
  - Contains `HybridGlobalProvider` with commercial API keys (`FMP_API_KEY`, `TWELVEDATA_API_KEY`).
  - Implements `_get_commercial_profile` for single companies, but has **no batch ticker endpoint, no index support, no commodity feed, and no real-time stream**.
  - Uses `yfinance` as Tier 2, which is unsuited for production low-latency commercial redistribution.
- `apps/api/app/providers/base.py`:
  - Minimal protocol `MarketDataProvider` defining only `search_instruments` and `get_dossier`. Lacks methods for quotes, historical bars, subscriptions, market sessions, and health checks.

### 3.2 Frontend Presentation Layer
- `apps/web/src/components/MarketTicker.tsx`:
  - Defines `FALLBACK_TICKERS` with static values and hardcoded `data_status="LIVE"`.
  - Re-renders ticker twice for CSS marquee with no WebSocket client or periodic polling.
- `apps/web/src/app/page.tsx`:
  - Loads `getMarketOverview()` once on mount. If the user leaves the tab open for 4 hours, prices never update.
- `apps/web/src/lib/api.ts`:
  - Has `getMarketTicker()` and `getMarketOverview()` calling `/api/v1/market/ticker` and `/api/v1/market/overview`, which hit the static python engine.

---

## 4. Root Cause Analysis

1. **Architecture Disconnection**:
   The market intelligence engine created in the redesign phase was built as a presentation demo mock to unblock UI layouts, rather than connecting directly to an ingestion and normalisation pipeline.
2. **Missing Ingestion Service**:
   There is no background daemon or worker polling or streaming quotes from Twelve Data or authorized feeds into Redis. The API simply responds synchronously with in-memory constants.
3. **Absence of Instrument Master**:
   Instrument resolution relied on loose string parsing (`rawSymbol.toUpperCase()`) without a central relational registry linking internal instrument IDs to exchange-specific provider ticker symbols.
4. **Lack of Session Awareness**:
   The system does not check whether NSE (09:15 - 15:30 IST) or NYSE (09:30 - 16:00 EST) is open, closed, in pre-market, or on holiday. It simply returns hardcoded `market_status="OPEN"`.

---

## 5. Required Corrections Plan

1. **Replace Static Constants with Live Multi-Provider Pipeline**:
   Decommission `CANONICAL_TICKER_ITEMS` as live data; relegate it exclusively to development testing fixtures marked as `SYNTHETIC_DEVELOPMENT`.
2. **Build Central Instrument Master Registry**:
   Create a single authoritative catalog linking internal IDs (`in-nse-nifty50`, `in-nse-reliance`, `us-nasdaq-aapl`, `cmd-ice-brent`) to exchange codes, currencies, tick sizes, and provider symbols.
3. **Implement Normalized Market Data Service**:
   Create modular adapters for Twelve Data, Financial Modeling Prep, and licensed exchange feeds implementing a standard `MarketDataProvider` interface.
4. **Deploy In-Memory Redis Quote Cache**:
   Store the latest validated quote per instrument with exact provider timestamp, exchange timestamp, and freshness classification.
5. **Implement Market Calendar & Session Engine**:
   Determine real-time market status (`OPEN`, `CLOSED`, `PRE_OPEN`, `POST_MARKET`, `HOLIDAY`) for Indian (NSE/BSE) and Global (NYSE/NASDAQ/ICE/MCX) venues.
6. **Deploy Native WebSocket Streaming Gateway**:
   Implement `/ws/v1/market-data` on FastAPI with client subscription management and auto-reconnection on the Next.js frontend.
7. **Transparent UI Disclosure**:
   Display clear, prominent provenance badges: `LIVE`, `DELAYED (15M)`, `OFFICIAL EOD`, `MARKET CLOSED`, and `SYNTHETIC DEMO (DEV)`. Never present synthetic or delayed data as live.
