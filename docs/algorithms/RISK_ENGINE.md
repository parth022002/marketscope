# Quantitative Risk Engine Specification
**Platform:** MarketScope.io  

## 1. Value at Risk (VaR) & CVaR
- **Parametric VaR**: $\text{VaR}_{\alpha} = Z_{\alpha} \cdot \sigma \cdot \sqrt{t}$
- **Historical VaR**: Calculated directly from empirical historical quantile returns.
- **Conditional VaR (CVaR / Expected Shortfall)**: $\mathbb{E}[R \mid R \le -\text{VaR}_{\alpha}]$

## 2. Volatility & Performance Metrics
- **RiskMetrics EWMA Volatility**: $\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1 - \lambda) r_{t-1}^2$, $\lambda = 0.94$
- **Sharpe Ratio**: $\frac{\mathbb{E}[R_p - R_f]}{\sigma_p}$
- **Sortino Ratio**: $\frac{\mathbb{E}[R_p - R_f]}{\text{Downside Deviation}}$
- **Calmar Ratio**: $\frac{\text{CAGR}}{\text{Max Drawdown}}$
- **Beta**: $\frac{\text{Cov}(R_i, R_m)}{\text{Var}(R_m)}$
