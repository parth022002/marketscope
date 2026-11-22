# MarketScope.io — Charting Known Limitations & Future Roadmap

## 1. Known Architectural Limitations

### 1.1 Multi-Year Intraday Storage
- **Current State**: Intraday bars (1m, 5m, 15m) are currently generated and cached for up to the most recent 60 trading days (120–500 bars per query) to optimize payload size and response latency.
- **Impact**: Full tick-level historical reconstruction going back 10+ years is restricted to daily/weekly aggregations.
- **Remediation**: In an upcoming release, cold-tier Parquet/DuckDB storage will be integrated to stream historical tick archives on demand.

### 1.2 WebGL vs Canvas 2D
- **Current State**: Lightweight Charts runs on HTML5 Canvas 2D context. While delivering 60 FPS for typical instrument series (up to 50,000 bars), extremely high-density multi-year 1-second feeds can stress lower-powered mobile devices.
- **Remediation**: Time-series level-of-detail (LOD) downsampling filters out invisible sub-pixel bars before canvas rendering.

---

## 2. Planned Technical Enhancements (Roadmap)
1. **Direct Binary WebSocket Streaming**:
   - Upgrading from HTTP polling to binary Protobuf WebSockets for sub-10ms quote streaming directly into `series.update()`.
2. **Multi-Symbol Overlay Comparison**:
   - Enabling secondary symbol normalization (% baseline scale) to compare stocks against benchmark indices (e.g. RELIANCE vs NIFTY 50).
3. **Advanced Harmonic & Pitchfork Tools**:
   - Expanding the vector drawing overlay with Andrews Pitchfork, Gann Fans, and ABCD harmonic pattern recognition.
