# MarketScope.io — Market Impact & Transmission Channel Methodology

## 1. Purpose & Analytical Boundaries

The Market Impact Analysis engine translates complex corporate disclosures and macroeconomic developments into structured economic causal flows.

### Important Compliance Guardrails
1. **Zero Investment Advice**: MarketScope is an independent financial intelligence platform, not a registered investment advisor (RIA) or broker. The system **never** generates "Buy", "Sell", or "Hold" recommendations.
2. **Analysis vs. Fact Distinction**: Causal transmission flows are explicitly categorized as **"Confirmed Direct Event"** vs. **"Market Implication"**.
3. **Data Grounding**: Any price or yield cited in impact analysis must link to a real-time canonical quote with an exact timestamp.

---

## 2. Causal Transmission Flow Structure

Each analyzed story decomposes into structured transmission nodes:

```json
{
  "channel": "Sovereign Bond Yields & Cost of Capital",
  "impact_type": "confirmed",
  "description": "The RBI MPC's status-quo decision stabilizes the benchmark 10-year G-Sec yield around 6.78%, preventing immediate upward revision in corporate borrowing spreads.",
  "affected_instruments": ["INDIA 10Y YIELD", "NSE:BANKNIFTY"],
  "affected_sectors": ["Banking & Financial Services", "Infrastructure"]
}
```

### Transmission Classifications
- **`confirmed`**: Direct, mathematically or legally inevitable outcome (e.g. repo rate unchanged means policy lending rates remain anchored).
- **`implication`**: Secondary economic hypothesis (e.g. stable rates sustain home loan credit disbursement momentum).

---

## 3. Multi-Asset Transmission Matrices

The engine models transmission across 6 asset classes:
1. **Equities**: Earnings yield, discount rate impact, sectoral margins.
2. **Fixed Income**: Yield curve steepening/flattening, corporate credit spreads.
3. **Commodities**: Brent/WTI crude import bill sensitivity, MCX Gold import parity.
4. **Foreign Exchange**: Trade deficit expansion/contraction, USD/INR depreciation pressure.
5. **Macro Policy**: Fiscal deficit headroom, system liquidity surplus/deficit.
6. **Global Spillover**: US Treasury yield moves triggering foreign portfolio investment (FPI) reallocations into emerging markets.
