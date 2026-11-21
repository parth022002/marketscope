# MarketScope.io — Instrument & Exchange Identity Mapping Rules

## 1. Mapping Philosophy

Financial instruments exist across multiple vendor registries with disparate identifiers (e.g. RIC, ISIN, Bloomberg Ticker, Yahoo symbol, Twelve Data ticker). MarketScope.io maintains an authoritative `InstrumentResolver` (`apps/api/app/engine/instrument_resolver.py`) that maps every query to a canonical instrument record.

---

## 2. Complete Canonical Mapping Catalog

| Canonical Symbol | Exchange | Asset Class | Currency | Precision | Primary Vendor Ticker | Normalization Rule |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NIFTY 50** | NSE | INDEX | INR | 2 | `^NSEI` | Native NSE benchmark index |
| **NIFTY NEXT 50** | NSE | INDEX | INR | 2 | `^NN50` / `^NSMIDCP` | Resolves strictly to Next 50, not Midcap |
| **NIFTY BANK** | NSE | INDEX | INR | 2 | `^NSEBANK` | Banking sector benchmark |
| **NIFTY FINANCIAL SERVICES** | NSE | INDEX | INR | 2 | `NIFTY_FIN_SERVICE.NS` | Financial services sector |
| **NIFTY IT** | NSE | INDEX | INR | 2 | `^CNXIT` | Information technology sector |
| **NIFTY MIDCAP 100** | NSE | INDEX | INR | 2 | `^CRSMID` | Midcap 100 index |
| **SENSEX** | BSE | INDEX | INR | 2 | `^BSESN` | BSE benchmark 30 |
| **BSE 100** | BSE | INDEX | INR | 2 | `^BSE100` | BSE broad market 100 |
| **BSE 500** | BSE | INDEX | INR | 2 | `^BSE500` | BSE broad market 500 |
| **NASDAQ Composite** | NASDAQ | INDEX | USD | 2 | `^IXIC` | US Composite index |
| **NASDAQ 100** | NASDAQ | INDEX | USD | 2 | `^NDX` | Top 100 non-financial tech index |
| **S&P 500** | NYSE | INDEX | USD | 2 | `^GSPC` | Standard & Poor's 500 benchmark |
| **Dow Jones** | NYSE | INDEX | USD | 2 | `^DJI` | Dow Jones Industrial Average |
| **Russell 2000** | NYSE | INDEX | USD | 2 | `^RUT` | US small-cap equity benchmark |
| **VIX** | CBOE | INDEX | USD | 2 | `^VIX` | Volatility index |
| **FTSE 100** | LSE | INDEX | GBP | 2 | `^FTSE` | London Stock Exchange benchmark |
| **DAX 40** | XETRA | INDEX | EUR | 2 | `^GDAXI` | Frankfurt Stock Exchange benchmark |
| **CAC 40** | EURONEXT | INDEX | EUR | 2 | `^FCHI` | Euronext Paris benchmark |
| **EURO STOXX 50** | EURONEXT | INDEX | EUR | 2 | `^STOXX50E` | Pan-European blue-chip index |
| **Nikkei 225** | TSE | INDEX | JPY | 0 | `^N225` | Tokyo Stock Exchange benchmark |
| **Hang Seng** | HKEX | INDEX | HKD | 2 | `^HSI` | Hong Kong benchmark |
| **Shanghai Composite** | SSE | INDEX | CNY | 2 | `000001.SS` | Shanghai Stock Exchange benchmark |
| **KOSPI** | KRX | INDEX | KRW | 2 | `^KS11` | Korea Composite Stock Price Index |
| **ASX 200** | ASX | INDEX | AUD | 2 | `^AXJO` | Australian Securities Exchange 200 |
| **GOLD SPOT** | COMEX | COMMODITY | USD | 2 | `GC=F` | US Dollar per Troy Ounce |
| **GOLD MCX** | MCX | COMMODITY | INR | 2 | `GOLDM` / Parity | Indian Rupee per 10 Grams (24 Karat) |
| **SILVER** | COMEX | COMMODITY | USD | 2 | `SI=F` | US Dollar per Troy Ounce |
| **SILVER MCX** | MCX | COMMODITY | INR | 2 | `SILVERM` / Parity | Indian Rupee per 1 Kilogram |
| **BRENT CRUDE** | ICE | COMMODITY | USD | 2 | `BZ=F` | ICE North Sea Brent Crude (USD/bbl) |
| **WTI CRUDE** | NYMEX | COMMODITY | USD | 2 | `CL=F` | NYMEX Light Sweet Crude (USD/bbl) |
| **NATURAL GAS** | NYMEX | COMMODITY | USD | 3 | `NG=F` | Henry Hub Natural Gas (USD/MMBtu) |
| **COPPER** | COMEX | COMMODITY | USD | 4 | `HG=F` | High Grade Copper (USD/lb) |
| **ALUMINIUM** | LME | COMMODITY | USD | 2 | `ALI=F` | London Metal Exchange Cash (USD/tonne) |
| **USD/INR** | FOREX | CURRENCY | INR | 4 | `USDINR=X` | US Dollar to Indian Rupee (4 decimals) |
| **EUR/INR** | FOREX | CURRENCY | INR | 4 | `EURINR=X` | Euro to Indian Rupee (4 decimals) |
| **GBP/INR** | FOREX | CURRENCY | INR | 4 | `GBPINR=X` | British Pound to Indian Rupee (4 decimals) |
| **JPY/INR** | FOREX | CURRENCY | INR | 4 | `JPYINR=X` | Japanese Yen (per 100 JPY) to INR |
| **EUR/USD** | FOREX | CURRENCY | USD | 4 | `EURUSD=X` | Euro to US Dollar |
| **GBP/USD** | FOREX | CURRENCY | USD | 4 | `GBPUSD=X` | British Pound to US Dollar |
| **USD/JPY** | FOREX | CURRENCY | JPY | 2 | `USDJPY=X` | US Dollar to Japanese Yen |
| **DXY** | ICE | CURRENCY | USD | 2 | `DX-Y.NYB` | US Dollar Index |
| **US 10Y YIELD** | BOND | YIELD | USD | 3 | `^TNX` | Scaled by 0.1 (e.g. 44.20 -> 4.420%) |
| **INDIA 10Y YIELD**| RBI | YIELD | INR | 3 | `IN10Y=RR` | Sovereign G-Sec Benchmark Yield |

---

## 3. Disambiguation Rules

### 3.1 Gold: COMEX vs MCX
- **COMEX Gold (`GOLD SPOT`)**: Currency is **USD**, quoted in **Troy Ounces** (1 oz = 31.1035 grams). Typical range: \$2,600 - \$2,800.
- **MCX Gold (`GOLD MCX`)**: Currency is **INR**, quoted in **10 Grams** of 24K Gold. Formula:
  $$\text{Price}_{\text{INR/10g}} = \left( \frac{\text{Price}_{\text{USD/oz}}}{31.1035} \times 10 \times \text{USD/INR} \right) \times (1 + \text{Customs Duty} + \text{AIDC} + \text{GST})$$
  Typical range: ₹75,000 - ₹80,000.
- **Violation Guard**: The system strictly prevents COMEX Gold (\$2,685) from ever being prefixed with `₹` or labeled as MCX Gold.

### 3.2 US 10-Year Treasury Yield (`^TNX`)
- CBOE reports `^TNX` as an index value multiplied by 10 (e.g., `44.20`).
- The resolver applies a deterministic `0.1` scaling factor to yield `4.420%`.
- The frontend formats this with the `%` suffix and basis points (`bps`), never with a currency symbol (`$` or `₹`).
