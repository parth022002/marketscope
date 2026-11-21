# MarketScope.io — Price Accuracy & Reliability Verification Test Report

## 1. Test Suite Overview

A specialized automated test suite (`apps/api/tests/test_price_accuracy_and_reliability.py`) was executed to comprehensively validate all aspects of the price data pipeline. The test cases target mathematical precision, floating-point drift elimination, currency conversion, instrument resolution, and boundary validation.

---

## 2. Test Execution Summary

| Test Category | Test Case Identifier | Target Behavior | Result |
| :--- | :--- | :--- | :---: |
| **Exact Precision** | `test_decimal_calculation_no_float_drift` | Ensures $0.1 + 0.2$ style drift is eliminated; verifies exact $0.01$ and $0.0001$ rounding | **PASS** |
| **Asset Class Precision**| `test_precision_by_asset_class` | Validates 2 decimals (equities), 4 decimals (FX), 3 decimals (yields) | **PASS** |
| **Gold Disambiguation** | `test_mcx_gold_domestic_parity` | Verifies MCX Gold is in INR/10g (~₹76,450) and COMEX Gold in USD/oz (~\$2,685) | **PASS** |
| **Bond Yield Normalization** | `test_sovereign_yield_normalization` | Verifies `^TNX` 10x divisor and basis points change calculation | **PASS** |
| **Currency Conversion** | `test_currency_conversion_provenance` | Tests explicit conversion rate, timestamp, and source metadata | **PASS** |
| **OHLC Boundaries** | `test_ohlc_boundary_validation` | Asserts $Low \le Open \le High$ and rejects inverted candles | **PASS** |
| **Anomaly Guard** | `test_price_jump_anomaly_detection` | Flags $> 35\%$ price spikes without crashing or halting feed | **PASS** |
| **Zero Close Safety** | `test_zero_previous_close_guard` | Prevents `ZeroDivisionError` on newly listed instruments | **PASS** |
| **Multi-Tier Fallback** | `test_fallback_provider_calibration` | Confirms fallback quotes match calibrated real market benchmarks | **PASS** |

---

## 3. Discrepancy Reconciliation Findings

1. **Floating-Point Elimination**: Python `float` calculations previously produced artifacts such as `change_pct = 1.1200000000000045`. Replacing the calculation engine with `PriceCalculationService` and `Decimal` guarantees outputs such as `1.12%`.
2. **Gold Pricing Rectified**: Domestic gold pricing on the Indian ticker now accurately reflects MCX parity (~₹76,450 / 10g), preventing the prior bug where COMEX USD prices were shown with a Rupee symbol.
3. **Yield Representation Resolved**: Sovereign yields no longer carry currency symbols (`$4.42` or `₹6.78`) and are rendered as percentages (`4.420%`, `6.780%`) with basis points changes.
