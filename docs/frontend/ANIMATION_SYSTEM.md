# MarketScope.io — 3D Background & Animation System Specification

## 1. System Overview
The motion language utilizes a custom HTML5 canvas rendering a mathematical **3D Isometric Horizon Matrix** without third-party bundle bloat or React 19 peer-dependency conflicts.

---

## 2. Core Visual Elements

1. **3D Horizon Grid**:
   - Recedes towards a perspective vanishing point.
   - Dynamic elevation waves governed by multi-harmonic sinusoidal functions ($y = y_0 + \sin(\omega t + r \cdot 0.4 + c \cdot 0.2) \times 14$).
2. **Rotating Financial Polyhedra**:
   - 3D wireframe crystals (cubes/octahedra) rotating in $(x, y, z)$ space with real-time perspective projection ($X' = x \cdot \frac{d}{z}$, $Y' = y \cdot \frac{d}{z}$).
3. **Pulsating Data Nodes**:
   - Luminous cyan and emerald glowing dots on polyhedral vertices.
4. **Interactive Mouse Parallax**:
   - Tracks cursor movement with smooth linear damping ($v = v + (target - v) \times 0.05$).

---

## 3. Performance & Accessibility Guardrails
- **`prefers-reduced-motion`**: Detects system preferences and halts canvas animation immediately, falling back to static ambient CSS gradients.
- **Tab Inactivity Detection**: Listens to `visibilitychange` and pauses the `requestAnimationFrame` loop when the browser tab is hidden, reducing CPU/GPU usage to 0%.
- **Lightweight**: Zero external dependencies, runs at a solid 60fps, consumes <2% CPU.
