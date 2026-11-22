# Intrinsic Valuation Engine Specification
**Platform:** MarketScope.io  

## 1. Discounted Cash Flow (DCF) Formula
$$\text{Enterprise Value} = \sum_{t=1}^{n} \frac{\text{FCF}_t}{(1 + \text{WACC})^t} + \frac{\text{Terminal Value}_n}{(1 + \text{WACC})^n}$$

Where:
$$\text{Terminal Value} = \frac{\text{FCF}_n \cdot (1 + g)}{\text{WACC} - g}$$

## 2. Weighted Average Cost of Capital (WACC)
$$\text{WACC} = \left(\frac{E}{V} \cdot K_e\right) + \left(\frac{D}{V} \cdot K_d \cdot (1 - T)\right)$$

Where:
- $K_e = R_f + \beta \cdot (R_m - R_f)$ (Capital Asset Pricing Model)
- $R_f$: Indian 10Y G-Sec Yield (6.5%) / US 10Y Treasury (4.5%)
- $g$: Terminal perpetual growth rate (typically 4.0%–5.5% for India)
- $T$: Corporate marginal tax rate (typically 25.17% in India)
