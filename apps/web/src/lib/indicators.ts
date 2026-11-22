/**
 * MarketScope.io — Client-Side High-Performance Technical Indicators Engine
 * Calculates indicators over OHLCV bar series with mathematical accuracy:
 * SMA, EMA, VWAP, Bollinger Bands, RSI, MACD, Supertrend, ATR, Stochastic, OBV.
 */

export interface OHLCVBar {
  time: number | string; // Unix timestamp in seconds (int) or YYYY-MM-DD string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorPoint {
  time: number | string;
  value: number;
}

export interface MultiValuePoint {
  time: number | string;
  [key: string]: number | string;
}

/** Simple Moving Average (SMA) */
export function calculateSMA(bars: OHLCVBar[], period: number = 20): IndicatorPoint[] {
  if (bars.length < period) return [];
  const results: IndicatorPoint[] = [];
  for (let i = period - 1; i < bars.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += bars[i - j].close;
    }
    results.push({
      time: bars[i].time,
      value: Number((sum / period).toFixed(2)),
    });
  }
  return results;
}

/** Exponential Moving Average (EMA) */
export function calculateEMA(bars: OHLCVBar[], period: number = 20): IndicatorPoint[] {
  if (bars.length < period) return [];
  const results: IndicatorPoint[] = [];
  const multiplier = 2 / (period + 1);

  // Seed with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += bars[i].close;
  }
  let currentEMA = sum / period;
  results.push({ time: bars[period - 1].time, value: Number(currentEMA.toFixed(2)) });

  for (let i = period; i < bars.length; i++) {
    currentEMA = (bars[i].close - currentEMA) * multiplier + currentEMA;
    results.push({ time: bars[i].time, value: Number(currentEMA.toFixed(2)) });
  }
  return results;
}

/** Volume Weighted Average Price (VWAP) */
export function calculateVWAP(bars: OHLCVBar[]): IndicatorPoint[] {
  if (bars.length === 0) return [];
  const results: IndicatorPoint[] = [];
  let cumTPVol = 0;
  let cumVol = 0;

  for (const bar of bars) {
    const tp = (bar.high + bar.low + bar.close) / 3;
    cumTPVol += tp * bar.volume;
    cumVol += bar.volume;
    const vwap = cumVol > 0 ? cumTPVol / cumVol : tp;
    results.push({ time: bar.time, value: Number(vwap.toFixed(2)) });
  }
  return results;
}

/** Bollinger Bands (Middle, Upper, Lower) */
export interface BollingerBandsPoint {
  time: number | string;
  middle: number;
  upper: number;
  lower: number;
}

export function calculateBollingerBands(
  bars: OHLCVBar[],
  period: number = 20,
  stdDevMult: number = 2
): BollingerBandsPoint[] {
  if (bars.length < period) return [];
  const results: BollingerBandsPoint[] = [];

  for (let i = period - 1; i < bars.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += bars[i - j].close;
    }
    const mean = sum / period;

    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      varianceSum += Math.pow(bars[i - j].close - mean, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);

    results.push({
      time: bars[i].time,
      middle: Number(mean.toFixed(2)),
      upper: Number((mean + stdDevMult * stdDev).toFixed(2)),
      lower: Number((mean - stdDevMult * stdDev).toFixed(2)),
    });
  }
  return results;
}

/** Relative Strength Index (RSI - Wilder's Smoothing) */
export function calculateRSI(bars: OHLCVBar[], period: number = 14): IndicatorPoint[] {
  if (bars.length <= period) return [];

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < bars.length; i++) {
    const diff = bars[i].close - bars[i - 1].close;
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const results: IndicatorPoint[] = [];
  let rs = avgLoss > 0 ? avgGain / avgLoss : 100;
  let rsi = avgLoss > 0 ? 100 - 100 / (1 + rs) : 100;
  results.push({ time: bars[period].time, value: Number(rsi.toFixed(2)) });

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    rs = avgLoss > 0 ? avgGain / avgLoss : 100;
    rsi = avgLoss > 0 ? 100 - 100 / (1 + rs) : 100;
    results.push({ time: bars[i + 1].time, value: Number(rsi.toFixed(2)) });
  }

  return results;
}

/** Moving Average Convergence Divergence (MACD, Signal, Histogram) */
export interface MACDPoint {
  time: number | string;
  macd: number;
  signal: number;
  histogram: number;
}

