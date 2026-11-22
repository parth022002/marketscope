# Derivatives & Options Analytics Engine Specification
**Platform:** MarketScope.io  

## 1. Black-Scholes-Merton Options Pricing & Greeks
$$d_1 = \frac{\ln(S/K) + (r - q + \frac{\sigma^2}{2})T}{\sigma \sqrt{T}}, \quad d_2 = d_1 - \sigma \sqrt{T}$$

- **Delta ($\Delta$)**: Call: $e^{-qT} N(d_1)$; Put: $-e^{-qT} N(-d_1)$
- **Gamma ($\Gamma$)**: $\frac{e^{-qT} N'(d_1)}{S \sigma \sqrt{T}}$
- **Vega ($\nu$)**: $S e^{-qT} N'(d_1) \sqrt{T}$
- **Theta ($\Theta$)**: Daily time decay derivative.

## 2. Sentiment Metrics
- **Put-Call Ratio (PCR)**: $\frac{\sum \text{Put Open Interest}}{\sum \text{Call Open Interest}}$
- **Max Pain Strike**: $\arg\min_K \sum_i (\text{Payout to option buyers at expiration price } K)$
- **Futures Build-up**: Long Build-up (Price $\uparrow$, OI $\uparrow$), Short Build-up (Price $\downarrow$, OI $\uparrow$), Short Covering (Price $\uparrow$, OI $\downarrow$), Long Unwinding (Price $\downarrow$, OI $\downarrow$).
