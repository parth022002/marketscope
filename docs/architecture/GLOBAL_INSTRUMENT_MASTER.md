# MarketScope.io — Global Instrument Master Specification

## 1. Scope & Purpose

The **Global Instrument Master** is the authoritative core database entity in MarketScope.io representing traded equities, indexes, American Depositary Receipts (ADRs), Global Depositary Receipts (GDRs), and Exchange-Traded Funds (ETFs) across worldwide financial exchanges.

---

## 2. Canonical Instrument Schema

Each security in MarketScope.io adheres to the following unified canonical schema:

```json
{
  "instrument_id": "in-nse-sbin",
  "symbol": "SBIN",
  "company_name": "State Bank of India",
  "display_name": "State Bank of India (SBI)",
  "exchange": "NSE",
  "exchange_name": "National Stock Exchange of India",
  "country": "India",
  "country_code": "IN",
  "currency": "INR",
  "isin": "INE062A01020",
  "bse_code": "500112",
  "sedol": null,
  "cusip": null,
  "sector": "Financial Services",
  "industry": "Public Sector Banking",
  "security_type": "EQUITY",
  "market_cap": 7250000000000.0,
  "market_cap_display": "₹7.25 Lakh Cr",
  "current_price": 812.50,
  "change_pct": 1.45,
  "pe_ratio": 10.4,
  "pb_ratio": 1.35,
  "ev_ebitda": 7.8,
  "dividend_yield_pct": 1.70,
  "roe_pct": 16.8,
  "roce_pct": 17.2,
  "operating_margin_pct": 28.5,
  "net_margin_pct": 18.2,
  "debt_to_equity": 0.85,
  "beta": 1.15,
  "var_95": 2.45,
  "max_drawdown_pct": 18.5,
  "q_score": 85.2,
  "data_status": "LIVE_MARKET",
  "has_multiple_listings": true,
  "peers": ["HDFCBANK", "ICICIBANK", "KOTAKBANK", "AXISBANK", "PNB"]
}
```

---

## 3. Supported Global Exchanges & Region Coverage

| Region | Exchange Code | Exchange Name | Primary Currency | Benchmark Tier |
|---|---|---|---|---|
| **India** | `NSE` | National Stock Exchange of India | INR (₹) | Mega / Large / Mid / Small |
| **India** | `BSE` | Bombay Stock Exchange | INR (₹) | Mega / Large / Mid / Small |
| **US** | `NASDAQ` | National Association of Securities Dealers | USD ($) | Mega / Large / Tech |
| **US** | `NYSE` | New York Stock Exchange | USD ($) | Mega / Large / Financials |
| **UK** | `LSE` | London Stock Exchange | GBP (£) | FTSE 100 / Large |
| **Germany** | `XETRA` | Deutsche Börse XETRA | EUR (€) | DAX 40 / Industrial |
| **Japan** | `TSE` | Tokyo Stock Exchange | JPY (¥) | Nikkei 225 / Tech & Auto |
| **Korea** | `KRX` | Korea Exchange | KRW (₩) | KOSPI / Semi & Tech |
| **Hong Kong** | `HKEX` | Hong Kong Exchanges and Clearing | HKD (HK$) | Hang Seng / Tech & Fin |

---

## 4. Multi-Listing & ADR Cross-Referencing

Securities often trade on multiple venues under different scrip tickers or depository receipt formats:

1. **Domestic Dual-Listing (NSE / BSE)**:
   - Example: State Bank of India trades as `SBIN` on NSE and scrip code `500112` on BSE.
   - Example: Reliance Industries trades as `RELIANCE` on NSE and scrip code `500325` on BSE.
   - The master links both listings to the same parent corporate entity with verified ISIN `INE002A01018`.

2. **Depositary Receipts (ADR / GDR)**:
   - Example: Infosys trades as `INFY` on NSE (ISIN `INE009A01021`) and as ADR `INFY` on NYSE (ISIN `US4567881085`).
   - The master tags `security_type: "ADR"` and cross-references the underlying domestic listing.

3. **Global Blue Chips**:
   - Covers global industry leaders including Apple (`AAPL`), Nvidia (`NVDA`), Microsoft (`MSFT`), Alphabet (`GOOGL`), Amazon (`AMZN`), Meta (`META`), Tesla (`TSLA`), Netflix (`NFLX`), Walmart (`WMT`), Berkshire Hathaway (`BRK-B`), JPMorgan (`JPM`), TSMC (`TSM`), ASML (`ASML`), SAP (`SAP.DE`), Shell (`SHEL.L`), Toyota (`7203.T`), and Samsung (`005930.KS`).
