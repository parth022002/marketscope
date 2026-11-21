# MarketScope.io — Company, Instrument & Sector Entity Mapping Engine

## 1. Resolution Methodology

Naive substring matching (e.g. searching for the word "Tata" or "Reliance") produces severe false positives across capital markets. MarketScope.io implements a multi-tier entity resolution engine integrated with the `universal_instrument_master`.

Every incoming news article is parsed through an entity extraction pipeline that maps mentions to unambiguous, exchange-qualified instrument records.

---

## 2. Entity Mapping Hierarchy

An entity is mapped only when at least one of the following criteria is validated:

1. **Exact Exchange Ticker Match**: Ticker symbol preceded by exchange prefix (e.g. `NSE:RELIANCE`, `BSE:500325`, `NASDAQ:AAPL`).
2. **ISIN Identification**: International Securities Identification Number matching (e.g. `INE002A01018` for Reliance Industries).
3. **Legal Entity Name Match**: Exact or normalized match against the corporate legal name registered with MCA / SEC (e.g. `Tata Consultancy Services Limited`).
4. **Disambiguated Brand / Subsidiary Mapping**: Parent/subsidiary ontology resolution:
   - "Jio Platforms" / "Reliance Retail" $\rightarrow$ Maps to parent `NSE:RELIANCE` with subsidiary tag.
   - "Tata Motors Passenger Vehicles" $\rightarrow$ Maps to `NSE:TATAMOTORS`.

---

## 3. Disambiguation Protections

- **Common Word Guard**: Tickers matching common English words (e.g. `IT`, `AT`, `BE`, `ALL`, `NOW`, `ON`) are **never** matched via standalone ticker search. They require explicit exchange qualification (`NSE:IT`) or context verification alongside company names.
- **Cross-Exchange Collision Guard**: Same symbol on different exchanges (e.g. `TCS` on NSE India vs `TCS` on NYSE - Container Store Group) is disambiguated using the article's detected country, currency, and sector context.
- **Macro & Commodity Ontology**: Macro articles referencing crude oil, gold, inflation, or central banks are tagged with canonical macro instruments (`BRENT`, `GOLD MCX`, `USD/INR`, `US 10Y YIELD`, `INDIA 10Y YIELD`).
