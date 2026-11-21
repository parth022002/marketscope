"""
MarketScope.io — Universal Global Exchange Registry
Maintains authoritative registry of all supported domestic Indian and international
securities and derivatives exchanges, clearing corporations, and central banks.
Includes MIC codes, country, region, trading sessions, calendars, supported asset classes,
and licensing display classifications.
"""

from dataclasses import dataclass, field
from typing import Sequence


@dataclass(frozen=True)
class TradingHours:
    open_time: str        # Local time "HH:MM"
    close_time: str       # Local time "HH:MM"
    pre_open_time: str | None = None
    post_close_time: str | None = None
    utc_offset: str = "+00:00"


@dataclass(frozen=True)
class ExchangeMetadata:
    exchange_id: str
    name: str
    mic: str
    country: str
    country_code: str
    region: str           # "India", "Americas", "Europe", "Asia-Pacific", "Middle East & Africa"
    trading_currency: str
    settlement_currency: str
    timezone: str
    trading_hours: TradingHours
    asset_classes: list[str]
    data_licensing_status: str  # "LICENSED_DISPLAY", "DELAYED_15M", "EOD_RESTRICTED", "OPEN_ACCESS", "PROPRIETARY"
    website: str
    status: str = "ACTIVE"
    notes: str = ""


# Authoritative Global Exchanges Master Registry
GLOBAL_EXCHANGE_REGISTRY: dict[str, ExchangeMetadata] = {
    # ─── 1. Domestic Indian Exchanges & Authorities ───────────────────────────
    "NSE": ExchangeMetadata(
        exchange_id="NSE",
        name="National Stock Exchange of India",
        mic="XNSE",
        country="India",
        country_code="IN",
        region="India",
        trading_currency="INR",
        settlement_currency="INR",
        timezone="Asia/Kolkata",
        trading_hours=TradingHours(
            open_time="09:15",
            close_time="15:30",
            pre_open_time="09:00",
            post_close_time="16:00",
            utc_offset="+05:30",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "FUTURE", "OPTION", "CURRENCY", "DEBT", "REIT", "INVIT"],
        data_licensing_status="LICENSED_DISPLAY",
        website="https://www.nseindia.com",
        notes="Primary domestic equity & derivatives liquidity center in India.",
    ),
    "BSE": ExchangeMetadata(
        exchange_id="BSE",
        name="BSE Limited",
        mic="XBOM",
        country="India",
        country_code="IN",
        region="India",
        trading_currency="INR",
        settlement_currency="INR",
        timezone="Asia/Kolkata",
        trading_hours=TradingHours(
            open_time="09:15",
            close_time="15:30",
            pre_open_time="09:00",
            post_close_time="16:00",
            utc_offset="+05:30",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "FUTURE", "OPTION", "CURRENCY", "DEBT", "SME", "MUTUAL_FUND"],
        data_licensing_status="LICENSED_DISPLAY",
        website="https://www.bseindia.com",
        notes="Asia's oldest stock exchange, home to S&P BSE SENSEX and StAR MF.",
    ),
    "MCX": ExchangeMetadata(
        exchange_id="MCX",
        name="Multi Commodity Exchange of India",
        mic="XMCX",
        country="India",
        country_code="IN",
        region="India",
        trading_currency="INR",
        settlement_currency="INR",
        timezone="Asia/Kolkata",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="23:30",
            pre_open_time="08:45",
            post_close_time="23:55",
            utc_offset="+05:30",
        ),
        asset_classes=["COMMODITY", "FUTURE", "OPTION"],
        data_licensing_status="LICENSED_DISPLAY",
        website="https://www.mcxindia.com",
        notes="India's leading commodity derivatives exchange for precious metals, energy, and base metals.",
    ),
    "NCDEX": ExchangeMetadata(
        exchange_id="NCDEX",
        name="National Commodity & Derivatives Exchange",
        mic="XNCX",
        country="India",
        country_code="IN",
        region="India",
        trading_currency="INR",
        settlement_currency="INR",
        timezone="Asia/Kolkata",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="17:00",
            utc_offset="+05:30",
        ),
        asset_classes=["COMMODITY", "FUTURE"],
        data_licensing_status="LICENSED_DISPLAY",
        website="https://www.ncdex.com",
        notes="Specialized agricultural commodity futures and options exchange.",
    ),
    "RBI": ExchangeMetadata(
        exchange_id="RBI",
        name="Reserve Bank of India (Debt & Reference Rates)",
        mic="XRBI",
        country="India",
        country_code="IN",
        region="India",
        trading_currency="INR",
        settlement_currency="INR",
        timezone="Asia/Kolkata",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="17:00",
            utc_offset="+05:30",
        ),
        asset_classes=["GOVERNMENT_BOND", "TREASURY_BILL", "CURRENCY", "INTEREST_RATE", "ECONOMIC_INDICATOR"],
        data_licensing_status="OPEN_ACCESS",
        website="https://www.rbi.org.in",
        notes="India's central bank; authoritative source for G-Sec benchmark yields, policy repo rate, and FBIL reference rates.",
    ),
    "AMFI": ExchangeMetadata(
        exchange_id="AMFI",
        name="Association of Mutual Funds in India",
        mic="AMFI",
        country="India",
        country_code="IN",
        region="India",
        trading_currency="INR",
        settlement_currency="INR",
        timezone="Asia/Kolkata",
        trading_hours=TradingHours(
            open_time="00:00",
            close_time="23:59",
            utc_offset="+05:30",
        ),
        asset_classes=["MUTUAL_FUND"],
        data_licensing_status="OPEN_ACCESS",
        website="https://www.amfiindia.com",
        notes="Industry body for mutual funds; primary source for official end-of-day NAVs, scheme master, and AUM statistics.",
    ),
    "INX": ExchangeMetadata(
        exchange_id="INX",
        name="India International Exchange (IFSC) GIFT City",
        mic="XINX",
        country="India",
        country_code="IN",
        region="India",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="Asia/Kolkata",
        trading_hours=TradingHours(
            open_time="04:30",
            close_time="02:30",
            utc_offset="+05:30",
        ),
        asset_classes=["EQUITY", "INDEX", "FUTURE", "OPTION", "DEBT"],
        data_licensing_status="LICENSED_DISPLAY",
        website="https://www.indiainx.com",
        notes="International financial services centre in GIFT City, operating 22 hours across global timezones.",
    ),

    # ─── 2. United States & Americas ─────────────────────────────────────────
    "NYSE": ExchangeMetadata(
        exchange_id="NYSE",
        name="New York Stock Exchange",
        mic="XNYS",
        country="United States",
        country_code="US",
        region="Americas",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="America/New_York",
        trading_hours=TradingHours(
            open_time="09:30",
            close_time="16:00",
            pre_open_time="04:00",
            post_close_time="20:00",
            utc_offset="-05:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "REIT", "DEBT"],
        data_licensing_status="DELAYED_15M",
        website="https://www.nyse.com",
        notes="World's largest equities exchange by market capitalization.",
    ),
    "NASDAQ": ExchangeMetadata(
        exchange_id="NASDAQ",
        name="NASDAQ Stock Market",
        mic="XNAS",
        country="United States",
        country_code="US",
        region="Americas",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="America/New_York",
        trading_hours=TradingHours(
            open_time="09:30",
            close_time="16:00",
            pre_open_time="04:00",
            post_close_time="20:00",
            utc_offset="-05:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF"],
        data_licensing_status="DELAYED_15M",
        website="https://www.nasdaq.com",
        notes="Global benchmark for technology, internet, and mega-cap growth equities.",
    ),
    "CBOE": ExchangeMetadata(
        exchange_id="CBOE",
        name="Chicago Board Options Exchange",
        mic="XCBO",
        country="United States",
        country_code="US",
        region="Americas",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="America/Chicago",
        trading_hours=TradingHours(
            open_time="08:30",
            close_time="15:15",
            utc_offset="-06:00",
        ),
        asset_classes=["INDEX", "OPTION", "FUTURE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.cboe.com",
        notes="Creator of the Cboe Volatility Index (VIX) and options exchange.",
    ),
    "CME": ExchangeMetadata(
        exchange_id="CME",
        name="Chicago Mercantile Exchange",
        mic="XCME",
        country="United States",
        country_code="US",
        region="Americas",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="America/Chicago",
        trading_hours=TradingHours(
            open_time="17:00",
            close_time="16:00",
            utc_offset="-06:00",
        ),
        asset_classes=["COMMODITY", "CURRENCY", "FUTURE", "INTEREST_RATE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.cmegroup.com",
        notes="Global derivatives marketplace for equity index futures, agricultural contracts, and interest rates.",
    ),
    "NYMEX": ExchangeMetadata(
        exchange_id="NYMEX",
        name="New York Mercantile Exchange",
        mic="XNYM",
        country="United States",
        country_code="US",
        region="Americas",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="America/New_York",
        trading_hours=TradingHours(
            open_time="18:00",
            close_time="17:00",
            utc_offset="-05:00",
        ),
        asset_classes=["COMMODITY", "FUTURE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.cmegroup.com",
        notes="Benchmark for energy commodities including WTI Crude and Henry Hub Natural Gas.",
    ),
    "COMEX": ExchangeMetadata(
        exchange_id="COMEX",
        name="Commodity Exchange Inc.",
        mic="XCEC",
        country="United States",
        country_code="US",
        region="Americas",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="America/New_York",
        trading_hours=TradingHours(
            open_time="18:00",
            close_time="17:00",
            utc_offset="-05:00",
        ),
        asset_classes=["COMMODITY", "FUTURE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.cmegroup.com",
        notes="Global pricing center for precious metals (Gold, Silver) and Copper.",
    ),
    "BOND": ExchangeMetadata(
        exchange_id="BOND",
        name="US Treasury & Benchmark Debt Markets",
        mic="XBND",
        country="United States",
        country_code="US",
        region="Americas",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="America/New_York",
        trading_hours=TradingHours(
            open_time="08:00",
            close_time="17:00",
            utc_offset="-05:00",
        ),
        asset_classes=["GOVERNMENT_BOND", "TREASURY_BILL", "YIELD_CURVE", "INTEREST_RATE"],
        data_licensing_status="OPEN_ACCESS",
        website="https://home.treasury.gov",
        notes="Benchmark sovereign debt curve including US 1M through 30Y Treasury yields and SOFR.",
    ),
    "TSX": ExchangeMetadata(
        exchange_id="TSX",
        name="Toronto Stock Exchange",
        mic="XTSE",
        country="Canada",
        country_code="CA",
        region="Americas",
        trading_currency="CAD",
        settlement_currency="CAD",
        timezone="America/Toronto",
        trading_hours=TradingHours(
            open_time="09:30",
            close_time="16:00",
            utc_offset="-05:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "COMMODITY"],
        data_licensing_status="DELAYED_15M",
        website="https://www.tsx.com",
        notes="Major global exchange for mining, natural resources, and financial services.",
    ),

    # ─── 3. United Kingdom & Europe ──────────────────────────────────────────
    "LSE": ExchangeMetadata(
        exchange_id="LSE",
        name="London Stock Exchange",
        mic="XLON",
        country="United Kingdom",
        country_code="GB",
        region="Europe",
        trading_currency="GBP",
        settlement_currency="GBP",
        timezone="Europe/London",
        trading_hours=TradingHours(
            open_time="08:00",
            close_time="16:30",
            utc_offset="+00:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "DEBT"],
        data_licensing_status="DELAYED_15M",
        website="https://www.londonstockexchange.com",
        notes="Home to the FTSE 100, FTSE 250, and international depositary receipts.",
    ),
    "ICE": ExchangeMetadata(
        exchange_id="ICE",
        name="Intercontinental Exchange (London/Global)",
        mic="IFEU",
        country="United Kingdom",
        country_code="GB",
        region="Europe",
        trading_currency="USD",
        settlement_currency="USD",
        timezone="Europe/London",
        trading_hours=TradingHours(
            open_time="01:00",
            close_time="23:00",
            utc_offset="+00:00",
        ),
        asset_classes=["COMMODITY", "CURRENCY", "FUTURE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.theice.com",
        notes="Global benchmark venue for Brent Crude Oil, US Dollar Index (DXY), and European emissions.",
    ),
    "XETRA": ExchangeMetadata(
        exchange_id="XETRA",
        name="Deutsche Börse Xetra (Frankfurt)",
        mic="XETR",
        country="Germany",
        country_code="DE",
        region="Europe",
        trading_currency="EUR",
        settlement_currency="EUR",
        timezone="Europe/Berlin",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="17:30",
            utc_offset="+01:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF"],
        data_licensing_status="DELAYED_15M",
        website="https://www.xetra.com",
        notes="German electronic trading venue; benchmark for DAX 40 and European industrial leaders.",
    ),
    "EURONEXT_PARIS": ExchangeMetadata(
        exchange_id="EURONEXT_PARIS",
        name="Euronext Paris",
        mic="XPAR",
        country="France",
        country_code="FR",
        region="Europe",
        trading_currency="EUR",
        settlement_currency="EUR",
        timezone="Europe/Paris",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="17:30",
            utc_offset="+01:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF"],
        data_licensing_status="DELAYED_15M",
        website="https://www.euronext.com",
        notes="French financial center, home to CAC 40 and global luxury conglomerates.",
    ),
    "EURONEXT_AMSTERDAM": ExchangeMetadata(
        exchange_id="EURONEXT_AMSTERDAM",
        name="Euronext Amsterdam",
        mic="XAMS",
        country="Netherlands",
        country_code="NL",
        region="Europe",
        trading_currency="EUR",
        settlement_currency="EUR",
        timezone="Europe/Amsterdam",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="17:30",
            utc_offset="+01:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF"],
        data_licensing_status="DELAYED_15M",
        website="https://www.euronext.com",
        notes="Home to the AEX index and semiconductor equipment leaders.",
    ),
    "SIX_SWISS": ExchangeMetadata(
        exchange_id="SIX_SWISS",
        name="SIX Swiss Exchange (Zurich)",
        mic="XSWX",
        country="Switzerland",
        country_code="CH",
        region="Europe",
        trading_currency="CHF",
        settlement_currency="CHF",
        timezone="Europe/Zurich",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="17:30",
            utc_offset="+01:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "DEBT"],
        data_licensing_status="DELAYED_15M",
        website="https://www.six-group.com",
        notes="Swiss market home to SMI index, pharmaceutical, and private banking bluechips.",
    ),

    # ─── 4. Asia-Pacific ─────────────────────────────────────────────────────
    "TSE": ExchangeMetadata(
        exchange_id="TSE",
        name="Tokyo Stock Exchange",
        mic="XTKS",
        country="Japan",
        country_code="JP",
        region="Asia-Pacific",
        trading_currency="JPY",
        settlement_currency="JPY",
        timezone="Asia/Tokyo",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="15:30",
            utc_offset="+09:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF"],
        data_licensing_status="DELAYED_15M",
        website="https://www.jpx.co.jp",
        notes="Asia's largest stock exchange; home to Nikkei 225 and TOPIX indices.",
    ),
    "HKEX": ExchangeMetadata(
        exchange_id="HKEX",
        name="Hong Kong Exchanges and Clearing",
        mic="XHKG",
        country="Hong Kong",
        country_code="HK",
        region="Asia-Pacific",
        trading_currency="HKD",
        settlement_currency="HKD",
        timezone="Asia/Hong_Kong",
        trading_hours=TradingHours(
            open_time="09:30",
            close_time="16:00",
            utc_offset="+08:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "FUTURE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.hkex.com.hk",
        notes="International gateway to Chinese equities and Asia tech leaders.",
    ),
    "SSE": ExchangeMetadata(
        exchange_id="SSE",
        name="Shanghai Stock Exchange",
        mic="XSHG",
        country="China",
        country_code="CN",
        region="Asia-Pacific",
        trading_currency="CNY",
        settlement_currency="CNY",
        timezone="Asia/Shanghai",
        trading_hours=TradingHours(
            open_time="09:30",
            close_time="15:00",
            utc_offset="+08:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "DEBT"],
        data_licensing_status="DELAYED_15M",
        website="https://www.sse.com.cn",
        notes="Mainland China's primary exchange, home to the Shanghai Composite.",
    ),
    "SGX": ExchangeMetadata(
        exchange_id="SGX",
        name="Singapore Exchange",
        mic="XSES",
        country="Singapore",
        country_code="SG",
        region="Asia-Pacific",
        trading_currency="SGD",
        settlement_currency="SGD",
        timezone="Asia/Singapore",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="17:00",
            utc_offset="+08:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "REIT", "FUTURE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.sgx.com",
        notes="Southeast Asian financial hub, prominent for international REITs and currency futures.",
    ),
    "KRX": ExchangeMetadata(
        exchange_id="KRX",
        name="Korea Exchange (Seoul)",
        mic="XKRX",
        country="South Korea",
        country_code="KR",
        region="Asia-Pacific",
        trading_currency="KRW",
        settlement_currency="KRW",
        timezone="Asia/Seoul",
        trading_hours=TradingHours(
            open_time="09:00",
            close_time="15:30",
            utc_offset="+09:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "FUTURE"],
        data_licensing_status="DELAYED_15M",
        website="https://www.krx.co.kr",
        notes="Home to KOSPI and world semiconductor/hardware leaders.",
    ),
    "ASX": ExchangeMetadata(
        exchange_id="ASX",
        name="Australian Securities Exchange",
        mic="XASX",
        country="Australia",
        country_code="AU",
        region="Asia-Pacific",
        trading_currency="AUD",
        settlement_currency="AUD",
        timezone="Australia/Sydney",
        trading_hours=TradingHours(
            open_time="10:00",
            close_time="16:00",
            utc_offset="+10:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF", "COMMODITY"],
        data_licensing_status="DELAYED_15M",
        website="https://www.asx.com.au",
        notes="Benchmark for mining, raw materials, and Pacific financial institutions.",
    ),

    # ─── 5. Middle East, Emerging & Specialized ──────────────────────────────
    "TADAWUL": ExchangeMetadata(
        exchange_id="TADAWUL",
        name="Saudi Stock Exchange (Tadawul)",
        mic="XSAU",
        country="Saudi Arabia",
        country_code="SA",
        region="Middle East & Africa",
        trading_currency="SAR",
        settlement_currency="SAR",
        timezone="Asia/Riyadh",
        trading_hours=TradingHours(
            open_time="10:00",
            close_time="15:00",
            utc_offset="+03:00",
        ),
        asset_classes=["EQUITY", "INDEX", "ETF"],
        data_licensing_status="DELAYED_15M",
        website="https://www.saudiexchange.sa",
        notes="Middle East's largest exchange, home to Saudi Aramco.",
    ),
    "B3": ExchangeMetadata(
        exchange_id="B3",
        name="B3 - Brasil, Bolsa, Balcão (São Paulo)",
        mic="BVMF",
        country="Brazil",
        country_code="BR",
        region="Americas",
        trading_currency="BRL",
        settlement_currency="BRL",
        timezone="America/Sao_Paulo",
        trading_hours=TradingHours(
            open_time="10:00",
            close_time="17:00",
            utc_offset="-03:00",
        ),
        asset_classes=["EQUITY", "INDEX", "FUTURE", "COMMODITY"],
        data_licensing_status="DELAYED_15M",
        website="https://www.b3.com.br",
        notes="Latin America's leading stock and derivatives exchange, home to the Ibovespa index.",
    ),
    "FOREX": ExchangeMetadata(
        exchange_id="FOREX",
        name="Global Interbank Foreign Exchange & Reference Venue",
        mic="XFXG",
        country="Global",
        country_code="GL",
        region="Global",
        trading_currency="USD",
        settlement_currency="INR",
        timezone="UTC",
        trading_hours=TradingHours(
            open_time="00:00",
            close_time="23:59",
            utc_offset="+00:00",
        ),
        asset_classes=["CURRENCY"],
        data_licensing_status="OPEN_ACCESS",
        website="https://www.bis.org",
        notes="Global 24/5 FX institutional market and benchmark fixing venue.",
    ),
}


class ExchangeRegistryService:
    """Provides exchange discovery, metadata inspection, and exchange-aware symbol parsing."""

    def __init__(self, registry: dict[str, ExchangeMetadata] | None = None):
        self._registry = registry or GLOBAL_EXCHANGE_REGISTRY

    def get_exchange(self, exchange_id: str) -> ExchangeMetadata | None:
        return self._registry.get(exchange_id.upper().strip())

    def list_exchanges(
        self,
        region: str | None = None,
        country: str | None = None,
        asset_class: str | None = None,
    ) -> list[ExchangeMetadata]:
        results = list(self._registry.values())
        if region:
            results = [e for e in results if e.region.lower() == region.lower()]
        if country:
            results = [e for e in results if e.country.lower() == country.lower() or e.country_code.lower() == country.lower()]
        if asset_class:
            results = [e for e in results if asset_class.upper() in e.asset_classes]
        return results

    def resolve_exchange_from_symbol(self, raw_symbol: str) -> tuple[str, str]:
        """
        Extracts exchange and base symbol cleanly without guesswork.
        E.g. 'RELIANCE:NSE' -> ('RELIANCE', 'NSE')
             'SHOP.TO'      -> ('SHOP', 'TSX')
             'AAPL'         -> ('AAPL', 'NASDAQ')
             'TCS.NS'       -> ('TCS', 'NSE')
        """
        sym = raw_symbol.strip()
        if ":" in sym:
            parts = sym.split(":")
            return parts[0].strip().upper(), parts[1].strip().upper()

        if sym.endswith(".NS"):
            return sym[:-3].upper(), "NSE"
        if sym.endswith(".BO"):
            return sym[:-3].upper(), "BSE"
        if sym.endswith(".TO"):
            return sym[:-3].upper(), "TSX"
        if sym.endswith(".L"):
            return sym[:-2].upper(), "LSE"
        if sym.endswith(".DE"):
            return sym[:-3].upper(), "XETRA"
        if sym.endswith(".PA"):
            return sym[:-3].upper(), "EURONEXT_PARIS"
        if sym.endswith(".T"):
            return sym[:-2].upper(), "TSE"
        if sym.endswith(".HK"):
            return sym[:-3].upper(), "HKEX"
        if sym.endswith(".SS"):
            return sym[:-3].upper(), "SSE"
        if sym.endswith(".AX"):
            return sym[:-3].upper(), "ASX"

        # Default mapping for known symbols
        upper = sym.upper()
        if upper in ("NIFTY 50", "NIFTY NEXT 50", "NIFTY BANK", "NIFTY IT", "NIFTY MIDCAP 100", "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "BHARTIARTL", "LT", "TATAMOTORS"):
            return upper, "NSE"
        if upper in ("SENSEX", "BSE 100", "BSE 500"):
            return upper, "BSE"
        if upper in ("GOLD SPOT", "SILVER", "COPPER"):
            return upper, "COMEX"
        if upper in ("BRENT CRUDE", "DXY"):
            return upper, "ICE"
        if upper in ("WTI CRUDE", "NATURAL GAS"):
            return upper, "NYMEX"
        if "/" in upper or upper in ("USD/INR", "EUR/INR", "EUR/USD", "GBP/USD"):
            return upper, "FOREX"
        if upper in ("NASDAQ 100", "NASDAQ COMPOSITE", "AAPL", "NVDA", "MSFT", "GOOGL"):
            return upper, "NASDAQ"
        if upper in ("S&P 500", "DOW JONES", "RUSSELL 2000"):
            return upper, "NYSE"
        if upper == "VIX":
            return upper, "CBOE"
        if upper in ("US 10Y YIELD", "US 2Y YIELD"):
            return upper, "BOND"
        if upper in ("INDIA 10Y YIELD", "INDIA REPO RATE"):
            return upper, "RBI"

        return upper, "NSE"


# Global singleton instance
exchange_registry = ExchangeRegistryService()
