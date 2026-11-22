# MarketScope.io — Observability, Telemetry & Logging Architecture

## 1. Observability Strategy & Pillars
MarketScope.io implements three pillars of observability across frontend, backend, and background workers:
1. **Metrics**: Real-time operational instrumentation (HTTP latency percentiles, error rates, cache hit ratios, queue lengths).
2. **Distributed Tracing**: End-to-end request correlation via `CorrelationIdMiddleware` injecting `X-Request-ID`.
3. **Structured Logging**: JSON-formatted logging with contextual tags (`request_id`, `user_id`, `symbol`, `duration_ms`).

---

## 2. Key Telemetry Metrics & SLIs

| Metric Name | Type | Target SLI / SLO | Description |
| :--- | :--- | :--- | :--- |
| `http_request_duration_seconds` | Histogram | p95 < 250ms (quant endpoints); p95 < 2,000ms (AI dossiers) | Latency across all API routes |
| `http_requests_total` | Counter | 99.9% 2xx/3xx response rate | Total HTTP requests classified by status |
| `cache_hit_ratio` | Gauge | > 85% for market reference & quotes | In-memory Redis cache effectiveness |
| `ai_token_usage_total` | Counter | Budget tracked daily | Cumulative prompt and completion tokens |
| `data_quality_anomalies_total` | Counter | < 0.1% of ingested rows | Triggered data anomalies (jump, stale, balance sheet mismatch) |

---

## 3. Log Redaction & Security
All log events pass through an in-memory formatter that redacts bearer tokens, authorization headers, passwords, and user PII before outputting to stdout or external collectors.
