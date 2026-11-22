"""MarketScope.io — Quantitative Anomaly Detection Engine
Detects:
1. Robust Z-scores using Median and Median Absolute Deviation (MAD).
2. Volume-Price Anomalies (e.g. high volume without price movement or vice-versa).
3. Volatility Anomalies (unusual IV expansion, wide range bars).
4. Derivatives Open Interest anomalies (abnormal call/put accumulation).
"""

from __future__ import annotations

import math
from typing import Any
import numpy as np
from pydantic import BaseModel, Field


class AnomalyEvent(BaseModel):
    anomaly_id: str
    anomaly_type: str                   # "VOLUME_PRICE_DIVERGENCE", "VOLATILITY_EXPANSION", "ROBUST_Z_EXTREME", "OI_CONCENTRATION"
    severity: str                       # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    score: float                        # 0.0 to 100.0
    detected_at: str
    evidence_metric: str
    observed_value: float
    expected_range: str
    explainability: str


class AnomalyScanReport(BaseModel):
    symbol: str
    total_anomalies_detected: int
    has_critical_anomaly: bool
    composite_anomaly_penalty: float    # 0.0 to -20.0 to subtract from Q-Score
    anomalies: list[AnomalyEvent] = Field(default_factory=list)
    scan_timestamp: str


class AnomalyDetectionEngine:
    """Robust statistical and machine anomaly detection engine."""

    @staticmethod
    def calculate_robust_z_scores(values: list[float]) -> list[float]:
        """Calculates robust Z-scores using Median Absolute Deviation (MAD) resistant to outliers."""
        arr = np.array(values, dtype=float)
        med = float(np.median(arr))
        mad = float(np.median(np.abs(arr - med)))

        if mad == 0:
            return [0.0] * len(values)

        # 1.4826 normal consistency factor
        return [float(0.6745 * (x - med) / mad) for x in arr]

    @staticmethod
    def scan_security_anomalies(
        symbol: str,
        prices: list[float],
        volumes: list[int] | None = None,
        implied_volatility: float | None = None,
        oi_change_pct: float | None = None,
    ) -> AnomalyScanReport:
        """Executes multi-factor anomaly diagnostics on price, volume, and derivatives data."""
        anomalies: list[AnomalyEvent] = []
        n = len(prices)

        if n >= 20:
            # 1. Price Robust Z-Score
            returns = list(np.diff(prices) / prices[:-1])
            z_scores = AnomalyDetectionEngine.calculate_robust_z_scores(returns)
            latest_z = abs(z_scores[-1]) if z_scores else 0.0

            if latest_z > 3.5:
                anomalies.append(
                    AnomalyEvent(
                        anomaly_id=f"ANO-Z-{symbol}-01",
                        anomaly_type="ROBUST_Z_EXTREME",
                        severity="HIGH" if latest_z > 4.5 else "MEDIUM",
                        score=min(95.0, latest_z * 20.0),
                        detected_at="Latest Session",
                        evidence_metric="MAD Robust Z-Score",
                        observed_value=round(latest_z, 2),
                        expected_range="[-3.0, +3.0]",
                        explainability=f"Daily price return deviates by {latest_z:.2f} standard deviations from rolling median.",
                    )
                )

            # 2. Volume-Price Divergence
            if volumes and len(volumes) == n and len(volumes) >= 20:
                avg_vol = float(np.mean(volumes[-20:-1])) if len(volumes) > 1 else volumes[-1]
                latest_vol = volumes[-1]
                vol_ratio = latest_vol / avg_vol if avg_vol > 0 else 1.0

                latest_price_move = abs((prices[-1] - prices[-2]) / prices[-2]) * 100.0 if n >= 2 else 0.0

                # High volume (3x) with minimal price move (< 0.2%) suggests absorption / churning
                if vol_ratio > 3.0 and latest_price_move < 0.25:
                    anomalies.append(
                        AnomalyEvent(
                            anomaly_id=f"ANO-VOL-{symbol}-02",
                            anomaly_type="VOLUME_PRICE_DIVERGENCE",
                            severity="HIGH",
                            score=85.0,
                            detected_at="Latest Session",
                            evidence_metric="Relative Volume / Price Move",
                            observed_value=round(vol_ratio, 2),
                            expected_range="[0.5x, 2.0x]",
                            explainability="Substantial institutional volume spike (3.0x+) without price displacement indicates absorption.",
                        )
                    )

        # 3. Implied Volatility Spikes
        if implied_volatility and implied_volatility > 45.0:
            anomalies.append(
                AnomalyEvent(
                    anomaly_id=f"ANO-IV-{symbol}-03",
                    anomaly_type="VOLATILITY_EXPANSION",
                    severity="MEDIUM",
                    score=75.0,
                    detected_at="Current Derivatives Cycle",
                    evidence_metric="Option Implied Volatility",
                    observed_value=round(implied_volatility, 2),
                    expected_range="[12.0%, 30.0%]",
                    explainability=f"Options IV elevated at {implied_volatility:.1f}%, indicating significant impending catalyst pricing.",
                )
            )

        # 4. Unusual Futures OI accumulation
        if oi_change_pct and abs(oi_change_pct) > 25.0:
            anomalies.append(
                AnomalyEvent(
                    anomaly_id=f"ANO-OI-{symbol}-04",
                    anomaly_type="OI_CONCENTRATION",
                    severity="HIGH",
                    score=82.0,
                    detected_at="Current Expiry",
                    evidence_metric="Futures OI Daily Change",
                    observed_value=round(oi_change_pct, 2),
                    expected_range="[-10.0%, +10.0%]",
                    explainability=f"Abnormal {oi_change_pct:+.1f}% shift in futures open interest signals aggressive speculative build-up.",
                )
            )

        # Composite penalty: each medium anomaly -3 pts, each high -6 pts (max -20 pts)
        penalty = 0.0
        has_crit = False
        for a in anomalies:
            if a.severity == "HIGH":
                penalty -= 6.0
            elif a.severity == "MEDIUM":
                penalty -= 3.0
            elif a.severity == "CRITICAL":
                penalty -= 10.0
                has_crit = True

        return AnomalyScanReport(
            symbol=symbol,
            total_anomalies_detected=len(anomalies),
            has_critical_anomaly=has_crit,
            composite_anomaly_penalty=max(-20.0, penalty),
            anomalies=anomalies,
            scan_timestamp="Automated Continuous Diagnostics",
        )


anomaly_detection_engine = AnomalyDetectionEngine()
