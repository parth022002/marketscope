# News AI Analysis Engine Specification

## 1. Structural Article Dossier Schema
Whenever a user views an article dossier or requests an AI synthesis of market news, the News AI Analysis Engine generates an 8-point structured institutional briefing:

1. **Executive Summary**: 2-sentence distillation of the core event.
2. **Key Verified Facts**: Bullet points listing audited numerical figures, dates, policy percentages, and named participants.
3. **Why It Matters**: Qualitative perspective on the economic or strategic significance for capital markets.
4. **Potential Market Impact**: Immediate transmission mechanism to equities, fixed income, commodities, or currencies.
5. **Impact Horizon**: Categorization into Immediate (0–48 hours), Short Term (1–4 weeks), or Medium/Long Term (1–12 months).
6. **Affected Entities & Sectors**: Explicit list of tickers (`RELIANCE.NS`, `HDFCBANK.NS`) and sectors (Banking, IT, Oil & Gas).
7. **Risk & Uncertainty Factors**: Counter-arguments, execution risks, and pending regulatory or judicial approvals.
8. **Source Evidence & Verification**: Citation links with cryptographic hash verification and publisher tier designation.

## 2. Hallucination Mitigation
The AI analysis strictly conditions on the extracted text and filing exhibits. If a metric (e.g. forward guidance or margin target) was not stated in the source text, the engine explicitly marks it as *"Not disclosed in source filing"* rather than interpolating synthetic estimates.
