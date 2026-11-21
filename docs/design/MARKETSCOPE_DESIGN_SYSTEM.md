# MarketScope Design System — Midnight Financial Terminal
**Document Reference:** `docs/design/MARKETSCOPE_DESIGN_SYSTEM.md`  
**Version:** 2.0 (Complete System Redesign)  
**Date:** 21 November 2026  
**Auditor:** Senior Product Designer & UI/UX Architect  

---

## 1. Design Philosophy

The **MarketScope Design System** creates an original, high-precision visual language tailored for institutional financial research and macroeconomic market intelligence. It balances:
- The **terminal rigor and multi-asset data density of TradingView**.
- The **approachable, structured financial discovery of Tickertape**.
- The **executive clarity, scenario modeling, and risk exposure hierarchy of VerquoAI**.

It avoids generic consumer dashboard aesthetics, superfluous gradients, distracting bouncy animations, and bloated empty whitespace. It prioritizes razor-sharp 1px structural borders, tabular numerical alignment, readable financial contrast, and continuous market context.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Neutral Canvas (Midnight Obsidian)
```css
:root {
  /* Canvas Backgrounds */
  --bg-primary: #07152B;       /* Deep Midnight Base — App background */
  --bg-surface: #0B1D38;       /* Elevated Surface — Cards, Panels, Drawers */
  --bg-elevated: #102547;      /* Secondary Surface — Dropdowns, Modals, Hover States */
  --bg-subtle: #132B4F;        /* Subtle Inset — Table headers, Chip backgrounds */
  
  /* Structural Borders */
  --border-subtle: #132B4F;    /* Default 1px dividing borders */
  --border-strong: #1B3B6B;    /* Highlighted / focused borders */
  --border-focus: #087BEE;     /* Active input / focused element glow */
  
  /* Typography & Text */
  --text-primary: #FFFFFF;     /* Primary headings, active prices, bold labels */
  --text-secondary: #94A3B8;   /* Slate 400 — Subtitles, standard table data */
  --text-muted: #64748B;       /* Slate 500 — Captions, timestamps, disclaimers */
  --text-disabled: #334155;    /* Inactive states */
}
```

### 2.2 Semantic Financial Direction Tokens
Financial data requires unambiguous positive, negative, and alert states:
```css
:root {
  /* Positive / Bullish Movement */
  --color-positive: #39E85B;          /* High-visibility Emerald Green */
  --color-positive-bg: rgba(57, 232, 91, 0.10);
  --color-positive-border: rgba(57, 232, 91, 0.30);
  
  /* Negative / Bearish Movement */
  --color-negative: #F06464;          /* Distinct Crimson / Coral Red */
  --color-negative-bg: rgba(240, 100, 100, 0.10);
  --color-negative-border: rgba(240, 100, 100, 0.30);
  
  /* Alerts, Caution & Breaking News */
  --color-amber: #F5A623;             /* Warm Amber for Warnings / Notices */
  --color-amber-bg: rgba(245, 166, 35, 0.10);
  --color-amber-border: rgba(245, 166, 35, 0.30);
  
  --color-cyan: #16C8D5;              /* Vibrant Cyan for Lineage / DPDP */
  --color-cyan-bg: rgba(22, 200, 213, 0.10);
  --color-cyan-border: rgba(22, 200, 213, 0.30);
  
  --color-blue: #087BEE;              /* MarketScope Core Brand Blue */
  --color-blue-bg: rgba(8, 123, 238, 0.10);
  --color-blue-border: rgba(8, 123, 238, 0.30);
}
```

---

## 3. Typography & Numerical Formatting

### 3.1 Font Stack
- **Primary Interface Font:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Financial & Data Font:** Monospaced tabular numerals (`font-mono` / `tabular-nums`) for all prices, percentage changes, market cap values, and financial statement line items.

### 3.2 Hierarchy Scale
| Token | Font Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `display-lg` | 32px (2.0rem) | 38px | 800 (Extrabold) | Hero market metrics, company primary price |
| `heading-1` | 24px (1.5rem) | 30px | 700 (Bold) | Page titles, major section headings |
| `heading-2` | 18px (1.125rem)| 24px | 700 (Bold) | Module titles, card headers, table titles |
| `heading-3` | 15px (0.9375rem)| 20px | 600 (Semibold) | Subsection headers, news headlines |
| `body-base` | 13px (0.8125rem)| 18px | 400 / 500 | Standard table cells, body paragraphs |
| `body-sm` | 12px (0.75rem) | 16px | 400 / 500 | Captions, secondary metric labels |
| `micro` | 10px (0.625rem)| 14px | 700 (Bold) | Status tags, ticker symbols, time stamps |

