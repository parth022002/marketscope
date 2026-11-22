# MarketScope.io — Data Freshness & Provenance Standards

## 1. Provenance Hierarchy & Enums
Every financial number, quote, and chart bar in MarketScope.io is accompanied by an authoritative `provenance` tag:

- `LIVE`: Sub-second streaming quote directly from an active market data socket or fresh polling interval (<5 seconds old).
- `DELAYED_15M`: Market quote delayed by 15 minutes in adherence to standard exchange redistribution guidelines.
- `CALIBRATED_EOD`: End-of-Day validated closing price from official exchange daily bhavcopy or official close.
- `VERIFIED_OFFICIAL`: Official corporate action or financial statement audited directly from company annual/quarterly reports.

## 2. Freshness SLAs
- **Live Trading Hours (09:15 - 15:30 IST / 09:30 - 16:00 EST)**: Quote cache TTL = 5 seconds; bar update TTL = 60 seconds.
- **Post-Market / Weekends**: Static caching with EOD calibration; zero unnecessary polling to preserve compute and API quota.
