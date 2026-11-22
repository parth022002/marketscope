# MarketScope.io — Accessibility Audit (WCAG 2.2 AA)

## 1. Overview
The frontend was audited against **WCAG 2.2 Level AA** standards for digital financial applications.

---

## 2. Compliance Checklist

| Criterion | Implementation | Status |
| :--- | :--- | :--- |
| **Color Contrast (1.4.3)** | Minimum 4.5:1 text contrast for body copy; 3:1 for large headers and interactive buttons in both dark and light modes. | **PASS** |
| **Keyboard Navigation (2.1.1)** | All buttons, tabs, links, and search inputs are fully reachable and activatable via `Tab`, `Enter`, `Space`, and `Esc`. | **PASS** |
| **Focus Visible (2.4.7)** | Tailored `focus-visible:ring-2 focus-visible:ring-sky-400` outline on all interactive controls. | **PASS** |
| **Reduced Motion (2.3.3)** | `prefers-reduced-motion` media query disables 3D canvas animations and substitutes static CSS gradients. | **PASS** |
| **Screen Reader Labels (4.1.2)** | Explicit `aria-label` attributes on icon-only buttons (theme toggle, sidebar collapse, mobile drawer, alert delete). | **PASS** |
| **Tabular Figures (1.3.1)** | Financial tables formatted with `tabular-nums` ensuring column numbers align for screen reader readability. | **PASS** |
| **Semantic HTML5** | Proper use of `<header>`, `<aside>`, `<main>`, `<footer>`, `<nav>`, and `<button>`. | **PASS** |
