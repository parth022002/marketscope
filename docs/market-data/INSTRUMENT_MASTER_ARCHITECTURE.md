# MarketScope.io — Phase 2: Instrument Master Architecture & Cross-Provider Mapping

## 1. Executive Summary & Purpose

The Instrument Master is the single authoritative registry and golden record for all tradeable and trackable financial instruments in MarketScope.io. 
In financial market infrastructure, a frequent cause of incorrect prices, broken charts, and corrupt financial ratios is **instrument fragmentation**: different data vendors refer to the exact same asset with discordant identifiers, different share classes, separate exchange suffixes, or mutated ticker symbols.

Without a canonical Instrument Master:
- Twelve Data uses `NSE:RELIANCE` or `RELIANCE:NSE`.
- Financial Modeling Prep (FMP) uses `RELIANCE.NS` or `RELIANCE.BO`.
- Yahoo Finance uses `RELIANCE.NS`.
- NSE India uses `RELIANCE` with series `EQ`.
- BSE India uses scrip code `500325`.
- Regulatory and depository databases (NSDL/CDSL) use ISIN `INE002A01018`.

If these symbols are not mapped deterministically to a persistent internal UUID, prices from one vendor can be mapped to the wrong company or currency, or duplicate entries appear in search results, watchlists, and screeners.

This document defines the complete architecture, database schema, normalization lifecycle, and cross-provider mapping rules for MarketScope.io.

---

## 2. Canonical Instrument Identifier Strategy

### 2.1 The MarketScope Instrument ID (MSID)
Every instrument in MarketScope is assigned a deterministic or UUIDv4 identifier:
`ms_inst_<uuid>` (e.g., `ms_inst_8f1d3c90-e74b-4a52-b912-74f28dc31940`).

The MSID remains immutable across corporate actions (such as symbol changes, name changes, or index reclassifications).

### 2.2 Global Identifier Hierarchy
1. **ISIN (International Securities Identification Number)** — ISO 6166:
   - Primary global key for equities, bonds, debentures, and ETFs.
   - Format: 2-letter country code + 9 alphanumeric characters + 1 check digit (e.g., `INE002A01018` for Reliance Industries, `US0378331005` for Apple Inc.).
2. **Exchange Ticker Symbol**:
   - The trading symbol on the primary listing exchange (e.g., `RELIANCE` on NSE, `AAPL` on NASDAQ).
3. **Local National Identifiers**:
   - **BSE Scrip Code**: 6-digit numeric identifier on Bombay Stock Exchange (e.g., `500325`).
   - **NSE Series**: `EQ` (Equity Regular), `BE` (Book Entry / Trade-for-Trade), `SM` (SME Platform), `IL` (Institutional Lot).
   - **CIN (Corporate Identity Number)**: Ministry of Corporate Affairs 21-digit identifier for Indian companies (e.g., `L17110MH1973PLC019786`).
   - **US CIK (Central Index Key)**: SEC 10-digit identifier (e.g., `0000320193` for Apple).
   - **FIGI (Financial Instrument Global Identifier)**: Bloomberg / OMG standard where available.

---

## 3. Relational Schema Architecture

The relational schema is implemented in PostgreSQL (Neon / RDS) with strict foreign key constraints, unique indexes, and audit logging.

