# Authoritative Global Exchange Registry

## 1. Registry Architecture & Overview

The Global Exchange Registry (`apps/api/app/engine/exchange_registry.py`) serves as the single source of truth for all domestic Indian and international exchange trading hours, ISO 10383 Market Identifier Codes (MIC), settlement currencies, and data licensing regimes.

Currently, **31 authoritative exchanges, clearing corporations, and central monetary authorities** are registered and fully active.

---

## 2. Comprehensive Global Exchanges Directory

| Exchange ID | Full Name | ISO MIC | Country | Region | Trading Hours (Local) | Currency | Licensing Status |
|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **NSE** | National Stock Exchange of India | `XNSE` | IN | India | 09:15 - 15:30 (IST) | INR | LICENSED_DISPLAY |
| **BSE** | Bombay Stock Exchange | `XBOM` | IN | India | 09:15 - 15:30 (IST) | INR | LICENSED_DISPLAY |
| **MCX** | Multi Commodity Exchange of India | `XMCX` | IN | India | 09:00 - 23:30 (IST) | INR | LICENSED_DISPLAY |
| **NCDEX** | National Commodity & Derivatives Exchange | `XNCX` | IN | India | 09:00 - 17:00 (IST) | INR | LICENSED_DISPLAY |
| **RBI** | Reserve Bank of India (DBIE/FBIL) | `XRBI` | IN | India | 09:00 - 17:00 (IST) | INR | OPEN_ACCESS |
| **AMFI** | Association of Mutual Funds in India | `XAMF` | IN | India | 09:00 - 21:00 (IST) | INR | OPEN_ACCESS |
| **INX** | India International Exchange (GIFT IFSC) | `XINX` | IN | India | 04:30 - 02:30 (IST) | USD | LICENSED_DISPLAY |
| **NSEIX** | NSE IFSC (GIFT City SEZ) | `XNIX` | IN | India | 06:30 - 02:00 (IST) | USD | LICENSED_DISPLAY |
| **NYSE** | New York Stock Exchange | `XNYS` | US | Americas | 09:30 - 16:00 (EST) | USD | LICENSED_DISPLAY |
| **NASDAQ** | Nasdaq Stock Market | `XNAS` | US | Americas | 09:30 - 16:00 (EST) | USD | LICENSED_DISPLAY |
| **CBOE** | Chicago Board Options Exchange (VIX) | `XCBO` | US | Americas | 09:30 - 16:15 (EST) | USD | PROPRIETARY |
| **CME** | Chicago Mercantile Exchange | `XCME` | US | Americas | 18:00 - 17:00 (CST) | USD | LICENSED_DISPLAY |
| **NYMEX** | New York Mercantile Exchange | `XNYM` | US | Americas | 18:00 - 17:00 (EST) | USD | LICENSED_DISPLAY |
| **COMEX** | Commodity Exchange (Precious Metals) | `XCEC` | US | Americas | 18:00 - 17:00 (EST) | USD | LICENSED_DISPLAY |
| **BOND** | US Treasury & Sovereign Bond Fixed Income | `XBND` | US | Americas | 07:00 - 17:00 (EST) | USD | OPEN_ACCESS |
| **TSX** | Toronto Stock Exchange | `XTSE` | CA | Americas | 09:30 - 16:00 (EST) | CAD | LICENSED_DISPLAY |
| **LSE** | London Stock Exchange | `XLON` | GB | Europe | 08:00 - 16:30 (GMT) | GBP | LICENSED_DISPLAY |
| **ICE** | Intercontinental Exchange (Brent Crude) | `IFEU` | GB | Europe | 01:00 - 23:00 (GMT) | USD | LICENSED_DISPLAY |
| **XETRA** | Deutsche Börse Xetra | `XETR` | DE | Europe | 09:00 - 17:30 (CET) | EUR | LICENSED_DISPLAY |
| **EURONEXT_PARIS** | Euronext Paris | `XPAR` | FR | Europe | 09:00 - 17:30 (CET) | EUR | LICENSED_DISPLAY |
| **EURONEXT_AMS** | Euronext Amsterdam | `XAMS` | NL | Europe | 09:00 - 17:30 (CET) | EUR | LICENSED_DISPLAY |
| **SIX** | SIX Swiss Exchange | `XSWX` | CH | Europe | 09:00 - 17:30 (CET) | CHF | LICENSED_DISPLAY |
| **TSE** | Tokyo Stock Exchange | `XTKS` | JP | Asia-Pac | 09:00 - 15:30 (JST) | JPY | LICENSED_DISPLAY |
| **HKEX** | Hong Kong Exchanges and Clearing | `XHKG` | HK | Asia-Pac | 09:30 - 16:00 (HKT) | HKD | LICENSED_DISPLAY |
| **SSE** | Shanghai Stock Exchange | `XSHG` | CN | Asia-Pac | 09:30 - 15:00 (CST) | CNY | DELAYED_15M |
| **SGX** | Singapore Exchange | `XSES` | SG | Asia-Pac | 09:00 - 17:00 (SGT) | SGD | LICENSED_DISPLAY |
| **KRX** | Korea Exchange | `XKRX` | KR | Asia-Pac | 09:00 - 15:30 (KST) | KRW | LICENSED_DISPLAY |
| **ASX** | Australian Securities Exchange | `XASX` | AU | Asia-Pac | 10:00 - 16:00 (AEST) | AUD | LICENSED_DISPLAY |
| **TADAWUL** | Saudi Exchange | `XSAU` | SA | MEA | 10:00 - 15:00 (AST) | SAR | LICENSED_DISPLAY |
| **B3** | B3 - Brasil Bolsa Balcão | `BVMF` | BR | Americas | 10:00 - 17:55 (BRT) | BRL | LICENSED_DISPLAY |
| **FOREX** | Global Foreign Exchange Interbank | `XFOR` | XX | Global | 24 Hours (Sun-Fri) | USD | OPEN_ACCESS |

---

## 3. Session Calendars & Pre-Open Auctions
- **Indian Equities (NSE/BSE):** Pre-open session runs from 09:00 to 09:08 IST (order entry and cancellation), followed by order matching from 09:08 to 09:12 IST. Regular continuous market opens at 09:15 IST and closes at 15:30 IST. Post-closing price discovery session runs from 15:40 to 16:00 IST.
- **Indian Commodities (MCX):** Operates on split non-agri sessions running from 09:00 to 23:30 IST (extended to 23:55 IST during US daylight saving periods) to overlap with active NYMEX and COMEX trading.
- **US Equities (NYSE/NASDAQ):** Pre-market runs 04:00 to 09:30 EST. Continuous regular trading runs 09:30 to 16:00 EST. After-hours runs 16:00 to 20:00 EST.
