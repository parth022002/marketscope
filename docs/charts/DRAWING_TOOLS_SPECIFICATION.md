# MarketScope.io — Drawing Tools Specification & Persistence
## Geometric Canvas Annotations & Chart State Serialization

---

## 1. Supported Drawing Tool Catalog

MarketScope.io implements 14 professional geometric, trend, and retracement tools matching TradingView functional conventions:

| Tool Identifier | Visual Representation | Mathematical Definition | Minimum Anchor Points |
| :--- | :--- | :--- | :--- |
| `trend_line` | Two-point ray or segment | $y - y_1 = \frac{y_2 - y_1}{x_2 - x_1} (x - x_1)$ | 2 |
| `horizontal_line` | Persistent price level across canvas | $y = P_{\text{target}}$ | 1 |
| `vertical_line` | Timeline marker across sub-panels | $x = T_{\text{target}}$ | 1 |
| `ray` | Unbounded directional ray from origin | Origin $(x_1, y_1)$ through $(x_2, y_2)$ to $\infty$ | 2 |
| `extended_line` | Infinite line spanning both directions | Line passing through $(x_1, y_1)$ and $(x_2, y_2)$ | 2 |
| `rectangle` | Support/Resistance bounding box | $[x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}]$ | 2 (Opposite corners) |
| `parallel_channel` | Equidistant trend channel | Two parallel trendlines separated by $\Delta y$ | 3 |
| `fibonacci_retracement` | Golden ratio retracement grid | $0\%, 23.6\%, 38.2\%, 50\%, 61.8\%, 78.6\%, 100\%$ | 2 (Swing Low & High) |
| `price_range` | Measured price change ($\Delta P$ and $\%$) | $|P_2 - P_1|$ with directional pill badge | 2 |
| `date_range` | Bar count and calendar duration | Number of bars and days between $T_1$ and $T_2$ | 2 |
| `text_annotation` | Positioned commentary block | Floating text attached to $(T, P)$ coordinates | 1 |
| `arrow` | Directional vector pointer | Vector $(x_1, y_1) \to (x_2, y_2)$ | 2 |
| `brush` | Freehand drawing polyline | Sequence of discrete coordinate pairs $[(x_i, y_i)]$ | $N \ge 2$ |

---

## 2. Drawing Persistence API & Data Contracts

Drawings are persisted per user and partitioned by `(instrument_id, timeframe)`:

### Endpoints:
- `GET /api/v1/chart/drawings?instrument_id=:id&timeframe=:tf`
- `POST /api/v1/chart/drawings`
- `DELETE /api/v1/chart/drawings/:drawing_id`

### Serialization Schema (`UserChartDrawing`):
```json
{
  "drawing_id": "draw_7a2b9f3e",
  "instrument_id": "RELIANCE",
  "user_id": "default_user",
  "timeframe": "1D",
  "tool_type": "fibonacci_retracement",
  "points": [
    {"time": "2026-01-15", "price": 1280.0},
    {"time": "2026-02-20", "price": 1410.0}
  ],
  "style": {
    "color": "#3B82F6",
    "lineWidth": 2,
    "lineStyle": "solid",
    "fillColor": "rgba(59, 130, 246, 0.15)"
  },
  "created_at": "2026-02-22T08:00:00Z"
}
```
