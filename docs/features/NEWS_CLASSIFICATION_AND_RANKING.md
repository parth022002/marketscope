# News Classification & Relevance Ranking Specification

## 1. Multidimensional Relevance Scoring Algorithm
Every canonical news article is evaluated on a composite 0–100 relevance score calculated across four core quantitative vectors:

$$\text{Relevance} = w_s \cdot S_{\text{source}} + w_t \cdot S_{\text{timeliness}} + w_e \cdot S_{\text{entity}} + w_m \cdot S_{\text{market}}$$

Where:
- $S_{\text{source}}$ (Weight: 35%): Source credibility tier weight (Tier 1 = 100, Tier 2 = 85, Tier 3 = 60).
- $S_{\text{timeliness}}$ (Weight: 25%): Exponential decay function over elapsed minutes since publication ($e^{-\lambda t}$).
- $S_{\text{entity}}$ (Weight: 20%): Market capitalization and index weighting of mapped entities (e.g., NIFTY 50 heavyweight entities receive higher scoring).
- $S_{\text{market}}$ (Weight: 20%): Systemic materiality (central bank interest rate adjustments, systemic banking regulations, macroeconomic shocks).

## 2. Priority & Urgency Classification
Articles are assigned one of four operational urgency tags:
- `BREAKING`: Real-time material developments published within the last 30 minutes with high systemic impact.
- `CRITICAL`: High-importance regulatory mandates, central bank announcements, or earnings surprises.
- `HIGH`: Major corporate earnings, key macroeconomic statistics, or sector-wide policy shifts.
- `GENERAL`: Regular corporate developments, analyst commentary, or routine market updates.
