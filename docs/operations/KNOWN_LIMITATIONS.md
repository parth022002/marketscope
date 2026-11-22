# MarketScope.io — Known Limitations & Forward Roadmap

## 1. Known Architectural & Operational Limitations

1. **Delayed Market Feeds on Free Tier**:
   - Quotes for select exchanges are subject to a standard 15-minute delay on standard accounts.
   - Mitigated by explicit user warning badges and timestamp displays.
2. **Cold Start Latency on Serverless Deployments**:
   - First call to AI research dossiers on idle containers may incur a 1.5-2.0s cold-start overhead while loading vector models.
   - Mitigated by worker keepalive pings (`/healthz`).
3. **Historical Data Depth on Select International Tickers**:
   - While US Equities provide 20+ years of audited SEC filings, select emerging market tickers provide 5-10 years of normalized fundamentals.
   - Mitigated by `DataCoverageScore` transparently surfacing data depth to users.

---

## 2. Engineering Roadmap (H1 2027)
- **Direct Exchange L1/L2 Feeds**: Formal integration of direct BATS/IEX/Nasdaq low-latency multicast feeds for institutional subscribers.
- **Local Small-Language Model On-Premises Option**: Deployment package for air-gapped financial institutions utilizing quantized Llama-3.3 70B models.
- **Automated Portfolio Stress-Testing**: Multi-scenario historical stress testing (e.g., 2008 Lehman shock, 2020 COVID liquidity freeze) integrated into the Paper Trading module.
