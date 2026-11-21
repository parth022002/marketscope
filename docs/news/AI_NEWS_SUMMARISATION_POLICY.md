# MarketScope.io — Grounded AI News Summarisation & Anti-Hallucination Policy

## 1. Ethical Mandate: Zero Unsupported Factual Claims

MarketScope.io utilizes AI language models strictly as **grounded analytical synthesizers**, never as original sources of financial facts.

Every AI-generated summary must strictly adhere to the **Source Grounding Contract**:
1. All extracted corporate actions, financial metrics, interest rates, currency levels, and person quotes must exist verbatim or near-verbatim in the authenticated source text.
2. The AI must never extrapolate, predict, or speculate beyond the factual bounds of the provided document.
3. Every factual bullet must cite the specific source paragraph or regulatory filing line.

---

## 2. Automated Anti-Hallucination Verification Pipeline

Prior to displaying any AI-generated summary on the platform, the output is passed through an automated verification barrier:

```
[Raw Ingested Article Text]
            │
            ▼
[Grounded LLM Prompt (Gemini / Claude)]
            │
            ▼
[Candidate Summary + Extracted Claims]
            │
            ▼
┌──────────────────────────────────────────────┐
│  Automated Fact-Checking & Entity Cross-Ref  │
│  ├── Numerical Consistency Check (exact match)│
│  ├── Company/Entity Mention Check            │
│  └── Quote Verification Check                │
└──────────────────────┬───────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[Verification PASSED]         [Unverified Claim Detected]
  Render Grounded Summary       Discard Generated Summary;
                                Render Original Publisher Snippet
```

---

## 3. Mandatory AI Labeling Standards

The user interface explicitly distinguishes between publisher reporting and platform synthesis:
- **`Publisher Headline`**: Exact, unmodified string from the originating publisher.
- **`MarketScope Grounded Summary`**: Clearly identified with a distinct analytical icon and subtitle: *"Synthesized strictly from official exchange filing ref. #2026/11/4891"*.
- **`Uncertainty Preserved`**: If an official company announcement states that project completion is subject to statutory approvals, the summary must explicitly state: *"Subject to statutory approvals"*. The AI is strictly barred from omitting qualifications to make a headline sound more definitive.