---

## 4. Spacing, Grids & Responsive Breakpoints

### 4.1 Spacing Scale
Follows a 4px/8px modular base:
- `space-1`: 4px | `space-2`: 8px | `space-3`: 12px | `space-4`: 16px | `space-6`: 24px | `space-8`: 32px

### 4.2 Breakpoints
- **Mobile (`sm`):** < 640px — Ticker becomes horizontal swipe strip; sidebar collapses to top hamburger drawer.
- **Tablet (`md`):** 640px – 1024px — 2-column grids; collapsible secondary panels.
- **Desktop (`lg`):** 1024px – 1440px — Standard 12-column layout with persistent sidebar and ticker.
- **Wide Display (`xl`):** > 1440px — 3-column financial workstation layout with persistent side monitors.

---

## 5. UI Component Specifications

### 5.1 Global Market Ticker Component (`MarketTicker.tsx`)
```
+-------------------------------------------------------------------------------------------------------------------------+
| [LIVE] NIFTY 50  24,480.20  +112.40 (+0.46%)  |  SENSEX  80,365.10  +320.15 (+0.40%)  |  NASDAQ  18,415.20  -42.10 (-0.23%) |
+-------------------------------------------------------------------------------------------------------------------------+
```
- **Height:** 36px fixed height directly below the navigation topbar.
- **Animation:** Continuous linear CSS marquee (`translateX`), pausing instantly on mouse hover.
- **Item Format:** Instrument symbol, exchange badge, price with currency/points, percentage change badge with green/red indicator, and real-time/delayed dot.

### 5.2 Topbar & Navigation Shell
- **Brand Identity:** Official MarketScope logo banner on desktop sidebar; square emblem on compact viewports.
- **Command Search Bar:** Keyboard-accessible (`Cmd/Ctrl + K`) global search input spanning companies, indices, commodities, and news.
- **Market Status Pill:** Live pulsing indicator showing current trading session status (e.g., `NSE: OPEN`, `NYSE: PRE-MARKET`).

### 5.3 Financial Data Tables
- **Zebra Striping:** Alternating rows using subtle background tint (`rgba(255, 255, 255, 0.015)`).
- **Sticky Column Headers:** Header row sticks at `top: 0` during vertical scrolling.
- **Alignment Rules:** Text and symbols align **Left**; financial quantities, prices, ratios, and percentages align **Right** with monospaced tabular numbers.
- **Line-Item Actions:** Hovering over any canonical metric reveals an "Inspect Evidence" micro-pill linking directly to the Evidence Drawer.

### 5.4 News Intelligence Cards (`NewsCard.tsx`)
- **Card Surface:** `#0B1D38` with 1px `#132B4F` border and rounded-xl (`12px`) corners.
- **Header:** Priority badge (`BREAKING`, `CRITICAL`, `HIGH`), publisher badge, and publication timestamp.
- **Body:** Clear headline (15px semibold) and 2-line concise summary.
- **Tags & Links:** Clickable entity tags (e.g., `$RELIANCE`, `$BRENT`, `RBI`), relevance score pill (`Relevance: 92/100`), and publisher count indicator.

### 5.5 Interactive Market Heatmaps (`MarketHeatmap.tsx`)
- **Visual Encoding:** Tree-map cells nested by Sector (Financials, Energy, Tech, Auto).
- **Area:** Proportional to Market Capitalization or 24h Volume.
- **Color:** Gradient from Deep Emerald (`#089981` at $\ge +3\%$) to Neutral Gray (`#2A2E39` at $0\%$) to Deep Crimson (`#F23645` at $\le -3\%$).
- **Tooltips:** Hover reveals ticker, company name, latest price, exact % change, market cap in ₹ Cr / $ B, and 1-click dossier navigation.

---

## 6. Accessibility & Contrast Compliance

- All text meets **WCAG 2.1 AA** contrast standards ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large headings and icons).
- Financial directional movements **do not rely exclusively on color**:
  - Positive movements include an upward arrow indicator (`▲ +0.85%`).
  - Negative movements include a downward arrow indicator (`▼ -1.20%`).
- Full keyboard navigation across all interactive modal dialogs, tab lists, and search inputs.
