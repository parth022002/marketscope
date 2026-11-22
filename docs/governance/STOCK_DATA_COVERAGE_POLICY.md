# MarketScope.io — Stock Data Coverage Policy & Taxonomy

## 1. Governance Objectives

MarketScope.io is an institutional-grade, non-custodial financial research platform. To maintain strict data integrity and regulatory transparency under SEBI (Research Analysts) Regulations and global investor protection norms, MarketScope.io never fabricates missing financial figures or presents delayed feeds as real-time without explicit disclosure.

---

## 2. The 8 Canonical Data Coverage States

Every instrument in MarketScope.io carries one of the following 8 explicitly defined data states:

| Coverage State | Badge Color | User Meaning | Provider Feed / Source |
|---|---|---|---|
| `LIVE_MARKET` | Emerald | Real-time direct tick data with sub-second quote refresh. | Direct exchange feed / Level 1 API |
| `DELAYED_15M` | Amber | 15-minute exchange delayed quotes as per exchange rules. | Standard market feed |
| `EOD_ONLY` | Sky Blue | Official end-of-day settlement price; updated at market close. | Bhavcopy / Exchange EOD settlement |
| `HISTORICAL_ONLY` | Slate | Historical price history exists; current trading halted or merged. | Archive database |
| `PARTIAL_DATA_AVAILABLE` | Orange | Quotes and overview available; detailed segment filings pending. | Secondary financial disclosure |
| `DISCONTINUED_INACTIVE` | Rose | Company delisted, bankrupt, or taken private. | Regulatory gazette notice |
| `UNSUPPORTED_RESTRICTED` | Gray | Trading restricted to qualified institutional buyers or non-compliant. | Compliance registry |
| `SYNTHETIC_DEMO` | Purple | MarketScope Model Engine simulation for educational sandboxes. | Internal quantitative model |

---

## 3. UI Presentation & Compliance Rules

1. **Mandatory Status Pill**: Every stock header on `/stocks/[instrumentId]` and `/company/[symbol]` must prominently display the coverage status badge.
2. **Delayed Market Notice**: When viewing a `DELAYED_15M` instrument, the timestamp must clearly state "Delayed by 15 mins (Exchange Policy)".
3. **Non-Advisory Disclaimer**: All research workstations must display the educational disclaimer:
   > *"MarketScope.io provides independent quantitative and fundamental research for educational and informational purposes. MarketScope.io is not a SEBI-registered investment advisor or stock broker. Content does not constitute an offer to buy or sell securities."*
