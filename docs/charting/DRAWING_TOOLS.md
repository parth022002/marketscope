# MarketScope.io — Vector Drawing Tools & Coordinate Architecture

## 1. Overview
The vector drawing layer in MarketScope enables technical analysts to perform geometric charting, support/resistance level mapping, Fibonacci retracement calculations, and price/time delta measurements directly on top of the interactive chart canvas.

---

## 2. Implemented Tools
1. **Crosshair / Pointer (`cursor`)**: Standard inspection mode with full mouse-through event handling.
2. **Trend Line (`trendline`)**: 2-point directional vector displaying angle and end points.
3. **Horizontal Price Level (`horizontal`)**: 1-click horizontal ray spanning the entire chart width with dynamic price pill label.
4. **Horizontal Ray (`ray`)**: 1-click ray originating at the selected bar and projecting indefinitely into future price space.
5. **Rectangle Box (`rectangle`)**: 2-corner boundary tool with translucent fill for highlighting consolidation zones and supply/demand blocks.
6. **Fibonacci Retracements (`fibonacci`)**: Computes and displays the classical 7 Fibonacci horizontal ratios:
   - $0.0\%$ (Initial Extreme)
   - $23.6\%$
   - $38.2\%$ (Shaded Golden Range Start)
   - $50.0\%$ (Midpoint)
   - $61.8\%$ (Golden Ratio Level)
   - $78.6\%$
   - $100.0\%$ (Terminal Extreme)
7. **Price Range Ruler (`measure_price`)**: Highlights absolute price change ($\Delta P$) and percentage variation ($\Delta\%$) between two points.
8. **Date/Bars Range Ruler (`measure_time`)**: Calculates the number of elapsed bars and time duration between two time coordinates.
9. **Text Annotation (`text`)**: Places custom analyst notes anchored to exact price/time coordinates.

---

## 3. Coordinate Conversion & Snapping
- **Screen Space to Data Space**:
  - $Y \rightarrow \text{Price}$: Handled via `series.coordinateToPrice(y)`.
  - $X \rightarrow \text{Time}$: Handled via `chart.timeScale().coordinateToTime(x)`.
- **Magnet Snapping**: When Magnet mode is toggled, cursor coordinates snap to the nearest bar's High, Low, or Close values.
- **Persistence Schema**: Drawings are serialized into JSON containing `instrument_id`, `tool_type`, `points: [{ time, price }]`, and styling attributes, stored in both backend SQLite/PostgreSQL and client `localStorage`.
