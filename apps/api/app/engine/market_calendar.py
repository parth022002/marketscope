"""
MarketScope.io — Authoritative Global Market Calendar & Status Intelligence Engine
Provides real-time session calculations, authoritative exchange operating hours,
granular holiday classification (trading vs settlement vs banking vs commodity),
special sessions (Muhurat trading), and economic/corporate catalyst tracking.
"""

from datetime import datetime, date, time, timezone, timedelta
from typing import NamedTuple, Sequence
from zoneinfo import ZoneInfo

from app.domain.canonical_calendar import (
    MarketStatus,
    HolidayCategory,
    EventImportance,
    EventCategory,
    MarketSessionInfo,
    CalendarHolidayRecord,
    EconomicCorporateEventRecord,
    GlobalMarketStatusSummary,
    CalendarUserPreferences,
)


# ─────────────────────────────────────────────────────────────────────────────
# Backward compatibility NamedTuple and Timezone Offsets for legacy imports
# ─────────────────────────────────────────────────────────────────────────────

IST_OFFSET = timezone(timedelta(hours=5, minutes=30))
EST_OFFSET = timezone(timedelta(hours=-5))

class SessionState(NamedTuple):
    market_status: str       # "OPEN", "CLOSED", "PRE_OPEN", "POST_CLOSE", "PRE_MARKET", "AFTER_HOURS", "HOLIDAY"
    is_regular_trading: bool
    session_label: str       # Human-readable session name
    effective_data_status: str # "LIVE", "DELAYED_15M", "CLOSED", "EOD"


# ─────────────────────────────────────────────────────────────────────────────
# 1. Authoritative 2026-2027 Holiday Master Database
# ─────────────────────────────────────────────────────────────────────────────

