# MarketScope.io — Quantitative Backtesting Methodology
## Zero-Lookahead Simulation, Friction Modeling & Risk Metrics

---

## 1. Simulation Mechanics & Anti-Lookahead Guarantee

The Backtesting Engine (`apps/api/app/engine/backtest_engine.py`) enforces strict causal mechanics:
1. **Signal Generation on Bar $i$**: Evaluated strictly using closed bar data $C_0 \dots C_i$.
2. **Execution on Bar $i+1$**: Order is executed at the Open price of bar $i+1$ plus slippage:
   - Buy Execution Price: $P_{\text{exec}} = O_{i+1} \times (1 + \text{Slippage})$
   - Sell Execution Price: $P_{\text{exec}} = O_{i+1} \times (1 - \text{Slippage})$
3. **Friction Costs**: Commission and regulatory exchange turnover fees (default 0.03% to 0.08%) deducted from capital on both entry and exit.

---

## 2. Statistical Risk & Performance Metrics

### 2.1 Compound Annual Growth Rate (CAGR)
$$\text{CAGR} = \left(\frac{\text{Ending Capital}}{\text{Initial Capital}}\right)^{\frac{1}{\text{Years}}} - 1$$

### 2.2 Annualized Sharpe Ratio
With daily returns $r_t$ and risk-free benchmark $r_f$ (6.5% annual):
$$\text{Sharpe} = \frac{\bar{r} - r_{f,\text{daily}}}{\sigma_r} \times \sqrt{252}$$

### 2.3 Annualized Sortino Ratio
Measures return per unit of downside risk:
$$\sigma_d = \sqrt{\frac{1}{T} \sum_{t=1}^T \min(0, r_t - r_{f,\text{daily}})^2}$$
$$\text{Sortino} = \frac{\bar{r} - r_{f,\text{daily}}}{\sigma_d} \times \sqrt{252}$$

### 2.4 Maximum Drawdown (MDD)
$$\text{MDD} = \max_{t \in [0, T]} \left( \frac{\text{Peak}_t - \text{Equity}_t}{\text{Peak}_t} \right) \times 100\%$$