export function calculateMACD(
  bars: OHLCVBar[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDPoint[] {
  if (bars.length < slowPeriod + signalPeriod) return [];

  const fastEMAs = calculateEMA(bars, fastPeriod);
  const slowEMAs = calculateEMA(bars, slowPeriod);

  // Map slow EMAs to corresponding fast EMAs
  const fastMap = new Map<number | string, number>();
  fastEMAs.forEach((p) => fastMap.set(p.time, p.value));

  const macdLinePoints: { time: number | string; close: number }[] = [];
  slowEMAs.forEach((slowP) => {
    const fastVal = fastMap.get(slowP.time);
    if (fastVal !== undefined) {
      macdLinePoints.push({
        time: slowP.time,
        close: fastVal - slowP.value,
      });
    }
  });

  if (macdLinePoints.length < signalPeriod) return [];

  // Seed signal line with EMA
  const kSignal = 2 / (signalPeriod + 1);
  let sum = 0;
  for (let i = 0; i < signalPeriod; i++) {
    sum += macdLinePoints[i].close;
  }
  let currentSignal = sum / signalPeriod;

  const results: MACDPoint[] = [];
  const firstM = macdLinePoints[signalPeriod - 1].close;
  results.push({
    time: macdLinePoints[signalPeriod - 1].time,
    macd: Number(firstM.toFixed(2)),
    signal: Number(currentSignal.toFixed(2)),
    histogram: Number((firstM - currentSignal).toFixed(2)),
  });

  for (let i = signalPeriod; i < macdLinePoints.length; i++) {
    const m = macdLinePoints[i].close;
    currentSignal = (m - currentSignal) * kSignal + currentSignal;
    results.push({
      time: macdLinePoints[i].time,
      macd: Number(m.toFixed(2)),
      signal: Number(currentSignal.toFixed(2)),
      histogram: Number((m - currentSignal).toFixed(2)),
    });
  }

  return results;
}

/** Average True Range (ATR) */
export function calculateATR(bars: OHLCVBar[], period: number = 14): IndicatorPoint[] {
  if (bars.length <= period) return [];

  const trs: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const h = bars[i].high;
    const l = bars[i].low;
    const prevC = bars[i - 1].close;
    trs.push(Math.max(h - l, Math.abs(h - prevC), Math.abs(l - prevC)));
  }

  let atr = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const results: IndicatorPoint[] = [{ time: bars[period].time, value: Number(atr.toFixed(2)) }];

  for (let i = period; i < trs.length; i++) {
    atr = (atr * (period - 1) + trs[i]) / period;
    results.push({ time: bars[i + 1].time, value: Number(atr.toFixed(2)) });
  }

  return results;
}

/** Supertrend Indicator */
export interface SupertrendPoint {
  time: number | string;
  supertrend: number;
  trend: number; // 1 for bull, -1 for bear
  upperBand: number;
  lowerBand: number;
}

export function calculateSupertrend(
  bars: OHLCVBar[],
  period: number = 10,
  multiplier: number = 3
): SupertrendPoint[] {
  if (bars.length <= period) return [];
  const atrPoints = calculateATR(bars, period);
  const atrMap = new Map<number | string, number>();
  atrPoints.forEach((p) => atrMap.set(p.time, p.value));

  const results: SupertrendPoint[] = [];
  let trend = 1;
  let upperBand = 0;
  let lowerBand = 0;

  for (const bar of bars) {
    const atr = atrMap.get(bar.time);
    if (atr === undefined) continue;

    const hl2 = (bar.high + bar.low) / 2;
    const basicUpper = hl2 + multiplier * atr;
    const basicLower = hl2 - multiplier * atr;
    const close = bar.close;

    if (trend === 1) {
      lowerBand = lowerBand > 0 ? Math.max(basicLower, lowerBand) : basicLower;
      if (close < lowerBand) {
        trend = -1;
        upperBand = basicUpper;
      }
    } else {
      upperBand = upperBand > 0 ? Math.min(basicUpper, upperBand) : basicUpper;
      if (close > upperBand) {
        trend = 1;
        lowerBand = basicLower;
      }
    }

    const supertrendVal = trend === 1 ? lowerBand : upperBand;
    results.push({
      time: bar.time,
      supertrend: Number(supertrendVal.toFixed(2)),
      trend,
      upperBand: Number(upperBand.toFixed(2)),
      lowerBand: Number(lowerBand.toFixed(2)),
    });
  }

  return results;
}

/** Heikin-Ashi Candle Transform */
export function transformHeikinAshi(bars: OHLCVBar[]): OHLCVBar[] {
  if (bars.length === 0) return [];
  const haBars: OHLCVBar[] = [];

  // First candle
  const first = bars[0];
  let haOpen = (first.open + first.close) / 2;
  let haClose = (first.open + first.high + first.low + first.close) / 4;
  let haHigh = Math.max(first.high, haOpen, haClose);
  let haLow = Math.min(first.low, haOpen, haClose);

  haBars.push({
    time: first.time,
    open: Number(haOpen.toFixed(2)),
    high: Number(haHigh.toFixed(2)),
    low: Number(haLow.toFixed(2)),
    close: Number(haClose.toFixed(2)),
    volume: first.volume,
  });

  for (let i = 1; i < bars.length; i++) {
    const b = bars[i];
    const prevHA = haBars[i - 1];

    haOpen = (prevHA.open + prevHA.close) / 2;
    haClose = (b.open + b.high + b.low + b.close) / 4;
    haHigh = Math.max(b.high, haOpen, haClose);
    haLow = Math.min(b.low, haOpen, haClose);

    haBars.push({
      time: b.time,
      open: Number(haOpen.toFixed(2)),
      high: Number(haHigh.toFixed(2)),
      low: Number(haLow.toFixed(2)),
      close: Number(haClose.toFixed(2)),
      volume: b.volume,
    });
  }

  return haBars;
}
