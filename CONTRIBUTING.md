# Contributing to MarketScope.io

Thank you for your interest in contributing to MarketScope.io! We welcome contributions that maintain our high standards of mathematical accuracy, code quality, and licensing compliance.

---

## 1. Code of Conduct & Contribution Principles

1. **Deterministic Accuracy**: Financial calculations and models must be mathematically verified. Avoid non-deterministic algorithms or floating-point drift.
2. **Strict Licensing Hygiene**: Only contribute code that you wrote or that is licensed under a compatible permissive open-source license (MIT, Apache-2.0, BSD-3-Clause, ISC).
3. **No Prohibited Copyleft**: Do not introduce dependencies licensed under GPL, AGPL, SSPL, or non-commercial restrictions without prior compliance approval.
4. **Data Provenance**: Never submit synthetic prices disguised as live market data. Retain authentic provenance tags at all times.
5. **Non-Custodial Boundary**: Do not introduce live broker trade execution or real-money order routing code.

---

## 2. Developer Certificate of Origin (DCO)

To ensure licensing compliance, all contributors must certify that they have the right to submit the work. By contributing to this project, you certify the following statement:

```text
Developer Certificate of Origin
Version 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

Sign each commit by adding `Signed-off-by: Your Name <your.email@example.com>` (or use `git commit -s`).

---

## 3. Pull Request Checklist

Before submitting a Pull Request:
- [ ] Run `npm run typecheck` and `npm run build` in `apps/web`.
- [ ] Run `pytest apps/api/tests/` in `apps/api` (all tests must pass).
- [ ] Run `python scripts/licensing/generate_license_report.py` to verify no prohibited licenses are introduced.
- [ ] Update documentation where applicable.
