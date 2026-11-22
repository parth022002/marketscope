# MarketScope.io — Chart Workspace Technical Specification

## 1. Overview
The charting workspace (`/charts`) is powered by **TradingView Lightweight Charts (v5.3.0)**, delivering high-performance financial charts capable of rendering thousands of candlesticks with smooth 60fps pan and zoom.

---

## 2. Technical Capabilities

- **Chart Series Types**: Candlestick, OHLC/Bar, Line, Area, Baseline, Volume Histogram.
- **Timeframes**: 1m, 3m, 5m, 10m, 15m, 30m, 45m, 1H, 2H, 4H, Daily (1D), Weekly (1W), Monthly (1M), 1 Year (1Y), ALL.
- **18 Technical Indicators**:
  - Trend: SMA, EMA, WMA, HMA, VWAP, Supertrend, Ichimoku, ADX.
  - Momentum: RSI, MACD, Stochastic, StochRSI, CCI, Williams %R, ROC.
  - Volatility: Bollinger Bands, ATR, Keltner Channels.
  - Volume: OBV, Chaikin Money Flow (CMF).
- **Vector Drawing Tools**: Trendline, Horizontal Line, Vertical Line, Ray, Extended Line, Parallel Channel, Rectangle, Text Annotation, Fibonacci Retracement, Long/Short Position Measurement.
- **Multi-Chart Split Layouts**: Single, 2 Horizontal (`split_2h`), 2 Vertical (`split_2v`), 4 Grid (`grid_4`).
