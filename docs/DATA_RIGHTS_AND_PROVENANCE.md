# Data rights and provenance

## Initial provider strategy
Use `MockProvider` and synthetic fixtures for local development. Do not scrape NSE, BSE, Screener, TradingView, Groww, Zerodha, Tickertape, Moneycontrol or other websites as a substitute for a data agreement.

## Provider adapter contract
Every provider adapter should declare:
- provider identity and contract/version
- permitted markets, instruments, fields and purposes
- display, caching, storage, derived-data and redistribution rights
- geographic and user-class restrictions
- rate limits, attribution and expiry requirements

## Minimum provenance fields
- source/provider ID
- source URL or permitted source locator
- publication timestamp (if known)
- retrieval timestamp
- period start/end and period type
- currency, unit and reporting basis
- transformation and formula version
- quality status and freshness status
- synthetic/demo flag
- rights/entitlement reference

## Required rule
A provider's data must not be displayed, cached, stored, exported or used for AI retrieval unless the applicable entitlement permits that action.
