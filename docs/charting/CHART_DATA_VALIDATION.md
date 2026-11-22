# MarketScope.io — Chart Data Integrity & Calibration Rules

## 1. Principles of Financial Data Reliability
In financial intelligence systems, charting errors (inverted wicks, negative volumes, misaligned timestamps) undermine institutional trust. MarketScope enforces strict mathematical invariants on every incoming and calculated OHLCV bar before passing it to the charting engine.

---

## 2. Invariant Rules

### Rule 1: High Price Invariant
The High price of every bar must be greater than or equal to both Open and Close:
$$H_t \ge \max(O_t, C_t)$$
If an external provider feeds an anomalous $H_t < \max(O_t, C_t)$, the calibration engine corrects $H_t$ to $\max(O_t, C_t)$.

### Rule 2: Low Price Invariant
The Low price of every bar must be less than or equal to both Open and Close:
$$L_t \le \min(O_t, C_t)$$
If an anomaly presents $L_t > \min(O_t, C_t)$, the calibration engine corrects $L_t$ to $\min(O_t, C_t)$.

### Rule 3: Non-Negative Volume Invariant
Reported volume must be non-negative:
$$V_t \ge 0$$

### Rule 4: Timestamp Monotonicity & Uniqueness
Lightweight Charts requires that bar time series be strictly ordered chronologically with zero duplicate timestamps:
$$t_1 < t_2 < t_3 < \dots < t_n$$
The data pipeline deduplicates identical timestamps by preserving the latest verified tick and sorts ascending.

---

## 3. Data Freshness Classifications
Every chart view explicitly communicates its data lineage status:
- **`LIVE`**: Active real-time feed during exchange trading hours (sub-second latency).
- **`DELAYED_15M`**: Compliant 15-minute delayed market feed for standard tier users.
- **`EOD` / `CLOSED`**: Verified end-of-day official settlement price after market close.
- **`SYNTHETIC`**: Clearly identified sandbox test dataset; never disguised as authentic live quotes.
