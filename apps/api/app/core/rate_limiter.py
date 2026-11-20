"""MarketScope.io — Production Rate Limiter & Throttling Middleware (MOD-01 / REQ-SEC-04)

Features:
- Sliding-window counter with Redis persistence (Upstash / local Redis).
- Seamless in-memory fallback if Redis is unavailable or in development.
- Injects standard HTTP headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.
- Emits HTTP 429 Too Many Requests when quota is exceeded.
"""

from __future__ import annotations

import time
import logging
from collections import defaultdict
from fastapi import Request, HTTPException, status
from app.core.config import settings

logger = logging.getLogger("marketscope.rate_limiter")


class SlidingWindowRateLimiter:
    def __init__(self, requests_per_minute: int = 120):
        self.requests_per_minute = requests_per_minute
        self.window_seconds = 60
        self._memory_store: dict[str, list[float]] = defaultdict(list)
        self._redis_client = None
        self._init_redis()

    def _init_redis(self):
        try:
            import redis
            if settings.redis_url and settings.redis_url.startswith("redis"):
                # Fast timeout so it doesn't block local boot if external redis is dormant
                client = redis.from_url(settings.redis_url, socket_timeout=0.5, socket_connect_timeout=0.5)
                client.ping()
                self._redis_client = client
                logger.info("Connected to Redis for distributed sliding-window rate limiting.")
        except Exception:
            self._redis_client = None

    def check_rate_limit(self, client_id: str) -> tuple[bool, int, int]:
        """Check if client_id is within rate limits.
        
        Returns:
            (is_allowed: bool, remaining_requests: int, reset_time_seconds: int)
        """
        now = time.time()
        window_start = now - self.window_seconds

        # Redis-backed path
        if self._redis_client:
            try:
                key = f"marketscope:ratelimit:{client_id}"
                pipe = self._redis_client.pipeline()
                pipe.zremrangebyscore(key, 0, window_start)
                pipe.zadd(key, {str(now): now})
                pipe.zcard(key)
                pipe.expire(key, self.window_seconds + 5)
                _, _, count, _ = pipe.execute()

                remaining = max(0, self.requests_per_minute - count)
                is_allowed = count <= self.requests_per_minute
                return is_allowed, remaining, int(window_start + self.window_seconds - now)
            except Exception:
                pass  # Fall back to in-memory

        # In-memory sliding window fallback
        timestamps = self._memory_store[client_id]
        # Filter out timestamps older than the window
        valid_timestamps = [t for t in timestamps if t > window_start]
        valid_timestamps.append(now)
        self._memory_store[client_id] = valid_timestamps

        count = len(valid_timestamps)
        remaining = max(0, self.requests_per_minute - count)
        is_allowed = count <= self.requests_per_minute
        reset_time = int(self.window_seconds)

        return is_allowed, remaining, reset_time


global_rate_limiter = SlidingWindowRateLimiter(requests_per_minute=120)


async def rate_limit_dependency(request: Request):
    """FastAPI Dependency for rate limiting per client IP or authorization workspace."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    auth_header = request.headers.get("Authorization", "")
    identifier = auth_header if auth_header else client_ip

    is_allowed, remaining, reset_time = global_rate_limiter.check_rate_limit(identifier)

    # Attach headers to request state so middleware/route can emit them
    request.state.rate_limit_limit = 120
    request.state.rate_limit_remaining = remaining
    request.state.rate_limit_reset = reset_time

    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit quota exceeded (120 req/min). Please back off before retrying.",
            headers={
                "X-RateLimit-Limit": "120",
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(reset_time),
                "Retry-After": str(reset_time),
            },
        )
