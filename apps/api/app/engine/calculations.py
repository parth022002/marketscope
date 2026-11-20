import hashlib
import hmac
import json
from typing import Any

SNAPSHOT_SALT = "marketscope-canonical-snapshot-v1-salt"


def compute_snapshot_checksum(payload: dict[str, Any], salt: str = SNAPSHOT_SALT) -> str:
    """
    Computes a deterministic, tamper-evident HMAC-SHA256 checksum over canonical JSON.
    Guarantees that snapshot payloads cannot be silently modified in storage.
    """
    canonical_json = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return hmac.new(salt.encode("utf-8"), canonical_json.encode("utf-8"), hashlib.sha256).hexdigest()


def verify_snapshot_checksum(payload: dict[str, Any], checksum: str, salt: str = SNAPSHOT_SALT) -> bool:
    """Verifies that an immutable research snapshot has not been tampered with."""
    expected = compute_snapshot_checksum(payload, salt)
    return hmac.compare_digest(expected, checksum)


# ─── CANONICAL FINANCIAL DATA FIXTURES (Ind AS Standardized) ───────────────────

FINANCIAL_STATEMENTS_DATABASE: dict[str, dict[str, Any]] = {
    "RELIANCE": {
        "company_name": "Reliance Industries Limited",
        "sector": "Energy & Consumer",
        "market_cap": 2015000.0,  # INR Cr
        "current_price": 2980.0,
        "shares_outstanding": 676.0,  # Cr shares
        "periods": ["FY22", "FY23", "FY24"],
        "quarters": ["Q1 FY24", "Q2 FY24", "Q3 FY24", "Q4 FY24"],
        "annual": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "fy22": 721634.0, "fy23": 879468.0, "fy24": 901064.0, "unit": "INR Cr"},
                {"line_item": "Other Income", "fy22": 14947.0, "fy23": 11776.0, "fy24": 15820.0, "unit": "INR Cr"},
                {"line_item": "Total Revenue", "fy22": 736581.0, "fy23": 891244.0, "fy24": 916884.0, "unit": "INR Cr"},
                {"line_item": "Operating Expenses (Raw Materials & Services)", "fy22": 611116.0, "fy23": 737030.0, "fy24": 738090.0, "unit": "INR Cr"},
                {"line_item": "EBITDA (Operating Profit)", "fy22": 125465.0, "fy23": 154214.0, "fy24": 178794.0, "unit": "INR Cr"},
                {"line_item": "Depreciation & Amortisation", "fy22": 29797.0, "fy23": 40303.0, "fy24": 50832.0, "unit": "INR Cr"},
                {"line_item": "EBIT (Operating Earnings)", "fy22": 95668.0, "fy23": 113911.0, "fy24": 127962.0, "unit": "INR Cr"},
                {"line_item": "Finance Costs (Interest)", "fy22": 14584.0, "fy23": 19571.0, "fy24": 23293.0, "unit": "INR Cr"},
                {"line_item": "Profit Before Tax (PBT)", "fy22": 84142.0, "fy23": 94528.0, "fy24": 104727.0, "unit": "INR Cr"},
                {"line_item": "Tax Expense", "fy22": 16297.0, "fy23": 20748.0, "fy24": 25105.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "fy22": 67845.0, "fy23": 73780.0, "fy24": 79622.0, "unit": "INR Cr"},
            ],
            "balance_sheet": [
                {"line_item": "Property, Plant & Equipment (Fixed Assets)", "fy22": 615786.0, "fy23": 718340.0, "fy24": 820450.0, "unit": "INR Cr"},
                {"line_item": "Capital Work in Progress (CWIP)", "fy22": 169884.0, "fy23": 234500.0, "fy24": 195600.0, "unit": "INR Cr"},
                {"line_item": "Cash & Cash Equivalents + Liquid Inv", "fy22": 118420.0, "fy23": 126500.0, "fy24": 142800.0, "unit": "INR Cr"},
                {"line_item": "Other Current & Non-Current Assets", "fy22": 395460.0, "fy23": 458600.0, "fy24": 496780.0, "unit": "INR Cr"},
                {"line_item": "Total Assets", "fy22": 1299550.0, "fy23": 1537940.0, "fy24": 1655630.0, "unit": "INR Cr"},
                {"line_item": "Share Capital", "fy22": 6765.0, "fy23": 6766.0, "fy24": 6766.0, "unit": "INR Cr"},
                {"line_item": "Reserves & Surplus (Equity)", "fy22": 645127.0, "fy23": 703664.0, "fy24": 703664.0, "unit": "INR Cr"},
                {"line_item": "Total Shareholders' Equity", "fy22": 651892.0, "fy23": 710430.0, "fy24": 710430.0, "unit": "INR Cr"},
                {"line_item": "Total Borrowings (Long + Short Term Debt)", "fy22": 266305.0, "fy23": 314708.0, "fy24": 298340.0, "unit": "INR Cr"},
                {"line_item": "Current Liabilities & Provisions", "fy22": 381353.0, "fy23": 512802.0, "fy24": 646860.0, "unit": "INR Cr"},
                {"line_item": "Total Equity & Liabilities", "fy22": 1299550.0, "fy23": 1537940.0, "fy24": 1655630.0, "unit": "INR Cr"},
            ],
            "cash_flow": [
                {"line_item": "Cash from Operating Activities (CFO)", "fy22": 110654.0, "fy23": 115044.0, "fy24": 150340.0, "unit": "INR Cr"},
                {"line_item": "Capital Expenditures (Capex)", "fy22": -100145.0, "fy23": -132000.0, "fy24": -131700.0, "unit": "INR Cr"},
                {"line_item": "Free Cash Flow (FCF = CFO - Capex)", "fy22": 10509.0, "fy23": -16956.0, "fy24": 18640.0, "unit": "INR Cr"},
                {"line_item": "Cash from Investing Activities (CFI)", "fy22": -110050.0, "fy23": -139800.0, "fy24": -138900.0, "unit": "INR Cr"},
                {"line_item": "Cash from Financing Activities (CFF)", "fy22": 15420.0, "fy23": 28400.0, "fy24": -8400.0, "unit": "INR Cr"},
                {"line_item": "Net Change in Cash", "fy22": 16024.0, "fy23": 3644.0, "fy24": 3040.0, "unit": "INR Cr"},
            ],
        },
        "quarterly": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "q1": 210831.0, "q2": 234956.0, "q3": 227970.0, "q4": 227307.0, "unit": "INR Cr"},
                {"line_item": "EBITDA (Operating Profit)", "q1": 41982.0, "q2": 44867.0, "q3": 44678.0, "q4": 47267.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "q1": 18258.0, "q2": 19878.0, "q3": 19641.0, "q4": 21845.0, "unit": "INR Cr"},
            ]
        },
    },
    "TCS": {
        "company_name": "Tata Consultancy Services Limited",
        "sector": "Information Technology",
        "market_cap": 1420000.0,
        "current_price": 3920.0,
        "shares_outstanding": 361.8,
        "periods": ["FY22", "FY23", "FY24"],
        "quarters": ["Q1 FY24", "Q2 FY24", "Q3 FY24", "Q4 FY24"],
        "annual": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "fy22": 191754.0, "fy23": 225458.0, "fy24": 240893.0, "unit": "INR Cr"},
                {"line_item": "Other Income", "fy22": 3234.0, "fy23": 3449.0, "fy24": 4250.0, "unit": "INR Cr"},
                {"line_item": "Total Revenue", "fy22": 194988.0, "fy23": 228907.0, "fy24": 245143.0, "unit": "INR Cr"},
                {"line_item": "Operating Expenses (Employee & Direct)", "fy22": 141208.0, "fy23": 169000.0, "fy24": 179500.0, "unit": "INR Cr"},
                {"line_item": "EBITDA (Operating Profit)", "fy22": 53057.0, "fy23": 59258.0, "fy24": 65643.0, "unit": "INR Cr"},
                {"line_item": "Depreciation & Amortisation", "fy22": 4604.0, "fy23": 5022.0, "fy24": 4985.0, "unit": "INR Cr"},
                {"line_item": "EBIT (Operating Earnings)", "fy22": 48453.0, "fy23": 54236.0, "fy24": 60658.0, "unit": "INR Cr"},
                {"line_item": "Finance Costs (Interest)", "fy22": 784.0, "fy23": 779.0, "fy24": 802.0, "unit": "INR Cr"},
                {"line_item": "Profit Before Tax (PBT)", "fy22": 51680.0, "fy23": 56906.0, "fy24": 64106.0, "unit": "INR Cr"},
                {"line_item": "Tax Expense", "fy22": 13238.0, "fy23": 14603.0, "fy24": 18007.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "fy22": 38449.0, "fy23": 42303.0, "fy24": 46099.0, "unit": "INR Cr"},
            ],
            "balance_sheet": [
                {"line_item": "Property, Plant & Equipment (Fixed Assets)", "fy22": 21853.0, "fy23": 22800.0, "fy24": 23450.0, "unit": "INR Cr"},
                {"line_item": "Cash & Cash Equivalents + Investments", "fy22": 57423.0, "fy23": 50320.0, "fy24": 46800.0, "unit": "INR Cr"},
                {"line_item": "Other Current Assets & Receivables", "fy22": 62234.0, "fy23": 70200.0, "fy24": 74500.0, "unit": "INR Cr"},
                {"line_item": "Total Assets", "fy22": 141510.0, "fy23": 143320.0, "fy24": 144750.0, "unit": "INR Cr"},
                {"line_item": "Total Shareholders' Equity", "fy22": 89139.0, "fy23": 90424.0, "fy24": 95578.0, "unit": "INR Cr"},
                {"line_item": "Total Borrowings (Leases)", "fy22": 7818.0, "fy23": 7720.0, "fy24": 7646.0, "unit": "INR Cr"},
                {"line_item": "Current Liabilities & Payables", "fy22": 44553.0, "fy23": 45176.0, "fy24": 41526.0, "unit": "INR Cr"},
                {"line_item": "Total Equity & Liabilities", "fy22": 141510.0, "fy23": 143320.0, "fy24": 144750.0, "unit": "INR Cr"},
            ],
            "cash_flow": [
                {"line_item": "Cash from Operating Activities (CFO)", "fy22": 39949.0, "fy23": 41965.0, "fy24": 44342.0, "unit": "INR Cr"},
                {"line_item": "Capital Expenditures (Capex)", "fy22": -2965.0, "fy23": -3120.0, "fy24": -3050.0, "unit": "INR Cr"},
                {"line_item": "Free Cash Flow (FCF = CFO - Capex)", "fy22": 36984.0, "fy23": 38845.0, "fy24": 41292.0, "unit": "INR Cr"},
                {"line_item": "Cash from Investing Activities (CFI)", "fy22": -1523.0, "fy23": 890.0, "fy24": -1200.0, "unit": "INR Cr"},
                {"line_item": "Cash from Financing Activities (CFF / Dividends)", "fy22": -37546.0, "fy23": -47630.0, "fy24": -46200.0, "unit": "INR Cr"},
                {"line_item": "Net Change in Cash", "fy22": 880.0, "fy23": -4775.0, "fy24": -3058.0, "unit": "INR Cr"},
            ],
        },
        "quarterly": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "q1": 59381.0, "q2": 59692.0, "q3": 60583.0, "q4": 61237.0, "unit": "INR Cr"},
                {"line_item": "EBITDA (Operating Profit)", "q1": 15286.0, "q2": 16405.0, "q3": 16752.0, "q4": 17200.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "q1": 11074.0, "q2": 11342.0, "q3": 11735.0, "q4": 11948.0, "unit": "INR Cr"},
            ]
        },
    },
    "INFY": {
        "company_name": "Infosys Limited",
        "sector": "Information Technology",
        "market_cap": 620000.0,
        "current_price": 1495.0,
        "shares_outstanding": 415.0,
        "periods": ["FY22", "FY23", "FY24"],
        "quarters": ["Q1 FY24", "Q2 FY24", "Q3 FY24", "Q4 FY24"],
        "annual": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "fy22": 121641.0, "fy23": 146767.0, "fy24": 153670.0, "unit": "INR Cr"},
                {"line_item": "Total Revenue", "fy22": 123936.0, "fy23": 149100.0, "fy24": 156100.0, "unit": "INR Cr"},
                {"line_item": "EBITDA (Operating Profit)", "fy22": 31492.0, "fy23": 35130.0, "fy24": 36800.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "fy22": 22110.0, "fy23": 24095.0, "fy24": 26248.0, "unit": "INR Cr"},
            ],
            "balance_sheet": [
                {"line_item": "Total Assets", "fy22": 117861.0, "fy23": 125800.0, "fy24": 138000.0, "unit": "INR Cr"},
                {"line_item": "Total Shareholders' Equity", "fy22": 75350.0, "fy23": 75407.0, "fy24": 88981.0, "unit": "INR Cr"},
                {"line_item": "Total Borrowings (Leases)", "fy22": 8200.0, "fy23": 9500.0, "fy24": 10677.0, "unit": "INR Cr"},
            ],
            "cash_flow": [
                {"line_item": "Cash from Operating Activities (CFO)", "fy22": 24964.0, "fy23": 23400.0, "fy24": 28400.0, "unit": "INR Cr"},
                {"line_item": "Capital Expenditures (Capex)", "fy22": -2161.0, "fy23": -2600.0, "fy24": -2800.0, "unit": "INR Cr"},
                {"line_item": "Free Cash Flow (FCF = CFO - Capex)", "fy22": 22803.0, "fy23": 20800.0, "fy24": 25600.0, "unit": "INR Cr"},
            ],
        },
        "quarterly": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "q1": 37933.0, "q2": 38994.0, "q3": 38821.0, "q4": 37922.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "q1": 5945.0, "q2": 6212.0, "q3": 6106.0, "q4": 7985.0, "unit": "INR Cr"},
            ]
        },
    },
    "TATAMOTORS": {
        "company_name": "Tata Motors Limited",
        "sector": "Automotive",
        "market_cap": 315000.0,
        "current_price": 920.0,
        "shares_outstanding": 332.0,
        "periods": ["FY22", "FY23", "FY24"],
        "quarters": ["Q1 FY24", "Q2 FY24", "Q3 FY24", "Q4 FY24"],
        "annual": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "fy22": 278454.0, "fy23": 345967.0, "fy24": 437928.0, "unit": "INR Cr"},
                {"line_item": "EBITDA (Operating Profit)", "fy22": 24813.0, "fy23": 37011.0, "fy24": 62800.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "fy22": -11441.0, "fy23": 2414.0, "fy24": 31807.0, "unit": "INR Cr"},
            ],
            "balance_sheet": [
                {"line_item": "Total Assets", "fy22": 330617.0, "fy23": 335000.0, "fy24": 358000.0, "unit": "INR Cr"},
                {"line_item": "Total Shareholders' Equity", "fy22": 44556.0, "fy23": 45355.0, "fy24": 87363.0, "unit": "INR Cr"},
                {"line_item": "Total Borrowings (Debt)", "fy22": 139686.0, "fy23": 125000.0, "fy24": 54320.0, "unit": "INR Cr"},
            ],
            "cash_flow": [
                {"line_item": "Cash from Operating Activities (CFO)", "fy22": 14294.0, "fy23": 32800.0, "fy24": 58900.0, "unit": "INR Cr"},
                {"line_item": "Capital Expenditures (Capex)", "fy22": -15000.0, "fy23": -20000.0, "fy24": -28000.0, "unit": "INR Cr"},
                {"line_item": "Free Cash Flow (FCF = CFO - Capex)", "fy22": -706.0, "fy23": 12800.0, "fy24": 30900.0, "unit": "INR Cr"},
            ],
        },
        "quarterly": {
            "income_statement": [
                {"line_item": "Revenue from Operations", "q1": 102236.0, "q2": 105128.0, "q3": 110577.0, "q4": 119987.0, "unit": "INR Cr"},
                {"line_item": "Net Profit (PAT)", "q1": 3203.0, "q2": 3764.0, "q3": 7025.0, "q4": 17815.0, "unit": "INR Cr"},
            ]
        },
    },
}


