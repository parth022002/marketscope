# MarketScope.io — Chart Components Breakdown

## 1. Overview
The MarketScope charting user interface is modular, strictly typed, and cleanly decomposed into specialized subcomponents under `apps/web/src/components/chart/`.

---

## 2. Component Specifications

### 2.1 `StockChart.tsx`
- **Path**: `apps/web/src/components/chart/StockChart.tsx`
- **Role**: Root charting controller.
- **State Managed**:
  - `bars`: Canonical OHLCV bar collection.
  - `timeframe`: Active aggregation (`1m` to `1Y`).
  - `chartType`: Series render mode (`CANDLESTICK`, `HOLLOW_CANDLES`, `BAR`, `LINE`, `AREA`, `BASELINE`, `HEIKIN_ASHI`).
  - `indicatorsState`: Active indicator configurations (periods, multipliers, colors).
  - `activeDrawingTool`: Selected tool (`cursor`, `trendline`, `horizontal`, `ray`, `rectangle`, `fibonacci`, `measure_price`, `measure_time`, `text`).
  - `drawings`: Collection of persisted user vector drawings.
  - `isFullscreen`: Fullscreen display flag.
  - `hoveredBar`: Currently tracked bar under the crosshair.
- **Methods**:
  - `handleExportScreenshot()`: Captures canvas data directly to downloadable high-res PNG.
  - `handleResetChart()`: Restores optimal time scale view.
  - `coordinateToPrice()` / `coordinateToTime()`: Exposes coordinate transforms to the drawing overlay.

### 2.2 `ChartToolbar.tsx`
- **Path**: `apps/web/src/components/chart/ChartToolbar.tsx`
- **Controls**:
  - Timeframe Switcher: Instant buttons for `1m`, `5m`, `15m`, `30m`, `1H`, `4H`, `1D`, `1W`, `1M`, `1Y`.
  - Chart Type Dropdown: Selects between 7 distinct rendering visualizations.
  - Indicators Trigger: Displays badge showing count of active indicators.
  - Reset, Screenshot, Fullscreen triggers.

### 2.3 `ChartDrawingToolbar.tsx`
- **Path**: `apps/web/src/components/chart/ChartDrawingToolbar.tsx`
- **Tools**:
  - `cursor`: Crosshair selector.
  - `trendline`: 2-point angled line with end handles.
  - `horizontal`: Full-width price level with numeric label.
  - `ray`: 1-point horizontal right ray.
  - `rectangle`: 2-corner boundary box for supply/demand zones.
  - `fibonacci`: 7-level retracement grid (0%, 23.6%, 38.2%, 50%, 61.8%, 78.6%, 100%).
  - `measure_price`: Vertical price delta and percent calculator.
  - `measure_time`: Horizontal bar counter and duration measurer.
  - `text`: Chart annotation callouts.
  - Auxiliary controls: Magnet Snap, Lock Drawings, and Clear All.

### 2.4 `ChartDrawingOverlay.tsx`
- **Path**: `apps/web/src/components/chart/ChartDrawingOverlay.tsx`
- **Implementation**: Hardware-accelerated SVG element covering 100% of the canvas area.
- **Interactivity**: Captures pointer events during drawing mode while passing through mouse events during crosshair navigation mode.
- **Deletion**: Supports selecting individual drawings and hitting Delete/Backspace or clicking the floating delete badge.

### 2.5 `ChartIndicatorsModal.tsx`
- **Path**: `apps/web/src/components/chart/ChartIndicatorsModal.tsx`
- **Organization**: Filterable by categories: `All`, `Trend`, `Momentum`, `Volatility`, `Volume`.
- **Parameter Inputs**: Configurable lengths, standard deviations, and multipliers for all 10 indicators.

### 2.6 `ChartRightSidebar.tsx`
- **Path**: `apps/web/src/components/chart/ChartRightSidebar.tsx`
- **Tabs**:
  - **Overview**: Symbol summary, asset class, live/delayed tag, big price display, 30-day volume vs current volume progress bar, day range slider, 52-week range slider, key valuation ratios.
  - **Watchlist**: Searchable watchlist with instant switch on click.
  - **Alerts**: Price threshold alert creation and active alert list.
