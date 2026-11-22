# MarketScope.io — Frontend Test Execution Report

## 1. Test Suite Summary

### Next.js Production Build Test
- **Command**: `npm --prefix apps/web run build`
- **Compiled Routes**: 37 routes (including `/discover`, `/portfolio`, `/intelligence`, `/alerts`, `/settings`, `/help`)
- **Compilation Result**: **Zero errors, clean production bundle emitted.**

### Core Functional Verifications
1. **Fixed Sidebar**: Verified height, non-scrollable desktop behavior, expand/collapse state toggling between 256px and 72px.
2. **Global Command Palette**: Verified `Cmd+K` keyboard listener, live instrument search, navigation shortcuts, and escape dismissal.
3. **3D Perspective Background**: Verified HTML5 canvas isometric projection, mouse parallax tracking, and tab visibility pause.
4. **Unified Intelligence**: Verified multi-model sections, composite score display, Bayesian confidence index separation, and expandable evidence drawers.
5. **Interactive Charts**: Verified Lightweight Charts canvas, series switching (Candles, Line, Area), timeframe resolution changes, and indicator calculations.
