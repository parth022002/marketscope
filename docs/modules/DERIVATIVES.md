# MarketScope.io — Derivatives & Options Analytics Module

## 1. Overview
The Derivatives module provides real-time options chain analytics, Black-Scholes Greeks calculation, Put-Call Ratio (PCR) analysis, and futures build-up radar.

## 2. Black-Scholes Greek Engine
Calculated strike-by-strike in `apps/api/app/engine/derivatives_engine.py`:
- **Delta (\(\Delta\))**: Sensitivity of option price to underlying price change.
  \[ \Delta_{\text{Call}} = N(d_1), \quad \Delta_{\text{Put}} = N(d_1) - 1 \]
- **Gamma (\(\Gamma\))**: Rate of change of Delta.
  \[ \Gamma = \frac{N'(d_1)}{S \sigma \sqrt{T}} \]
- **Theta (\(\Theta\))**: Time decay per calendar day.
  \[ \Theta_{\text{Call}} = -\frac{S N'(d_1) \sigma}{2\sqrt{T}} - r K e^{-rT} N(d_2) \]
- **Vega (\(\nu\))**: Sensitivity to 1% change in implied volatility.
  \[ \nu = S \sqrt{T} N'(d_1) \]

## 3. Futures Build-up Quadrants
- **Long Build-up**: Price \(\uparrow\) + Open Interest \(\uparrow\) (Bullish positioning)
- **Short Build-up**: Price \(\downarrow\) + Open Interest \(\uparrow\) (Bearish positioning)
- **Short Covering**: Price \(\uparrow\) + Open Interest \(\downarrow\) (Bearish exit / rally)
- **Long Unwinding**: Price \(\downarrow\) + Open Interest \(\downarrow\) (Bullish profit-booking)
