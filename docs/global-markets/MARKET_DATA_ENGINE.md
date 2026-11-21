# Universal Market Data Engine Implementation

## 1. Engine Core Overview

The Market Data Engine (`apps/api/app/engine/market_data_service.py`) coordinates multi-provider ingestion, validation, and delivery:
1. **Parallel Quote Resolution**: Concurrent asyncio task dispatching across registered providers with strict timeout boundaries (1500ms max timeout).
2. **Dynamic Ingestion Routing**: Domestic Indian instruments route through `LiveExchangeProvider`, international equities query Twelve Data and FMP, and sovereign yields query statutory open portals.
3. **Micro-Caching Architecture**: In-memory LRU cache with TTL calibrated to asset volatility:
   - High-frequency equities & futures: 5 seconds TTL.
   - Commodity & FX spot rates: 10 seconds TTL.
   - Sovereign yield curves & policy rates: 300 seconds TTL.
   - AMFI NAVs: 3600 seconds TTL.
4. **WebSocket Streaming Gateway**: `/ws/market-data` broadcasting real-time tick updates, price jumps, and volume changes to connected clients with auto-reconnection and client heartbeat.

---

## 2. API Endpoints Reference

| Endpoint | Method | Response Model | Description |
|:---|:---:|:---|:---|
| `/api/v1/market/exchanges` | GET | `list[ExchangeMetadataResponse]` | 31 registered global exchanges, MICs, and session times |
| `/api/v1/market/instruments/universal` | GET | `list[UniversalInstrumentResponse]` | 124+ instruments across 20 asset classes with regulatory rules |
| `/api/v1/market/instruments/universal/{id}`| GET | `UniversalInstrumentResponse` | Detailed instrument metadata and legal conditions |
| `/api/v1/market/universal-search` | GET | `UniversalSearchResponse` | Fuzzy search across symbols, ISINs, and company names |
| `/api/v1/market/derivatives` | GET | `DerivativesOverviewResponse` | Futures basis, open interest, PCR, and India VIX vs CBOE VIX |
| `/api/v1/market/fixed-income` | GET | `FixedIncomeOverviewResponse` | India & US yield curves (3M-30Y), policy rates, and SGBs |
| `/api/v1/market/funds` | GET | `FundsOverviewResponse` | AMFI NAVs, AUM, expense ratios, and feeder fund routes |
| `/api/v1/market/commodities` | GET | `CommoditiesOverviewResponse` | MCX & global commodities across precious, energy, and base |
| `/api/v1/market/currencies` | GET | `CurrenciesOverviewResponse` | Official RBI reference rates, interbank FX, and DXY index |
| `/api/v1/market/admin/providers` | GET | `AdminProvidersResponse` | Ingestion health, licensing tiers, quotas, and latencies |
