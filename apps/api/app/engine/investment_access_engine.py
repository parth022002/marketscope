"""
MarketScope.io — Resident Indian Investment Access & Regulatory Eligibility Engine
Classifies financial instruments into legally grounded investment access statuses
for Indian residents under RBI (LRS / FEMA), SEBI, and IFSCA (GIFT City) frameworks.
Strictly research & intelligence — non-brokerage.
"""

from dataclasses import dataclass
from enum import Enum


class InvestmentAccessStatus(str, Enum):
    DOMESTIC_ACCESS = "DOMESTIC_ACCESS"
    INTERNATIONAL_ACCESS_SUBJECT_TO_LRS = "INTERNATIONAL_ACCESS_SUBJECT_TO_LRS"
    ACCESS_VIA_IFSC_ROUTE = "ACCESS_VIA_IFSC_ROUTE"
    ACCESS_VIA_DOMESTIC_FUND = "ACCESS_VIA_DOMESTIC_FUND"
    ACCESS_SUBJECT_TO_INTERMEDIARY = "ACCESS_SUBJECT_TO_INTERMEDIARY"
    RESEARCH_ONLY = "RESEARCH_ONLY"
    RESTRICTED_OR_UNVERIFIED = "RESTRICTED_OR_UNVERIFIED"
    NOT_AVAILABLE = "NOT_AVAILABLE"


@dataclass(frozen=True)
class InvestmentAccessClassification:
    status: InvestmentAccessStatus
    display_badge: str
    description: str
    governing_framework: str
    permitted_route: str
    key_conditions: list[str]
    disclaimer: str


