# MarketScope.io — Known Price Data Limitations & Provider Discrepancies

## 1. Upstream Provider Limitations

While MarketScope.io enforces complete internal precision and validation, upstream data providers possess documented statutory and licensing constraints:

1. **Free-Tier Indian Stock Delays on Global APIs**:
   - Commercial US providers (Twelve Data, FMP) often provide delayed (15-minute) or end-of-day data for Indian NSE/BSE equities on standard free tiers.
   - *Mitigation*: The platform routes Indian symbols through `LiveExchangeProvider` and flags delayed quotes as `DELAYED_15M`.

2. **MCX Commodity Tick Feeds**:
   - Direct real-time tick streaming from Multi Commodity Exchange (MCX) requires an authorized member broker feed (CTCL/DOTEX).
   - *Mitigation*: The platform implements domestic parity pricing calibrated to official RBI reference exchange rates and bullion customs duties, transparently flagged as `PARITY_MODEL`.

3. **Corporate Action Timings**:
   - Stock splits and bonus issues take effect on ex-date morning (09:15 IST). Historical series may experience up to a 2-hour adjustment lag on third-party commercial APIs before backward-adjusted candles are finalized.

4. **Forex Weekend Stalls**:
   - Forex markets trade continuously Sunday 22:00 UTC through Friday 22:00 UTC. Weekend rates remain frozen at Friday's closing settlement.
