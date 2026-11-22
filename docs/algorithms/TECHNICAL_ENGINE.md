# Technical Indicators Engine Specification
**Platform:** MarketScope.io  

## 1. Indicator Formulations
1. **Simple Moving Average (SMA)**: $\frac{1}{n} \sum_{i=0}^{n-1} P_{t-i}$
2. **Exponential Moving Average (EMA)**: $P_t \cdot \alpha + \text{EMA}_{t-1} \cdot (1 - \alpha)$, $\alpha = \frac{2}{n+1}$
3. **Relative Strength Index (RSI)**: $100 - \frac{100}{1 + RS}$, $RS = \frac{\text{Smoothed Gain}}{\text{Smoothed Loss}}$
4. **MACD**: $\text{EMA}_{12}(P) - \text{EMA}_{26}(P)$; Signal: $\text{EMA}_9(\text{MACD})$
5. **Bollinger Bands**: $\text{SMA}_{20} \pm 2 \cdot \sigma_{20}$
6. **Average True Range (ATR)**: Wilder smoothed $\text{TR} = \max(H - L, |H - C_{t-1}|, |L - C_{t-1}|)$
7. **Supertrend**: $\frac{H+L}{2} \pm \text{Multiplier} \cdot \text{ATR}$
8. **Chaikin Money Flow (CMF)**: $\frac{\sum \text{MFV}}{\sum \text{Volume}}$, $\text{MFV} = \frac{(C - L) - (H - C)}{H - L} \cdot V$
9. **Ichimoku Cloud**: Tenkan-sen (9), Kijun-sen (26), Senkou Span A/B (52).
