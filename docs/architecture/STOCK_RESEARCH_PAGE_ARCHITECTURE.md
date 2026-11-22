# MarketScope.io — Stock Research Workstation Architecture

## 1. Executive Summary

The Stock Research Workstation (`/stocks/[instrumentId]`) is MarketScope.io's primary analytical canvas for fundamental, quantitative, and technical analysis. It aggregates 12 distinct financial intelligence modules into a coherent, responsive workstation that opens immediately from any universal search result.

---

## 2. The 12 Comprehensive Research Modules

```
┌────────────────────────────────────────────────────────────────────────┐
│                      STOCK RESEARCH WORKSTATION                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Header & Identity: Symbol, Sector, Country, ISIN, BSE, Coverage Pill│
│ 2. Live Quote & Stats: Price, Day Range, 52W Range, Vol, Market Cap    │
│ 3. Advanced Chart: TradingView Lightweight Charts (Candles, SMA, EMA)  │
├────────────────────────────────────────────────────────────────────────┤
│ TABS:                                                                  │
│ 4. Overview & 5-Pillar Scorecard (Valuation, Profit, Solvency, Risk)   │
│ 5. Financial Statements: Income Statement, Balance Sheet, Cash Flow    │
│ 6. Valuation & DCF: Intrinsic Value, WACC, Terminal Growth, Multiples  │
│ 7. Technical Indicators: RSI 14, MACD, 50/200 DMA, Support/Resistance │
│ 8. Downside Risk: 1-Day 95% VaR, Beta, Max Drawdown %, Volatility      │
│ 9. Q-Intelligence: 9-Vector Quant Model Score & Breakdown              │
│ 10. Peer Comparison: Sector Benchmarking Table                         │
│ 11. News & Corporate Calendar: Verified News Feeds & Upcoming Dates    │
│ 12. AI Research Assistant: Synthesized RAG Dossier & Thesis Generator  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Ingestion & State Management

1. **Master Research Bundle Hook**:
   - The workstation triggers a single consolidated fetch:
     `getMasterResearchBundle(instrumentId)` $\rightarrow$ `GET /api/v1/instruments/{instrument_id}/research`.
   - Consolidates quote, financial statements, valuation parameters, technicals, downside risk, Q-Intelligence, news, and calendar events in one round trip, reducing initial load latency to <150ms.
2. **Lightweight Charts Hydration**:
   - Interactive charting is powered by `lightweight-charts`, rendering candlestick, line, area, and baseline views with indicators (SMA, EMA, VWAP, Bollinger Bands, Supertrend).
3. **Modals & Drawers**:
   - `AddToWatchlistModal`: Saves security to custom workspaces.
   - `SnapshotModal`: Generates SHA-256 verified cryptographically reproducible research snapshots.
   - `AISynthesisPanel`: Streams grounded research dossiers with cited Ind AS / GAAP evidence.

---

## 4. Error Boundary & Zero-State Handling

- If an unknown ticker is requested, the workstation displays an informative recovery screen featuring:
  1. Clear explanation of why the instrument could not be located.
  2. One-click button returning to the full Stock Directory (`/stocks`).
  3. Search bar with instant autocomplete to resolve typo errors.
