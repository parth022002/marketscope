"""
MarketScope.io — Automated Price Accuracy & Reliability Test Suite
Verifies Decimal calculations, precision standards, currency conversion,
instrument resolution, MCX/COMEX disambiguation, and anomaly detection.
"""

import asyncio
from decimal import Decimal
import pytest
from app.engine.price_calculation_service import (
    PriceCalculationService,
    CurrencyConversionService,
)
from app.engine.instrument_resolver import instrument_resolver
from app.providers.market_data.fallback_provider import FallbackDevProvider


def test_decimal_calculation_no_float_drift():
    """Verify that calculations use exact Decimal arithmetic and eliminate floating-point drift."""
    abs_change, pct_change = PriceCalculationService.calculate_price_change(
        current_price=Decimal("1265.40"),
        previous_close=Decimal("1258.00"),
        precision=2,
    )
    assert abs_change == Decimal("7.40")
    # (7.40 / 1258.00) * 100 = 0.588235... -> rounds to 0.59 with ROUND_HALF_UP
    assert pct_change == Decimal("0.59")
    assert str(abs_change) == "7.40"
    assert str(pct_change) == "0.59"


def test_precision_by_asset_class():
    """Validate that precision rules conform to asset-class standards."""
    # 1. Foreign exchange (4 decimals)
    fx_change, fx_pct = PriceCalculationService.calculate_price_change(
        current_price=Decimal("84.4200"),
        previous_close=Decimal("84.3800"),
        precision=4,
    )
    assert fx_change == Decimal("0.0400")
    assert fx_pct == Decimal("0.05")

    # 2. Sovereign Yield (3 decimals)
    yield_change, yield_pct = PriceCalculationService.calculate_price_change(
        current_price=Decimal("4.420"),
        previous_close=Decimal("4.450"),
        precision=3,
    )
    assert yield_change == Decimal("-0.030")
    assert yield_pct == Decimal("-0.67")

    # 3. Equity (2 decimals)
    eq_change, eq_pct = PriceCalculationService.calculate_price_change(
        current_price=Decimal("24180.80"),
        previous_close=Decimal("24055.40"),
        precision=2,
    )
    assert eq_change == Decimal("125.40")
    assert eq_pct == Decimal("0.52")


def test_gold_disambiguation_and_mcx_parity():
    """Verify that COMEX Gold (USD/oz) and MCX Gold (INR/10g) are correctly disambiguated."""
    comex = instrument_resolver.resolve("GOLD SPOT", "COMEX")
    assert comex is not None
    assert comex.currency == "USD"
    assert comex.price_unit == "USD / troy oz"

    mcx = instrument_resolver.resolve("GOLD MCX", "MCX")
    assert mcx is not None
    assert mcx.currency == "INR"
    assert mcx.price_unit == "INR / 10g"
    assert mcx.symbol == "GOLD MCX"


def test_yield_normalization_scale():
    """Verify that US 10Y Yield has a 0.1 scale factor applied to normalize index quote."""
    tnx_inst = instrument_resolver.resolve("US 10Y YIELD", "BOND")
    assert tnx_inst is not None
    assert tnx_inst.yield_multiplier == 0.1
    assert tnx_inst.price_precision == 3
    assert tnx_inst.is_yield is True

    # If raw quote is 44.20, normalized yield is 4.420
    raw_quote = Decimal("44.20")
    normalized_yield = raw_quote * Decimal(str(tnx_inst.yield_multiplier))
    assert normalized_yield == Decimal("4.420")


def test_currency_conversion_service():
    """Verify that currency conversion calculates correct converted values and records provenance."""
    service = CurrencyConversionService()
    conv = service.convert(
        amount=Decimal("100.00"),
        from_currency="USD",
        to_currency="INR",
        precision=2,
    )
    assert conv.converted_amount == Decimal("8442.00")
    assert conv.conversion_rate == Decimal("84.42")
    assert conv.conversion_source == "Reserve Bank of India FBIL Benchmark Fixing"
    assert conv.original_currency == "USD"
    assert conv.target_currency == "INR"


def test_ohlc_boundary_validation():
    """Assert that OHLC boundaries are strictly enforced and invalid bars are detected."""
    # Valid candle: Low <= Open, Close <= High
    val_valid = PriceCalculationService.validate_ohlc(
        open_p=Decimal("100.00"),
        high_p=Decimal("105.00"),
        low_p=Decimal("98.00"),
        close_p=Decimal("102.00"),
    )
    assert val_valid.is_valid is True
    assert len(val_valid.violations) == 0

    # Invalid candle: Low > High
    val_inv1 = PriceCalculationService.validate_ohlc(
        open_p=Decimal("100.00"),
        high_p=Decimal("95.00"),
        low_p=Decimal("98.00"),
        close_p=Decimal("102.00"),
    )
    assert val_inv1.is_valid is False
    assert any("cannot be lower than Low" in v for v in val_inv1.violations)

    # Invalid candle: Close > High
    val_inv2 = PriceCalculationService.validate_ohlc(
        open_p=Decimal("100.00"),
        high_p=Decimal("105.00"),
        low_p=Decimal("98.00"),
        close_p=Decimal("108.00"),
    )
    assert val_inv2.is_valid is False
    assert any("cannot be lower than Close" in v for v in val_inv2.violations)


def test_price_jump_anomaly_detection():
    """Verify that price spikes > 35% trigger an anomaly flag without runtime exceptions."""
    # Normal 2% move
    is_normal_anomalous = PriceCalculationService.is_price_jump_anomalous(
        current_price=Decimal("102.00"),
        previous_close=Decimal("100.00"),
        threshold_pct=35.0,
    )
    assert is_normal_anomalous is False

    # 45% spike move
    is_spike_anomalous = PriceCalculationService.is_price_jump_anomalous(
        current_price=Decimal("145.00"),
        previous_close=Decimal("100.00"),
        threshold_pct=35.0,
    )
    assert is_spike_anomalous is True


def test_zero_previous_close_guard():
    """Verify that a zero or negative previous close does not raise ZeroDivisionError."""
    abs_change, pct_change = PriceCalculationService.calculate_price_change(
        current_price=Decimal("100.00"),
        previous_close=Decimal("0.00"),
    )
    assert abs_change == Decimal("0.00")
    assert pct_change == Decimal("0.00")


def test_fallback_dev_provider():
    """Confirm fallback provider delivers properly calibrated quotes with SYNTHETIC_DEVELOPMENT flag."""
    provider = FallbackDevProvider()
    quote = asyncio.run(provider.get_quote("NIFTY 50", "NSE"))
    assert quote is not None
    assert quote.symbol == "NIFTY 50"
    assert quote.price == 24180.80
    assert quote.data_status == "SYNTHETIC_DEVELOPMENT"
    assert quote.currency == "INR"
    assert quote.change > 0
