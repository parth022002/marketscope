# Market Regime Detection Specification
**Platform:** MarketScope.io  

## 1. Multi-Vector Regime Model
Evaluates 5 dimensions causally with zero future lookahead:
1. **Volatility Regime**: Low ($< 14$ VIX), Normal (14–20), Elevated (20–28), Extreme ($> 28$).
2. **Trend Regime**: Strong Bull ($P > \text{SMA}_{20} > \text{SMA}_{50}$), Moderate Bull, Neutral, Moderate Bear, Strong Bear.
3. **Breadth Regime**: Expanding ($\text{A/D} > 1.5$), Neutral, Contracting ($\text{A/D} < 0.7$).
4. **Liquidity Regime**: High vs. Constrained based on realized volatility and spreads.
5. **Risk Appetite**: Risk-On vs. Risk-Neutral vs. Risk-Off.
