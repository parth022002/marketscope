"""
MarketScope.io — Canonical Price Data Model
Authoritative, high-precision price and candle domain models using Python Decimal arithmetic.
Retains full data provenance, dual timestamps (exchange event vs server reception),
and validation statuses. Never fabricates prices or conceals data latency.
"""

from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Sequence
from enum import Enum


class DataDeliveryClassification(str, Enum):
    LIVE = "LIVE"
    DELAYED = "DELAYED"
    END_OF_DAY = "END_OF_DAY"
    HISTORICAL = "HISTORICAL"
    SYNTHETIC = "SYNTHETIC"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"


class ValidationStatus(str, Enum):
    VALIDATED = "VALIDATED"
    SUSPECT_DISCREPANCY = "SUSPECT_DISCREPANCY"
    PROVISIONAL = "PROVISIONAL"
    FALLBACK = "FALLBACK"


class MarketSessionState(str, Enum):
    REGULAR_SESSION = "REGULAR_SESSION"
    PRE_OPEN = "PRE_OPEN"
    POST_CLOSE = "POST_CLOSE"
    CLOSED = "CLOSED"
    WEEKEND = "WEEKEND"
    HOLIDAY = "HOLIDAY"


@dataclass(frozen=True)
class CanonicalQuote:
    instrument_id: str
    symbol: str
    name: str
    exchange: str
    exchange_mic: str
    country: str
    asset_class: str
    instrument_type: str
    trading_currency: str
    settlement_currency: str
    price: Decimal
    previous_close: Decimal
    open: Decimal | None
    high: Decimal | None
    low: Decimal | None
    volume: int | None
    bid: Decimal | None
    ask: Decimal | None
    change: Decimal
    change_pct: Decimal
    exchange_timestamp: datetime
    provider_timestamp: datetime | None
    received_timestamp: datetime
    last_validated_timestamp: datetime
    provider_id: str
    delivery_mode: str
    market_status: MarketSessionState
    data_status: DataDeliveryClassification
    validation_status: ValidationStatus
    price_precision: int = 2
    price_unit: str = "Currency / Share"
    sparkline: list[Decimal] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "instrument_id": self.instrument_id,
            "symbol": self.symbol,
            "name": self.name,
            "exchange": self.exchange,
            "exchange_mic": self.exchange_mic,
            "country": self.country,
            "asset_class": self.asset_class,
            "instrument_type": self.instrument_type,
            "trading_currency": self.trading_currency,
            "settlement_currency": self.settlement_currency,
            "price": float(self.price),
            "previous_close": float(self.previous_close),
            "open": float(self.open) if self.open is not None else None,
            "high": float(self.high) if self.high is not None else None,
            "low": float(self.low) if self.low is not None else None,
            "volume": self.volume,
            "bid": float(self.bid) if self.bid is not None else None,
            "ask": float(self.ask) if self.ask is not None else None,
            "change": float(self.change),
            "change_pct": float(self.change_pct),
            "exchange_timestamp": self.exchange_timestamp.isoformat(),
            "provider_timestamp": self.provider_timestamp.isoformat() if self.provider_timestamp else None,
            "received_timestamp": self.received_timestamp.isoformat(),
            "last_validated_timestamp": self.last_validated_timestamp.isoformat(),
            "provider_id": self.provider_id,
            "delivery_mode": self.delivery_mode,
            "market_status": self.market_status.value,
            "data_status": self.data_status.value,
            "validation_status": self.validation_status.value,
            "price_precision": self.price_precision,
            "price_unit": self.price_unit,
            "sparkline": [float(p) for p in self.sparkline],
        }


@dataclass(frozen=True)
class CanonicalCandle:
    instrument_id: str
    interval: str
    start_timestamp: datetime
    end_timestamp: datetime
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: int
    currency: str
    provider_id: str
    is_adjusted: bool = True
    validation_status: ValidationStatus = ValidationStatus.VALIDATED

    def to_dict(self) -> dict:
        return {
            "instrument_id": self.instrument_id,
            "interval": self.interval,
            "start_timestamp": self.start_timestamp.isoformat(),
            "end_timestamp": self.end_timestamp.isoformat(),
            "open": float(self.open),
            "high": float(self.high),
            "low": float(self.low),
            "close": float(self.close),
            "volume": self.volume,
            "currency": self.currency,
            "provider_id": self.provider_id,
            "is_adjusted": self.is_adjusted,
            "validation_status": self.validation_status.value,
        }
