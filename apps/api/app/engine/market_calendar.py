"""
MarketScope.io — Market Calendar & Exchange Session Engine
Handles real-time exchange session calculation, trading hours, pre/post-market states,
and exchange holidays across Indian (NSE, BSE, MCX), US (NYSE, NASDAQ), European, and FX markets.
"""

from datetime import datetime, time, date, timezone, timedelta
from typing import NamedTuple

# Indian Standard Time (IST) offset: UTC + 5:30
IST_OFFSET = timezone(timedelta(hours=5, minutes=30))
# US Eastern Standard Time (EST) offset: approx UTC - 5:00
EST_OFFSET = timezone(timedelta(hours=-5))


class SessionState(NamedTuple):
    market_status: str       # "OPEN", "CLOSED", "PRE_OPEN", "POST_CLOSE", "PRE_MARKET", "AFTER_HOURS", "HOLIDAY"
    is_regular_trading: bool
    session_label: str       # Human-readable session name (e.g., "Regular Trading", "Market Closed")
    effective_data_status: str # "LIVE", "DELAYED_15M", "CLOSED", "EOD"


# 2026-2027 NSE / BSE Public Market Holidays (ISO format strings)
NSE_HOLIDAYS = {
    date(2026, 1, 26),  # Republic Day
    date(2026, 2, 16),  # Mahashivratri
    date(2026, 3, 4),   # Holi
    date(2026, 4, 3),   # Good Friday
    date(2026, 4, 14),  # Dr. B.R. Ambedkar Jayanti
    date(2026, 5, 1),   # Maharashtra Day
    date(2026, 5, 28),  # Bakri Id / Eid-ul-Adha
    date(2026, 6, 26),  # Muharram
    date(2026, 8, 15),  # Independence Day
    date(2026, 10, 2),  # Mahatma Gandhi Jayanti
    date(2026, 10, 20), # Dussehra
    date(2026, 11, 8),  # Diwali Laxmi Pujan (Muhurat session only)
    date(2026, 11, 9),  # Diwali Balipratipada
    date(2026, 11, 24), # Gurunanak Jayanti
    date(2026, 12, 25), # Christmas
}

# US Federal Holidays (NYSE / NASDAQ)
US_HOLIDAYS = {
    date(2026, 1, 1),   # New Year's Day
    date(2026, 1, 19),  # Martin Luther King Jr. Day
    date(2026, 2, 16),  # Washington's Birthday (Presidents Day)
    date(2026, 4, 3),   # Good Friday
    date(2026, 5, 25),  # Memorial Day
    date(2026, 6, 19),  # Juneteenth National Independence Day
    date(2026, 7, 3),   # Independence Day (Observed)
    date(2026, 9, 7),   # Labor Day
    date(2026, 11, 26), # Thanksgiving Day
    date(2026, 12, 25), # Christmas Day
}


def get_nse_session_state(now_utc: datetime | None = None) -> SessionState:
    """
    Evaluates NSE / BSE market session status in Indian Standard Time (IST).
    - Weekend (Sat/Sun): CLOSED
    - Holiday: HOLIDAY
    - 09:00 - 09:08: Pre-open order entry
    - 09:08 - 09:15: Pre-open order matching
    - 09:15 - 15:30: Regular Trading Session (OPEN)
    - 15:40 - 16:00: Post-closing session
    - Outside these hours: CLOSED
    """
    if now_utc is None:
        now_utc = datetime.now(timezone.utc)
    
    ist_now = now_utc.astimezone(IST_OFFSET)
    current_date = ist_now.date()
    current_time = ist_now.time()
    weekday = ist_now.weekday()  # Monday = 0, Sunday = 6

    # Weekend check
    if weekday in (5, 6):
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="Weekend — Market Closed",
            effective_data_status="EOD",
        )

    # Holiday check
    if current_date in NSE_HOLIDAYS:
        return SessionState(
            market_status="HOLIDAY",
            is_regular_trading=False,
            session_label="Exchange Holiday",
            effective_data_status="EOD",
        )

    # Weekday trading session evaluation
    pre_open_start = time(9, 0)
    market_open = time(9, 15)
    market_close = time(15, 30)
    post_close_start = time(15, 40)
    post_close_end = time(16, 0)

    if pre_open_start <= current_time < market_open:
        return SessionState(
            market_status="PRE_OPEN",
            is_regular_trading=False,
            session_label="Pre-Market Session (09:00–09:15 IST)",
            effective_data_status="DELAYED_15M",
        )
    elif market_open <= current_time <= market_close:
        return SessionState(
            market_status="OPEN",
            is_regular_trading=True,
            session_label="Regular Trading Session",
            effective_data_status="LIVE",
        )
    elif post_close_start <= current_time <= post_close_end:
        return SessionState(
            market_status="POST_CLOSE",
            is_regular_trading=False,
            session_label="Post-Closing Price Adjustment",
            effective_data_status="EOD",
        )
    else:
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="Market Closed",
            effective_data_status="EOD",
        )


