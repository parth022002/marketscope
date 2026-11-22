# MarketScope.io — Interactive Charting Architecture

## 1. Overview & Architectural Philosophy
MarketScope.io delivers an enterprise-grade financial charting experience built natively into each instrument's dedicated stock detail view (`/company/[symbol]`). Designed in accordance with modern quantitative workstation principles, the charting subsystem provides institutional-grade precision, sub-50ms render latency, and smooth 60 FPS viewport manipulation.

Unlike disjointed static graphics or decorative charts with dummy controls, MarketScope's charting architecture enforces complete data authenticity, mathematical rigor, and bidirectional state synchronization across market stats, watchlists, drawing layers, and indicators.

```
+---------------------------------------------------------------------------------------+
|                                    Next.js Web App                                    |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                            Stock Detail Page (/company/[symbol])                |  |
|  |                                                                                 |  |
|  |  +---------------------------------------------------------------------------+  |  |
|  |  | Top Control Toolbar (ChartToolbar)                                        |  |  |
|  |  | Timeframes [1m..1Y] | Types [Candles, Bars..] | Indicators Modal Trigger  |  |  |
|  |  +---------------------------------------------------------------------------+  |  |
|  |  | Left Tools     | Central Canvas Workspace (Lightweight Charts v5)  | Right   |  |
|  |  | (ChartDrawing- | +-----------------------------------------------+ | Sidebar |  |
|  |  |  Toolbar)      | | Primary Series (Candlestick / OHLC / Line)    | | (Stats, |  |
|  |  | Trendlines,    | | Indicator Overlays (SMA, EMA, BB, Supertrend) | | Alerts, |  |
|  |  | Rays, Levels,  | | Volume Histogram Bar Series                   | | Watch-  |  |
|  |  | Retracements,  | +-----------------------------------------------+ |  list)  |  |
|  |  | Rulers, Text   | | SVG Drawing Overlay (ChartDrawingOverlay)     | |         |  |
|  |  |                | +-----------------------------------------------+ |         |  |
|  |  |                | Bottom Timeframe Navigator [1D, 5D, 1M, 1Y, ALL]| |         |  |
|  |  +----------------+-------------------------------------------------+---------+  |  |
|  |                                                                                 |  |
|  |  +---------------------------------------------------------------------------+  |  |
|  |  | Research Tabs Suite (Overview, Technicals, Statements, Valuation, News)   |  |  |
|  |  +---------------------------------------------------------------------------+  |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------+
                                           | HTTP / JSON
                                           v
+---------------------------------------------------------------------------------------+
|                                  FastAPI Backend Engine                               |
|  - GET /api/v1/instruments/{symbol}/chart (Aggregated Multi-Timeframe OHLCV)         |
|  - GET /api/v1/instruments/{symbol}/indicators (Headless Mathematical Indicators)     |
|  - GET/POST/DELETE /api/v1/chart/drawings (Coordinate Persistence)                    |
|  - GET/POST/DELETE /api/v1/alerts (Target Price Alerts)                               |
+---------------------------------------------------------------------------------------+
```

---

## 2. Component Hierarchy
1. **`StockChart.tsx`**: Master coordinator managing state, canvas initialization, series lifecycle, resize observation, crosshair tracking, and layout coordination.
2. **`ChartToolbar.tsx`**: Header bar offering timeframe selection, series rendering modes, active indicators launcher, zoom reset, image export, and fullscreen toggle.
3. **`ChartDrawingToolbar.tsx`**: Vertical dock featuring 9 vector annotation tools, magnet snapping toggle, lock mode, and drawing cleanup actions.
4. **`ChartDrawingOverlay.tsx`**: Hardware-accelerated SVG layer positioned above the canvas providing interactive pointer handling, geometric previews, and touch/click editing.
5. **`ChartIndicatorsModal.tsx`**: Parameter configuration dialog supporting category filtering and real-time adjustment for 10 calibrated mathematical indicators.
6. **`ChartRightSidebar.tsx`**: Multi-tab dock displaying live watchlists, TradingView-styled instrument metrics with 30-day volume comparisons, and price alert managers.

---

## 3. High-Performance Canvas Rendering
MarketScope utilizes TradingView's open-source `lightweight-charts` v5.3.0 engine. Built on pure HTML5 Canvas:
- Avoids DOM overhead by rendering thousands of bars and volume ticks in a single canvas context.
- Maintains a steady 60 frames per second during panning, scaling, and pinch-to-zoom.
- Decouples chart canvas rendering from React's virtual DOM reconciliation loop.

---

## 4. State & Persistence Topology
- **Drawings**: Stored with normalized price/time coordinates and local pixel cache, synced to the backend SQLite/PostgreSQL store and cached in browser `localStorage`.
- **Active Indicators**: Maintained via clean unidirectional state, recomputing overlays on-the-fly without requiring network roundtrips.
- **Price Alerts**: Persistent across user sessions, linked to real-time threshold monitoring.