```sql
-- 1. Issuers (The corporate or sovereign entity)
CREATE TABLE issuers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2 (IN, US, GB, etc.)
    cin VARCHAR(21) UNIQUE,           -- Indian CIN
    us_cik VARCHAR(10) UNIQUE,        -- US SEC CIK
    lei VARCHAR(20) UNIQUE,           -- Legal Entity Identifier (ISO 17442)
    sector VARCHAR(100),
    industry VARCHAR(100),
    website_url VARCHAR(255),
    incorporation_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Instruments Master (The tradeable or trackable financial asset)
CREATE TABLE instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issuer_id UUID REFERENCES issuers(id) ON DELETE RESTRICT,
    canonical_symbol VARCHAR(50) NOT NULL,     -- e.g. 'RELIANCE', 'AAPL', 'NIFTY 50'
    display_name VARCHAR(255) NOT NULL,        -- e.g. 'Reliance Industries Limited'
    asset_class VARCHAR(30) NOT NULL,          -- 'EQUITY', 'INDEX', 'COMMODITY', 'CURRENCY', 'BOND'
    instrument_type VARCHAR(30) NOT NULL,      -- 'COMMON_STOCK', 'ETF', 'INDEX', 'SPOT', 'FUTURES'
    exchange_code VARCHAR(20) NOT NULL,        -- 'NSE', 'BSE', 'NASDAQ', 'NYSE', 'MCX', 'FOREX'
    country_code VARCHAR(2) NOT NULL DEFAULT 'IN',
    base_currency VARCHAR(3) NOT NULL,         -- 'INR', 'USD', 'EUR', etc.
    quote_currency VARCHAR(3) NOT NULL,        -- 'INR', 'USD', etc.
    isin VARCHAR(12) UNIQUE,                   -- ISO 6166 ISIN
    bse_scrip_code VARCHAR(10) UNIQUE,         -- BSE 6-digit code
    nse_series VARCHAR(5) DEFAULT 'EQ',        -- 'EQ', 'BE', 'SM', etc.
    lot_size INT NOT NULL DEFAULT 1,
    tick_size NUMERIC(10, 4) NOT NULL DEFAULT 0.05,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_tradable BOOLEAN NOT NULL DEFAULT TRUE,
    primary_vendor VARCHAR(50) NOT NULL DEFAULT 'twelvedata',
    fallback_vendor VARCHAR(50) DEFAULT 'fmp',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_symbol_exchange UNIQUE (canonical_symbol, exchange_code)
);

-- 3. Cross-Provider Symbol Mapping Table
CREATE TABLE instrument_vendor_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL REFERENCES instruments(id) ON DELETE CASCADE,
    vendor_name VARCHAR(50) NOT NULL,          -- 'twelvedata', 'fmp', 'truedata', 'yfinance', 'nse_bhavcopy'
    vendor_symbol VARCHAR(100) NOT NULL,       -- e.g. 'RELIANCE.NS', 'RELIANCE:NSE', '500325'
    vendor_exchange VARCHAR(50),               -- Vendor's internal exchange name
    vendor_instrument_id VARCHAR(100),         -- Vendor's internal ID if separate
    supports_realtime BOOLEAN NOT NULL DEFAULT FALSE,
    supports_websocket BOOLEAN NOT NULL DEFAULT FALSE,
    supports_eod BOOLEAN NOT NULL DEFAULT TRUE,
    priority_rank INT NOT NULL DEFAULT 1,      -- 1 is highest priority
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vendor_symbol UNIQUE (vendor_name, vendor_symbol)
);

-- 4. Corporate Actions & Symbol Change History
CREATE TABLE instrument_corporate_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL REFERENCES instruments(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,          -- 'SPLIT', 'BONUS', 'DIVIDEND', 'SYMBOL_CHANGE', 'MERGER', 'DELISTING'
    effective_date DATE NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ratio_numerator NUMERIC(15, 6),
    ratio_denominator NUMERIC(15, 6),
    adjustment_factor NUMERIC(15, 8),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast resolution
CREATE INDEX idx_inst_canonical_symbol ON instruments (canonical_symbol);
CREATE INDEX idx_inst_isin ON instruments (isin);
CREATE INDEX idx_inst_bse_code ON instruments (bse_scrip_code);
CREATE INDEX idx_inst_vendor_lookup ON instrument_vendor_mappings (vendor_name, vendor_symbol);
```

---

## 4. Multi-Vendor Mapping Matrix for Core Universe

