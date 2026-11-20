# MarketScope.io — REST API Documentation

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Base URL:** `http://localhost:8000/api/v1` (Local Dev) / `https://api.marketscope.io/api/v1` (Production)  
**Standard Format:** JSON (`application/json`)  
**Character Encoding:** UTF-8

---

## 1. General Principles & Conventions

- **RESTful Resource Modeling:** Endpoints are organized around core entities (`instruments`, `dossiers`, `facts`, `metrics`, `evidence`, `notes`, `snapshots`).
- **Standardized Response Envelopes:** All list queries return `{ "items": [...], "count": N }`. Single resource requests return the canonical model directly.
- **Consistent Error Responses:** Errors return an explicit HTTP status code with RFC 7807 compliant problem details:
  ```json
  {
    "detail": "Descriptive error message",
    "error_code": "INSTRUMENT_NOT_FOUND",
    "status": 404,
    "timestamp": "2026-11-19T14:30:00Z"
  }
  ```
- **Authentication & Headers:** Protected endpoints require an `Authorization: Bearer <jwt>` header (or valid session cookie). During local development with `MOCK_AUTH_ENABLED=true`, a default developer workspace identity is automatically injected.

---

## 2. Core Endpoints Reference

### 2.1 System Health & Service Status

#### `GET /health`
Returns the operational health of the FastAPI process and dependent database/cache connectivity.
- **Access:** Public
- **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "service": "marketscope-api",
    "version": "0.1.0",
    "environment": "development",
    "database": "connected"
  }
  ```

---

### 2.2 Instruments & Search

#### `GET /api/v1/instruments/search`
Searches for listed companies by exchange ticker symbol, company name, or ISIN.
- **Access:** Public / Workspace Member
- **Query Parameters:**
  - `q` (string, required, length 1–80): Search query (e.g. `TCS`, `Reliance`, `INE002A01018`).
  - `exchange` (string, optional): Filter by exchange (`NSE`, `BSE`).
- **Response `200 OK`:**
  ```json
  {
    "items": [
      {
        "instrument_id": "in-nse-reliance",
        "symbol": "RELIANCE",
        "company_name": "Reliance Industries Limited",
        "exchange": "NSE",
        "sector": "Energy / Retail / Digital Services",
        "currency": "INR",
        "data_status": "SYNTHETIC_DEMO"
      }
    ],
    "count": 1
  }
  ```

#### `GET /api/v1/instruments/{instrument_id}/resolve`
Resolves a specific instrument identifier into its canonical listing details and disambiguation status.
- **Access:** Public / Workspace Member
- **Path Parameters:**
  - `instrument_id` (string, required): Canonical instrument identifier (e.g. `in-nse-tcs`).
- **Response `200 OK`:**
  ```json
  {
    "instrument_id": "in-nse-tcs",
    "symbol": "TCS",
    "company_name": "Tata Consultancy Services Limited",
    "exchange": "NSE",
    "isin": "INE467B01029",
    "is_ambiguous": false,
    "candidate_listings": []
  }
  ```

---

### 2.3 Company Research Dossier & Metrics

#### `GET /api/v1/instruments/{instrument_id}/dossier`
Returns the complete research dossier for a company, including corporate profile, primary financial metrics, and evidence reference links.
- **Access:** Public / Workspace Member
- **Path Parameters:**
  - `instrument_id` (string, required): Canonical instrument identifier.
- **Response `200 OK`:**
  ```json
  {
    "instrument": {
      "instrument_id": "in-nse-reliance",
      "symbol": "RELIANCE",
      "company_name": "Reliance Industries Limited",
      "exchange": "NSE",
      "sector": "Energy / Retail / Digital Services",
      "currency": "INR",
      "data_status": "SYNTHETIC_DEMO"
    },
    "metrics": [
      {
        "metric_id": "revenue_growth",
        "label": "Revenue growth",
        "value": 8.4,
        "unit": "%",
        "period": "FY demo",
        "formula_version": "demo-1",
        "data_status": "SYNTHETIC_DEMO"
      },
      {
        "metric_id": "roe",
        "label": "Return on equity",
        "value": 9.8,
        "unit": "%",
        "period": "FY demo",
        "formula_version": "demo-1",
        "data_status": "SYNTHETIC_DEMO"
      }
    ],
    "evidence": [
      {
        "evidence_id": "ev-rel-fy-demo",
        "source_name": "Annual Report FY demo",
        "source_type": "ANNUAL_REPORT",
        "published_at": null,
        "retrieved_at": "2026-11-19T14:30:00Z",
        "quality_status": "VERIFIED"
      }
    ],
    "as_of": "2026-11-19T14:30:00Z",
    "data_status": "SYNTHETIC_DEMO"
  }
  ```

---

### 2.4 Evidence Lineage Inspector

#### `GET /api/v1/metrics/{metric_id}/evidence`
Fetches the granular mathematical derivation and filing source lineage for a specific calculated metric.
- **Access:** Public / Workspace Member
- **Path Parameters:**
  - `metric_id` (string, required): Unique metric key (e.g. `roe`).
- **Query Parameters:**
  - `instrument_id` (string, required): Instrument context.
- **Response `200 OK`:**
  ```json
  {
    "metric_id": "roe",
    "formula_name": "Return on Equity (ROE)",
    "formula_expression": "net_income / total_equity",
    "period": "FY2025",
    "calculated_value": 9.8,
    "unit": "%",
    "inputs": [
      {
        "fact_key": "net_income",
        "label": "Net Profit after Tax",
        "value": 69648.0,
        "currency": "INR",
        "scale": "Crores",
        "source_filing": "Audited Consolidated Financial Results FY2025",
        "filing_url": "https://example.com/filings/rel-fy25.pdf",
        "reported_page": 42
      },
      {
        "fact_key": "total_equity",
        "label": "Total Shareholders Equity",
        "value": 710693.0,
        "currency": "INR",
        "scale": "Crores",
        "source_filing": "Balance Sheet as at 31 March 2025",
        "filing_url": "https://example.com/filings/rel-fy25.pdf",
        "reported_page": 43
      }
    ]
  }
  ```

---

### 2.5 Workspace Research Notes

#### `GET /api/v1/workspaces/{workspace_id}/notes`
Lists all research notes saved in the user's isolated workspace.
- **Access:** Authenticated Workspace Member

#### `POST /api/v1/workspaces/{workspace_id}/notes`
Creates a new research note associated with an instrument and specific metrics.
- **Access:** Authenticated Workspace Member
- **Request Body:**
  ```json
  {
    "instrument_id": "in-nse-reliance",
    "title": "Capital Expenditure & Debt Thesis",
    "content": "Monitoring retail expansion and 5G capex cycle. Debt-to-equity ratio of 0.42x remains well within historical bounds."
  }
  ```
- **Response `201 Created`:** Returns created note record with UUID and timestamps.

---

### 2.6 Immutable Research Snapshots

#### `POST /api/v1/workspaces/{workspace_id}/snapshots`
Captures an immutable, cryptographically hashable freeze of a company dossier.
- **Access:** Authenticated Workspace Member
- **Request Body:**
  ```json
  {
    "instrument_id": "in-nse-reliance",
    "snapshot_name": "Post-Q3 FY25 Earnings Review",
    "notes": "Thesis valid based on reported operational margins."
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "snapshot_id": "550e8400-e29b-41d4-a716-446655440000",
    "instrument_id": "in-nse-reliance",
    "snapshot_name": "Post-Q3 FY25 Earnings Review",
    "payload_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "created_at": "2026-11-19T14:35:00Z"
  }
  ```
