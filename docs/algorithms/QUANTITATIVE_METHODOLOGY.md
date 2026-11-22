# Quantitative Methodology Specification
**Platform:** MarketScope.io  

## 1. Mathematical Philosophy & Principles
MarketScope.io rejects the uncalibrated presentation of statistical factor scores as guaranteed probabilities.
1. **Mathematical Determinism**: Financial ratios, technical indicators, and option Greeks are evaluated directly using NumPy and audited financial equations.
2. **Separation of Concepts**:
   - **Score**: Model-derived normalized percentile (0–100).
   - **Confidence**: Statistical coverage and input completeness (0.0–1.0).
   - **Freshness**: Data age state (`LIVE`, `DELAYED`, `END_OF_DAY`, `HISTORICAL`).
   - **Coverage**: Proportion of required financial statement items available (0–100%).
3. **Zero Lookahead**: Backtests and regime detection models use only causal information available at the historical point in time.