CANONICAL_HOLIDAYS: list[CalendarHolidayRecord] = [
    # ── Domestic Indian Exchanges (NSE / BSE / MCX / RBI) ──────────────────────
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-01",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Republic Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-01-26",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT", "COMMODITY"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="National holiday celebrating the Constitution of India. All Indian exchanges and commercial banks closed.",
        source="NSE Official Holiday Circular / Gazette of India",
        source_url="https://www.nseindia.com/resources/exchange-communication-circulars",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-02",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Mahashivratri",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-02-16",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Public holiday. NSE/BSE cash and derivatives closed. MCX evening session open from 17:00 IST.",
        source="NSE Trading Holidays Schedule",
        source_url="https://www.nseindia.com/products-services/equity-market-trading-holidays",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-03",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="MCX",
        event_name="Mahashivratri (Morning Session Closed)",
        category=HolidayCategory.COMMODITY_HOLIDAY,
        holiday_date="2026-02-16",
        start_time_local="09:00",
        end_time_local="17:00",
        timezone="Asia/Kolkata",
        affected_asset_classes=["COMMODITY"],
        trading_status="PARTIAL",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="MCX morning session closed (09:00–17:00 IST). Evening session open (17:00–23:30 IST).",
        source="MCX Official Trading Holidays Calendar",
        source_url="https://www.mcxindia.com/trade-holidays",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-04",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Holi",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-03-04",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Festival of Colors. Full trading holiday across NSE and BSE equity/derivatives segments.",
        source="NSE Trading Holidays Schedule",
        source_url="https://www.nseindia.com/products-services/equity-market-trading-holidays",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-05",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="RBI",
        event_name="Annual Bank Closing (RBI / Commercial Banks)",
        category=HolidayCategory.BANKING_HOLIDAY,
        holiday_date="2026-04-01",
        timezone="Asia/Kolkata",
        affected_asset_classes=["DEBT", "BANKING_CLEARING"],
        trading_status="OPEN", # Stock exchanges remain OPEN on April 1!
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Annual closing of bank accounts under NI Act. NSE/BSE equity trading remains fully OPEN, but RTGS/NEFT settlement is suspended.",
        source="Reserve Bank of India Bank Holidays Schedule",
        source_url="https://www.rbi.org.in/Scripts/HolidayMatrixDisplay.aspx",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-06",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Good Friday",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-04-03",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT", "COMMODITY"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Good Friday public holiday. All Indian and major Western exchanges closed.",
        source="NSE Trading Holidays Schedule",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-07",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Dr. B.R. Ambedkar Jayanti",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-04-14",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Ambedkar Jayanti national holiday. NSE, BSE, and banking institutions closed.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-08",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Maharashtra Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-05-01",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="State formation day of Maharashtra. Exchange headquarters closed.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-09",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Bakri Id / Eid-ul-Adha",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-05-28",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Gazetted holiday. All Indian exchange cash & derivatives segments closed.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-10",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Muharram",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-06-26",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Religious holiday. Exchange and clearing corporations closed.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-11",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Independence Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-08-15",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="National Independence Day celebration. Falls on Saturday.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-12",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Mahatma Gandhi Jayanti",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-10-02",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT", "COMMODITY"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="National holiday honoring Mahatma Gandhi. Complete closure of Indian capital markets.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-13",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Dussehra",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-10-20",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Vijayadashami / Dussehra holiday. Cash, derivatives, and fixed-income closed.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-14",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Diwali Laxmi Pujan (Muhurat Trading)",
        category=HolidayCategory.SPECIAL_SESSION,
        holiday_date="2026-11-08",
        start_time_local="18:15",
        end_time_local="19:15",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES"],
        trading_status="PARTIAL",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Auspicious 1-hour Diwali Muhurat Trading session marking the commencement of Samvat 2083. Regular daytime session closed.",
        source="NSE Special Session Announcement Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        is_special_session=True,
        special_session_hours="18:15–19:15 IST",
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-15",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Diwali Balipratipada",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-11-09",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Diwali post-festival exchange holiday.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-16",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Gurunanak Jayanti",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-11-24",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Gurunanak Prakash Parv. Exchange and banking holiday.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="IN-HOL-2026-17",
        country="India",
        country_code="IN",
        market="DOMESTIC_INDIA",
        exchange="NSE",
        event_name="Christmas",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-12-25",
        timezone="Asia/Kolkata",
        affected_asset_classes=["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT", "COMMODITY"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Christmas Day national holiday. Global and domestic markets closed.",
        source="NSE Official Circular",
        source_url="https://www.nseindia.com",
        effective_year=2026,
        last_verified_at="2026-01-10T00:00:00Z",
    ),

    # ── United States Exchanges (NYSE / NASDAQ) ──────────────────────────────
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-01",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="New Year's Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-01-01",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. NYSE, NASDAQ, and US bond markets closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-02",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Martin Luther King Jr. Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-01-19",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. US exchanges closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-03",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Washington's Birthday (Presidents Day)",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-02-16",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. US exchanges closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-04",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Good Friday",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-04-03",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Good Friday holiday. US equity markets closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-05",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Memorial Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-05-25",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. All US markets closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-06",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Juneteenth National Independence Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-06-19",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. US cash and derivatives exchanges closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-07",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Independence Day (Observed)",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-07-03",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="US Independence Day observed holiday. Markets closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-08",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Labor Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-09-07",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. US exchanges closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-09",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Thanksgiving Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-11-26",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. Markets closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="US-HOL-2026-10",
        country="United States",
        country_code="US",
        market="US_EQUITIES",
        exchange="NYSE",
        event_name="Christmas Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-12-25",
        timezone="America/New_York",
        affected_asset_classes=["EQUITY", "OPTION", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Federal holiday. US exchanges closed.",
        source="NYSE Holidays and Trading Hours",
        source_url="https://www.nyse.com/markets/hours-calendars",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),

    # ── United Kingdom (London Stock Exchange) ──────────────────────────────
    CalendarHolidayRecord(
        holiday_id="UK-HOL-2026-01",
        country="United Kingdom",
        country_code="GB",
        market="EUROPEAN_MARKETS",
        exchange="LSE",
        event_name="New Year's Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-01-01",
        timezone="Europe/London",
        affected_asset_classes=["EQUITY", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Bank holiday. London Stock Exchange closed.",
        source="London Stock Exchange Business Days Schedule",
        source_url="https://www.londonstockexchange.com",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="UK-HOL-2026-02",
        country="United Kingdom",
        country_code="GB",
        market="EUROPEAN_MARKETS",
        exchange="LSE",
        event_name="Easter Monday",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-04-06",
        timezone="Europe/London",
        affected_asset_classes=["EQUITY", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Bank holiday. LSE and European banking networks closed.",
        source="London Stock Exchange Business Days Schedule",
        source_url="https://www.londonstockexchange.com",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="UK-HOL-2026-03",
        country="United Kingdom",
        country_code="GB",
        market="EUROPEAN_MARKETS",
        exchange="LSE",
        event_name="Early May Bank Holiday",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-05-04",
        timezone="Europe/London",
        affected_asset_classes=["EQUITY", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="UK Bank holiday. LSE closed.",
        source="London Stock Exchange Business Days Schedule",
        source_url="https://www.londonstockexchange.com",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="UK-HOL-2026-04",
        country="United Kingdom",
        country_code="GB",
        market="EUROPEAN_MARKETS",
        exchange="LSE",
        event_name="Summer Bank Holiday",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-08-31",
        timezone="Europe/London",
        affected_asset_classes=["EQUITY", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="UK Bank holiday. LSE closed.",
        source="London Stock Exchange Business Days Schedule",
        source_url="https://www.londonstockexchange.com",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="UK-HOL-2026-05",
        country="United Kingdom",
        country_code="GB",
        market="EUROPEAN_MARKETS",
        exchange="LSE",
        event_name="Boxing Day (Observed)",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-12-28",
        timezone="Europe/London",
        affected_asset_classes=["EQUITY", "BOND"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Boxing Day observed. LSE closed.",
        source="London Stock Exchange Business Days Schedule",
        source_url="https://www.londonstockexchange.com",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),

    # ── Japan (Tokyo Stock Exchange / JPX) ───────────────────────────────────
    CalendarHolidayRecord(
        holiday_id="JP-HOL-2026-01",
        country="Japan",
        country_code="JP",
        market="ASIA_PACIFIC",
        exchange="TSE",
        event_name="Coming of Age Day",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-01-12",
        timezone="Asia/Tokyo",
        affected_asset_classes=["EQUITY", "FUTURES", "BONDS"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="National holiday. Tokyo Stock Exchange and JPX derivatives closed.",
        source="Japan Exchange Group (JPX) Holiday Schedule",
        source_url="https://www.jpx.co.jp/english/corporate/calendar",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="JP-HOL-2026-02",
        country="Japan",
        country_code="JP",
        market="ASIA_PACIFIC",
        exchange="TSE",
        event_name="Emperor's Birthday",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-02-23",
        timezone="Asia/Tokyo",
        affected_asset_classes=["EQUITY", "FUTURES"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="National holiday. TSE closed.",
        source="Japan Exchange Group Calendar",
        source_url="https://www.jpx.co.jp",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
    CalendarHolidayRecord(
        holiday_id="JP-HOL-2026-03",
        country="Japan",
        country_code="JP",
        market="ASIA_PACIFIC",
        exchange="TSE",
        event_name="Golden Week (Children's Day)",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-05-05",
        timezone="Asia/Tokyo",
        affected_asset_classes=["EQUITY", "FUTURES"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Golden Week holiday string. TSE closed.",
        source="Japan Exchange Group Calendar",
        source_url="https://www.jpx.co.jp",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),

    # ── Hong Kong (HKEX) ─────────────────────────────────────────────────────
    CalendarHolidayRecord(
        holiday_id="HK-HOL-2026-01",
        country="Hong Kong",
        country_code="HK",
        market="ASIA_PACIFIC",
        exchange="HKEX",
        event_name="Lunar New Year",
        category=HolidayCategory.EXCHANGE_HOLIDAY,
        holiday_date="2026-02-17",
        timezone="Asia/Hong_Kong",
        affected_asset_classes=["EQUITY", "DERIVATIVES"],
        trading_status="CLOSED",
        settlement_status="CLOSED",
        banking_status="CLOSED",
        description="Lunar New Year Spring Festival. HKEX cash and Northbound/Southbound Stock Connect closed.",
        source="HKEX Trading Calendar",
        source_url="https://www.hkex.com.hk/News/HKEX-Calendar",
        effective_year=2026,
        last_verified_at="2026-01-01T00:00:00Z",
    ),
]


# ─────────────────────────────────────────────────────────────────────────────
# 2. Authoritative Economic & Corporate Catalyst Events (2026–2027)
# ─────────────────────────────────────────────────────────────────────────────

CANONICAL_CATALYST_EVENTS: list[EconomicCorporateEventRecord] = [
    # ── Macro & Central Bank Rate Decisions ──────────────────────────────────
    EconomicCorporateEventRecord(
        event_id="CAT-MACRO-001",
        title="RBI Monetary Policy Committee (MPC) Decision",
        event_type=EventCategory.CENTRAL_BANK,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2026-12-04T04:30:00Z",
        event_time_local="10:00 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="6.25%",
        previous="6.50%",
        unit="Repo Rate %",
        source="Reserve Bank of India Monetary Policy Department",
        source_url="https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
        importance=EventImportance.HIGH,
        notes="Key benchmark policy repo rate decision with liquidity and inflation trajectory outlook.",
        publication_status="SCHEDULED",
        affected_sectors=["Banking", "Financial Services", "Real Estate", "Automotive"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-MACRO-002",
        title="US Federal Reserve FOMC Interest Rate Decision",
        event_type=EventCategory.CENTRAL_BANK,
        country="United States",
        country_code="US",
        currency="USD",
        event_time_utc="2026-12-16T19:00:00Z",
        event_time_local="14:00 EST",
        timezone="America/New_York",
        actual=None,
        forecast="4.25%–4.50%",
        previous="4.50%–4.75%",
        unit="Fed Funds Target Range",
        source="Board of Governors of the Federal Reserve System",
        source_url="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
        importance=EventImportance.HIGH,
        notes="FOMC statement, Summary of Economic Projections (Dot Plot), and press conference.",
        publication_status="SCHEDULED",
        affected_sectors=["Information Technology", "Global Banking", "Commodities", "Emerging Market Currencies"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-MACRO-003",
        title="India Consumer Price Index (CPI) Inflation",
        event_type=EventCategory.INFLATION,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2026-12-12T12:00:00Z",
        event_time_local="17:30 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="4.80%",
        previous="5.10%",
        unit="YoY %",
        source="Ministry of Statistics and Programme Implementation (MOSPI)",
        source_url="https://www.mospi.gov.in",
        importance=EventImportance.HIGH,
        notes="Headline retail inflation figures tracked by RBI for headline MPC inflation targeting.",
        publication_status="SCHEDULED",
        affected_sectors=["FMCG", "Consumer Discretionary", "Banking"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-MACRO-004",
        title="US Consumer Price Index (CPI) YoY",
        event_type=EventCategory.INFLATION,
        country="United States",
        country_code="US",
        currency="USD",
        event_time_utc="2026-12-10T13:30:00Z",
        event_time_local="08:30 EST",
        timezone="America/New_York",
        actual=None,
        forecast="2.60%",
        previous="2.70%",
        unit="YoY %",
        source="US Bureau of Labor Statistics (BLS)",
        source_url="https://www.bls.gov/cpi/",
        importance=EventImportance.HIGH,
        notes="Headline and Core CPI gauge consumer price dynamics prior to FOMC meeting.",
        publication_status="SCHEDULED",
        affected_sectors=["Technology", "Treasuries", "Currencies"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-MACRO-005",
        title="India Q2 Gross Domestic Product (GDP)",
        event_type=EventCategory.MACRO,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2026-11-30T12:00:00Z",
        event_time_local="17:30 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="6.80%",
        previous="6.70%",
        unit="YoY Growth %",
        source="National Statistical Office (NSO)",
        source_url="https://www.mospi.gov.in",
        importance=EventImportance.HIGH,
        notes="Real Gross Domestic Product quarterly print reflecting economic momentum.",
        publication_status="SCHEDULED",
        affected_sectors=["Manufacturing", "Infrastructure", "Services", "Banking"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-MACRO-006",
        title="European Central Bank (ECB) Monetary Policy Decision",
        event_type=EventCategory.CENTRAL_BANK,
        country="Eurozone",
        country_code="EU",
        currency="EUR",
        event_time_utc="2026-12-17T13:15:00Z",
        event_time_local="14:15 CET",
        timezone="Europe/Berlin",
        actual=None,
        forecast="3.00%",
        previous="3.25%",
        unit="Deposit Facility Rate %",
        source="European Central Bank (ECB)",
        source_url="https://www.ecb.europa.eu",
        importance=EventImportance.HIGH,
        notes="Key euro area policy rates and economic outlook statement.",
        publication_status="SCHEDULED",
        affected_sectors=["European Banking", "Export Sectors", "Forex (EUR/USD)"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),

    # ── Corporate Earnings Catalysts ─────────────────────────────────────────
    EconomicCorporateEventRecord(
        event_id="CAT-CORP-001",
        title="Reliance Industries Q3 FY26 Earnings Board Meeting",
        event_type=EventCategory.EARNINGS,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2027-01-18T10:30:00Z",
        event_time_local="16:00 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="₹19,850 Cr Net Profit",
        previous="₹19,323 Cr Net Profit",
        unit="Consolidated PAT",
        source="BSE/NSE Corporate Announcements Filing",
        source_url="https://www.nseindia.com/companies-listing/corporate-filings-announcements",
        importance=EventImportance.HIGH,
        symbol="NSE:RELIANCE",
        company_name="Reliance Industries Ltd",
        notes="Quarterly financial results covering Oil-to-Chemicals (O2C), Jio Infocomm, and Reliance Retail.",
        publication_status="SCHEDULED",
        affected_sectors=["Energy", "Telecom", "Retail"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-CORP-002",
        title="Tata Consultancy Services (TCS) Q3 FY26 Results",
        event_type=EventCategory.EARNINGS,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2027-01-09T10:00:00Z",
        event_time_local="15:30 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="₹12,450 Cr Net Profit",
        previous="₹11,909 Cr Net Profit",
        unit="Consolidated PAT",
        source="NSE Corporate Filings",
        source_url="https://www.nseindia.com",
        importance=EventImportance.HIGH,
        symbol="NSE:TCS",
        company_name="Tata Consultancy Services Ltd",
        notes="First of India Tier-1 IT earnings, setting deal total contract value (TCV) benchmark.",
        publication_status="SCHEDULED",
        affected_sectors=["Information Technology", "Digital Services"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-CORP-003",
        title="HDFC Bank Q3 FY26 Earnings & NIM Update",
        event_type=EventCategory.EARNINGS,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2027-01-16T08:30:00Z",
        event_time_local="14:00 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="₹17,200 Cr Net Profit",
        previous="₹16,821 Cr Net Profit",
        unit="Consolidated PAT",
        source="BSE Corporate Announcements",
        source_url="https://www.bseindia.com",
        importance=EventImportance.HIGH,
        symbol="NSE:HDFCBANK",
        company_name="HDFC Bank Ltd",
        notes="Key financial metrics: Net Interest Margin (NIM), credit-deposit ratio, and gross NPA ratio.",
        publication_status="SCHEDULED",
        affected_sectors=["Banking", "Financial Services"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-CORP-004",
        title="Infosys Ltd Q3 FY26 Earnings & Constant Currency Guidance",
        event_type=EventCategory.EARNINGS,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2027-01-11T10:15:00Z",
        event_time_local="15:45 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="₹6,600 Cr Net Profit",
        previous="₹6,506 Cr Net Profit",
        unit="Consolidated PAT",
        source="NSE Filings",
        source_url="https://www.nseindia.com",
        importance=EventImportance.HIGH,
        symbol="NSE:INFY",
        company_name="Infosys Ltd",
        notes="Full-year revenue guidance in constant currency and operating margin band.",
        publication_status="SCHEDULED",
        affected_sectors=["Information Technology"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
    EconomicCorporateEventRecord(
        event_id="CAT-CORP-005",
        title="Tata Motors Commercial & Passenger Vehicle Sales Update",
        event_type=EventCategory.CORPORATE_ACTION,
        country="India",
        country_code="IN",
        currency="INR",
        event_time_utc="2026-12-01T04:30:00Z",
        event_time_local="10:00 IST",
        timezone="Asia/Kolkata",
        actual=None,
        forecast="78,500 Units Total Domestic",
        previous="76,800 Units",
        unit="Monthly Volumes",
        source="BSE Corporate Announcements",
        source_url="https://www.bseindia.com",
        importance=EventImportance.MEDIUM,
        symbol="NSE:TATAMOTORS",
        company_name="Tata Motors Ltd",
        notes="Monthly wholesale dispatches for commercial, passenger, and electric vehicle divisions.",
        publication_status="SCHEDULED",
        affected_sectors=["Automotive", "Electric Mobility"],
        last_verified_at="2026-11-20T00:00:00Z",
    ),
]


# ─────────────────────────────────────────────────────────────────────────────
# 3. Market Schedule Definitions & Real-Time Calculation Logic
# ─────────────────────────────────────────────────────────────────────────────

EXCHANGE_CONFIGS = {
    "NSE": {
        "name": "National Stock Exchange of India",
        "mic": "XNSE",
        "country": "India",
        "country_code": "IN",
        "region": "India",
        "tz_name": "Asia/Kolkata",
        "pre_market_start": time(9, 0),
        "pre_market_end": time(9, 15),
        "market_open": time(9, 15),
        "market_close": time(15, 30),
        "post_close_start": time(15, 40),
        "post_close_end": time(16, 0),
        "has_break": False,
        "asset_classes": ["EQUITY", "DERIVATIVES", "CURRENCY", "DEBT", "ETF"],
    },
    "BSE": {
        "name": "BSE Limited",
        "mic": "XBOM",
        "country": "India",
        "country_code": "IN",
        "region": "India",
        "tz_name": "Asia/Kolkata",
        "pre_market_start": time(9, 0),
        "pre_market_end": time(9, 15),
        "market_open": time(9, 15),
        "market_close": time(15, 30),
        "post_close_start": time(15, 40),
        "post_close_end": time(16, 0),
        "has_break": False,
        "asset_classes": ["EQUITY", "DERIVATIVES", "MUTUAL_FUNDS", "SME"],
    },
    "MCX": {
        "name": "Multi Commodity Exchange of India",
        "mic": "XMCX",
        "country": "India",
        "country_code": "IN",
        "region": "India",
        "tz_name": "Asia/Kolkata",
        "pre_market_start": time(8, 45),
        "pre_market_end": time(9, 0),
        "market_open": time(9, 0),
        "market_close": time(23, 30),
        "post_close_start": None,
        "post_close_end": None,
        "has_break": False,
        "asset_classes": ["COMMODITIES", "METALS", "ENERGY", "AGRICULTURE"],
    },
    "NYSE": {
        "name": "New York Stock Exchange",
        "mic": "XNYS",
        "country": "United States",
        "country_code": "US",
        "region": "Americas",
        "tz_name": "America/New_York",
        "pre_market_start": time(4, 0),
        "pre_market_end": time(9, 30),
        "market_open": time(9, 30),
        "market_close": time(16, 0),
        "post_close_start": time(16, 0),
        "post_close_end": time(20, 0),
        "has_break": False,
        "asset_classes": ["EQUITY", "ETF", "BONDS"],
    },
    "NASDAQ": {
        "name": "NASDAQ Stock Market",
        "mic": "XNAS",
        "country": "United States",
        "country_code": "US",
        "region": "Americas",
        "tz_name": "America/New_York",
        "pre_market_start": time(4, 0),
        "pre_market_end": time(9, 30),
        "market_open": time(9, 30),
        "market_close": time(16, 0),
        "post_close_start": time(16, 0),
        "post_close_end": time(20, 0),
        "has_break": False,
        "asset_classes": ["EQUITY", "ETF", "DERIVATIVES"],
    },
    "LSE": {
        "name": "London Stock Exchange",
        "mic": "XLON",
        "country": "United Kingdom",
        "country_code": "GB",
        "region": "Europe",
        "tz_name": "Europe/London",
        "pre_market_start": time(7, 50),
        "pre_market_end": time(8, 0),
        "market_open": time(8, 0),
        "market_close": time(16, 30),
        "post_close_start": time(16, 30),
        "post_close_end": time(17, 15),
        "has_break": False,
        "asset_classes": ["EQUITY", "FIXED_INCOME", "ETF"],
    },
    "TSE": {
        "name": "Tokyo Stock Exchange (JPX)",
        "mic": "XJPX",
        "country": "Japan",
        "country_code": "JP",
        "region": "Asia-Pacific",
        "tz_name": "Asia/Tokyo",
        "pre_market_start": time(8, 0),
        "pre_market_end": time(9, 0),
        "market_open": time(9, 0),
        "market_close": time(15, 30),
        "break_start": time(11, 30),
        "break_end": time(12, 30),
        "has_break": True,
        "post_close_start": None,
        "post_close_end": None,
        "asset_classes": ["EQUITY", "INDEX_FUTURES", "JGB"],
    },
    "HKEX": {
        "name": "Hong Kong Exchanges and Clearing",
        "mic": "XHKG",
        "country": "Hong Kong",
        "country_code": "HK",
        "region": "Asia-Pacific",
        "tz_name": "Asia/Hong_Kong",
        "pre_market_start": time(9, 0),
        "pre_market_end": time(9, 30),
        "market_open": time(9, 30),
        "market_close": time(16, 0),
        "break_start": time(12, 0),
        "break_end": time(13, 0),
        "has_break": True,
        "post_close_start": time(16, 0),
        "post_close_end": time(16, 10),
        "asset_classes": ["EQUITY", "DERIVATIVES", "STOCK_CONNECT"],
    },
    "XETRA": {
        "name": "Deutsche Börse Xetra",
        "mic": "XETR",
        "country": "Germany",
        "country_code": "DE",
        "region": "Europe",
        "tz_name": "Europe/Berlin",
        "pre_market_start": time(8, 0),
        "pre_market_end": time(9, 0),
        "market_open": time(9, 0),
        "market_close": time(17, 30),
        "post_close_start": time(17, 30),
        "post_close_end": time(17, 35),
        "has_break": False,
        "asset_classes": ["EQUITY", "ETF", "BONDS"],
    },
    "ASX": {
        "name": "Australian Securities Exchange",
        "mic": "XASX",
        "country": "Australia",
        "country_code": "AU",
        "region": "Asia-Pacific",
        "tz_name": "Australia/Sydney",
        "pre_market_start": time(7, 0),
        "pre_market_end": time(10, 0),
        "market_open": time(10, 0),
        "market_close": time(16, 0),
        "post_close_start": time(16, 0),
        "post_close_end": time(16, 12),
        "has_break": False,
        "asset_classes": ["EQUITY", "FUTURES", "OPTIONS"],
    },
}


class GlobalMarketCalendarEngine:
    def __init__(self):
        self._user_preferences: dict[str, CalendarUserPreferences] = {}

    def get_market_session(
        self,
        market_id: str,
        now_utc: datetime | None = None,
        user_timezone: str | None = None,
    ) -> MarketSessionInfo:
        """
        Calculates exact real-time session state for an exchange given its authoritative schedule,
        local IANA timezone, lunch breaks, and holiday registry.
        """
        if now_utc is None:
            now_utc = datetime.now(timezone.utc)

        key = market_id.upper().strip()
        config = EXCHANGE_CONFIGS.get(key)
        if not config:
            config = EXCHANGE_CONFIGS["NSE"]
            key = "NSE"

        tz = ZoneInfo(config["tz_name"])
        local_dt = now_utc.astimezone(tz)
        local_date = local_dt.date()
        local_time = local_dt.time()
        weekday = local_dt.weekday() # 0 = Mon, 6 = Sun

        date_iso = local_date.isoformat()

        # Check for holiday today
        holiday_today_rec = next(
            (
                h for h in CANONICAL_HOLIDAYS
                if h.exchange == key and h.holiday_date == date_iso
            ),
            None,
        )

        is_trading_day = weekday < 5 and not (
            holiday_today_rec and holiday_today_rec.trading_status == "CLOSED"
        )

        status = MarketStatus.CLOSED
        session_label = "Market Closed"
        effective_data = "EOD"
        is_regular = False
        holiday_today = False
        holiday_name = None
        special_session_today = False
        special_session_notes = None

        # Special session check takes priority over standard weekend rule (e.g. Diwali Muhurat Trading on weekend)
        if holiday_today_rec and holiday_today_rec.category == HolidayCategory.SPECIAL_SESSION:
            special_session_today = True
            special_session_notes = holiday_today_rec.description
            if holiday_today_rec.start_time_local and holiday_today_rec.end_time_local:
                sh, sm = map(int, holiday_today_rec.start_time_local.split(":"))
                eh, em = map(int, holiday_today_rec.end_time_local.split(":"))
                st_time = time(sh, sm)
                et_time = time(eh, em)
                if st_time <= local_time <= et_time:
                    status = MarketStatus.SPECIAL_SESSION
                    session_label = f"Special Session: {holiday_today_rec.event_name}"
                    is_regular = True
                    effective_data = "LIVE"
                else:
                    status = MarketStatus.CLOSED
                    session_label = f"Special Session Scheduled Today ({holiday_today_rec.special_session_hours})"
                    effective_data = "EOD"
            else:
                status = MarketStatus.SPECIAL_SESSION
                session_label = holiday_today_rec.event_name
        elif weekday in (5, 6):
            status = MarketStatus.CLOSED
            session_label = f"Weekend — {config['name']} Closed"
            effective_data = "EOD"
        elif holiday_today_rec and holiday_today_rec.trading_status == "CLOSED":
            status = MarketStatus.HOLIDAY
            session_label = f"Exchange Holiday: {holiday_today_rec.event_name}"
            holiday_today = True
            holiday_name = holiday_today_rec.event_name
            effective_data = "EOD"
        elif holiday_today_rec and holiday_today_rec.category == HolidayCategory.COMMODITY_HOLIDAY:
            if local_time >= time(17, 0) and local_time <= time(23, 30):
                status = MarketStatus.OPEN
                session_label = "Commodity Evening Session (Live)"
                is_regular = True
                effective_data = "LIVE"
            else:
                status = MarketStatus.HOLIDAY
                session_label = "Morning Session Closed (Evening Session Opens 17:00 IST)"
                effective_data = "EOD"
        else:
            pre_start = config["pre_market_start"]
            pre_end = config["pre_market_end"]
            m_open = config["market_open"]
            m_close = config["market_close"]
            post_start = config.get("post_close_start")
            post_end = config.get("post_close_end")
            has_break = config.get("has_break", False)

            if has_break and config.get("break_start") <= local_time < config.get("break_end"):
                status = MarketStatus.BREAK
                session_label = "Mid-Day Session Break"
                effective_data = "DELAYED_15M"
            elif pre_start and pre_start <= local_time < pre_end:
                status = MarketStatus.PRE_MARKET
                session_label = "Pre-Market Discovery Session"
                effective_data = "DELAYED_15M"
            elif m_open <= local_time < m_close:
                status = MarketStatus.OPEN
                session_label = "Regular Trading Session"
                is_regular = True
                effective_data = "LIVE"
            elif post_start and post_end and post_start <= local_time <= post_end:
                status = MarketStatus.POST_MARKET
                session_label = "Post-Closing Adjustment"
                effective_data = "EOD"
            else:
                status = MarketStatus.CLOSED
                session_label = "Market Closed"
                effective_data = "EOD"

        user_local_str = None
        if user_timezone:
            try:
                user_tz = ZoneInfo(user_timezone)
                user_local_str = now_utc.astimezone(user_tz).strftime("%H:%M:%S")
            except Exception:
                user_local_str = local_dt.strftime("%H:%M:%S")

        return MarketSessionInfo(
            market_id=key,
            market_name=config["name"],
            exchange=key,
            mic=config["mic"],
            country=config["country"],
            country_code=config["country_code"],
            region=config["region"],
            timezone=config["tz_name"],
            status=status,
            session_label=session_label,
            current_local_time=local_dt.strftime("%H:%M:%S"),
            current_utc_time=now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
            user_local_time=user_local_str,
            session_start_local=config["market_open"].strftime("%H:%M"),
            session_end_local=config["market_close"].strftime("%H:%M"),
            is_regular_trading=is_regular,
            is_trading_day=is_trading_day,
            holiday_today=holiday_today,
            holiday_name=holiday_name,
            special_session_today=special_session_today,
            special_session_notes=special_session_notes,
            supported_asset_classes=config["asset_classes"],
            effective_data_status=effective_data,
            source_attribution=f"Authoritative {key} Rules & Schedules",
            last_verified_at="2026-11-22T00:00:00Z",
        )

    def get_all_markets_summary(
        self,
        now_utc: datetime | None = None,
        user_timezone: str | None = None,
    ) -> GlobalMarketStatusSummary:
        """Returns consolidated snapshot of all authoritative global markets."""
        if now_utc is None:
            now_utc = datetime.now(timezone.utc)

        market_keys = ["NSE", "BSE", "MCX", "NYSE", "NASDAQ", "LSE", "TSE", "HKEX", "XETRA", "ASX"]
        sessions = [
            self.get_market_session(k, now_utc=now_utc, user_timezone=user_timezone)
            for k in market_keys
        ]

        open_count = sum(1 for s in sessions if s.status == MarketStatus.OPEN)
        closed_count = len(sessions) - open_count

        now_date_str = now_utc.date().isoformat()
        today_hols = [h for h in CANONICAL_HOLIDAYS if h.holiday_date == now_date_str]
        upcoming_hols = [h for h in CANONICAL_HOLIDAYS if h.holiday_date > now_date_str][:6]

        summary_label = (
            f"{open_count} Global Markets Open"
            if open_count > 0
            else "Global Regular Sessions Closed"
        )

        return GlobalMarketStatusSummary(
            timestamp_utc=now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
            summary_label=summary_label,
            active_open_markets_count=open_count,
            closed_markets_count=closed_count,
            next_major_opening="NSE/BSE (09:15 IST) & TSE (09:00 JST)",
            next_major_closing="US Markets (16:00 EST)",
            markets=sessions,
            today_holidays=today_hols,
            upcoming_holidays=upcoming_hols,
        )

    def get_holidays(
        self,
        year: int | None = 2026,
        country: str | None = None,
        exchange: str | None = None,
        category: str | None = None,
    ) -> list[CalendarHolidayRecord]:
        """Returns filtered holiday records from the canonical database."""
        results = CANONICAL_HOLIDAYS
        if year:
            results = [h for h in results if h.effective_year == year]
        if country and country.lower() != "all":
            results = [h for h in results if h.country.lower() == country.lower()]
        if exchange and exchange.lower() != "all":
            results = [h for h in results if h.exchange.upper() == exchange.upper()]
        if category and category.lower() != "all":
            results = [h for h in results if h.category.value.lower() == category.lower()]
        return results

    def get_catalyst_events(
        self,
        event_type: str | None = None,
        country: str | None = None,
        importance: str | None = None,
        symbol: str | None = None,
        limit: int = 50,
    ) -> list[EconomicCorporateEventRecord]:
        """Filters economic events and corporate earnings."""
        results = CANONICAL_CATALYST_EVENTS
        if event_type and event_type.lower() != "all":
            results = [e for e in results if e.event_type.value.lower() == event_type.lower()]
        if country and country.lower() != "all":
            results = [e for e in results if e.country.lower() == country.lower()]
        if importance and importance.lower() != "all":
            results = [e for e in results if e.importance.value.lower() == importance.lower()]
        if symbol:
            sym_upper = symbol.upper()
            results = [e for e in results if e.symbol and sym_upper in e.symbol.upper()]
        return results[:limit]

    def get_upcoming_catalysts(self, limit: int = 10) -> list[EconomicCorporateEventRecord]:
        """Returns next upcoming catalysts ordered by scheduled date."""
        return sorted(CANONICAL_CATALYST_EVENTS, key=lambda x: x.event_time_utc)[:limit]

    def get_user_preferences(self, user_id: str) -> CalendarUserPreferences:
        """Retrieves user calendar preferences."""
        return self._user_preferences.get(user_id, CalendarUserPreferences(user_id=user_id))

    def save_user_preferences(self, prefs: CalendarUserPreferences) -> CalendarUserPreferences:
        """Persists user calendar preferences."""
        self._user_preferences[prefs.user_id] = prefs
        return prefs


# Global Singleton Instance
market_calendar_engine = GlobalMarketCalendarEngine()


# ─────────────────────────────────────────────────────────────────────────────
# 4. Backward-Compatible Session Helper Functions
# ─────────────────────────────────────────────────────────────────────────────

def get_nse_session_state(now_utc: datetime | None = None) -> SessionState:
    session = market_calendar_engine.get_market_session("NSE", now_utc=now_utc)
    status_str = session.status.value
    if session.status == MarketStatus.PRE_MARKET:
        status_str = "PRE_OPEN"
    return SessionState(
        market_status=status_str,
        is_regular_trading=session.is_regular_trading,
        session_label=session.session_label,
        effective_data_status=session.effective_data_status,
    )


def get_us_session_state(now_utc: datetime | None = None) -> SessionState:
    session = market_calendar_engine.get_market_session("NYSE", now_utc=now_utc)
    return SessionState(
        market_status=session.status.value,
        is_regular_trading=session.is_regular_trading,
        session_label=session.session_label,
        effective_data_status=session.effective_data_status,
    )


def get_mcx_session_state(now_utc: datetime | None = None) -> SessionState:
    session = market_calendar_engine.get_market_session("MCX", now_utc=now_utc)
    return SessionState(
        market_status=session.status.value,
        is_regular_trading=session.is_regular_trading,
        session_label=session.session_label,
        effective_data_status=session.effective_data_status,
    )


def get_forex_session_state(now_utc: datetime | None = None) -> SessionState:
    if now_utc is None:
        now_utc = datetime.now(timezone.utc)
    weekday = now_utc.weekday()
    hour = now_utc.hour
    if weekday == 5 or (weekday == 6 and hour < 22) or (weekday == 4 and hour >= 22):
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="Global Forex Closed",
            effective_data_status="EOD",
        )
    return SessionState(
        market_status="OPEN",
        is_regular_trading=True,
        session_label="Global 24/5 FX Session",
        effective_data_status="LIVE",
    )


def resolve_session_state_for_exchange(exchange: str, now_utc: datetime | None = None) -> SessionState:
    exch = (exchange or "").upper().strip()
    if exch in ("NSE", "BSE", "NIFTY", "SENSEX", "RBI"):
        return get_nse_session_state(now_utc)
    elif exch in ("NASDAQ", "NYSE", "AMEX", "CBOE"):
        return get_us_session_state(now_utc)
    elif exch in ("MCX", "NCDEX"):
        return get_mcx_session_state(now_utc)
    elif exch in ("FOREX", "FX", "ICE", "COMEX", "NYMEX"):
        return get_forex_session_state(now_utc)
    elif exch in ("LSE", "TSE", "HKEX", "XETRA", "ASX"):
        session = market_calendar_engine.get_market_session(exch, now_utc=now_utc)
        return SessionState(
            market_status=session.status.value,
            is_regular_trading=session.is_regular_trading,
            session_label=session.session_label,
            effective_data_status=session.effective_data_status,
        )
    return get_nse_session_state(now_utc)
