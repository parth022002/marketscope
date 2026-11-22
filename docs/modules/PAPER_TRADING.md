# MarketScope.io — Virtual Paper Trading Module

## 1. Overview
The Virtual Paper Trading module provides a risk-free, non-custodial simulation environment for practicing trade execution and testing strategies with real market prices.

## 2. Account Specifications
- **Initial Cash Balance**: ₹10,00,000 INR virtual capital.
- **Order Types**:
  - *Market Order*: Executed at the current Ask (for Buy) or Bid (for Sell) with realistic simulation spread.
  - *Limit Order*: Queued in the virtual order ledger and filled when historical or real-time price touches the limit price.
- **Mark-to-Market (MTM) Portfolio Revaluation**: Positions are revalued dynamically on every price tick:
  \[ \text{Unrealized P&L} = (\text{LTP} - \text{Average Buy Price}) \times \text{Quantity} \]
- **Reset**: Users can reset their virtual balance and trade history back to ₹10,00,000 at any time.
