"""
MarketScope.io — Canonical Market Calendar & Status Intelligence Domain Models
Defines immutable data models for global market sessions, exchange holiday database,
banking closures, economic and corporate events, and user calendar alerts.
"""

from datetime import datetime, date, time
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class MarketStatus(str, Enum):
    PRE_MARKET = "PRE_MARKET"
    OPEN = "OPEN"
    BREAK = "BREAK"                     # Mid-session break (e.g., TSE / HKEX lunch)
    CLOSING_AUCTION = "CLOSING_AUCTION" # Closing auction price formation
    POST_MARKET = "POST_MARKET"         # Post-closing adjustment / after-hours
    CLOSED = "CLOSED"                   # Regular market closed
    HOLIDAY = "HOLIDAY"                 # Full exchange public holiday
    SPECIAL_SESSION = "SPECIAL_SESSION" # Muhurat trading or special session
    EMERGENCY_CLOSED = "EMERGENCY_CLOSED"
    STATUS_UNAVAILABLE = "STATUS_UNAVAILABLE"


class HolidayCategory(str, Enum):
    EXCHANGE_HOLIDAY = "EXCHANGE_HOLIDAY"       # Full trading halt on equity & derivatives
    BANKING_HOLIDAY = "BANKING_HOLIDAY"         # Commercial bank / central bank clearing holiday
    TRADING_HOLIDAY = "TRADING_HOLIDAY"         # Trading closed but settlement may operate
    SETTLEMENT_HOLIDAY = "SETTLEMENT_HOLIDAY"   # Clearing house closed, trading may proceed
    CLEARING_HOLIDAY = "CLEARING_HOLIDAY"       # NSCCL / ICCL depository closure
    COMMODITY_HOLIDAY = "COMMODITY_HOLIDAY"     # Morning session closed, evening open
    SPECIAL_SESSION = "SPECIAL_SESSION"         # Muhurat or special mock trading session
    EMERGENCY_CLOSURE = "EMERGENCY_CLOSURE"     # Disaster recovery or emergency closure


class EventImportance(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class EventCategory(str, Enum):
    MACRO = "MACRO"                       # Macroeconomic releases
    CENTRAL_BANK = "CENTRAL_BANK"         # Interest rate decisions, MPC/FOMC/ECB
    INFLATION = "INFLATION"               # CPI, WPI, PCE deflator
    GDP = "GDP"                           # Quarterly/Annual Gross Domestic Product
    EMPLOYMENT = "EMPLOYMENT"             # Nonfarm payrolls, unemployment rate
    PMI = "PMI"                           # Manufacturing & Services PMI
    BOND_AUCTION = "BOND_AUCTION"         # Sovereign debt issuance / yields
    EARNINGS = "EARNINGS"                 # Corporate quarterly/annual results
    DIVIDEND = "DIVIDEND"                 # Ex-dividend & record dates
    IPO = "IPO"                           # Primary market open/close/listing
    CORPORATE_ACTION = "CORPORATE_ACTION" # Stock splits, bonuses, rights issues
    GOVERNMENT_BUDGET = "GOVERNMENT_BUDGET" # Annual fiscal budgets & policies


class MarketSessionInfo(BaseModel):
    market_id: str                      # e.g. "NSE", "NYSE", "LSE", "TSE"
    market_name: str                    # e.g. "National Stock Exchange of India"
    exchange: str                       # e.g. "NSE"
    mic: str                            # e.g. "XNSE"
    country: str                        # e.g. "India"
    country_code: str                   # e.g. "IN"
    region: str                         # e.g. "India", "Americas", "Europe", "Asia-Pacific"
    timezone: str                       # e.g. "Asia/Kolkata"
    status: MarketStatus
    session_label: str                  # e.g. "Regular Trading Session"
    current_local_time: str             # e.g. "14:30:00"
    current_utc_time: str
    user_local_time: str | None = None
    session_start_local: str            # e.g. "09:15"
    session_end_local: str              # e.g. "15:30"
    next_open_utc: str | None = None
    next_close_utc: str | None = None
    next_event_countdown_seconds: int | None = None
    is_regular_trading: bool
    is_trading_day: bool
    holiday_today: bool = False
    holiday_name: str | None = None
    special_session_today: bool = False
    special_session_notes: str | None = None
    supported_asset_classes: list[str] = Field(default_factory=list)
    effective_data_status: str = "LIVE" # "LIVE", "DELAYED_15M", "CLOSED", "EOD"
    source_attribution: str = "Official Exchange Calendar Schedule"
    last_verified_at: str


class CalendarHolidayRecord(BaseModel):
    holiday_id: str
    country: str
    country_code: str
    market: str                         # e.g. "DOMESTIC_INDIA", "US_EQUITIES"
    exchange: str                       # e.g. "NSE", "BSE", "MCX", "NYSE", "LSE"
    event_name: str                     # e.g. "Republic Day", "Independence Day"
    category: HolidayCategory
    holiday_date: str                   # ISO "YYYY-MM-DD"
    start_time_local: str | None = None
    end_time_local: str | None = None
    timezone: str
    affected_asset_classes: list[str] = Field(default_factory=list)
    trading_status: str = "CLOSED"      # "CLOSED", "PARTIAL", "OPEN"
    settlement_status: str = "CLOSED"   # "CLOSED", "OPEN"
    banking_status: str = "CLOSED"      # "CLOSED", "OPEN"
    description: str
    source: str
    source_url: str
    effective_year: int
    is_special_session: bool = False
    special_session_hours: str | None = None
    last_verified_at: str


class EconomicCorporateEventRecord(BaseModel):
    event_id: str
    title: str
    event_type: EventCategory
    country: str
    country_code: str
    currency: str
    event_time_utc: str
    event_time_local: str
    timezone: str
    actual: str | None = None
    forecast: str | None = None
    previous: str | None = None
    unit: str | None = None
    source: str
    source_url: str
    importance: EventImportance
    symbol: str | None = None           # e.g. "NSE:RELIANCE"
    company_name: str | None = None
    notes: str
    publication_status: str = "SCHEDULED" # "SCHEDULED", "RELEASED", "DELAYED"
    affected_sectors: list[str] = Field(default_factory=list)
    last_verified_at: str


class GlobalMarketStatusSummary(BaseModel):
    timestamp_utc: str
    summary_label: str
    active_open_markets_count: int
    closed_markets_count: int
    next_major_opening: str
    next_major_closing: str
    markets: list[MarketSessionInfo]
    today_holidays: list[CalendarHolidayRecord] = Field(default_factory=list)
    upcoming_holidays: list[CalendarHolidayRecord] = Field(default_factory=list)


class CalendarUserPreferences(BaseModel):
    user_id: str = "default_user"
    followed_markets: list[str] = Field(default_factory=lambda: ["NSE", "BSE", "NYSE", "NASDAQ", "LSE", "TSE"])
    followed_categories: list[EventCategory] = Field(default_factory=lambda: [
        EventCategory.CENTRAL_BANK,
        EventCategory.INFLATION,
        EventCategory.EARNINGS,
        EventCategory.DIVIDEND,
    ])
    min_importance: EventImportance = EventImportance.MEDIUM
    notify_market_open: bool = True
    notify_market_close: bool = False
    notify_holidays: bool = True
    notify_earnings: bool = True
