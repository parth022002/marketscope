# News Entity Resolution Specification

## 1. Named Entity Recognition (NER) & Instrument Mapping
Financial news text often references companies by abbreviations, colloquial names, or informal monikers (e.g. "Reliance", "RIL", "Mukesh Ambani's conglomerate", "HDFC Bank", "HDFC", "the private lender"). The Entity Resolution subsystem disambiguates and maps these textual occurrences to authoritative securities database identifiers.

## 2. Resolution Dictionary & Cross-Reference Mapping
The engine maps entities to:
- `symbol`: Ticker symbol on primary exchanges (`RELIANCE.NS`, `HDFCBANK.NS`, `TCS.NS`, `AAPL.O`).
- `isin`: International Securities Identification Number (e.g. `INE002A01018` for Reliance Industries).
- `exchange`: Designated listing exchange (`NSE`, `BSE`, `NASDAQ`, `NYSE`).
- `sector`: GICS/Industry sector classification.
- `market_cap_tier`: Large Cap, Mid Cap, Small Cap classification.

## 3. Disambiguation Rules
- **Multi-Class Shares**: When a news item references Tata Motors, it maps specifically to the primary equity instrument unless DVR shares are explicitly named.
- **Parent vs. Subsidiary**: Announcements regarding Jio Platforms or Reliance Retail associate with the parent entity `RELIANCE` while tagging the subsidiary name in the entity metadata.
- **Sector Transmission**: If an announcement impacts an entire sector (e.g. "RBI increases risk weight on unsecured consumer loans"), the resolution engine links the banking sector entities while flagging individual bank tickers.
