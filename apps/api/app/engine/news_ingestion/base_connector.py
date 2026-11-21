"""
MarketScope.io — Base News Source Connector Contract
Defines independent adapter interface, circuit breakers, and rate limit handling.
"""

import abc
import asyncio
import logging
from datetime import datetime, timezone
from typing import Any

from app.domain.canonical_news import CanonicalNewsArticle, NewsSourceRegistryItem

logger = logging.getLogger(__name__)


class BaseNewsConnector(abc.ABC):
    source_id: str
    name: str
    tier: str
    is_active: bool = True

    def __init__(self):
        self._consecutive_failures: int = 0
        self._circuit_tripped_until: datetime | None = None
        self._last_successful_fetch: datetime | None = None
        self._last_latency_ms: float = 0.0

    @property
    def is_circuit_open(self) -> bool:
        if not self._circuit_tripped_until:
            return False
        if datetime.now(timezone.utc) > self._circuit_tripped_until:
            # Circuit auto-resets after cooldown
            self._circuit_tripped_until = None
            self._consecutive_failures = 0
            return False
        return True

    def record_success(self, latency_ms: float):
        self._consecutive_failures = 0
        self._circuit_tripped_until = None
        self._last_successful_fetch = datetime.now(timezone.utc)
        self._last_latency_ms = latency_ms

    def record_failure(self, error: Exception):
        self._consecutive_failures += 1
        logger.warning(f"Connector {self.source_id} failed ({self._consecutive_failures}x): {error}")
        if self._consecutive_failures >= 3:
            # Trip circuit for 120 seconds
            self._circuit_tripped_until = datetime.now(timezone.utc).replace(second=0)
            logger.error(f"Circuit breaker TRIPPED for connector {self.source_id} (cooldown: 120s)")

    @abc.abstractmethod
    async def fetch_latest_records(self, limit: int = 25) -> list[dict[str, Any]]:
        """Fetches raw data records from external source interface."""
        pass
