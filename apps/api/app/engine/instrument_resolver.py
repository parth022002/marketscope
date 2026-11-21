"""
MarketScope.io — Authoritative Instrument & Exchange Identity Resolver
Provides deterministic resolution across 20 asset classes, disambiguating instruments
by symbol, exchange, country, asset class, ISIN, and vendor-specific tickers.
Prevents cross-exchange mixing (e.g. COMEX Gold vs MCX Gold, WTI vs Brent).
"""

from dataclasses import dataclass
from typing import Sequence
from app.engine.exchange_registry import exchange_registry, GLOBAL_EXCHANGE_REGISTRY
from app.engine.instrument_master import universal_instrument_master, UniversalInstrument


@dataclass(frozen=True)
class ProviderTickerMapping:
    canonical_id: str
    symbol: str
    exchange: str
    asset_class: str
    currency: str
    price_precision: int
    price_unit: str
    yfinance_ticker: str
    twelvedata_ticker: str | None
    fmp_ticker: str | None
    is_yield: bool = False
    yield_multiplier: float = 1.0  # e.g., ^TNX on Yahoo is 10x actual yield


class InstrumentResolver:
    """Authoritative mapping and resolution engine."""

    def __init__(self):
        self._provider_mappings: dict[str, ProviderTickerMapping] = {
            # ─── 1. Indian Indices (NSE & BSE) ────────────────────────────────
            "NIFTY 50": ProviderTickerMapping(
                canonical_id="inst_in_nifty50",
                symbol="NIFTY 50",
                exchange="NSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^NSEI",
                twelvedata_ticker="NIFTY:NSE",
                fmp_ticker="^NSEI",
            ),
            "SENSEX": ProviderTickerMapping(
                canonical_id="inst_in_sensex",
                symbol="SENSEX",
                exchange="BSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^BSESN",
                twelvedata_ticker="SENSEX:BSE",
                fmp_ticker="^BSESN",
            ),
            "NIFTY BANK": ProviderTickerMapping(
                canonical_id="inst_in_niftybank",
                symbol="NIFTY BANK",
                exchange="NSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^NSEBANK",
                twelvedata_ticker="BANKNIFTY:NSE",
                fmp_ticker="^NSEBANK",
            ),
            "NIFTY NEXT 50": ProviderTickerMapping(
                canonical_id="inst_in_niftynext50",
                symbol="NIFTY NEXT 50",
                exchange="NSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^NN50",
                twelvedata_ticker="NIFTYJR:NSE",
                fmp_ticker="^NN50",
            ),
            "NIFTY IT": ProviderTickerMapping(
                canonical_id="inst_in_niftyit",
                symbol="NIFTY IT",
                exchange="NSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^CNXIT",
                twelvedata_ticker="CNXIT:NSE",
                fmp_ticker="^CNXIT",
            ),
            "NIFTY MIDCAP 100": ProviderTickerMapping(
                canonical_id="inst_in_niftymidcap100",
                symbol="NIFTY MIDCAP 100",
                exchange="NSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="NIFTY_MIDCAP_100.NS",
                twelvedata_ticker="MIDCAP:NSE",
                fmp_ticker="NIFTY_MIDCAP_100.NS",
            ),
            "BSE 100": ProviderTickerMapping(
                canonical_id="inst_in_bse100",
                symbol="BSE 100",
                exchange="BSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="BSE-100.BO",
                twelvedata_ticker=None,
                fmp_ticker="BSE-100.BO",
            ),
            "BSE 500": ProviderTickerMapping(
                canonical_id="inst_in_bse500",
                symbol="BSE 500",
                exchange="BSE",
                asset_class="INDEX",
                currency="INR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="BSE-500.BO",
                twelvedata_ticker=None,
                fmp_ticker="BSE-500.BO",
            ),

            # ─── 2. US & International Indices ────────────────────────────────
            "S&P 500": ProviderTickerMapping(
                canonical_id="inst_us_sp500",
                symbol="S&P 500",
                exchange="NYSE",
                asset_class="INDEX",
                currency="USD",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^GSPC",
                twelvedata_ticker="SPX",
                fmp_ticker="^GSPC",
            ),
            "NASDAQ 100": ProviderTickerMapping(
                canonical_id="inst_us_nasdaq100",
                symbol="NASDAQ 100",
                exchange="NASDAQ",
                asset_class="INDEX",
                currency="USD",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^NDX",
                twelvedata_ticker="NDX",
                fmp_ticker="^NDX",
            ),
            "DOW JONES": ProviderTickerMapping(
                canonical_id="inst_us_dowjones",
                symbol="DOW JONES",
                exchange="NYSE",
                asset_class="INDEX",
                currency="USD",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^DJI",
                twelvedata_ticker="DJI",
                fmp_ticker="^DJI",
            ),
            "RUSSELL 2000": ProviderTickerMapping(
                canonical_id="inst_us_russell2000",
                symbol="RUSSELL 2000",
                exchange="NYSE",
                asset_class="INDEX",
                currency="USD",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^RUT",
                twelvedata_ticker="RUT",
                fmp_ticker="^RUT",
            ),
            "VIX": ProviderTickerMapping(
                canonical_id="inst_us_vix",
                symbol="VIX",
                exchange="CBOE",
                asset_class="INDEX",
                currency="USD",
                price_precision=2,
                price_unit="Volatility Index Points",
                yfinance_ticker="^VIX",
                twelvedata_ticker="VIX",
                fmp_ticker="^VIX",
            ),
            "FTSE 100": ProviderTickerMapping(
                canonical_id="inst_uk_ftse100",
                symbol="FTSE 100",
                exchange="LSE",
                asset_class="INDEX",
                currency="GBP",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^FTSE",
                twelvedata_ticker="FTSE",
                fmp_ticker="^FTSE",
            ),
            "DAX 40": ProviderTickerMapping(
                canonical_id="inst_de_dax40",
                symbol="DAX 40",
                exchange="XETRA",
                asset_class="INDEX",
                currency="EUR",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^GDAXI",
                twelvedata_ticker="DAX",
                fmp_ticker="^GDAXI",
            ),
            "NIKKEI 225": ProviderTickerMapping(
                canonical_id="inst_jp_nikkei225",
                symbol="NIKKEI 225",
                exchange="TSE",
                asset_class="INDEX",
                currency="JPY",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^N225",
                twelvedata_ticker="N225",
                fmp_ticker="^N225",
            ),
            "HANG SENG": ProviderTickerMapping(
                canonical_id="inst_hk_hangseng",
                symbol="HANG SENG",
                exchange="HKEX",
                asset_class="INDEX",
                currency="HKD",
                price_precision=2,
                price_unit="Points",
                yfinance_ticker="^HSI",
                twelvedata_ticker="HSI",
                fmp_ticker="^HSI",
            ),

            # ─── 3. Commodities: Disambiguating MCX Domestic vs COMEX/NYMEX ──
            "GOLD MCX": ProviderTickerMapping(
                canonical_id="inst_in_mcx_gold",
                symbol="GOLD MCX",
                exchange="MCX",
                asset_class="COMMODITY",
                currency="INR",
                price_precision=2,
                price_unit="INR / 10g",
                yfinance_ticker="GC=F",  # Converted by domestic parity engine
                twelvedata_ticker=None,
                fmp_ticker=None,
            ),
            "SILVER MCX": ProviderTickerMapping(
                canonical_id="inst_in_mcx_silver",
                symbol="SILVER MCX",
                exchange="MCX",
                asset_class="COMMODITY",
                currency="INR",
                price_precision=2,
                price_unit="INR / 1kg",
                yfinance_ticker="SI=F",
                twelvedata_ticker=None,
                fmp_ticker=None,
            ),
            "GOLD SPOT": ProviderTickerMapping(
                canonical_id="inst_global_gold_spot",
                symbol="GOLD SPOT",
                exchange="COMEX",
                asset_class="COMMODITY",
                currency="USD",
                price_precision=2,
                price_unit="USD / troy oz",
                yfinance_ticker="GC=F",
                twelvedata_ticker="XAU/USD",
                fmp_ticker="GCUSD",
            ),
            "SILVER": ProviderTickerMapping(
                canonical_id="inst_global_silver_spot",
                symbol="SILVER",
                exchange="COMEX",
                asset_class="COMMODITY",
                currency="USD",
                price_precision=2,
                price_unit="USD / troy oz",
                yfinance_ticker="SI=F",
                twelvedata_ticker="XAG/USD",
                fmp_ticker="SIUSD",
            ),
            "BRENT CRUDE": ProviderTickerMapping(
                canonical_id="inst_global_brent_crude",
                symbol="BRENT CRUDE",
                exchange="ICE",
                asset_class="COMMODITY",
                currency="USD",
                price_precision=2,
                price_unit="USD / bbl",
                yfinance_ticker="BZ=F",
                twelvedata_ticker="BRENT",
                fmp_ticker="BZUSD",
            ),
            "WTI CRUDE": ProviderTickerMapping(
                canonical_id="inst_global_wti_crude",
                symbol="WTI CRUDE",
                exchange="NYMEX",
                asset_class="COMMODITY",
                currency="USD",
                price_precision=2,
                price_unit="USD / bbl",
                yfinance_ticker="CL=F",
                twelvedata_ticker="WTI/USD",
                fmp_ticker="CLUSD",
            ),
            "NATURAL GAS": ProviderTickerMapping(
                canonical_id="inst_global_natural_gas",
                symbol="NATURAL GAS",
                exchange="NYMEX",
                asset_class="COMMODITY",
                currency="USD",
                price_precision=3,
                price_unit="USD / MMBtu",
                yfinance_ticker="NG=F",
                twelvedata_ticker="NG/USD",
                fmp_ticker="NGUSD",
            ),
            "COPPER": ProviderTickerMapping(
                canonical_id="inst_global_copper",
                symbol="COPPER",
                exchange="COMEX",
                asset_class="COMMODITY",
                currency="USD",
                price_precision=4,
                price_unit="USD / lb",
                yfinance_ticker="HG=F",
                twelvedata_ticker="COPPER",
                fmp_ticker="HGUSD",
            ),

            # ─── 4. Foreign Exchange (4 Decimals) ─────────────────────────────
            "USD/INR": ProviderTickerMapping(
                canonical_id="inst_fx_usdinr",
                symbol="USD/INR",
                exchange="FOREX",
                asset_class="CURRENCY",
                currency="INR",
                price_precision=4,
                price_unit="INR per USD",
                yfinance_ticker="INR=X",
                twelvedata_ticker="USD/INR",
                fmp_ticker="USDINR",
            ),
            "EUR/INR": ProviderTickerMapping(
                canonical_id="inst_fx_eurinr",
                symbol="EUR/INR",
                exchange="FOREX",
                asset_class="CURRENCY",
                currency="INR",
                price_precision=4,
                price_unit="INR per EUR",
                yfinance_ticker="EURINR=X",
                twelvedata_ticker="EUR/INR",
                fmp_ticker="EURINR",
            ),
            "GBP/INR": ProviderTickerMapping(
                canonical_id="inst_fx_gbpinr",
                symbol="GBP/INR",
                exchange="FOREX",
                asset_class="CURRENCY",
                currency="INR",
                price_precision=4,
                price_unit="INR per GBP",
                yfinance_ticker="GBPINR=X",
                twelvedata_ticker="GBP/INR",
                fmp_ticker="GBPINR",
            ),
            "JPY/INR": ProviderTickerMapping(
                canonical_id="inst_fx_jpyinr",
                symbol="JPY/INR",
                exchange="FOREX",
                asset_class="CURRENCY",
                currency="INR",
                price_precision=4,
                price_unit="INR per 100 JPY",
                yfinance_ticker="JPYINR=X",
                twelvedata_ticker="JPY/INR",
                fmp_ticker="JPYINR",
            ),
            "EUR/USD": ProviderTickerMapping(
                canonical_id="inst_fx_eurusd",
                symbol="EUR/USD",
                exchange="FOREX",
                asset_class="CURRENCY",
                currency="USD",
                price_precision=4,
                price_unit="USD per EUR",
                yfinance_ticker="EURUSD=X",
                twelvedata_ticker="EUR/USD",
                fmp_ticker="EURUSD",
            ),
            "GBP/USD": ProviderTickerMapping(
                canonical_id="inst_fx_gbpusd",
                symbol="GBP/USD",
                exchange="FOREX",
                asset_class="CURRENCY",
                currency="USD",
                price_precision=4,
                price_unit="USD per GBP",
                yfinance_ticker="GBPUSD=X",
                twelvedata_ticker="GBP/USD",
                fmp_ticker="GBPUSD",
            ),
            "DXY": ProviderTickerMapping(
                canonical_id="inst_fx_dxy",
                symbol="DXY",
                exchange="ICE",
                asset_class="CURRENCY",
                currency="USD",
                price_precision=2,
                price_unit="Index Points",
                yfinance_ticker="DX-Y.NYB",
                twelvedata_ticker="DXY",
                fmp_ticker="DX-Y.NYB",
            ),

            # ─── 5. Sovereign Yields (3 Decimals, Normalized Factor) ──────────
            "US 10Y YIELD": ProviderTickerMapping(
                canonical_id="inst_us_treasury_10y",
                symbol="US 10Y YIELD",
                exchange="BOND",
                asset_class="GOVERNMENT_BOND",
                currency="USD",
                price_precision=3,
                price_unit="Percent p.a.",
                yfinance_ticker="^TNX",
                twelvedata_ticker=None,
                fmp_ticker="^TNX",
                is_yield=True,
                yield_multiplier=0.1,  # ^TNX quotes 44.20 for 4.42% yield
            ),
            "INDIA 10Y YIELD": ProviderTickerMapping(
                canonical_id="inst_in_gsec_10y",
                symbol="INDIA 10Y YIELD",
                exchange="RBI",
                asset_class="GOVERNMENT_BOND",
                currency="INR",
                price_precision=3,
                price_unit="Percent p.a.",
                yfinance_ticker="IN10YT=RR",
                twelvedata_ticker=None,
                fmp_ticker=None,
                is_yield=True,
                yield_multiplier=1.0,
            ),
        }

    def resolve(self, symbol: str, exchange: str | None = None) -> ProviderTickerMapping | None:
        sym_clean = symbol.upper().strip()
        mapping = self._provider_mappings.get(sym_clean)
        if mapping:
            return mapping

        # Look up in universal_instrument_master
        inst = universal_instrument_master.get_by_symbol(sym_clean, exchange)
        if inst:
            # Build dynamic mapping
            y_ticker = sym_clean
            if inst.country_code == "IN" and inst.exchange in ("NSE", "BSE"):
                y_ticker = f"{sym_clean}.NS" if inst.exchange == "NSE" else f"{sym_clean}.BO"

            return ProviderTickerMapping(
                canonical_id=inst.instrument_id,
                symbol=inst.symbol,
                exchange=inst.exchange,
                asset_class=inst.asset_class,
                currency=inst.trading_currency,
                price_precision=inst.price_precision,
                price_unit="INR / share" if inst.trading_currency == "INR" else "USD / share",
                yfinance_ticker=y_ticker,
                twelvedata_ticker=sym_clean if inst.country_code == "US" else None,
                fmp_ticker=y_ticker,
            )

        return None


# Global singleton instance
instrument_resolver = InstrumentResolver()
