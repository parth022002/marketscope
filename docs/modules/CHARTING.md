# MarketScope.io — Charting Module

## 1. Overview
The Charting module provides professional TradingView-grade interactive charting powered by **Lightweight Charts v5.3.0**, integrated into both dedicated stock pages (`/stock/[symbol]`) and the full-screen multi-chart terminal (`/charts`).

## 2. Capabilities
- **Chart Styles**: Candlestick, Bar, Line, Area, and Volume histogram.
- **Timeframes**: 1-minute, 5-minute, 15-minute, 1-hour, 1-day, 1-week, and 1-month resolutions.
- **Multi-Chart Grid Layouts**:
  - `single`: 1 primary full-width chart.
  - `split_2h`: 2 charts split horizontally (top / bottom).
  - `split_2v`: 2 charts split vertically (left / right).
  - `grid_4`: 4 charts in a 2x2 grid.
- **Drawing Tools**: Trend Line, Horizontal Ray, Fibonacci Retracement, Rectangle, Price Range, and Text Notes with coordinate persistence.
- **Multi-Chart Persistence**: Full layout state saved to backend (`/api/v1/chart/layouts`) and local storage.
