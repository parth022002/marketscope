# MarketScope.io — Architecture Decisions Register (ADRs)

## ADR-001: Modular Monolith vs Microservices
- **Status**: Accepted
- **Context**: MarketScope.io requires rapid feature evolution, synchronized data contracts, and ultra-low latency inter-engine communication.
- **Decision**: Adopt a Modular Monolith architecture within a single FastAPI repository.
- **Consequences**: Zero network hop serialization overhead between engines; unified database connection pooling; straightforward atomic deployments to Render.

## ADR-002: TradingView Lightweight Charts v5 Selection
- **Status**: Accepted
- **Context**: Financial charting requires 60 FPS rendering, pan/zoom performance, customizable series (candlestick, volume, indicators), and minimal bundle footprint.
- **Decision**: Implement TradingView Lightweight Charts v5.3.0.
- **Consequences**: Superior Canvas-based rendering performance compared to D3 or SVG; small client bundle (<50KB); full support for custom indicator series and drawing overlays.

## ADR-003: Pure Domain Engines with Zero Web Coupling
- **Status**: Accepted
- **Context**: Financial calculations (Greeks, indicators, backtesting) must be verifiable independently of HTTP request lifecycles.
- **Decision**: Build calculation engines as pure Python modules accepting domain objects and returning typed models.
- **Consequences**: High test coverage via `pytest` without mocking HTTP layers; deterministic execution and reproducible audit logs.

## ADR-004: Explicit Data Provenance Tagging
- **Status**: Accepted
- **Context**: Financial applications frequently suffer from untracked delays, synthetic estimates, or ambiguous mock data.
- **Decision**: Mandate an explicit `provenance` enum (`LIVE`, `DELAYED_15M`, `CALIBRATED_EOD`, `VERIFIED_OFFICIAL`) on every quote, bar, and financial metric.
- **Consequences**: Complete regulatory compliance, zero fabricated data, and complete user trust.
