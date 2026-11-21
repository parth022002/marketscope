# MarketScope.io — Price Calculation & Precision Rules

## 1. Mathematical Standards

In accordance with institutional financial systems, all price calculation operations are performed using Python's `Decimal` module with `ROUND_HALF_UP` rounding. Floating-point arithmetic (`float`) is strictly prohibited during calculation steps.

---

## 2. Core Formulas

### 2.1 Absolute Price Change
$$\Delta P = P_{\text{current}} - P_{\text{previous\_close}}$$

### 2.2 Percentage Price Change
$$\Delta P\% = \begin{cases} 
\left( \frac{P_{\text{current}} - P_{\text{previous\_close}}}{P_{\text{previous\_close}}} \right) \times 100, & \text{if } P_{\text{previous\_close}} > 0 \\
0.00, & \text{if } P_{\text{previous\_close}} \le 0 
\end{cases}$$

### 2.3 Basis Points (Yields & Fixed Income)
$$\text{Change in bps} = (Y_{\text{current}} - Y_{\text{previous\_close}}) \times 100$$
*Example*: A yield moving from $4.450\%$ to $4.420\%$ represents a change of $-0.030\%$ or $-3.0\text{ bps}$.

---

## 3. Precision Standards by Asset Class

| Asset Class | Standard Decimal Places | Rounding Mode | Example Quote |
| :--- | :---: | :---: | :--- |
| **Equities (INR / USD)** | 2 | `ROUND_HALF_UP` | ₹1,265.40 / \$228.50 |
| **Indices (Points)** | 2 | `ROUND_HALF_UP` | 24,180.80 pts |
| **Commodities (Crude, Gold)**| 2 | `ROUND_HALF_UP` | \$74.20 / ₹76,450.00 |
| **Natural Gas & Metals** | 3 - 4 | `ROUND_HALF_UP` | \$3.150 / \$4.1800 |
| **Foreign Exchange (FX)** | 4 | `ROUND_HALF_UP` | 84.4200 / 1.0560 |
| **Bond Yields** | 3 | `ROUND_HALF_UP` | 4.420% |
| **Cryptocurrency (Major)** | 2 | `ROUND_HALF_UP` | \$96,420.50 |

---

## 4. Anomaly Detection & Circuit Breaker Logic

MarketScope.io executes automated anomaly filters prior to publishing any price update:

1. **Price Jump Guard**:
   $$\left| \frac{P_{\text{current}} - P_{\text{previous\_close}}}{P_{\text{previous\_close}}} \right| > 0.35 \quad (35\%)$$
   If triggered without an authenticated corporate action flag (e.g. stock split or bonus issue), the tick is flagged as `SUSPECT_JUMP`, held from ticker streaming, and logged to the administrative review ledger.

2. **OHLC Integrity Assertion**:
   $$P_{\text{low}} \le P_{\text{open}} \le P_{\text{high}} \quad \text{and} \quad P_{\text{low}} \le P_{\text{close}} \le P_{\text{high}}$$
   Ticks violating this inequality are flagged as `DATA_CORRUPTION` and rejected from candle construction.

3. **Previous Close Non-Zero Guarantee**:
   If $P_{\text{previous\_close}} \le 0$, percentage calculation returns `0.00%` rather than raising a runtime `ZeroDivisionError`.
