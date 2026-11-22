# Universal Stock Exchange Registry

## 1. Registry Architecture & Mission

The **Universal Stock Exchange Registry** (`ExchangeRegistryService` in `apps/api/app/engine/exchange_registry.py`) defines authoritative operational, regulatory, and technical specifications for over 30 global stock, commodity, derivatives, and fixed-income exchanges.

Every instrument in MarketScope.io is strictly bounded by its parent exchange venue. Tickers without an associated exchange venue are rejected by schema validators.

---

## 2. Coverage by Geographic Jurisdiction

### India (Domestic Focus)
| Exchange Code | MIC | Venue Name | Trading Hours (Local) | Currency | Asset Classes | Coverage Tier |
|---|---|---|---|---|---|---|
| **NSE** | `XNSE` | National Stock Exchange of India | 09:15 – 15:30 IST | INR | Equities, Derivatives, ETFs, Debt | Verified Canonical |
| **BSE** | `XBOM` | BSE Limited | 09:15 – 15:30 IST | INR | Equities, Derivatives, ETFs, Debt | Verified Canonical |
| **MCX** | `XMCX` | Multi Commodity Exchange of India | 09:00 – 23:30/23:55 IST | INR | Commodity Futures & Options | Verified Canonical |
| **NCDEX** | `XNCX` | National Commodity & Derivatives Exchange | 09:00 – 17:00 IST | INR | Agri Commodities | Verified Canonical |
| **RBI** | `XRBI` | Reserve Bank of India NDS-OM | 09:00 – 17:00 IST | INR | Sovereign Bonds, T-Bills, Repo | Calibrated Reference |
| **AMFI** | `AMFI` | Association of Mutual Funds in India | End-of-Day 21:00 IST | INR | Mutual Funds & NAVs | Calibrated EOD |

### North America
| Exchange Code | MIC | Venue Name | Trading Hours (Local) | Currency | Asset Classes | Coverage Tier |
|---|---|---|---|---|---|---|
| **NASDAQ** | `XNAS` | The Nasdaq Stock Market | 09:30 – 16:00 EST | USD | Equities, Indices, ETFs | Verified Canonical |
| **NYSE** | `XNYS` | New York Stock Exchange | 09:30 – 16:00 EST | USD | Equities, ADRs, ETFs | Verified Canonical |
| **AMEX** | `XASE` | NYSE American | 09:30 – 16:00 EST | USD | Equities, Emerging Growth | Verified Canonical |
| **ARCA** | `ARCX` | NYSE Arca | 09:30 – 16:00 EST | USD | ETFs, ETPs | Verified Canonical |
| **CBOE** | `XCBO` | Chicago Board Options Exchange | 08:30 – 15:15 CST | USD | Index Options, VIX | Verified Canonical |
| **TSX** | `XTSE` | Toronto Stock Exchange | 09:30 – 16:00 EST | CAD | Equities, Mining, Financials | Imported |
| **TSXV** | `XTSX` | TSX Venture Exchange | 09:30 – 16:00 EST | CAD | Small-cap, Resource | Imported |
| **CSE** | `XCNQ` | Canadian Securities Exchange | 09:30 – 16:00 EST | CAD | Emerging Equities | Imported |

### United Kingdom & Europe
| Exchange Code | MIC | Venue Name | Trading Hours (Local) | Currency | Asset Classes | Coverage Tier |
|---|---|---|---|---|---|---|
| **LSE** | `XLON` | London Stock Exchange | 08:00 – 16:30 GMT | GBP | Equities, GDRs, Bonds | Verified Canonical |
| **AIM** | `XAIM` | Alternative Investment Market | 08:00 – 16:30 GMT | GBP | Growth Equities | Imported |
| **XETRA** | `XETR` | Deutsche Börse Xetra | 09:00 – 17:30 CET | EUR | Equities, DAX Components | Verified Canonical |
| **EURONEXT** | `XPAR` | Euronext (Paris, Amsterdam, Brussels) | 09:00 – 17:30 CET | EUR | Equities, CAC40, AEX | Verified Canonical |
| **SIX** | `XSWX` | SIX Swiss Exchange | 09:00 – 17:30 CET | CHF | Equities, SMI | Calibrated Reference |
| **BME** | `BMEX` | BME Spanish Exchanges | 09:00 – 17:30 CET | EUR | Equities, IBEX 35 | Calibrated Reference |

### Asia-Pacific & Emerging Markets
| Exchange Code | MIC | Venue Name | Trading Hours (Local) | Currency | Asset Classes | Coverage Tier |
|---|---|---|---|---|---|---|
| **TSE** | `XTKS` | Tokyo Stock Exchange | 09:00 – 15:30 JST | JPY | Equities, Nikkei 225 | Verified Canonical |
| **HKEX** | `XHKG` | Hong Kong Exchanges and Clearing | 09:30 – 16:00 HKT | HKD | Equities, Red Chips, H-Shares | Verified Canonical |
| **SSE** | `XSHG` | Shanghai Stock Exchange | 09:30 – 15:00 CST | CNY | A-Shares, SSE 50 | Calibrated Reference |
| **SZSE** | `XSHE` | Shenzhen Stock Exchange | 09:30 – 15:00 CST | CNY | Tech Equities, ChiNext | Calibrated Reference |
| **SGX** | `XSES` | Singapore Exchange | 09:00 – 17:00 SGT | SGD | Equities, REITs, STI | Verified Canonical |
| **KRX** | `XKRX` | Korea Exchange | 09:00 – 15:30 KST | KRW | Equities, KOSPI | Calibrated Reference |
| **TWSE** | `XTAI` | Taiwan Stock Exchange | 09:00 – 13:30 TST | TWD | Semis, Electronics | Verified Canonical |
| **ASX** | `XASX` | Australian Securities Exchange | 10:00 – 16:00 AEST | AUD | Equities, Mining, Banks | Verified Canonical |
| **NZX** | `XNZE` | New Zealand Exchange | 10:00 – 16:45 NZST | NZD | Equities, Agriculture | Calibrated Reference |
| **B3** | `BVMF` | B3 - Brasil Bolsa Balcão | 10:00 – 17:55 BRT | BRL | Equities, Ibovespa | Calibrated Reference |
| **JSE** | `XJSE` | Johannesburg Stock Exchange | 09:00 – 17:00 SAST | ZAR | Equities, Mining | Calibrated Reference |
| **TADAWUL**| `XSAU` | Saudi Exchange | 10:00 – 15:00 AST | SAR | Equities, Energy | Calibrated Reference |

---

## 3. Transparency & Regulatory Integrity

1. **Market Schedule Precision**:
   Trading sessions are modeled with UTC offsets, pre-open sessions, and post-close trading windows. When an exchange is closed, the UI prominently displays the exact state (`CLOSED`, `PRE_OPEN`, `REGULAR_HOURS`, `POST_CLOSE`) and timestamp of the latest official settlement print.

2. **MIC Code Standardization**:
   All venues map to ISO 10383 Market Identifier Codes (MIC) to ensure downstream interoperability with FIX protocol feeds and regulatory reporting standards.
