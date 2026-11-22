# MarketScope.io — Test Cases Register

| Test ID | Test Category | Target Component | Description | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **TC-001** | Technical Math | `technical_indicators.py` | Calculate SMA, EMA, WMA, HMA over 20-bar series | Exact mathematical values matching manual computation. |
| **TC-002** | Technical Math | `technical_indicators.py` | Compute RSI Wilder smoothing over standard series | Values strictly bounded between [0, 100]. |
| **TC-003** | Technical Math | `technical_indicators.py` | Compute Bollinger Bands & Supertrend | Upper band > Middle > Lower band; ATR multiplier correct. |
| **TC-004** | Chart Engine | `canonical_chart.py` | Generate OHLCV bars across 1D/1W timeframes | Valid monotonic timestamp order; High >= Low; Volume >= 0. |
| **TC-005** | Chart Layout | `chart_routes.py` | Save, retrieve, and delete multi-chart layouts | Persists slots, indicators, and layout mode cleanly. |
| **TC-006** | Screener | `screener_engine.py` | Filter by P/E, P/B, Dividend Yield, RSI | Returns only instruments satisfying all active filter bounds. |
| **TC-007** | Screener | `screener_engine.py` | Execute prebuilt thematic screens (Compounders, etc.) | Correctly queries universe and returns matching candidates. |
| **TC-008** | Derivatives | `derivatives_engine.py` | Compute Black-Scholes Delta, Gamma, Theta, Vega | Put-Call parity holds; Delta Call in [0, 1], Put in [-1, 0]. |
| **TC-009** | Derivatives | `derivatives_engine.py` | Calculate PCR and Max Pain strike | Max pain strike identifies minimum total option loss. |
| **TC-010** | Derivatives | `derivatives_engine.py` | Classify futures build-up across 4 quadrants | Price/OI changes mapped to correct quadrant. |
| **TC-011** | Market Flow | `market_flow_engine.py` | Calculate Advance/Decline ratio & Mansfield RS | Breadth counts sum to universe size; RS correctly computed. |
| **TC-012** | Backtesting | `backtest_engine.py` | Simulate SMA Crossover with slippage & fees | Generates valid trades, CAGR, Sharpe, Sortino, and MDD. |
| **TC-013** | Backtesting | `backtest_engine.py` | Enforce zero-lookahead bias (Bar t signal -> Bar t+1 fill)| Signal at close does not execute on historical close. |
| **TC-014** | Paper Trading | `paper_trading_engine.py` | Execute Market Buy order with virtual cash | Deducts cash with spread; adds position to portfolio. |
| **TC-015** | Paper Trading | `paper_trading_engine.py` | Mark-to-market revaluation on price change | Unrealized P&L updates; Total equity reflects current prices. |
| **TC-016** | Paper Trading | `paper_trading_engine.py` | Reset account functionality | Restores balance to ₹10,00,000; clears open positions. |
| **TC-017** | Production | `main.py` | Probe `/health` endpoint | Returns 200 OK with `status: "ok"`. |
