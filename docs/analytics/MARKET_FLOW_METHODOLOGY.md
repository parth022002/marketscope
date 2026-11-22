# MarketScope.io — Market Flow & Breadth Analytics Methodology
## Advance/Decline Breadth, Mansfield Relative Strength & Quantitative Setup Radar

---

## 1. Market Breadth Metrics

### 1.1 Advance / Decline Ratio
For an index or market universe consisting of $N$ constituents:
$$\text{A/D Ratio} = \frac{N_{\text{advancing}}}{\max(1, N_{\text{declining}})}$$
- $\text{A/D Ratio} > 1.8$: Strong institutional breadth / broad-based accumulation.
- $0.9 \le \text{A/D Ratio} \le 1.8$: Neutral / mixed market conditions.
- $\text{A/D Ratio} < 0.8$: Market-wide distribution / breadth deterioration.

### 1.2 52-Week High / Low Expansion
Measures net leadership expansion:
$$\text{Net New Highs} = N_{\text{52W High}} - N_{\text{52W Low}}$$

---

## 2. Mansfield Relative Strength (RS)
Measures sector or stock momentum relative to the benchmark index (e.g., NIFTY 50):
$$R_t = \frac{P_{\text{asset}, t}}{P_{\text{benchmark}, t}}$$
$$\text{BaseLine}_t = \text{SMA}_{52}(R)$$
$$\text{Mansfield RS} = \left(\frac{R_t}{\text{BaseLine}_t} - 1\right) \times 100$$
- $\text{Mansfield RS} > 0$: Asset is outperforming the benchmark (Leading / Improving).
- $\text{Mansfield RS} < 0$: Asset is underperforming the benchmark (Weakening / Lagging).

---

## 3. Algorithmic Setup Radar
Automated pattern detectors scan market ticks and candles for 4 institutional setups:
1. **VWAP Breakout + Volume Surge**: Price crosses intraday VWAP with $> 2.0\times$ 20-period average volume.
2. **EMA 20/50 Golden Cross**: Fast 20-period EMA crosses above slow 50-period EMA on 15m or 1H chart.
3. **Bollinger Band Squeeze**: Bandwidth contracts to multi-month lows indicating impending breakout.
4. **RSI Divergence**: Price prints lower low while RSI oscillator forms a higher low near demand support.
