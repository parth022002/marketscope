# MarketScope.io — Search Ranking Methodology & Scoring Formula

## 1. Overview & Mathematical Formulation

The search ranking engine orders candidate instruments by relevance to minimize user cognitive overhead. It uses a composite scoring formula that balances exact identifier matches, prefix completion, token overlap, market capitalization tier, exchange prominence, and fuzzy typo corrections.

$$\text{FinalScore}(q, i) = w_1 \cdot S_{\text{exact}} + w_2 \cdot S_{\text{prefix}} + w_3 \cdot S_{\text{token}} + w_4 \cdot S_{\text{mcap}} + w_5 \cdot S_{\text{exchange}} + w_6 \cdot S_{\text{fuzzy}}$$

---

## 2. Weight Parameters & Scoring Components

| Component | Variable | Weight ($w_k$) | Value Range | Calculation Details |
|---|---|---|---|---|
| **Exact Ticker** | $S_{\text{exact}}$ | $40.0$ | $\{0, 1\}$ | $1$ if $\text{upper}(q) == \text{upper}(i.\text{symbol})$ or $q == i.\text{isin}$ |
| **Prefix Match** | $S_{\text{prefix}}$ | $25.0$ | $\{0, 1\}$ | $1$ if $i.\text{symbol}$ starts with $q$ |
| **Token Overlap** | $S_{\text{token}}$ | $20.0$ | $[0, 1]$ | Jaccard index of token sets: $\frac{\|Tokens(q) \cap Tokens(i)\|}{\|Tokens(q)\|}$ |
| **Cap Tier Boost** | $S_{\text{mcap}}$ | $10.0$ | $\{0, 1\}$ | $1$ if Large/Mega Cap ($\ge \$10\text{B}$ / $\ge ₹50,000\text{ Cr}$) |
| **Exchange Bias** | $S_{\text{exchange}}$ | $3.0$ | $\{0, 1\}$ | $1$ if primary exchange matches user's active market context |
| **Fuzzy Proximity** | $S_{\text{fuzzy}}$ | $2.0$ | $[0, 1]$ | $1 - \frac{\text{Levenshtein}(q, \text{name})}{\max(\|q\|, \|\text{name}\|)}$ |

---

## 3. Typo Tolerance & Levenshtein Formulation

The Levenshtein distance $\text{lev}(a, b)$ between strings $a$ and $b$ of lengths $|a|$ and $|b|$ is given by:

$$\text{lev}_{a,b}(i, j) = \begin{cases}
  \max(i, j) & \text{if } \min(i, j) = 0, \\
  \min \begin{cases}
    \text{lev}_{a,b}(i-1, j) + 1 \\
    \text{lev}_{a,b}(i, j-1) + 1 \\
    \text{lev}_{a,b}(i-1, j-1) + 1_{(a_i \neq b_j)}
  \end{cases} & \text{otherwise.}
\end{cases}$$

### Fuzzy Search Rules:
1. Fuzzy matching is only activated when exact token and prefix searches yield fewer than 3 results.
2. The maximum allowed edit distance is 2 for queries with length $\ge 5$ characters, and 1 for queries with length 3-4 characters. No fuzzy matching is performed on 1-2 character inputs to avoid noise.
3. Every fuzzy result is tagged with `match_reason: "TYPO_FUZZY"` so the client UI can indicate the correction (e.g. "Showing results for RELIANCE").

---

## 4. Tie-Breaking Heuristics

When two instruments receive equal composite scores:
1. Higher Market Capitalization takes precedence.
2. Higher Liquidity (Average Daily Trading Volume) takes secondary precedence.
3. Domestic exchange (NSE/BSE) takes precedence if client locale is India.
