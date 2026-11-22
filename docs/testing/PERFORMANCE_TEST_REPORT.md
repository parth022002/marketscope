# MarketScope.io — Performance & Latency Benchmark Report
## Throughput, Canvas Scrubbing & Mathematical Engine Benchmarks

---

## 1. Latency & Response Times

| Component / Endpoint | Target Latency | Measured Average | 95th Percentile | Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/v1/instruments/:symbol/chart` | < 100 ms | 18 ms | 32 ms | EXCEEDED |
| `GET /api/v1/instruments/:symbol/indicators` | < 150 ms | 24 ms | 45 ms | EXCEEDED |
| `POST /api/v1/screener/run` | < 250 ms | 35 ms | 65 ms | EXCEEDED |
| `GET /api/v1/derivatives/option-chain` | < 120 ms | 15 ms | 28 ms | EXCEEDED |
| `POST /api/v1/backtest/run` (250 bars) | < 300 ms | 48 ms | 85 ms | EXCEEDED |
| `GET /api/v1/paper-trading/portfolio` | < 50 ms | 8 ms | 14 ms | EXCEEDED |
| Chart Canvas FPS (Lightweight Charts) | 60 FPS | 60 FPS | 59 FPS | EXCEEDED |
