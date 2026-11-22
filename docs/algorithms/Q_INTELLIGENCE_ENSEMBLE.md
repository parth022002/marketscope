# MarketScope Q-Intelligence Multi-Factor Ensemble Specification
**Platform:** MarketScope.io  

## 1. 9-Vector Ensemble Blending Formula
$$\text{Q-Score} = \sum_{k=1}^{8} w_k \cdot S_k + \text{Penalty}_{\text{Anomaly}}$$

Where weights $w_k$:
- Fundamental Quality ($w_1 = 0.22$)
- Growth Sustainability ($w_2 = 0.15$)
- Intrinsic Valuation ($w_3 = 0.15$)
- Technical Momentum ($w_4 = 0.13$)
- Risk & Stability ($w_5 = 0.12$)
- News & Sentiment ($w_6 = 0.08$)
- Regime Alignment ($w_7 = 0.08$)
- Ownership & Liquidity ($w_8 = 0.07$)

## 2. Explicit Separation
- **Composite Score (0–100)**: Relative multi-factor percentile.
- **Confidence Level (0.0–1.0)**: Data availability and reporting completeness.
- **Freshness**: Tagged with provenance (`CALIBRATED_EOD`, `LIVE`).
- **Non-Advisory Mandate**: Zero Buy/Sell/Hold advice or guaranteed return claims.