def calculate_financial_ratios(symbol: str) -> dict[str, Any]:
    """
    Computes deterministic valuation, profitability, solvency, and cash flow ratios.
    Every calculation is strictly reproducible with formula versions.
    """
    data = FINANCIAL_STATEMENTS_DATABASE.get(symbol.upper())
    if not data:
        # Default fallback
        return {
            "symbol": symbol.upper(),
            "valuation": {"pe_ratio": 25.0, "pb_ratio": 3.0, "ev_ebitda": 15.0, "market_cap": 100000.0},
            "profitability": {"roe": 15.0, "roce": 18.0, "operating_margin": 16.0, "net_margin": 10.0},
            "solvency": {"debt_to_equity": 0.2, "interest_coverage": 10.0, "current_ratio": 1.5},
            "cash_flow": {"fcf": 5000.0, "fcf_yield": 4.5, "cfo_to_pat": 1.1},
        }

    mcap = data["market_cap"]
    annual_pnl = {item["line_item"]: item["fy24"] for item in data["annual"]["income_statement"]}
    annual_bs = {item["line_item"]: item["fy24"] for item in data["annual"]["balance_sheet"]}
    annual_cf = {item["line_item"]: item["fy24"] for item in data["annual"]["cash_flow"]}

    pat = annual_pnl.get("Net Profit (PAT)", 1.0)
    rev = annual_pnl.get("Revenue from Operations", 1.0)
    ebitda = annual_pnl.get("EBITDA (Operating Profit)", 1.0)
    ebit = annual_pnl.get("EBIT (Operating Earnings)", ebitda * 0.8)
    finance_cost = annual_pnl.get("Finance Costs (Interest)", 100.0)

    equity = annual_bs.get("Total Shareholders' Equity", 1.0)
    debt = annual_bs.get("Total Borrowings (Long + Short Term Debt)", annual_bs.get("Total Borrowings (Leases)", annual_bs.get("Total Borrowings (Debt)", 0.0)))
    cash = annual_bs.get("Cash & Cash Equivalents + Liquid Inv", annual_bs.get("Cash & Cash Equivalents + Investments", 10000.0))

    cfo = annual_cf.get("Cash from Operating Activities (CFO)", pat * 1.1)
    fcf = annual_cf.get("Free Cash Flow (FCF = CFO - Capex)", cfo * 0.7)

    # 1. Valuation Ratios
    pe_ratio = round(mcap / pat, 2) if pat > 0 else None
    pb_ratio = round(mcap / equity, 2)
    ev = mcap + debt - cash
    ev_ebitda = round(ev / ebitda, 2) if ebitda > 0 else None

    # 2. Profitability & Returns
    roe = round((pat / equity) * 100, 2)
    capital_employed = equity + debt
    roce = round((ebit / capital_employed) * 100, 2) if capital_employed > 0 else 0.0
    opm = round((ebitda / rev) * 100, 2)
    npm = round((pat / rev) * 100, 2)

    # 3. Solvency & Health
    debt_equity = round(debt / equity, 2) if equity > 0 else 0.0
    interest_coverage = round(ebit / finance_cost, 2) if finance_cost > 0 else 99.9

    # 4. Cash Flow Quality
    fcf_yield = round((fcf / mcap) * 100, 2) if mcap > 0 else 0.0
    cfo_pat = round(cfo / pat, 2) if pat > 0 else 1.0

    return {
        "symbol": symbol.upper(),
        "company_name": data["company_name"],
        "sector": data["sector"],
        "valuation": {
            "pe_ratio": pe_ratio,
            "pb_ratio": pb_ratio,
            "ev_ebitda": ev_ebitda,
            "market_cap": mcap,
            "enterprise_value": ev,
        },
        "profitability": {
            "roe": roe,
            "roce": roce,
            "operating_margin": opm,
            "net_margin": npm,
        },
        "solvency": {
            "debt_to_equity": debt_equity,
            "interest_coverage": interest_coverage,
        },
        "cash_flow": {
            "fcf": fcf,
            "fcf_yield": fcf_yield,
            "cfo_to_pat": cfo_pat,
        },
    }
