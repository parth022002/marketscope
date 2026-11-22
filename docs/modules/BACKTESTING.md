# MarketScope.io — Strategy Backtesting Module

## 1. Overview
The Strategy Backtesting module simulates technical and quantitative trading strategies across historical bar series. The engine (`apps/api/app/engine/backtest_engine.py`) enforces strict zero-lookahead bias.

## 2. Realistic Market Simulation Rules
- **Slippage Modeling**: 0.05% slippage applied to each trade execution price to reflect real-world order book depth.
- **Turnover & Brokerage Fees**: 0.03% transaction fee applied on total buy and sell turnover (reflecting STT, exchange turnover fees, and brokerage).
- **Causal Execution**: Signals generated at Bar \(t\) close are filled at Bar \(t+1\) open.

## 3. Evaluated Performance Metrics
- **CAGR**: Compound Annual Growth Rate of portfolio equity.
- **Sharpe Ratio**: Excess return per unit of total risk (risk-free rate = 6.5%).
- **Sortino Ratio**: Excess return penalized solely by downside deviation.
- **Maximum Drawdown (MDD)**: Peak-to-trough decline across the simulation window.
- **Win Rate & Profit Factor**: Ratio of winning trades to total trades, and gross profit over gross loss.
