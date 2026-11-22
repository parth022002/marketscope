# MarketScope.io — Licensing & Open-Source Compliance Checklist

## 1. Compliance Audit Status

| Compliance Check | Status | Verification Detail |
| :--- | :---: | :--- |
| **All Dependencies Audited** | **PASSED** | 401 software components audited across Python and Node.js. |
| **Zero Viral Copyleft Violations** | **PASSED** | Zero GPL-3.0, AGPL-3.0, or SSPL-1.0 libraries in production. |
| **Apache 2.0 Notice Retention** | **PASSED** | Formal `NOTICE` file created attributing TradingView Lightweight Charts. |
| **CycloneDX SBOM Generated** | **PASSED** | Machine-readable `compliance/sbom.json` created in CycloneDX 1.5 standard. |
| **Project License Defined** | **PASSED** | Proprietary core with permissive open-source third-party retention in `LICENSE`. |
| **Developer Contribution Policy** | **PASSED** | `CONTRIBUTING.md` authored with Developer Certificate of Origin (DCO 1.1). |
| **Automated Compliance CLI** | **PASSED** | `scripts/licensing/generate_license_report.py` integrated and verified. |
| **In-App Acknowledgements Page** | **PASSED** | Dedicated `/acknowledgements` page built and linked in footer. |
| **In-App Licenses Explorer** | **PASSED** | Dedicated `/licenses` page built and linked in footer. |
| **Financial Data Disclosures** | **PASSED** | Explicit freshness tags (`LIVE`, `DELAYED_15M`, `CALIBRATED_EOD`) on all market data. |
| **Non-Custodial Legal Notice** | **PASSED** | Strict research-only disclaimers present across application views. |

---

## 2. Recurring Maintenance & CI/CD Protocol

1. **Pre-Commit Verification**: Run `python scripts/licensing/generate_license_report.py` before merging PRs modifying `requirements.txt` or `package.json`.
2. **SBOM Regeneration**: The SBOM is automatically regenerated upon dependency updates.
3. **Annual Review**: Review third-party terms of service and exchange data vendor policies annually.
