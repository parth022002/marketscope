import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.seed import DEFAULT_WORKSPACE_ID
from app.engine.calculations import (
    compute_snapshot_checksum,
    verify_snapshot_checksum,
    calculate_financial_ratios,
)


@pytest.fixture
def client():
    return TestClient(app)


# ─── PHASE 2 TESTS ────────────────────────────────────────────────────────────

def test_financial_statements_income_statement(client):
    res = client.get("/api/v1/instruments/RELIANCE/statements?statement_type=income_statement&period_type=annual")
    assert res.status_code == 200
    data = res.json()
    assert data["symbol"] == "RELIANCE"
    assert data["statement_type"] == "income_statement"
    assert "FY24" in data["periods"]
    assert len(data["items"]) >= 8

    # Verify Revenue and Net Profit exist
    rev_item = next((i for i in data["items"] if "Revenue from Operations" in i["line_item"]), None)
    assert rev_item is not None
    assert rev_item["fy24"] == 901064.0


def test_financial_statements_balance_sheet_and_cash_flow(client):
    # Balance Sheet
    bs_res = client.get("/api/v1/instruments/TCS/statements?statement_type=balance_sheet")
    assert bs_res.status_code == 200
    bs_data = bs_res.json()
    equity_item = next((i for i in bs_data["items"] if "Shareholders' Equity" in i["line_item"]), None)
    assert equity_item is not None
    assert equity_item["fy24"] == 95578.0

    # Cash Flow
    cf_res = client.get("/api/v1/instruments/TCS/statements?statement_type=cash_flow")
    assert cf_res.status_code == 200
    cf_data = cf_res.json()
    fcf_item = next((i for i in cf_data["items"] if "Free Cash Flow" in i["line_item"]), None)
    assert fcf_item is not None
    assert fcf_item["fy24"] == 41292.0


def test_financial_statements_quarterly(client):
    res = client.get("/api/v1/instruments/INFY/statements?statement_type=income_statement&period_type=quarterly")
    assert res.status_code == 200
    data = res.json()
    assert data["period_type"] == "quarterly"
    assert "Q1 FY24" in data["periods"]
    assert len(data["items"]) >= 1


def test_golden_financial_ratios():
    # TCS Golden Metric Assertions
    tcs_ratios = calculate_financial_ratios("TCS")
    assert tcs_ratios["symbol"] == "TCS"
    # ROE = (PAT 46099 / Equity 95578) * 100 = 48.23%
    assert 48.0 < tcs_ratios["profitability"]["roe"] < 48.5
    # Debt/Equity = (Debt 7646 / Equity 95578) = 0.08x
    assert tcs_ratios["solvency"]["debt_to_equity"] == 0.08
    # Free Cash Flow = 41292.0 Cr
    assert tcs_ratios["cash_flow"]["fcf"] == 41292.0


def test_company_ratios_endpoint(client):
    res = client.get("/api/v1/instruments/RELIANCE/ratios")
    assert res.status_code == 200
    data = res.json()
    assert data["valuation"]["pe_ratio"] is not None
    assert data["solvency"]["debt_to_equity"] == 0.42


# ─── PHASE 3 TESTS ────────────────────────────────────────────────────────────

def test_peer_comparison_endpoint(client):
    res = client.get("/api/v1/instruments/TCS/peers")
    assert res.status_code == 200
    data = res.json()
    assert data["target_symbol"] == "TCS"
    assert len(data["peers"]) >= 2
    symbols = [p["symbol"] for p in data["peers"]]
    assert "TCS" in symbols
    assert "INFY" in symbols
    assert len(data["alignment_warnings"]) >= 1


def test_screener_presets_and_run(client):
    # Presets
    presets_res = client.get("/api/v1/screener/presets")
    assert presets_res.status_code == 200
    assert len(presets_res.json()["presets"]) >= 3

    # Run Screener: ROE >= 25%
    screen_payload = {"min_roe": 25.0}
    run_res = client.post("/api/v1/screener/run", json=screen_payload)
    assert run_res.status_code == 200
    results = run_res.json()["results"]
    assert len(results) >= 2
    for item in results:
        assert item["roe"] >= 25.0


def test_watchlists_crud(client):
    ws_id = str(DEFAULT_WORKSPACE_ID)

    # 1. Create Watchlist
    wl_payload = {"name": "High Conviction Compounders", "description": "Top Indian IT & Consumer"}
    create_wl = client.post(f"/api/v1/workspaces/{ws_id}/watchlists", json=wl_payload)
    assert create_wl.status_code == 201
    wl_id = create_wl.json()["id"]

    # 2. Add Item to Watchlist
    add_item = client.post(
        f"/api/v1/workspaces/{ws_id}/watchlists/{wl_id}/items",
        json={"symbol": "TCS", "notes": "Leader in enterprise AI & consulting"},
    )
    assert add_item.status_code == 201
    item_id = add_item.json()["id"]

    # 3. List Watchlists
    list_wl = client.get(f"/api/v1/workspaces/{ws_id}/watchlists")
    assert list_wl.status_code == 200
    wls = list_wl.json()
    target_wl = next((w for w in wls if w["id"] == wl_id), None)
    assert target_wl is not None
    assert len(target_wl["items"]) == 1
    assert target_wl["items"][0]["symbol"] == "TCS"

    # 4. Delete Watchlist Item
    del_item = client.delete(f"/api/v1/workspaces/{ws_id}/watchlists/{wl_id}/items/{item_id}")
    assert del_item.status_code == 200


def test_immutable_research_snapshots(client):
    ws_id = str(DEFAULT_WORKSPACE_ID)

    # 1. Create Immutable Snapshot
    snap_payload = {
        "instrument_id": "in-nse-reliance",
        "snapshot_label": "FY24 Annual Performance Research Snapshot",
        "thesis": "Retail & Telecom cash generation sustaining balance sheet strength.",
    }
    create_snap = client.post(f"/api/v1/workspaces/{ws_id}/snapshots", json=snap_payload)
    assert create_snap.status_code == 201
    snap_data = create_snap.json()
    snap_id = snap_data["id"]
    checksum = snap_data["checksum"]
    assert checksum is not None
    assert snap_data["is_valid"] is True

    # 2. Retrieve & Cryptographically Verify
    get_snap = client.get(f"/api/v1/workspaces/{ws_id}/snapshots/{snap_id}")
    assert get_snap.status_code == 200
    verified_data = get_snap.json()
    assert verified_data["is_valid"] is True
    assert verified_data["checksum"] == checksum

    # 3. Verify Tamper Detection
    tampered_payload = dict(verified_data["payload"])
    tampered_payload["thesis"] = "TAMPERED THESIS CONTENT"
    assert verify_snapshot_checksum(tampered_payload, checksum) is False
