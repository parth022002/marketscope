# MarketScope.io — News Intelligence API Documentation

## 1. Overview & Authentication

The News Intelligence API provides structured, source-backed financial news, regulatory disclosures, evidence lineages, and transmission analysis.

- **Base URL**: `/api/v1/news`
- **Rate Limit**: 120 requests/minute (free tier), 600 requests/minute (pro tier).
- **Format**: JSON, UTF-8.

---

## 2. Endpoint Catalog

### 2.1 Get News Feed
`GET /api/v1/news`

**Query Parameters**:
- `category` (string, optional): Filter by channel ("Economy & Central Banks", "Company News", "Financial Markets", "Geopolitics", "Industry & Sectors").
- `priority` (string, optional): "BREAKING", "CRITICAL", "HIGH", "MEDIUM", "GENERAL".
- `country` (string, optional): "India", "US", "Global", "Europe".
- `query` (string, optional): Full-text search across headlines, summaries, and key facts.
- `symbol` (string, optional): Filter stories mentioning ticker (e.g. `RELIANCE`, `TCS`, `AAPL`).
- `verification_status` (string, optional): "PRIMARY_SOURCE_CONFIRMED", "MULTIPLE_SOURCES_REPORTED", etc.
- `page` (int, default 1): Pagination page number.
- `limit` (int, default 20): Results per page (max 100).

---

### 2.2 Get News Story Detail
`GET /api/v1/news/{storyId}`

Returns complete story dossier including:
- Grounded summary and key verified facts.
- Multi-asset transmission channels and causal flow.
- Attached evidence items and original publisher URL.
- Full correction and revision history.

---

### 2.3 Get Story Evidence
`GET /api/v1/news/{storyId}/evidence`

Returns inspectable list of regulatory filings, circulars, and independent reports supporting the story.

---

### 2.4 Get Source Registry & Licensing
`GET /api/v1/news/sources`

Returns the official directory of all connected sources, their credibility tier (Tier 1 to Tier 4), permitted usage rights, and health telemetry.

---

### 2.5 Submit Dispute / Correction Report
`POST /api/v1/news/report`

**Request Body**:
```json
{
  "article_id": "news_art_rbi_policy_2026",
  "report_category": "INCORRECT_FIGURE",
  "description": "Reported inflation rate states 4.8% but official RBI bulletin says 4.5%.",
  "evidence_url": "https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx"
}
```
