# MarketScope.io — Historical Data & Candle Validation Standards

## 1. Historical Bar Integrity Requirements

MarketScope.io ingests and stores historical OHLCV candles (`apps/api/app/domain/canonical_price.py`) across standard resolutions: 1-minute (`1m`), 5-minute (`5m`), 15-minute (`15m`), 1-hour (`1h`), daily (`1D`), and weekly (`1W`).

Every historical bar must satisfy strict structural invariants before being committed to PostgreSQL or returned via API endpoints.

---

## 2. Invariant Rules for OHLCV Candles

### 2.1 Price Bound Invariant
For any candle $C = (O, H, L, C_l, V)$:
$$L \le \min(O, C_l) \quad \text{and} \quad H \ge \max(O, C_l)$$
$$H \ge L \ge 0$$
Any candle where $Low > High$ or $Open, Close$ falls outside $[Low, High]$ is strictly rejected as corrupted.

### 2.2 Volume & Turnover Invariants
$$V \ge 0 \quad \text{and} \quad \text{Turnover} \ge 0$$
If Volume $> 0$, then Volume-Weighted Average Price (VWAP) must satisfy:
$$L \le \text{VWAP} \le H$$

### 2.3 Chronological Continuity
- Bars must be strictly ordered by `open_time` ascending.
- No overlapping candles for the same resolution and instrument.
- Gaps during regular trading hours are marked with missing bar indicators rather than filled with artificial interpolated prices.

---

## 3. Split & Corporate Action Adjustments

When corporate actions occur (e.g., stock splits, bonus shares, rights issues):
1. **Unadjusted Raw Bars**: Preserved for historical filing and tax audit lineage.
2. **Adjusted Split Bars**: Backward-adjusted using the official exchange corporate action ratio factor $F$:
   $$P_{\text{adjusted}} = P_{\text{raw}} \times F \quad \text{and} \quad V_{\text{adjusted}} = \frac{V_{\text{raw}}}{F}$$
3. All adjusted time series are tagged with the adjustment timestamp and ratio provenance.
