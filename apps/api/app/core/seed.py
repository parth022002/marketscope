import uuid
from datetime import datetime, date, timezone
from sqlalchemy.orm import Session
from app.domain.models import (
    Workspace,
    User,
    WorkspaceMembership,
    Issuer,
    Instrument,
    DataProvider,
    MetricDefinition,
    FinancialFact,
    EvidenceItem,
)

DEFAULT_WORKSPACE_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")
DEFAULT_USER_ID = uuid.UUID("22222222-2222-2222-2222-222222222222")


def seed_database(db: Session) -> dict[str, str]:
    """Idempotently seeds initial relational entities for MarketScope.io."""
    now = datetime.now(timezone.utc)

    # 1. Default Workspace & User
    workspace = db.query(Workspace).filter(Workspace.id == DEFAULT_WORKSPACE_ID).first()
    if not workspace:
        workspace = Workspace(
            id=DEFAULT_WORKSPACE_ID,
            name="Primary Research Workspace",
            created_at=now,
        )
        db.add(workspace)

    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    if not user:
        user = User(
            id=DEFAULT_USER_ID,
            external_identity_id="demo_researcher_01",
            email="analyst@marketscope.io",
            display_name="Senior Equity Analyst",
            created_at=now,
        )
        db.add(user)
        db.flush()

        membership = WorkspaceMembership(
            workspace_id=workspace.id,
            user_id=user.id,
            role="OWNER",
            created_at=now,
        )
        db.add(membership)

    # 2. Data Provider
    provider = db.query(DataProvider).filter(DataProvider.provider_key == "in-regulatory-filings").first()
    if not provider:
        provider = DataProvider(
            provider_key="in-regulatory-filings",
            display_name="NSE/BSE Regulatory Filings (Ind AS)",
            environment="DEMO",
            created_at=now,
        )
        db.add(provider)
        db.flush()

    # 3. Metric Definitions
    metrics_data = [
        ("roe", "Return on Equity", "Net Income / Shareholders' Equity", "v1.2-canonical", "%"),
        ("revenue_growth", "Revenue Growth (YoY)", "(Revenue_t - Revenue_t-1) / Revenue_t-1", "v1.0-canonical", "%"),
        ("debt_equity", "Debt to Equity Ratio", "Total Debt / Shareholders' Equity", "v1.1-canonical", "x"),
    ]
    for key, label, formula, version, unit in metrics_data:
        m = db.query(MetricDefinition).filter(
            MetricDefinition.metric_key == key,
            MetricDefinition.formula_version == version,
        ).first()
        if not m:
            db.add(MetricDefinition(
                metric_key=key,
                label=label,
                formula_text=formula,
                formula_version=version,
                unit=unit,
                active=True,
                created_at=now,
            ))

    # 4. Issuers and Instruments
    companies = [
        {
            "canonical_name": "Reliance Industries Limited",
            "sector": "Energy & Consumer",
            "industry": "Conglomerate",
            "instruments": [
                {"symbol": "RELIANCE", "exchange": "NSE", "isin": "INE002A01018", "type": "EQUITY"},
                {"symbol": "RELIANCE", "exchange": "BSE", "isin": "INE002A01018", "type": "EQUITY"},
            ],
            "facts": [
                ("revenue", 901064.0, "INR Cr", "FY 2024", 8.4),
                ("net_income", 69622.0, "INR Cr", "FY 2024", 9.8),
                ("shareholders_equity", 710430.0, "INR Cr", "FY 2024", None),
                ("total_debt", 298340.0, "INR Cr", "FY 2024", 0.42),
            ],
            "filing_url": "https://www.bseindia.com/stock-share-price/reliance-industries-ltd/reliance/500325/annual-reports/",
        },
        {
            "canonical_name": "Tata Consultancy Services Limited",
            "sector": "Information Technology",
            "industry": "IT Services & Consulting",
            "instruments": [
                {"symbol": "TCS", "exchange": "NSE", "isin": "INE467B01029", "type": "EQUITY"},
                {"symbol": "TCS", "exchange": "BSE", "isin": "INE467B01029", "type": "EQUITY"},
            ],
            "facts": [
                ("revenue", 240893.0, "INR Cr", "FY 2024", 6.1),
                ("net_income", 46099.0, "INR Cr", "FY 2024", 48.2),
                ("shareholders_equity", 95578.0, "INR Cr", "FY 2024", None),
                ("total_debt", 7646.0, "INR Cr", "FY 2024", 0.08),
            ],
            "filing_url": "https://www.bseindia.com/stock-share-price/tata-consultancy-services-ltd/tcs/532540/annual-reports/",
        },
        {
            "canonical_name": "Infosys Limited",
            "sector": "Information Technology",
            "industry": "IT Services & Consulting",
            "instruments": [
                {"symbol": "INFY", "exchange": "NSE", "isin": "INE009A01021", "type": "EQUITY"},
                {"symbol": "INFY", "exchange": "BSE", "isin": "INE009A01021", "type": "EQUITY"},
            ],
            "facts": [
                ("revenue", 153670.0, "INR Cr", "FY 2024", 4.7),
                ("net_income", 26248.0, "INR Cr", "FY 2024", 29.5),
                ("shareholders_equity", 88981.0, "INR Cr", "FY 2024", None),
                ("total_debt", 10677.0, "INR Cr", "FY 2024", 0.12),
            ],
            "filing_url": "https://www.bseindia.com/stock-share-price/infosys-ltd/infy/500209/annual-reports/",
        },
        {
            "canonical_name": "Tata Motors Limited",
            "sector": "Automotive",
            "industry": "Commercial & Passenger Vehicles",
            "instruments": [
                {"symbol": "TATAMOTORS", "exchange": "NSE", "isin": "INE155A01022", "type": "EQUITY"},
                {"symbol": "TATAMTRDVR", "exchange": "NSE", "isin": "IN9155A01020", "type": "EQUITY_DVR"},
            ],
            "facts": [
                ("revenue", 437928.0, "INR Cr", "FY 2024", 26.6),
                ("net_income", 31807.0, "INR Cr", "FY 2024", 36.4),
                ("shareholders_equity", 87363.0, "INR Cr", "FY 2024", None),
                ("total_debt", 54320.0, "INR Cr", "FY 2024", 0.62),
            ],
            "filing_url": "https://www.bseindia.com/stock-share-price/tata-motors-ltd/tatamotors/500570/annual-reports/",
        },
    ]

    for comp in companies:
        issuer = db.query(Issuer).filter(Issuer.canonical_name == comp["canonical_name"]).first()
        if not issuer:
            issuer = Issuer(
                canonical_name=comp["canonical_name"],
                country_code="IN",
                sector=comp["sector"],
                industry=comp["industry"],
                created_at=now,
            )
            db.add(issuer)
            db.flush()

        for inst_data in comp["instruments"]:
            inst = db.query(Instrument).filter(
                Instrument.symbol == inst_data["symbol"],
                Instrument.exchange_code == inst_data["exchange"],
            ).first()
            if not inst:
                inst = Instrument(
                    issuer_id=issuer.id,
                    symbol=inst_data["symbol"],
                    exchange_code=inst_data["exchange"],
                    instrument_type=inst_data["type"],
                    isin=inst_data["isin"],
                    currency="INR",
                    listing_status="ACTIVE",
                    created_at=now,
                )
                db.add(inst)
                db.flush()

                # Add Evidence item for this instrument
                ev = EvidenceItem(
                    provider_id=provider.id,
                    instrument_id=inst.id,
                    title=f"Audited Annual Financial Filing ({comp['canonical_name']})",
                    source_type="REGULATORY_FILING",
                    source_locator=comp["filing_url"],
                    published_at=datetime(2024, 4, 30, tzinfo=timezone.utc),
                    retrieved_at=now,
                    quality_status="VERIFIED_AUDITED",
                    item_metadata={
                        "filing_type": "Annual Report FY24",
                        "accounting_standard": "Ind AS",
                        "auditor": "Independent Statutory Auditor",
                    },
                )
                db.add(ev)

                # Add Financial Facts
                for fact_key, val, unit, period, _ in comp["facts"]:
                    db.add(FinancialFact(
                        instrument_id=inst.id,
                        provider_id=provider.id,
                        fact_key=fact_key,
                        value_numeric=val,
                        unit=unit,
                        currency="INR",
                        period_start=date(2023, 4, 1),
                        period_end=date(2024, 3, 31),
                        period_type="ANNUAL",
                        reporting_basis="CONSOLIDATED",
                        published_at=datetime(2024, 4, 30, tzinfo=timezone.utc),
                        quality_status="VERIFIED_AUDITED",
                        is_synthetic=False,
                        source_locator=comp["filing_url"],
                        source_version="Ind AS FY24 v1",
                        created_at=now,
                    ))

    db.commit()
    return {"status": "success", "workspace_id": str(DEFAULT_WORKSPACE_ID)}
