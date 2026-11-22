# MarketScope.io — Paper Trading Rules & Simulation Governance
## Virtual Account Simulation, Execution Modeling & Disclaimers

---

## 1. Simulation Rules & Capital Allocations
- **Starting Capital**: Each virtual account is initialized with ₹10,00,000 (INR) or $100,000 (USD) in virtual cash.
- **Order Types**:
  - *Market Order*: Executed immediately at current verified market price plus simulated broker spread (0.02%).
  - *Limit Order*: Executed only when verified price touches or breaches specified limit.
- **Transaction Costs**: Fixed simulated commission of 0.03% (mirroring STT, GST, SEBI turnover fees).
- **Mark-to-Market (MTM)**: Open positions are continuously revalued at current market price.
- **Account Reset**: Users can reset their virtual portfolio at any time back to starting capital.

---

## 2. Research-Only Regulatory Governance
- **Strictly Non-Custodial**: MarketScope.io does not accept or hold customer fiat deposits or securities.
- **No Direct Broker Order Routing**: Simulated orders are held strictly within MarketScope's internal memory/database.
- **Disclaimer**: Paper trading results are hypothetical and do not represent actual trading performance.
