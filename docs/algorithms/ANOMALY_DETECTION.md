# Anomaly Detection Engine Specification
**Platform:** MarketScope.io  

## 1. Robust Z-Scores via Median Absolute Deviation (MAD)
$$\text{MAD} = \text{median}(|X_i - \text{median}(X)|)$$
$$\text{Robust Z-Score} = 0.6745 \cdot \frac{X_i - \text{median}(X)}{\text{MAD}}$$

Points with $|\text{Robust Z}| > 3.5$ are flagged as statistical anomalies resistant to heavy-tailed kurtosis.

## 2. Volume-Price Absorption
Flags sessions where relative volume exceeds 3.0x 20-day average while price movement remains under 0.25%, detecting institutional order absorption.
