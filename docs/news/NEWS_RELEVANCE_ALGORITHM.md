# MarketScope.io — Explainable 7-Factor News Relevance & Ranking Algorithm

## 1. Objective & Design Philosophy

MarketScope.io avoids opaque black-box algorithms or engagement-maximizing clickbait sorting. Every story's position in the feed is determined by an **explainable 7-factor mathematical score** ($0 \le S \le 100$) prioritizing factual evidence, institutional relevance, and recency.

---

## 2. The 7-Factor Mathematical Formulation

$$\text{Relevance Score } S = \sum_{i=1}^{7} w_i \cdot F_i - \text{Penalty}_{\text{duplicate}} - \text{Penalty}_{\text{dispute}}$$

Where:

| Factor ($F_i$) | Weight ($w_i$) | Description & Scoring Logic |
| :--- | :---: | :--- |
| **1. Source Credibility Tier ($F_{\text{src}}$)** | $0.25$ | Tier 1 Official = $100$; Tier 2 Established Journalism = $85$; Tier 3 Secondary = $65$; Tier 4 = $0$. |
| **2. Factual Evidence Strength ($F_{\text{evid}}$)** | $0.20$ | Verified regulatory filing attached = $100$; Multiple independent corroborations = $80$; Single report = $50$. |
| **3. Financial Significance ($F_{\text{impact}}$)** | $0.15$ | High market-wide impact (RBI/Fed policy, GDP, large-cap M&A) = $100$; Midcap earnings = $75$; Sectoral update = $50$. |
| **4. Recency & Freshness Decay ($F_{\text{time}}$)** | $0.15$ | Exponential half-life decay: $F_{\text{time}} = 100 \cdot e^{-\lambda t}$, where $\lambda$ corresponds to a 6-hour half-life for breaking news. |
| **5. Entity & Portfolio Specificity ($F_{\text{entity}}$)** | $0.10$ | Exact match to user's active watchlist or selected company dossier = $100$; Sector match = $60$; Broad market = $40$. |
| **6. Cross-Publisher Corroboration ($F_{\text{corrob}}$)** | $0.10$ | $\ge 3$ independent publishers reporting = $100$; $2$ publishers = $75$; $1$ publisher = $40$. |
| **7. Story Completeness & Lineage ($F_{\text{qual}}$)** | $0.05$ | Complete key facts, transmission channels, and structured metadata = $100$. |

---

## 3. Penalty Deductions

- **Duplicate / Syndication Penalty**: Cloned wire copies received after the primary release receive a $-25$ score reduction to prevent feed saturation.
- **Disputed Story Flag**: Stories with unresolved factual contradictions are tagged `DISPUTED` and capped at a maximum score of $70$ until confirmed by primary evidence.
- **Correction Audit Note**: Corrected stories receive a prominent status badge and an audit banner explaining the modification.

---

## 4. User-Facing Explainability

Every news card provides an explainability tooltip:
> *"Ranked 94/100 because this is a recent Tier-1 official filing from the National Stock Exchange of India (NSE) directly affecting your selected company with verified financial figures."*
