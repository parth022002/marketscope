# MarketScope.io — Data Fetching, State Management & Resiliency Architecture

## Executive Summary

This architecture guide details the frontend state management, caching protocols, offline storage mechanisms, and asynchronous data fetching strategies implemented in the **MarketScope.io** Next.js application.

---

## 1. Architectural Principles

1. **Deterministic Render Guarantee**: Every component must render a valid state at all times (Loading Skeleton → Live Data OR High-Fidelity Fallback). Blank screens are categorically forbidden.
2. **Zero Synthetic Zero Defaults**: Undefined or pending metrics must never display misleading zeros (`₹0.00` or `0.00%`). They must display `N/A`, reference baseline scores, or explicit status badges.
3. **Local State Durability**: User-created entities (custom watchlists, virtual portfolio positions, price alert rules, and layout preferences) persist across browser sessions using local storage synchronization.
4. **Resilient Network Abort Policy**: Network requests abort after 7,000 ms, gracefully serving canonical fallback data rather than throwing uncaught runtime exceptions.

---

## 2. Data Fetching Architecture

### 2.1 The `fetchWithTimeout` Pattern
All external API requests routed through `apps/web/src/lib/api.ts` invoke a custom timeout wrapper:

```typescript
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 7000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}
```

### 2.2 Hierarchical Fallback Strategy
```
Component Mounts
      │
      ▼
Display Skeleton Loaders (8 Pulse Cards / Skeleton Table)
      │
      ▼
Execute fetchWithTimeout(endpoint, 7000ms)
      │
      ├─── HTTP 200 OK ──────────► Parse JSON & Render Live Data
      │
      └─── Timeout / HTTP Error ──► Log Warning & Render Canonical Fallback Matrix
```

---

## 3. State Management Across Key Modules

### 3.1 Watchlists State (`apps/web/src/app/watchlists/page.tsx`)
- **Initial State**: Fetches from backend `/api/v1/watchlists`. If the backend returns empty or fails, initializes with `STARTER_WATCHLISTS` ("Nifty Bluechips", "High Momentum Growth", "Dividend Aristocrats").
- **Persistence**: Any added symbol or new watchlist updates local component state and synchronizes with `localStorage.setItem("marketscope_watchlists", ...)`.
- **User Actions**:
  - Add Symbol: Modal with real-time symbol search.
  - Delete Item: Removes symbol from active watchlist.
  - Create Watchlist: Creates a new user watchlist tab.

### 3.2 Portfolio State (`apps/web/src/app/portfolio/page.tsx`)
- **Initial State**: Curated institutional model portfolio with 4 holdings:
  - RELIANCE: 100 shares @ ₹1,320.00 (Current: ₹1,377.50, +4.35%)
  - TCS: 50 shares @ ₹4,150.00 (Current: ₹4,210.00, +1.44%)
  - HDFCBANK: 200 shares @ ₹1,680.00 (Current: ₹1,745.20, +3.88%)
  - INFY: 150 shares @ ₹1,820.00 (Current: ₹1,885.50, +3.59%)
- **Dynamic Metrics**:
  - Total Invested Capital: $\sum (\text{Shares} \times \text{Avg Price})$
  - Current Portfolio Value: $\sum (\text{Shares} \times \text{Current Price})$
  - Total Unrealized P&L and Percentage Gain: Auto-computed on state change.
  - Quantitative Risk Statistics: VaR (2.14%), Portfolio Beta (0.94), Max Drawdown (-7.40%).
- **Interactive Mutations**: "Add Position" modal calculates weighted average price if adding to an existing holding, or adds a new row to the table.

### 3.3 Alert Centre State (`apps/web/src/app/alerts/page.tsx`)
- **Initial State**: Default monitoring rules for NIFTY, RELIANCE, and TCS.
- **Rule Lifecycle**:
  - `ACTIVE`: Actively monitored against real-time price feeds.
  - `TRIGGERED`: Stored in alert history with trigger timestamp.
- **Mutations**: Add alert modal supports "Crosses Above", "Crosses Below", and technical breakouts (e.g. RSI < 30).

### 3.4 Platform Settings (`apps/web/src/app/settings/page.tsx`)
- **Theme**: Managed via `ThemeProvider` (`light` | `dark`). Persisted in `localStorage` and HTML `class="dark"`.
- **Default Exchange & Currency**: Saved in client storage and applied globally across price labels.
