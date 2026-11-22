# MarketScope.io — Mobile Responsive Chart Experience

## 1. Responsive Design Strategy
Trading and market analysis occur across desktop monitors, tablets, and smartphones. MarketScope's charting architecture adapts fluidly across all breakpoints (360px mobile to 3840px 4K workstations).

---

## 2. Adaptive Breakpoint Behaviors

### 2.1 Viewport Breakpoints
- **Mobile (< 768px)**:
  - Right sidebar collapses into a compact floating tab strip or bottom drawer.
  - Left drawing toolbar provides horizontal swipe or compact flyout to preserve maximum horizontal chart width.
  - Timeframe switcher highlights primary intervals (`1D`, `1W`, `1M`, `1Y`) with secondary timeframes accessible via dropdown.
  - Crosshair legend collapses from multi-item inline strip into high-priority price & percent readout.
- **Tablet (768px – 1024px)**:
  - Right sidebar defaults to icon-rail mode (width 40px) and expands over canvas on user tap.
  - Full drawing toolbar displayed vertically.
- **Desktop (>= 1024px)**:
  - Full 3-panel layout: Left vector drawing rail (44px), central expansive canvas, and right 320px research dock.

---

## 3. Touch Gesture Handling
- **Pinch-to-Zoom**: Lightweight Charts natively translates dual-touch distance changes into timescale compression/expansion.
- **Single-Finger Drag**: Pans across historical timeline.
- **Long-Press**: Activates inspection crosshair without firing accidental clicks.
