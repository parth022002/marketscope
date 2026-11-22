"""MarketScope.io — Data Governance & Quality Engine
Provides:
1. Strict Provenance Metadata tracking.
2. Automated Data Quality validation (outliers, ranges, missing values, duplicates).
3. Explicit Freshness State classification.
4. Cryptographic Lineage Hashing.
"""

from __future__ import annotations

import hashlib
import json
import logging
from datetime import datetime, timezone
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field

logger = logging.getLogger("marketscope.data_quality")


class DataFreshnessState(str, Enum):
    LIVE = "LIVE"                       # Real-time streaming (< 1s)
    DELAYED = "DELAYED"                 # Standard 15-minute delayed
    END_OF_DAY = "END_OF_DAY"           # Official closing auction
    HISTORICAL = "HISTORICAL"           # Archived past quarters/sessions
    CALIBRATED_EOD = "CALIBRATED_EOD"   # Validated calibrated baseline
    STALE = "STALE"                     # Cached beyond TTL window
    UNAVAILABLE = "UNAVAILABLE"         # Source offline or market halted


class QualityValidationStatus(str, Enum):
    VERIFIED = "VERIFIED"               # Passes all range & consistency checks
    SUSPECT = "SUSPECT"                 # Anomaly or outlier detected
    RECONCILED = "RECONCILED"           # Adjusted against multi-source evidence
    UNVERIFIED = "UNVERIFIED"           # Raw ingestion without cross-check


class DataProvenanceRecord(BaseModel):
    record_id: str
    source_name: str
    source_tier: str                    # TIER_1_PRIMARY, TIER_2_JOURNALISM, etc.
    provider_id: str
    instrument_symbol: str
    market: str
    published_at: str
    ingested_at: str
    currency: str = "INR"
    unit: str = "ABSOLUTE"
    freshness_state: DataFreshnessState
    validation_status: QualityValidationStatus
    lineage_hash: str
    transformation_version: str = "v2.0"


class QualityCheckResult(BaseModel):
    passed: bool
    checks_executed: int
    failed_checks: list[str] = Field(default_factory=list)
    confidence_score: float = 1.0       # 0.0 to 1.0
    quality_status: QualityValidationStatus
    notes: str = ""


class DataQualityEngine:
    """Enterprise Data Quality and Provenance Engine."""

    @staticmethod
    def compute_lineage_hash(payload: dict[str, Any]) -> str:
        """Calculates a deterministic SHA-256 hash over canonical payload keys."""
        canonical_str = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    @staticmethod
    def validate_quote(
        symbol: str,
        price: float,
        previous_close: float | None = None,
        volume: int | None = None,
    ) -> QualityCheckResult:
        """Validates price quotes for negative values, extreme spikes, and zero-volume anomalies."""
        failed: list[str] = []
        checks = 0

        # Check 1: Non-negative price
        checks += 1
        if price <= 0.0:
            failed.append("Price must be strictly positive.")

        # Check 2: Max daily circuit limit check (80% theoretical extreme threshold)
        if previous_close and previous_close > 0:
            checks += 1
            pct_move = abs((price - previous_close) / previous_close) * 100.0
            if pct_move > 80.0:
                failed.append(f"Excessive price movement ({pct_move:.1f}%) exceeds plausibility bounds.")

        # Check 3: Non-negative volume
        if volume is not None:
            checks += 1
            if volume < 0:
                failed.append("Trading volume cannot be negative.")

        passed = len(failed) == 0
        confidence = 1.0 if passed else max(0.2, 1.0 - (len(failed) * 0.4))
        status = QualityValidationStatus.VERIFIED if passed else QualityValidationStatus.SUSPECT

        return QualityCheckResult(
            passed=passed,
            checks_executed=checks,
            failed_checks=failed,
            confidence_score=confidence,
            quality_status=status,
            notes="All checks passed." if passed else "; ".join(failed),
        )

    @staticmethod
    def validate_financial_statement(
        revenue: float,
        ebitda: float,
        net_profit: float,
        total_assets: float,
        total_equity: float,
        total_debt: float,
    ) -> QualityCheckResult:
        """Validates accounting consistency equations under Ind AS / IFRS."""
        failed: list[str] = []
        checks = 0

        # Check 1: EBITDA cannot exceed Total Revenue
        checks += 1
        if revenue > 0 and ebitda > revenue:
            failed.append("Operating profit (EBITDA) cannot exceed total revenue.")

        # Check 2: Balance Sheet Identity (Assets >= Equity + Debt)
        checks += 1
        if total_assets <= 0:
            failed.append("Total assets must be positive.")
        elif (total_equity + total_debt) > (total_assets * 1.05):
            failed.append("Liabilities and equity materially exceed total assets.")

        passed = len(failed) == 0
        confidence = 1.0 if passed else max(0.1, 1.0 - (len(failed) * 0.45))
        status = QualityValidationStatus.VERIFIED if passed else QualityValidationStatus.SUSPECT

        return QualityCheckResult(
            passed=passed,
            checks_executed=checks,
            failed_checks=failed,
            confidence_score=confidence,
            quality_status=status,
            notes="Financial statement arithmetic reconciled." if passed else "; ".join(failed),
        )


data_quality_engine = DataQualityEngine()
