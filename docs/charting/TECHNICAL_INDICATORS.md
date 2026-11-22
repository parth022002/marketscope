# MarketScope.io — Technical Indicators Mathematical Reference

## 1. Overview
MarketScope implements technical indicators both on the backend (`apps/api/app/engine/technical_indicators.py`) and on the frontend client (`apps/web/src/lib/indicators.ts`). Both implementations adhere to identical mathematical formulations.

---

## 2. Mathematical Formulations

### 2.1 Simple Moving Average (SMA)
For a series of closing prices $P$ and period $N$:
$$\text{SMA}_t = \frac{1}{N} \sum_{i=0}^{N-1} P_{t-i}$$

### 2.2 Exponential Moving Average (EMA)
Weighting multiplier $\alpha = \frac{2}{N + 1}$:
$$\text{EMA}_t = \alpha \cdot P_t + (1 - \alpha) \cdot \text{EMA}_{t-1}$$
Seeded by the SMA of the initial $N$ periods.

### 2.3 Volume Weighted Average Price (VWAP)
Using typical price $\text{TP}_t = \frac{H_t + L_t + C_t}{3}$:
$$\text{VWAP}_t = \frac{\sum_{i=1}^{t} (\text{TP}_i \cdot V_i)}{\sum_{i=1}^{t} V_i}$$
Anchored to the daily trading session start.

### 2.4 Bollinger Bands (BB)
1. **Middle Band**: $\text{SMA}_{20}(C)$
2. **Standard Deviation**: $\sigma = \sqrt{\frac{1}{N} \sum_{i=0}^{N-1} (C_{t-i} - \text{SMA}_t)^2}$
3. **Upper Band**: $\text{SMA}_t + (K \cdot \sigma)$, default $K = 2.0$
4. **Lower Band**: $\text{SMA}_t - (K \cdot \sigma)$, default $K = 2.0$

### 2.5 Relative Strength Index (RSI - Wilder's Smoothing)
1. Price change: $\Delta P_t = C_t - C_{t-1}$
2. Gain $U_t = \max(\Delta P_t, 0)$, Loss $D_t = \max(-\Delta P_t, 0)$
3. Smoothed average gain/loss over $N = 14$:
   $$\text{AvgGain}_t = \frac{\text{AvgGain}_{t-1} \cdot 13 + U_t}{14}$$
   $$\text{AvgLoss}_t = \frac{\text{AvgLoss}_{t-1} \cdot 13 + D_t}{14}$$
4. Relative Strength: $\text{RS} = \frac{\text{AvgGain}}{\text{AvgLoss}}$
5. $\text{RSI} = 100 - \frac{100}{1 + \text{RS}}$

### 2.6 Moving Average Convergence Divergence (MACD)
1. $\text{MACD Line} = \text{EMA}_{12}(C) - \text{EMA}_{26}(C)$
2. $\text{Signal Line} = \text{EMA}_{9}(\text{MACD Line})$
3. $\text{Histogram} = \text{MACD Line} - \text{Signal Line}$

### 2.7 Average True Range (ATR)
1. True Range $\text{TR}_t = \max(H_t - L_t, |H_t - C_{t-1}|, |L_t - C_{t-1}|)$
2. Wilder's smoothed ATR: $\text{ATR}_t = \frac{\text{ATR}_{t-1} \cdot (N - 1) + \text{TR}_t}{N}$

### 2.8 Supertrend
1. Basic Upper Band: $\frac{H_t + L_t}{2} + (M \cdot \text{ATR}_t)$, where $M = 3.0$
2. Basic Lower Band: $\frac{H_t + L_t}{2} - (M \cdot \text{ATR}_t)$
3. Trailing stop band locks higher during uptrends and lower during downtrends.

### 2.9 Stochastic Oscillator
$$\%K = \frac{C_t - \min(L_{t-13..t})}{\max(H_{t-13..t}) - \min(L_{t-13..t})} \times 100$$
$$\%D = \text{SMA}_3(\%K)$$

### 2.10 On-Balance Volume (OBV)
$$\text{OBV}_t = \begin{cases} \text{OBV}_{t-1} + V_t & \text{if } C_t > C_{t-1} \\ \text{OBV}_{t-1} - V_t & \text{if } C_t < C_{t-1} \\ \text{OBV}_{t-1} & \text{if } C_t = C_{t-1} \end{cases}$$
