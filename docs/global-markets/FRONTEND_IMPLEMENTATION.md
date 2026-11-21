# Frontend Architecture & Global Markets Hub Experience

## 1. UI/UX Transformation & Aesthetic Framework

MarketScope.io's frontend redesign delivers an institutional financial research experience combining the analytical power of TradingView with the research clarity of Tickertape and VerquoAI:
- **Palette**: Deep institutional navy background (`#071426` / `#0B1528`), slate borders (`#162C4E`), cyan and emerald accents for gains and key indicators, and rose for losses.
- **Dynamic Marquee Ticker**: Calibrated to **110s smooth scroll speed** with automatic freeze on hover (`[animation-play-state:paused]`) for comfortable human reading.
- **Universal Multi-Tab Hub (`/markets`)**:
  - `Overview`: Key global & domestic benchmark cards, technical comparison charts, and sector breadth tree-map.
  - `Indian Equities`: NSE/BSE bluechips with Demat badges.
  - `US & International`: NYSE/NASDAQ/LSE/TSE megacaps with RBI LRS USD 250,000 regulatory badges.
  - `Commodities & Energy`: MCX vs COMEX Gold/Silver, Brent, WTI, Natural Gas, Base Metals.
  - `Currencies & FX`: Official RBI Reference Rates, USD/INR, EUR/INR, GBP/INR, JPY(100)/INR, Dollar Index (DXY).
  - `Bonds & Sovereign Yields`: India vs US 10Y Benchmark sovereign yield curves (3M to 30Y) with spread, Central Bank Policy Rates, and Sovereign Gold Bonds (SGBs).
  - `Mutual Funds & ETFs`: Official AMFI NAVs, AUM, expense ratios, Index ETFs, and Global Feeder Funds.
  - `Derivatives Pulse`: Futures basis, Put/Call Ratio (PCR), Open Interest (OI) & OI change %, India VIX vs CBOE VIX volatility spread.
- **Real-Time Universal Search**: High-speed debounced lookup querying 124+ instruments across 20 asset classes with instant regulatory access badges.
- **Regulatory Access Modal**: Clickable badge component providing comprehensive legal breakdowns of governing frameworks (RBI LRS, FEMA, SEBI, IFSCA), annual quotas, TCS implications, and Schedule FA filing requirements.