class InvestmentAccessEngine:
    """Evaluates regulatory investment access rules for resident Indian individuals."""

    @staticmethod
    def classify(
        asset_class: str,
        exchange: str,
        country_code: str = "IN",
        isin: str | None = None,
        is_feeder_fund: bool = False,
    ) -> InvestmentAccessClassification:
        ac = asset_class.upper().strip()
        exch = exchange.upper().strip()
        cc = country_code.upper().strip()

        # 1. Domestic Indian Assets (NSE, BSE, MCX, NCDEX, AMFI, RBI)
        if cc == "IN" and exch in ("NSE", "BSE", "MCX", "NCDEX", "AMFI", "RBI"):
            if ac in ("EQUITY", "INDEX", "ETF", "REIT", "INVIT"):
                return InvestmentAccessClassification(
                    status=InvestmentAccessStatus.DOMESTIC_ACCESS,
                    display_badge="Direct Domestic Access",
                    description="Freely tradeable by resident Indians via SEBI-registered brokers and domestic depositories (NSDL / CDSL).",
                    governing_framework="SEBI / Depositories Act 1996",
                    permitted_route="Standard Demat & Trading Account with SEBI-registered broker",
                    key_conditions=[
                        "Valid PAN and KYC required",
                        "Securities Transaction Tax (STT) applicable",
                        "Capital gains tax under Section 112A / 111A of Income Tax Act",
                    ],
                    disclaimer="MarketScope.io is an independent research platform, not a broker. Execute trades exclusively through SEBI-registered intermediaries.",
                )

            if ac in ("FUTURE", "OPTION"):
                return InvestmentAccessClassification(
                    status=InvestmentAccessStatus.DOMESTIC_ACCESS,
                    display_badge="Domestic Derivatives (Risk Warning)",
                    description="Exchange-traded derivatives available on NSE/BSE/MCX subject to SEBI risk disclosure and margin framework.",
                    governing_framework="SEBI Equity & Commodity Derivatives Framework",
                    permitted_route="SEBI Derivatives enabled Trading & Demat Account",
                    key_conditions=[
                        "SEBI Warning: 9 out of 10 individual traders in equity F&O segment incur net losses",
                        "Mandatory upfront SPAN + Exposure margins",
                        "Strict client suitability and risk disclosure required",
                    ],
                    disclaimer="Derivatives involve significant capital risk. Data provided solely for institutional research and volatility analysis.",
                )

            if ac in ("GOVERNMENT_BOND", "TREASURY_BILL", "SGB"):
                return InvestmentAccessClassification(
                    status=InvestmentAccessStatus.DOMESTIC_ACCESS,
                    display_badge="Sovereign Direct Access",
                    description="Government securities, T-Bills, and Sovereign Gold Bonds accessible directly via RBI Retail Direct or NSE/BSE debt segments.",
                    governing_framework="RBI Retail Direct Scheme / SEBI Debt Segment",
                    permitted_route="RBI Retail Direct Portal or Demat Account via exchange debt platform",
                    key_conditions=[
                        "Zero account opening and maintenance fee on RBI Retail Direct",
                        "Direct sovereign credit guarantee (Govt of India)",
                        "SGB capital gains exempt on redemption for individuals",
                    ],
                    disclaimer="Yield metrics and prices are indicative. G-Sec allotments subject to RBI auction results.",
                )

            if ac == "MUTUAL_FUND":
                if is_feeder_fund:
                    return InvestmentAccessClassification(
                        status=InvestmentAccessStatus.ACCESS_VIA_DOMESTIC_FUND,
                        display_badge="Domestic Fund / Feeder Route",
                        description="Domestic SEBI-registered feeder fund investing in offshore underlying mutual funds/ETFs. Rupee denominated.",
                        governing_framework="SEBI (Mutual Funds) Regulations, 1996 & RBI Overseas Fund Cap ($7B industry cap)",
                        permitted_route="Direct or Regular Plan via domestic AMC in INR (No personal LRS remittance required)",
                        key_conditions=[
                            "Invested in INR, AMC manages overseas investment within industry aggregate cap",
                            "Does not consume individual USD 250,000 LRS limit",
                            "Subject to RBI overall industry limit of USD 7 Billion for overseas mutual fund investments",
                        ],
                        disclaimer="Check AMC overseas subscription windows as industry limits may occasionally halt fresh inflows.",
                    )
                return InvestmentAccessClassification(
                    status=InvestmentAccessStatus.DOMESTIC_ACCESS,
                    display_badge="Domestic Mutual Fund",
                    description="SEBI-registered open-ended and closed-ended schemes accessible directly or via AMFI-registered distributors (MF Central / CAMS / KFintech).",
                    governing_framework="SEBI (Mutual Funds) Regulations, 1996",
                    permitted_route="Direct Plan via AMC or Regular Plan via AMFI Registered Mutual Fund Distributor",
                    key_conditions=[
                        "NAV declared daily at end of trading day by AMCs",
                        "Mutual fund investments are subject to market risks; read scheme documents carefully",
                    ],
                    disclaimer="Past fund performance is not an indicator of future returns.",
                )

        # 2. GIFT City IFSC Route (NSE IFSC / India INX)
        if exch in ("INX", "NSEIX", "NSE_IFSC"):
            return InvestmentAccessClassification(
                status=InvestmentAccessStatus.ACCESS_VIA_IFSC_ROUTE,
                display_badge="GIFT City IFSC Route",
                description="International securities and unsponsored depository receipts accessible to Indian residents under the IFSCA GIFT City framework.",
                governing_framework="IFSCA (Banking / Capital Markets) Regulations & RBI LRS",
                permitted_route="Account with IFSCA-registered broker in GIFT City SEZ",
                key_conditions=[
                    "Funds remitted into GIFT City account count against the USD 250,000 LRS limit",
                    "Tax exemptions under Section 47(viiab) for specified transfers in IFSC",
                    "Denominated in US Dollars (USD)",
                ],
                disclaimer="Access subject to IFSCA intermediary account setup and compliance verification.",
            )

        # 3. Domestic Feeder Funds for Global Assets
        if is_feeder_fund or ac == "MUTUAL_FUND" and cc != "IN":
            return InvestmentAccessClassification(
                status=InvestmentAccessStatus.ACCESS_VIA_DOMESTIC_FUND,
                display_badge="Indirect Domestic Feeder Fund",
                description="Resident Indians can gain exposure to this international market indirectly in INR via SEBI-registered Fund-of-Funds (FoF) or index feeder funds.",
                governing_framework="SEBI Overseas Investment Guidelines for Domestic Mutual Funds",
                permitted_route="Invest in INR via domestic mutual fund platforms without requiring foreign currency remittance",
                key_conditions=[
                    "Does NOT count towards personal USD 250,000 LRS limit",
                    "Subject to industry-wide SEBI cap (aggregate USD 7 billion limit across mutual funds)",
                    "Taxed according to domestic debt/specified mutual fund tax slabs under Income Tax Act",
                ],
                disclaimer="Certain domestic global feeder funds periodically pause fresh inflows due to SEBI overseas investment cap limits.",
            )

        # 4. International Equities & ETFs (US, UK, Europe, etc.) under RBI LRS
        if ac in ("EQUITY", "ETF", "REIT") and cc != "IN":
            return InvestmentAccessClassification(
                status=InvestmentAccessStatus.INTERNATIONAL_ACCESS_SUBJECT_TO_LRS,
                display_badge="International Access (RBI LRS)",
                description="Accessible to resident Indian individuals for direct foreign portfolio investment under the RBI Liberalised Remittance Scheme.",
                governing_framework="RBI Master Direction - Liberalised Remittance Scheme (FEMA 1999)",
                permitted_route="Remittance through Authorized Dealer (AD Category I Bank) to approved foreign broker",
                key_conditions=[
                    "Strict aggregate limit: USD 250,000 per financial year per resident individual",
                    "Tax Collected at Source (TCS) of 20% applies on foreign outward remittances exceeding ₹7 Lakhs/FY (Section 206C(1G))",
                    "Mandatory reporting of Foreign Assets in Schedule FA of Income Tax Return (ITR)",
                    "Direct margin trading, leveraged trading, or short-selling abroad is STRICTLY PROHIBITED under LRS",
                ],
                disclaimer="LRS limits are aggregate across all foreign remittances (travel, education, investments). Consult an Authorized Dealer Bank.",
            )

        # 5. Offshore Derivatives, FX Margin, and Spot Commodities
        if ac in ("FUTURE", "OPTION", "CURRENCY") and cc != "IN":
            return InvestmentAccessClassification(
                status=InvestmentAccessStatus.RESEARCH_ONLY,
                display_badge="Research Only (LRS Prohibited)",
                description="Displayed strictly for macroeconomic research and international price benchmarking. Resident Indians are legally prohibited from remitting funds abroad for offshore margin trading or overseas currency/derivative speculation.",
                governing_framework="RBI A.P. (DIR Series) Circular No. 78 / FEMA Regulations",
                permitted_route="Institutional / Corporate with specific RBI approval only; Retail LRS is strictly prohibited",
                key_conditions=[
                    "Remittance under LRS for overseas forex trading, speculative derivatives, or lottery/gambling is illegal under FEMA",
                    "Unauthorized electronic trading platforms (ETPs) are blacklisted on RBI's Alert List",
                    "Severe penalties under FEMA 1999 for unauthorized cross-border transactions",
                ],
                disclaimer="MarketScope displays global commodity and forex derivatives exclusively for academic analysis and supply-chain benchmarking.",
            )

        # 6. Global Sovereign Debt, Macro Indicators, and Benchmarks
        return InvestmentAccessClassification(
            status=InvestmentAccessStatus.RESEARCH_ONLY,
            display_badge="Research & Benchmarking Only",
            description="Institutional macroeconomic data, sovereign yield benchmarks, and central bank indicators displayed for market intelligence and risk modeling.",
            governing_framework="International Financial Statistics & Open Public Data",
            permitted_route="Informational display only; non-investable index/macroeconomic indicator",
            key_conditions=[
                "Indices and sovereign yield curves cannot be purchased directly",
                "Investable exposure requires compatible exchange-traded ETFs or synthetic index instruments",
            ],
            disclaimer="Benchmark rates are non-executable reference indicators.",
        )


# Global singleton instance
investment_access_engine = InvestmentAccessEngine()
