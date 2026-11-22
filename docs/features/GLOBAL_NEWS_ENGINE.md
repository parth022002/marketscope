# Global News Engine Specification

## 1. Engine Objective & Architecture
The MarketScope Global Financial News Engine (`app.engine.news_engine` and `canonical_news.py`) ingests, validates, clusters, ranks, and analyzes financial news and regulatory filings across domestic Indian and international capital markets.

## 2. Ingestion Pipeline & Quality Control
The pipeline executes a multi-stage validation sequence:
1. **Source Authentication**: Ingestion strictly restricted to registered publishers in the Source Registry.
2. **Canonical Deduping**: Title and content hashing detects syndication duplicates across news aggregators, grouping articles into unified story clusters.
3. **Temporal Verification**: Exact publication timestamp verification preventing fabricated dates or retroactive timestamps.
4. **Content Sanitization**: Removal of promotional spam, pump-and-dump commentary, and low-quality syndicated wire copies.

## 3. Seven Canonical Topic Taxonomies
1. **Banking & Financial Services (`BANKING`)**: RBI monetary policy, NBFC regulations, asset quality/NPA trends, credit growth, capital adequacy.
2. **Company News & Corporate Actions (`COMPANY`)**: Quarterly earnings disclosures, AGM resolutions, management changes, mergers & acquisitions, dividend declarations, buybacks.
3. **Sectoral Coverage (`SECTOR`)**: In-depth industry developments across IT services, Automotive, Energy/Power, Metals/Mining, Pharmaceuticals, FMCG, Real Estate, and Telecommunications.
4. **Macroeconomics & Central Banks (`MACRO`)**: GDP prints, Consumer Price Index (CPI), Wholesale Price Index (WPI), fiscal deficit metrics, central bank balance sheets, sovereign bond yields.
5. **Global Financial Markets (`GLOBAL_MARKETS`)**: Wall Street performance (S&P 500, NASDAQ), European bourses (LSE, DAX, CAC), Asian markets (Nikkei, Hang Seng, Shanghai), emerging market currency dynamics.
6. **Commodities & Currencies (`COMMODITIES_FOREX`)**: Brent Crude, WTI, MCX Gold/Silver spot and futures, USD/INR, EUR/INR, and foreign exchange reserves.
7. **Regulatory, Geopolitics & Policy (`REGULATION_POLICY`)**: SEBI circulars, MCA compliance, Supreme Court judicial rulings affecting commerce, international sanctions, and bilateral trade policies.