| Canonical Symbol | Display Name | Asset Class | Primary Exch | Currency | ISIN | Twelve Data Symbol | FMP Symbol | TrueData / NSE Symbol | Yahoo Finance |
|---|---|---|---|---|---|---|---|---|---|
| `NIFTY 50` | Nifty 50 Index | INDEX | NSE | INR | `IN9000000001` | `NIFTY 50:NSE` | `^NSEI` | `NIFTY-I` / `NIFTY 50` | `^NSEI` |
| `SENSEX` | S&P BSE SENSEX | INDEX | BSE | INR | `IN9000000002` | `SENSEX:BSE` | `^BSESN` | `SENSEX` | `^BSESN` |
| `NIFTY BANK` | Nifty Bank Index | INDEX | NSE | INR | `IN9000000003` | `NIFTY BANK:NSE` | `^NSEBANK`| `BANKNIFTY-I` | `^NSEBANK`|
| `NIFTY IT` | Nifty IT Index | INDEX | NSE | INR | `IN9000000004` | `CNXIT:NSE` | `^CNXIT` | `NIFTY IT` | `^CNXIT` |
| `RELIANCE` | Reliance Industries Ltd | EQUITY | NSE | INR | `INE002A01018` | `RELIANCE:NSE` | `RELIANCE.NS`| `RELIANCE` | `RELIANCE.NS` |
| `TCS` | Tata Consultancy Services | EQUITY | NSE | INR | `INE467B01029` | `TCS:NSE` | `TCS.NS` | `TCS` | `TCS.NS` |
| `HDFCBANK` | HDFC Bank Ltd | EQUITY | NSE | INR | `INE040A01034` | `HDFCBANK:NSE` | `HDFCBANK.NS`| `HDFCBANK` | `HDFCBANK.NS` |
| `INFY` | Infosys Ltd | EQUITY | NSE | INR | `INE009A01021` | `INFY:NSE` | `INFY.NS` | `INFY` | `INFY.NS` |
| `TATAMOTORS`| Tata Motors Ltd | EQUITY | NSE | INR | `INE155A01022` | `TATAMOTORS:NSE`| `TATAMOTORS.NS`| `TATAMOTORS` | `TATAMOTORS.NS` |
| `NASDAQ 100` | NASDAQ 100 Futures/Index | INDEX | NASDAQ | USD | `US6311011026` | `NDX` / `QQQ` | `^NDX` | N/A | `^NDX` |
| `S&P 500` | S&P 500 Index | INDEX | NYSE | USD | `US78378X1072` | `SPX` / `SPY` | `^GSPC` | N/A | `^GSPC` |
| `AAPL` | Apple Inc. | EQUITY | NASDAQ | USD | `US0378331005` | `AAPL` | `AAPL` | N/A | `AAPL` |
| `NVDA` | NVIDIA Corporation | EQUITY | NASDAQ | USD | `US67066G1040` | `NVDA` | `NVDA` | N/A | `NVDA` |
| `MSFT` | Microsoft Corporation | EQUITY | NASDAQ | USD | `US5949181045` | `MSFT` | `MSFT` | N/A | `MSFT` |
| `BRENT CRUDE`| Brent Crude Oil Spot/Fut | COMMODITY | ICE | USD | N/A | `BRENT` | `BZUSD` | `BRENTCRUDE` | `BZ=F` |
| `GOLD SPOT` | Gold Spot (oz) | COMMODITY | COMEX | USD | N/A | `XAU/USD` | `GCUSD` | N/A | `GC=F` |
| `GOLD MCX` | Gold 24K (10g) | COMMODITY | MCX | INR | N/A | `GOLD:MCX` | N/A | `GOLD-I` | `GOLD.MCX` |
| `USD/INR` | US Dollar / Indian Rupee | CURRENCY | FOREX | INR | N/A | `USD/INR` | `USDINR` | `USDINR` | `USDINR=X` |
| `EUR/INR` | Euro / Indian Rupee | CURRENCY | FOREX | INR | N/A | `EUR/INR` | `EURINR` | `EURINR` | `EURINR=X` |
| `US 10Y YIELD`| US 10Y Treasury Note | YIELD | BOND | USD | `US91282CDJ71` | `TNX` | `^TNX` | N/A | `^TNX` |
| `INDIA 10Y YIELD`| India 10Y G-Sec (7.18 GS 2033)| YIELD | RBI | INR | `IN0020230085` | N/A | N/A | `IN10Y` | `IN10YT=RR` |

---

## 5. Resolution & Disambiguation Rules

When an incoming query or user search is processed:
1. **Direct Identifier Match**: If the query matches an ISIN (12 chars starting with two uppercase letters) or BSE scrip code (6 digits), resolve immediately to the single canonical instrument.
2. **Exact Symbol + Exchange Match**: If `symbol="RELIANCE"` and `exchange="NSE"`, resolve to the NSE equity.
3. **Disambiguation Trigger**: If a search for `TATA` matches `TATAMOTORS`, `TATASTEEL`, `TCS`, and `TATACONSUM`, return all candidates with `requires_disambiguation=True` and clear company names, exchanges, and sectors.
4. **Share Class Segregation**: Ordinary shares (`TATAMOTORS`) and Differential Voting Rights (`TATAMOTORS DVR` / `TATAMTRDVR`) must never share the same `instrument_id`. Each has distinct ISINs, prices, and dividend yields.
5. **Currency Consistency Enforcement**: The Instrument Master defines the base and quote currency. Under no circumstance may a USD quote be populated into an INR instrument without an explicit FX translation step.
