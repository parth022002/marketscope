# MarketScope.io — Technical Indicator Formulas & Mathematical Specification
## Mathematical Formulations for All 18 Quantitative Indicators

---

## 1. Moving Averages

### 1.1 Simple Moving Average (SMA)
For a lookback period $N$:
$$\text{SMA}_t = \frac{1}{N} \sum_{i=0}^{N-1} C_{t-i}$$

### 1.2 Exponential Moving Average (EMA)
Smoothing multiplier $\alpha = \frac{2}{N + 1}$:
$$\text{EMA}_t = \alpha \cdot C_t + (1 - \alpha) \cdot \text{EMA}_{t-1}$$
Seeded with $\text{SMA}_N$.

### 1.3 Weighted Moving Average (WMA)
Linear weight series $w_i = i$:
$$\text{WMA}_t = \frac{\sum_{i=1}^N i \cdot C_{t - N + i}}{\frac{N(N+1)}{2}}$$

### 1.4 Hull Moving Average (HMA)
Eliminates lag while maintaining curvature:
$$\text{HMA}_t = \text{WMA}\left(2 \cdot \text{WMA}(C, \lfloor N/2 \rfloor) - \text{WMA}(C, N), \lfloor \sqrt{N} \rfloor\right)$$

---

## 2. Momentum & Oscillators

### 2.1 Relative Strength Index (RSI) — Wilder's Smoothing
Price changes: $U_t = \max(0, C_t - C_{t-1})$, $D_t = \max(0, C_{t-1} - C_t)$.
Smoothed averages:
$$\bar{U}_t = \frac{\bar{U}_{t-1} \cdot (N - 1) + U_t}{N}$$
$$\bar{D}_t = \frac{\bar{D}_{t-1} \cdot (N - 1) + D_t}{N}$$
$$\text{RS} = \frac{\bar{U}_t}{\bar{D}_t}, \quad \text{RSI} = 100 - \frac{100}{1 + \text{RS}}$$

### 2.2 Moving Average Convergence Divergence (MACD)
- Fast EMA ($N=12$), Slow EMA ($N=26$).
- $\text{MACD Line} = \text{EMA}_{12}(C) - \text{EMA}_{26}(C)$
- $\text{Signal Line} = \text{EMA}_9(\text{MACD Line})$
- $\text{Histogram} = \text{MACD Line} - \text{Signal Line}$

### 2.3 Stochastic Oscillator & Stochastic RSI
- Fast $\%K = \frac{C_t - L_N}{H_N - L_N} \times 100$
- $\%D = \text{SMA}_3(\%K)$
- Stochastic RSI computes $\%K$ over the $N$-period RSI series.

### 2.4 Commodity Channel Index (CCI)
- Typical Price $TP_t = (H_t + L_t + C_t) / 3$
- Mean Deviation $MD_t = \frac{1}{N} \sum_{i=0}^{N-1} |TP_{t-i} - \text{SMA}_N(TP)|$
- $\text{CCI} = \frac{TP_t - \text{SMA}_N(TP)}{0.015 \cdot MD_t}$

### 2.5 Williams %R
$$\%R = \frac{H_N - C_t}{H_N - L_N} \times (-100)$$

---

## 3. Volatility & Bands

### 3.1 Bollinger Bands
- Middle Band $= \text{SMA}_N(C)$
- $\sigma = \sqrt{\frac{1}{N} \sum_{i=0}^{N-1} (C_{t-i} - \text{Middle})^2}$
- Upper Band $= \text{Middle} + k \cdot \sigma$, Lower Band $= \text{Middle} - k \cdot \sigma$ (default $k=2.0$).

### 3.2 Average True Range (ATR)
- True Range $TR_t = \max(H_t - L_t, |H_t - C_{t-1}|, |L_t - C_{t-1}|)$
- $\text{ATR}_t = \frac{\text{ATR}_{t-1} \cdot (N - 1) + TR_t}{N}$

### 3.3 Supertrend
- Basic Upper $= \frac{H_t + L_t}{2} + m \cdot \text{ATR}_t$, Basic Lower $= \frac{H_t + L_t}{2} - m \cdot \text{ATR}_t$
- Bands are ratcheted based on previous bar close; trend flips when price penetrates opposite band.

### 3.4 Keltner Channels
- Middle Line $= \text{EMA}_{20}(C)$
- Upper $= \text{EMA}_{20} + m \cdot \text{ATR}_{10}$, Lower $= \text{EMA}_{20} - m \cdot \text{ATR}_{10}$

---

## 4. Volume Flow Indicators

### 4.1 Volume Weighted Average Price (VWAP)
$$\text{VWAP} = \frac{\sum (TP_i \cdot V_i)}{\sum V_i}$$

### 4.2 On-Balance Volume (OBV)
$$\text{OBV}_t = \text{OBV}_{t-1} + \begin{cases} V_t & \text{if } C_t > C_{t-1} \\ -V_t & \text{if } C_t < C_{t-1} \\ 0 & \text{if } C_t = C_{t-1} \end{cases}$$

### 4.3 Chaikin Money Flow (CMF)
- Money Flow Multiplier $MFM_t = \frac{(C_t - L_t) - (H_t - C_t)}{H_t - L_t}$
- Money Flow Volume $MFV_t = MFM_t \cdot V_t$
- $\text{CMF}_N = \frac{\sum_{i=0}^{N-1} MFV_{t-i}}{\sum_{i=0}^{N-1} V_{t-i}}$
