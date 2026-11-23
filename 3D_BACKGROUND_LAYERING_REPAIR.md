# MarketScope.io — 3D Background Layering and Interaction Repair Report

**Date:** November 23, 2026  
**Status:** Verification Passed  
**Component:** Three.js / Canvas WebGL Layer, CSS Stacking Context, Event Transparency  

---

## 1. Problem Diagnosis

The application features an ambient 3D geometric particle constellation rendered via HTML5 Canvas in `AnimatedBackground.tsx`.

In initial implementations:
1. The canvas element occupied fixed full-screen dimensions (`fixed inset-0`).
2. Although positioned at `z-0`, mouse move and drag events in certain browsers were being captured by the transparent WebGL context rather than passing through to buttons, tabs, input fields, and chart sliders underneath.
3. Radial gradient vignettes overlaid on the canvas were missing CSS event passthrough rules (`pointer-events: none`).
4. This created an illusion of the page being "unclickable" or "frozen" even when content was visually present.

---

## 2. Technical Repairs Applied

### 2.1 Pointer Events Transparency
In `apps/web/src/components/AnimatedBackground.tsx`:
```tsx
<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
  <canvas
    ref={canvasRef}
    className="w-full h-full opacity-35 dark:opacity-40 pointer-events-none"
  />
  <div className="absolute inset-0 bg-radial-gradient pointer-events-none select-none" />
</div>
```
- **`pointer-events-none`:** Forces all click, scroll, hover, and drag events to bypass the canvas entirely and dispatch directly to the underlying DOM elements.
- **`select-none`:** Eliminates text selection highlights on accidental canvas dragging.

### 2.2 Stacking Order Hierarchy
A strict z-index convention was enforced across all shell components:
- **`z-0`:** 3D animated canvas & ambient background gradient.
- **`z-10`:** Main application workspace (`children` content container).
- **`z-20`:** Sticky top header (breadcrumb, market ticker, search bar, status badges).
- **`z-30`:** Left navigation sidebar (icon rail & hover expand flyout).
- **`z-40`:** Dropdown menus, tooltips, and popovers.
- **`z-50`:** Modal dialogs, full-screen overlays, and alert banners.

---

## 3. Interaction Verification

- Tested mouse drag operations on TradingView charts inside `/charts`.
- Tested mouse hover and click events across screener filter pills in `/discover`.
- Tested text selection and copy actions on financial statements in `/research`.
- Verified that particle movement continues smoothly in the background without affecting CPU rendering budgets or blocking user inputs.
