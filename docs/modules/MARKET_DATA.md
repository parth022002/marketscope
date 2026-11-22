# MarketScope.io — Market Data Module

## 1. Overview
The Market Data module provides the core pricing, quote ingestion, bar aggregation, and provenance verification infrastructure for MarketScope.io.

## 2. Ingestion & Fallback Architecture
- **Primary Feeds**: TwelveData, Financial Modeling Prep (FMP), and AlphaVantage via asynchronous HTTP clients (`httpx`).
- **Data Normalization**: Ingested ticks and quotes are mapped into the canonical `MarketQuote` schema:
  - `symbol`: Ticker symbol (e.g. `RELIANCE.NSE`, `TCS.NSE`, `AAPL.NASDAQ`)
  - `price`: Last traded price (LTP)
  - `change`: Absolute price change
  - `change_pct`: Percentage change
  - `open`, `high`, `low`, `close`, `volume`
  - `provenance`: `LIVE`, `DELAYED_15M`, `CALIBRATED_EOD`
  - `timestamp`: UTC ISO timestamp
- **Caching**: 5-second in-memory quote cache and 60-second bar cache to minimize external API quota consumption while maintaining real-time freshness.
