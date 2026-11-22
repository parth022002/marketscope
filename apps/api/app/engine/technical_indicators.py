"""
MarketScope.io — Technical Indicators Calculation Engine
High-precision mathematical indicators calculated over historical OHLCV bar series:
SMA, EMA, VWAP, Bollinger Bands, RSI, MACD, Supertrend, ATR, Stochastic, OBV.
"""

import math
from typing import Sequence
from app.domain.canonical_chart import OHLCVBar, IndicatorDataPoint, IndicatorType


class TechnicalIndicatorsEngine:
    @staticmethod
    def calculate_sma(bars: Sequence[OHLCVBar], period: int = 20) -> list[IndicatorDataPoint]:
        """Simple Moving Average (SMA)."""
        if len(bars) < period:
            return []
        results: list[IndicatorDataPoint] = []
        for i in range(period - 1, len(bars)):
            subset = [float(b.close) for b in bars[i - period + 1 : i + 1]]
            sma = sum(subset) / period
            results.append(IndicatorDataPoint(time=bars[i].time, values={"sma": round(sma, 2)}))
        return results

    @staticmethod
    def calculate_ema(bars: Sequence[OHLCVBar], period: int = 20) -> list[IndicatorDataPoint]:
        """Exponential Moving Average (EMA)."""
        if len(bars) < period:
            return []
        results: list[IndicatorDataPoint] = []
        multiplier = 2.0 / (period + 1.0)

        # Seed with initial SMA
        initial_subset = [float(b.close) for b in bars[:period]]
        current_ema = sum(initial_subset) / period
        results.append(IndicatorDataPoint(time=bars[period - 1].time, values={"ema": round(current_ema, 2)}))

        for i in range(period, len(bars)):
            close_price = float(bars[i].close)
            current_ema = (close_price - current_ema) * multiplier + current_ema
            results.append(IndicatorDataPoint(time=bars[i].time, values={"ema": round(current_ema, 2)}))
        return results

    @staticmethod
    def calculate_vwap(bars: Sequence[OHLCVBar]) -> list[IndicatorDataPoint]:
        """Volume Weighted Average Price (VWAP)."""
        if not bars:
            return []
        results: list[IndicatorDataPoint] = []
        cumulative_tp_vol = 0.0
        cumulative_vol = 0.0

        for b in bars:
            tp = (float(b.high) + float(b.low) + float(b.close)) / 3.0
            vol = float(b.volume)
            cumulative_tp_vol += tp * vol
            cumulative_vol += vol

            vwap = cumulative_tp_vol / cumulative_vol if cumulative_vol > 0 else tp
            results.append(IndicatorDataPoint(time=b.time, values={"vwap": round(vwap, 2)}))
        return results

    @staticmethod
    def calculate_bollinger_bands(
        bars: Sequence[OHLCVBar], period: int = 20, std_dev_mult: float = 2.0
    ) -> list[IndicatorDataPoint]:
        """Bollinger Bands (Middle, Upper, Lower)."""
        if len(bars) < period:
            return []
        results: list[IndicatorDataPoint] = []
        for i in range(period - 1, len(bars)):
            subset = [float(b.close) for b in bars[i - period + 1 : i + 1]]
            sma = sum(subset) / period
            variance = sum((x - sma) ** 2 for x in subset) / period
            std_dev = math.sqrt(variance)

            upper = sma + (std_dev_mult * std_dev)
            lower = sma - (std_dev_mult * std_dev)
            results.append(
                IndicatorDataPoint(
                    time=bars[i].time,
                    values={
                        "middle": round(sma, 2),
                        "upper": round(upper, 2),
                        "lower": round(lower, 2),
                    },
                )
            )
        return results

    @staticmethod
    def calculate_rsi(bars: Sequence[OHLCVBar], period: int = 14) -> list[IndicatorDataPoint]:
        """Relative Strength Index (RSI) using Wilder's Smoothing."""
        if len(bars) <= period:
            return []

        changes = [float(bars[i].close) - float(bars[i - 1].close) for i in range(1, len(bars))]
        gains = [max(0.0, c) for c in changes]
        losses = [abs(min(0.0, c)) for c in changes]

        # Initial averages
        avg_gain = sum(gains[:period]) / period
        avg_loss = sum(losses[:period]) / period

        results: list[IndicatorDataPoint] = []
        rs = avg_gain / avg_loss if avg_loss > 0 else 100.0
        rsi = 100.0 - (100.0 / (1.0 + rs)) if avg_loss > 0 else 100.0
        results.append(IndicatorDataPoint(time=bars[period].time, values={"rsi": round(rsi, 2)}))

        for i in range(period + 1, len(bars)):
            gain = gains[i - 1]
            loss = losses[i - 1]

            avg_gain = ((avg_gain * (period - 1)) + gain) / period
            avg_loss = ((avg_loss * (period - 1)) + loss) / period

            rs = avg_gain / avg_loss if avg_loss > 0 else 100.0
            rsi = 100.0 - (100.0 / (1.0 + rs)) if avg_loss > 0 else 100.0
            results.append(IndicatorDataPoint(time=bars[i].time, values={"rsi": round(rsi, 2)}))

        return results

    @staticmethod
    def calculate_macd(
        bars: Sequence[OHLCVBar], fast_period: int = 12, slow_period: int = 26, signal_period: int = 9
    ) -> list[IndicatorDataPoint]:
        """Moving Average Convergence Divergence (MACD, Signal, Histogram)."""
        if len(bars) < slow_period + signal_period:
            return []

        # 1. Calculate fast & slow EMAs over closes
        closes = [float(b.close) for b in bars]
        k_fast = 2.0 / (fast_period + 1.0)
        k_slow = 2.0 / (slow_period + 1.0)

        # Initial EMAs
        fast_ema = sum(closes[:fast_period]) / fast_period
        fast_emas = [fast_ema]
        for c in closes[fast_period:]:
            fast_ema = (c - fast_ema) * k_fast + fast_ema
            fast_emas.append(fast_ema)

        slow_ema = sum(closes[:slow_period]) / slow_period
        slow_emas = [slow_ema]
        for c in closes[slow_period:]:
            slow_ema = (c - slow_ema) * k_slow + slow_ema
            slow_emas.append(slow_ema)

        # Align fast and slow series
        offset = slow_period - fast_period
        macd_series = []
        for i in range(len(slow_emas)):
            macd_val = fast_emas[i + offset] - slow_emas[i]
            macd_series.append(macd_val)

        # 2. Calculate signal line (EMA of MACD)
        k_signal = 2.0 / (signal_period + 1.0)
        signal_val = sum(macd_series[:signal_period]) / signal_period
        signal_series = [signal_val]
        for m in macd_series[signal_period:]:
            signal_val = (m - signal_val) * k_signal + signal_val
            signal_series.append(signal_val)

        # 3. Construct result items
        results: list[IndicatorDataPoint] = []
        start_bar_idx = slow_period - 1 + signal_period - 1
        for i in range(len(signal_series)):
            m_val = macd_series[i + signal_period - 1]
            s_val = signal_series[i]
            hist = m_val - s_val
            bar_idx = start_bar_idx + i
            if bar_idx < len(bars):
                results.append(
                    IndicatorDataPoint(
                        time=bars[bar_idx].time,
                        values={
                            "macd": round(m_val, 2),
                            "signal": round(s_val, 2),
                            "histogram": round(hist, 2),
                        },
                    )
                )
        return results

    @staticmethod
    def calculate_atr(bars: Sequence[OHLCVBar], period: int = 14) -> list[IndicatorDataPoint]:
        """Average True Range (ATR)."""
        if len(bars) <= period:
            return []

        tr_list = []
        for i in range(1, len(bars)):
            h = float(bars[i].high)
            l = float(bars[i].low)
            prev_c = float(bars[i - 1].close)
            tr = max(h - l, abs(h - prev_c), abs(l - prev_c))
            tr_list.append(tr)

        atr = sum(tr_list[:period]) / period
        results = [IndicatorDataPoint(time=bars[period].time, values={"atr": round(atr, 2)})]

        for i in range(period, len(tr_list)):
            atr = ((atr * (period - 1)) + tr_list[i]) / period
            results.append(IndicatorDataPoint(time=bars[i + 1].time, values={"atr": round(atr, 2)}))

        return results

    @staticmethod
    def calculate_supertrend(
        bars: Sequence[OHLCVBar], period: int = 10, multiplier: float = 3.0
    ) -> list[IndicatorDataPoint]:
        """Supertrend Indicator with trend direction and dynamic stop bands."""
        if len(bars) <= period:
            return []

        atr_points = TechnicalIndicatorsEngine.calculate_atr(bars, period=period)
        if not atr_points:
            return []

        atr_dict = {p.time: p.values["atr"] for p in atr_points}
        results: list[IndicatorDataPoint] = []
        trend = 1  # 1 for bullish, -1 for bearish
        upper_band = 0.0
        lower_band = 0.0

        for b in bars:
            if b.time not in atr_dict:
                continue
            atr = atr_dict[b.time]
            hl2 = (float(b.high) + float(b.low)) / 2.0
            basic_upper = hl2 + (multiplier * atr)
            basic_lower = hl2 - (multiplier * atr)
            close = float(b.close)

            if trend == 1:
                lower_band = max(basic_lower, lower_band) if lower_band > 0 else basic_lower
                if close < lower_band:
                    trend = -1
                    upper_band = basic_upper
            else:
                upper_band = min(basic_upper, upper_band) if upper_band > 0 else basic_upper
                if close > upper_band:
                    trend = 1
                    lower_band = basic_lower

            supertrend_val = lower_band if trend == 1 else upper_band
            results.append(
                IndicatorDataPoint(
                    time=b.time,
                    values={
                        "supertrend": round(supertrend_val, 2),
                        "trend": float(trend),
                        "upper_band": round(upper_band, 2),
                        "lower_band": round(lower_band, 2),
                    },
                )
            )
        return results

    @staticmethod
    def calculate_stochastic(
        bars: Sequence[OHLCVBar], k_period: int = 14, d_period: int = 3
    ) -> list[IndicatorDataPoint]:
        """Stochastic Oscillator (%K, %D)."""
        if len(bars) < k_period + d_period:
            return []

        k_values = []
        times = []
        for i in range(k_period - 1, len(bars)):
            subset = bars[i - k_period + 1 : i + 1]
            highest_high = max(float(b.high) for b in subset)
            lowest_low = min(float(b.low) for b in subset)
            close = float(bars[i].close)

            denom = highest_high - lowest_low
            k = ((close - lowest_low) / denom * 100.0) if denom > 0 else 50.0
            k_values.append(k)
            times.append(bars[i].time)

        results = []
        for i in range(d_period - 1, len(k_values)):
            d = sum(k_values[i - d_period + 1 : i + 1]) / d_period
            results.append(
                IndicatorDataPoint(
                    time=times[i],
                    values={"k": round(k_values[i], 2), "d": round(d, 2)},
                )
            )
        return results

    @staticmethod
    def calculate_obv(bars: Sequence[OHLCVBar]) -> list[IndicatorDataPoint]:
        """On-Balance Volume (OBV)."""
        if not bars:
            return []
        results: list[IndicatorDataPoint] = []
        obv = 0.0
        results.append(IndicatorDataPoint(time=bars[0].time, values={"obv": obv}))

        for i in range(1, len(bars)):
            prev_close = float(bars[i - 1].close)
            curr_close = float(bars[i].close)
            vol = float(bars[i].volume)

            if curr_close > prev_close:
                obv += vol
            elif curr_close < prev_close:
                obv -= vol

            results.append(IndicatorDataPoint(time=bars[i].time, values={"obv": obv}))
        return results

    @staticmethod
    def calculate_wma(bars: Sequence[OHLCVBar], period: int = 14) -> list[IndicatorDataPoint]:
        """Weighted Moving Average (WMA) with linear weights 1..N."""
        if len(bars) < period:
            return []
        results: list[IndicatorDataPoint] = []
        weight_sum = period * (period + 1) / 2.0
        for i in range(period - 1, len(bars)):
            subset = [float(b.close) for b in bars[i - period + 1 : i + 1]]
            wma = sum((idx + 1) * val for idx, val in enumerate(subset)) / weight_sum
            results.append(IndicatorDataPoint(time=bars[i].time, values={"wma": round(wma, 2)}))
        return results

    @staticmethod
    def calculate_hma(bars: Sequence[OHLCVBar], period: int = 16) -> list[IndicatorDataPoint]:
        """Hull Moving Average (HMA): WMA(2*WMA(n/2) - WMA(n), sqrt(n))."""
        if len(bars) < period:
            return []
        half_period = max(2, period // 2)
        sqrt_period = max(2, int(math.sqrt(period)))

        def _calc_wma_series(values: list[float], n: int) -> list[float]:
            denom = n * (n + 1) / 2.0
            out = []
            for i in range(n - 1, len(values)):
                subset = values[i - n + 1 : i + 1]
                val = sum((idx + 1) * v for idx, v in enumerate(subset)) / denom
                out.append(val)
            return out

        closes = [float(b.close) for b in bars]
        wma_half = _calc_wma_series(closes, half_period)
        wma_full = _calc_wma_series(closes, period)

        # Align length
        offset = len(wma_half) - len(wma_full)
        diff_series = [2.0 * wma_half[i + offset] - wma_full[i] for i in range(len(wma_full))]

        hma_raw = _calc_wma_series(diff_series, sqrt_period)
        time_offset = len(bars) - len(hma_raw)

        results: list[IndicatorDataPoint] = []
        for i, val in enumerate(hma_raw):
            results.append(IndicatorDataPoint(time=bars[time_offset + i].time, values={"hma": round(val, 2)}))
        return results

    @staticmethod
    def calculate_stoch_rsi(
        bars: Sequence[OHLCVBar], rsi_period: int = 14, stoch_period: int = 14, k_period: int = 3, d_period: int = 3
    ) -> list[IndicatorDataPoint]:
        """Stochastic RSI (%K and %D lines)."""
        rsi_points = TechnicalIndicatorsEngine.calculate_rsi(bars, period=rsi_period)
        if len(rsi_points) < stoch_period + k_period:
            return []

        rsi_values = [p.values["rsi"] for p in rsi_points]
        raw_k = []
        for i in range(stoch_period - 1, len(rsi_values)):
            sub = rsi_values[i - stoch_period + 1 : i + 1]
            min_r = min(sub)
            max_r = max(sub)
            denom = max_r - min_r
            k = ((rsi_values[i] - min_r) / denom * 100.0) if denom > 0 else 50.0
            raw_k.append(k)

        # Smooth K with SMA
        smoothed_k = []
        for i in range(k_period - 1, len(raw_k)):
            smoothed_k.append(sum(raw_k[i - k_period + 1 : i + 1]) / k_period)

        # Smooth D with SMA over smoothed K
        results = []
        time_offset = len(bars) - len(smoothed_k)
        for i in range(d_period - 1, len(smoothed_k)):
            d = sum(smoothed_k[i - d_period + 1 : i + 1]) / d_period
            results.append(
                IndicatorDataPoint(
                    time=bars[time_offset + i].time,
                    values={"stoch_rsi_k": round(smoothed_k[i], 2), "stoch_rsi_d": round(d, 2)},
                )
            )
        return results

    @staticmethod
    def calculate_cci(bars: Sequence[OHLCVBar], period: int = 20) -> list[IndicatorDataPoint]:
        """Commodity Channel Index (CCI)."""
        if len(bars) < period:
            return []
        results: list[IndicatorDataPoint] = []
        tps = [(float(b.high) + float(b.low) + float(b.close)) / 3.0 for b in bars]

        for i in range(period - 1, len(bars)):
            sub_tp = tps[i - period + 1 : i + 1]
            mean_tp = sum(sub_tp) / period
            mean_dev = sum(abs(x - mean_tp) for x in sub_tp) / period
            denom = 0.015 * mean_dev
            cci = ((tps[i] - mean_tp) / denom) if denom > 0 else 0.0
            results.append(IndicatorDataPoint(time=bars[i].time, values={"cci": round(cci, 2)}))
        return results

    @staticmethod
    def calculate_williams_r(bars: Sequence[OHLCVBar], period: int = 14) -> list[IndicatorDataPoint]:
        """Williams %R oscillator (-100 to 0)."""
        if len(bars) < period:
            return []
        results: list[IndicatorDataPoint] = []
        for i in range(period - 1, len(bars)):
            sub = bars[i - period + 1 : i + 1]
            highest_high = max(float(b.high) for b in sub)
            lowest_low = min(float(b.low) for b in sub)
            close = float(bars[i].close)
            denom = highest_high - lowest_low
            wr = (((highest_high - close) / denom) * -100.0) if denom > 0 else -50.0
            results.append(IndicatorDataPoint(time=bars[i].time, values={"williams_r": round(wr, 2)}))
        return results

    @staticmethod
    def calculate_ichimoku(
        bars: Sequence[OHLCVBar],
        tenkan_period: int = 9,
        kijun_period: int = 26,
        senkou_b_period: int = 52,
    ) -> list[IndicatorDataPoint]:
        """Ichimoku Kinko Hyo (Conversion, Base, Span A, Span B)."""
        if len(bars) < senkou_b_period:
            return []
        results: list[IndicatorDataPoint] = []

        def _hl_avg(slice_bars: Sequence[OHLCVBar]) -> float:
            hh = max(float(b.high) for b in slice_bars)
            ll = min(float(b.low) for b in slice_bars)
            return (hh + ll) / 2.0

        for i in range(senkou_b_period - 1, len(bars)):
            tenkan = _hl_avg(bars[i - tenkan_period + 1 : i + 1])
            kijun = _hl_avg(bars[i - kijun_period + 1 : i + 1])
            span_a = (tenkan + kijun) / 2.0
            span_b = _hl_avg(bars[i - senkou_b_period + 1 : i + 1])

            results.append(
                IndicatorDataPoint(
                    time=bars[i].time,
                    values={
                        "tenkan": round(tenkan, 2),
                        "kijun": round(kijun, 2),
                        "span_a": round(span_a, 2),
                        "span_b": round(span_b, 2),
                    },
                )
            )
        return results

    @staticmethod
    def calculate_keltner(
        bars: Sequence[OHLCVBar], ema_period: int = 20, atr_period: int = 10, multiplier: float = 2.0
    ) -> list[IndicatorDataPoint]:
        """Keltner Channels (EMA +/- multiplier * ATR)."""
        ema_pts = TechnicalIndicatorsEngine.calculate_ema(bars, period=ema_period)
        atr_pts = TechnicalIndicatorsEngine.calculate_atr(bars, period=atr_period)
        if not ema_pts or not atr_pts:
            return []

        # Map by time
        atr_map = {p.time: p.values["atr"] for p in atr_pts}
        results: list[IndicatorDataPoint] = []
        for pt in ema_pts:
            if pt.time in atr_map:
                mid = pt.values["ema"]
                atr = atr_map[pt.time]
                upper = mid + (multiplier * atr)
                lower = mid - (multiplier * atr)
                results.append(
                    IndicatorDataPoint(
                        time=pt.time,
                        values={
                            "middle": round(mid, 2),
                            "upper": round(upper, 2),
                            "lower": round(lower, 2),
                        },
                    )
                )
        return results

    @staticmethod
    def calculate_cmf(bars: Sequence[OHLCVBar], period: int = 20) -> list[IndicatorDataPoint]:
        """Chaikin Money Flow (CMF)."""
        if len(bars) < period:
            return []
        results: list[IndicatorDataPoint] = []
        mfvs = []
        vols = []
        for b in bars:
            h = float(b.high)
            l = float(b.low)
            c = float(b.close)
            v = float(b.volume)
            denom = h - l
            mfm = ((c - l) - (h - c)) / denom if denom > 0 else 0.0
            mfvs.append(mfm * v)
            vols.append(v)

        for i in range(period - 1, len(bars)):
            sum_mfv = sum(mfvs[i - period + 1 : i + 1])
            sum_vol = sum(vols[i - period + 1 : i + 1])
            cmf = (sum_mfv / sum_vol) if sum_vol > 0 else 0.0
            results.append(IndicatorDataPoint(time=bars[i].time, values={"cmf": round(cmf, 4)}))
        return results
