"""
MarketScope.io — Base Market Data Provider Interface
"""

from abc import ABC, abstractmethod
from typing import Sequence
from datetime import datetime, timezone
from app.domain.schemas import MarketQuote, ProviderHealthItem


class BaseMarketDataProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Unique identifier of the market data provider (e.g., 'twelvedata', 'fmp')."""
        pass

    @abstractmethod
    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        """Fetch normalized quote for a single instrument."""
        pass

    @abstractmethod
    async def get_batch_quotes(self, symbols: Sequence[str]) -> list[MarketQuote]:
        """Fetch quotes in batch for a list of instruments."""
        pass

    @abstractmethod
    async def get_historical_bars(
        self, symbol: str, interval: str = "1D", limit: int = 30
    ) -> list[dict]:
        """Fetch historical OHLCV bars."""
        pass

    @abstractmethod
    async def health_check(self) -> ProviderHealthItem:
        """Probe provider connection latency and API key validity."""
        pass

    @staticmethod
    def calculate_price_change(price: float, previous_close: float) -> tuple[float, float]:
        """
        Calculates exact absolute change and percentage change with fixed rounding.
        Prevents IEEE-754 float drift artifacts.
        """
        if previous_close <= 0.0:
            return 0.0, 0.0
        change = round(price - previous_close, 2)
        change_pct = round((change / previous_close) * 100.0, 2)
        return change, change_pct

    @staticmethod
    def is_valid_price(price: float) -> bool:
        """Validates that price is positive and non-zero."""
        return price is not None and price > 0.0

    @staticmethod
    def is_price_jump_anomalous(price: float, previous_close: float, threshold_pct: float = 30.0) -> bool:
        """Flags suspicious price changes that exceed circuit limits in a single tick."""
        if previous_close <= 0.0 or price <= 0.0:
            return True
        pct = abs(price - previous_close) / previous_close * 100.0
        return pct > threshold_pct