def get_us_session_state(now_utc: datetime | None = None) -> SessionState:
    """
    Evaluates US Markets (NYSE / NASDAQ) session status in Eastern Time (EST/EDT).
    - Weekend (Sat/Sun): CLOSED
    - Holiday: HOLIDAY
    - 04:00 - 09:30 EST: Pre-Market
    - 09:30 - 16:00 EST: Regular Trading Session (OPEN)
    - 16:00 - 20:00 EST: After-Hours
    - 20:00 - 04:00 EST: CLOSED
    """
    if now_utc is None:
        now_utc = datetime.now(timezone.utc)

    est_now = now_utc.astimezone(EST_OFFSET)
    current_date = est_now.date()
    current_time = est_now.time()
    weekday = est_now.weekday()

    if weekday in (5, 6):
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="Weekend — US Market Closed",
            effective_data_status="EOD",
        )

    if current_date in US_HOLIDAYS:
        return SessionState(
            market_status="HOLIDAY",
            is_regular_trading=False,
            session_label="US Federal Exchange Holiday",
            effective_data_status="EOD",
        )

    pre_market_start = time(4, 0)
    market_open = time(9, 30)
    market_close = time(16, 0)
    after_hours_end = time(20, 0)

    if pre_market_start <= current_time < market_open:
        return SessionState(
            market_status="PRE_MARKET",
            is_regular_trading=False,
            session_label="US Pre-Market Session",
            effective_data_status="DELAYED_15M",
        )
    elif market_open <= current_time <= market_close:
        return SessionState(
            market_status="OPEN",
            is_regular_trading=True,
            session_label="US Regular Trading Session",
            effective_data_status="LIVE",
        )
    elif market_close < current_time <= after_hours_end:
        return SessionState(
            market_status="AFTER_HOURS",
            is_regular_trading=False,
            session_label="US After-Hours Session",
            effective_data_status="DELAYED_15M",
        )
    else:
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="US Market Closed",
            effective_data_status="EOD",
        )


def get_mcx_session_state(now_utc: datetime | None = None) -> SessionState:
    """
    MCX Commodity session:
    - Mon-Fri: 09:00 to 23:30/23:55 IST
    - Weekends: Closed
    """
    if now_utc is None:
        now_utc = datetime.now(timezone.utc)

    ist_now = now_utc.astimezone(IST_OFFSET)
    weekday = ist_now.weekday()
    current_time = ist_now.time()

    if weekday in (5, 6):
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="MCX Weekend Closed",
            effective_data_status="EOD",
        )

    if time(9, 0) <= current_time <= time(23, 30):
        return SessionState(
            market_status="OPEN",
            is_regular_trading=True,
            session_label="MCX Live Trading Session",
            effective_data_status="LIVE",
        )
    return SessionState(
        market_status="CLOSED",
        is_regular_trading=False,
        session_label="MCX Closed",
        effective_data_status="EOD",
    )


def get_forex_session_state(now_utc: datetime | None = None) -> SessionState:
    """
    Forex 24/5 session:
    - Opens Sunday 22:00 UTC (17:00 EST)
    - Closes Friday 22:00 UTC (17:00 EST)
    """
    if now_utc is None:
        now_utc = datetime.now(timezone.utc)

    weekday = now_utc.weekday()
    hour = now_utc.hour

    # Saturday: completely closed
    if weekday == 5:
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="Global Forex Closed",
            effective_data_status="EOD",
        )
    # Sunday: closed before 22:00 UTC
    if weekday == 6 and hour < 22:
        return SessionState(
            market_status="CLOSED",
            is_regular_trading=False,
            session_label="Global Forex Closed",
            effective_data_status="EOD",
        )
    # Friday: closed after 22:00 UTC
    if weekday == 4 and hour >= 22:
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
    """
    Routes an exchange code to its dedicated session calendar.
    """
    exch_upper = (exchange or "").upper().strip()
    if exch_upper in ("NSE", "BSE", "NIFTY", "SENSEX", "RBI"):
        return get_nse_session_state(now_utc)
    elif exch_upper in ("NASDAQ", "NYSE", "AMEX", "CBOE", "BOND"):
        return get_us_session_state(now_utc)
    elif exch_upper in ("MCX", "NCDEX"):
        return get_mcx_session_state(now_utc)
    elif exch_upper in ("FOREX", "FX", "ICE", "COMEX", "NYMEX"):
        return get_forex_session_state(now_utc)
    else:
        # Default global fallback
        return get_nse_session_state(now_utc)
