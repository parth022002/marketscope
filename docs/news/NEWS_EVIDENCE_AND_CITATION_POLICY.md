# MarketScope.io — Evidence Linking & Source Citation Policy

## 1. Traceability Standard

Every news item displayed on MarketScope.io must feature an inspectable **Evidence Drawer**. A user must be able to click on any factual claim, financial figure, or corporate disclosure and view its primary underlying source document.

---

## 2. Evidence Architecture

Each `NewsEvidence` record attached to a story contains:
1. **Document Identity**: Unique filing reference, circular number, or accession ID.
2. **Authoritative Authority**: The issuing regulatory or corporate body (e.g. `National Stock Exchange of India`, `Securities and Exchange Board of India`).
3. **Direct URL**: Active, publicly verifiable hyperlink opening directly in a new browser tab.
4. **Document Timestamp**: Date and time of official publication in ISO 8601 UTC format.
5. **Verification Hash**: SHA-256 fingerprint of the fetched regulatory document or announcement text to guarantee tamper-proof auditability.

---

## 3. Disputed Claims & Conflicting Reports Protocol

When two reputable publishers provide conflicting accounts of an event (e.g. differing acquisition valuations, conflicting layoff numbers, or disputed dividend dates):

1. **Zero Suppression Rule**: The platform never arbitrarily selects one version or suppresses the other.
2. **Explicit Conflict Highlight**:
   - Status transitions immediately to `DISPUTED`.
   - The headline renders both accounts transparently: e.g. *"[DISPUTED] Tech Merger Valuation Reported as \$1.2B by Reuters, \$950M by Bloomberg"*.
3. **Side-by-Side Evidence Linking**: Both publisher articles and any available exchange filings are juxtaposed in the Evidence Drawer with highlighted differences.
4. **Resolution Protocol**: When the official company exchange disclosure (e.g. BSE Regulation 30 disclosure) is released, the story updates automatically to `PRIMARY_SOURCE_CONFIRMED`, linking the official filing and noting the resolution of the earlier reporting discrepancy.
