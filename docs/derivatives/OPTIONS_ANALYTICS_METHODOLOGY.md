# MarketScope.io — Options Analytics & Derivatives Methodology
## Black-Scholes PDE, Options Greeks, Put-Call Ratio (PCR) & Max Pain

---

## 1. Black-Scholes European Option Pricing & Greeks

For an option with spot price $S$, strike $K$, risk-free rate $r$, time to expiry $T$ (in years), and implied volatility $\sigma$:
$$d_1 = \frac{\ln(S / K) + (r + \frac{1}{2} \sigma^2) T}{\sigma \sqrt{T}}, \quad d_2 = d_1 - \sigma \sqrt{T}$$

### 1.1 Greeks Formulations:
- **Delta ($\Delta$)**:
  $$\Delta_{\text{call}} = N(d_1), \quad \Delta_{\text{put}} = N(d_1) - 1$$
- **Gamma ($\Gamma$)**:
  $$\Gamma = \frac{N'(d_1)}{S \sigma \sqrt{T}}$$
- **Vega ($\nu$)**:
  $$\nu = \frac{S \sqrt{T} N'(d_1)}{100} \quad (\text{per 1\% change in } \sigma)$$
- **Theta ($\Theta$)**:
  $$\Theta_{\text{call}} = \frac{1}{365} \left[ -\frac{S N'(d_1) \sigma}{2 \sqrt{T}} - r K e^{-r T} N(d_2) \right]$$
  $$\Theta_{\text{put}} = \frac{1}{365} \left[ -\frac{S N'(d_1) \sigma}{2 \sqrt{T}} + r K e^{-r T} N(-d_2) \right]$$

---

## 2. Put-Call Ratio (PCR)
$$\text{PCR} = \frac{\sum \text{Put Open Interest}}{\sum \text{Call Open Interest}}$$
- $\text{PCR} > 1.2$: Bullish accumulation / institutional put writing (strong support).
- $\text{PCR} < 0.8$: Bearish bias / heavy call writing (strong resistance).

---

## 3. Max Pain Algorithm
The Max Pain strike is the underlying expiry price at which option sellers (writers) experience the minimum cumulative financial payout:
$$\text{Total Loss}(K_j) = \sum_{K_i < K_j} (K_j - K_i) \cdot \text{OI}_{\text{call}}(K_i) + \sum_{K_i > K_j} (K_i - K_j) \cdot \text{OI}_{\text{put}}(K_i)$$
The strike $K_j$ that minimizes $\text{Total Loss}(K_j)$ is designated as the Max Pain Strike.

---

## 4. Futures Build-Up Quadrant Analysis
Based on simultaneous price and open interest delta:
1. **Long Build-Up**: $\Delta P > 0$, $\Delta \text{OI} > 0$ (Aggressive fresh long positions).
2. **Short Build-Up**: $\Delta P < 0$, $\Delta \text{OI} > 0$ (Aggressive fresh short positions).
3. **Short Covering**: $\Delta P > 0$, $\Delta \text{OI} < 0$ (Shorts exiting positions).
4. **Long Unwinding**: $\Delta P < 0$, $\Delta \text{OI} < 0$ (Longs liquidating positions).
