# MarketScope.io — Technical Analysis Module

## 1. Overview
The Technical Analysis module calculates mathematical indicator series across OHLCV bars. Calculations are implemented in `apps/api/app/engine/technical_indicators.py` and rendered client-side on the chart canvas.

## 2. Implemented Indicators (14 Core Formulas)
1. **Simple Moving Average (SMA)**: \( \text{SMA}_n = \frac{1}{n} \sum_{i=0}^{n-1} P_{t-i} \)
2. **Exponential Moving Average (EMA)**: \( \text{EMA}_t = \alpha P_t + (1-\alpha) \text{EMA}_{t-1} \), where \( \alpha = \frac{2}{n+1} \)
3. **Weighted Moving Average (WMA)**: Linearly weighted sum of prices.
4. **Hull Moving Average (HMA)**: \( \text{WMA}(2 \times \text{WMA}(n/2) - \text{WMA}(n), \sqrt{n}) \) for reduced lag.
5. **Relative Strength Index (RSI)**: Wilder's smoothed RSI (14-period standard).
6. **MACD**: 12/26 EMA difference with 9-period signal EMA and histogram.
7. **Bollinger Bands**: 20-period SMA with \(\pm 2\) standard deviation bands.
8. **Average True Range (ATR)**: Wilder's smoothed true range for volatility measurement.
9. **Supertrend**: ATR-based trailing band with trend direction flip.
10. **Stochastic RSI**: RSI momentum scaled between 0 and 100 with %K and %D smoothing.
11. **Commodity Channel Index (CCI)**: Mean deviation indicator for cyclical extremes.
12. **Williams %R**: High-Low price position indicator on a -100 to 0 scale.
13. **Ichimoku Cloud**: Tenkan-sen (9), Kijun-sen (26), Senkou Span A/B (52), and Chikou Span.
14. **Chaikin Money Flow (CMF)**: Volume-weighted accumulation/distribution over 20 periods.
