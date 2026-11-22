# MarketScope.io — Frontend Test Report

## 1. Build & Compilation Verification
- **Framework**: Next.js 15.5.29 / 15.2.8 (React 19.0.0, TypeScript 5.8.2)
- **CSS Engine**: Tailwind CSS 3.4.19
- **Build Status**: **SUCCESS (28 / 28 routes compiled with 0 errors)**
- **Build Time**: ~16.9s

---

## 2. Route Compilation Matrix

| Route | Type | Client Bundle | First Load JS | Validation Result |
| :--- | :--- | :--- | :--- | :---: |
| `/` (Landing & Overview) | Static | 8.6 kB | 203 kB | **PASSED** |
| `/charts` (Advanced Charting Terminal) | Static | 3.9 kB | 186 kB | **PASSED** |
| `/company/[symbol]` (Stock Detail Hub) | Dynamic | 16.8 kB | 280 kB | **PASSED** |
| `/screener` (Universal Stock Screener) | Static | 5.98 kB | 196 kB | **PASSED** |
| `/derivatives` (Options Chain & Greeks) | Static | 3.48 kB | 193 kB | **PASSED** |
| `/market-intelligence` (Breadth & Flow) | Static | 3.09 kB | 193 kB | **PASSED** |
| `/backtesting` (Strategy Backtester) | Static | 3.86 kB | 193 kB | **PASSED** |
| `/paper-trading` (Virtual Paper Account)| Static | 3.31 kB | 193 kB | **PASSED** |
| `/news` (Verified Financial News) | Static | 4.45 kB | 194 kB | **PASSED** |
| `/news/[id]` (News Article Detail) | Dynamic | 5.13 kB | 195 kB | **PASSED** |
| `/watchlist` (User Watchlists) | Static | 2.75 kB | 192 kB | **PASSED** |
| `/privacy-security-trust` (Trust Page) | Static | 9.54 kB | 199 kB | **PASSED** |
| `/sign-in/[[...sign-in]]` (Clerk Auth) | Dynamic | 5.89 kB | 155 kB | **PASSED** |
| `/sign-up/[[...sign-up]]` (Clerk Auth) | Dynamic | 5.94 kB | 155 kB | **PASSED** |

---

## 3. Client Quality Checks
- **Zero TypeScript Errors**: All imports from `@/lib/api` strictly match backend Pydantic models.
- **Responsive Layout**: Validated against mobile (<640px), tablet (768px), desktop (1024px), and ultra-wide (>1440px) viewports.
- **Lightweight Charts v5.3.0**: Initialized inside React `useEffect` with proper resize observation and canvas cleanup on unmount.
