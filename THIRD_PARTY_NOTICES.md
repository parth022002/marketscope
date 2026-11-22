# MarketScope.io — Third-Party Notices & Component Disclosures

This document provides formal notice, copyright ownership, and licensing terms for open-source software, fonts, and data assets incorporated into or utilized by MarketScope.io.

---

## 1. Core Frameworks & Runtime Libraries

### Next.js
- **Copyright**: © 2026 Vercel, Inc.
- **License**: MIT
- **SPDX Identifier**: `MIT`
- **Official Repository**: https://github.com/vercel/next.js
- **Attribution Notice**: Included under standard MIT permission allowing commercial use, modification, and distribution with copyright notice retention.

### React & React DOM
- **Copyright**: © Meta Platforms, Inc. and affiliates.
- **License**: MIT
- **SPDX Identifier**: `MIT`
- **Official Repository**: https://github.com/facebook/react

### TypeScript
- **Copyright**: © Microsoft Corporation.
- **License**: Apache-2.0
- **SPDX Identifier**: `Apache-2.0`
- **Official Repository**: https://github.com/microsoft/TypeScript

### Tailwind CSS
- **Copyright**: © Tailwind Labs, Inc.
- **License**: MIT
- **SPDX Identifier**: `MIT`
- **Official Repository**: https://github.com/tailwindlabs/tailwindcss

---

## 2. Charting & Visualization

### TradingView Lightweight Charts (v5.3.0)
- **Copyright**: © 2019–2026 TradingView, Inc.
- **License**: Apache License, Version 2.0
- **SPDX Identifier**: `Apache-2.0`
- **Official Repository**: https://github.com/tradingview/lightweight-charts
- **Terms & Notice**: Used under the Apache-2.0 license. MarketScope.io complies with all notice and attribution requirements without claiming endorsement or copying TradingView's proprietary branding or hosted products.

---

## 3. UI, Icons & Styling

### Lucide React
- **Copyright**: © 2022–2026 Lucide Contributors (based on Feather Icons by Cole Bemis).
- **License**: ISC License
- **SPDX Identifier**: `ISC`
- **Official Repository**: https://github.com/lucide-icons/lucide
- **Attribution Notice**: Permission to use, copy, modify, and distribute for any purpose with retention of copyright notice.

### Geist Font Family
- **Copyright**: © Vercel, Inc.
- **License**: SIL Open Font License 1.1
- **SPDX Identifier**: `OFL-1.1`
- **Official Repository**: https://github.com/vercel/geist-font

---

## 4. Backend Engine & API Services

### FastAPI
- **Copyright**: © 2018–2026 Sebastián Ramírez.
- **License**: MIT
- **SPDX Identifier**: `MIT`
- **Official Repository**: https://github.com/fastapi/fastapi

### Starlette
- **Copyright**: © 2018–2026 Encode OSS Ltd.
- **License**: BSD 3-Clause License
- **SPDX Identifier**: `BSD-3-Clause`
- **Official Repository**: https://github.com/encode/starlette

### Uvicorn
- **Copyright**: © 2017–2026 Encode OSS Ltd.
- **License**: BSD 3-Clause License
- **SPDX Identifier**: `BSD-3-Clause`
- **Official Repository**: https://github.com/encode/uvicorn

### Pydantic & Pydantic-Core
- **Copyright**: © 2017–2026 Samuel Colvin and Pydantic Services Inc.
- **License**: MIT
- **SPDX Identifier**: `MIT`
- **Official Repository**: https://github.com/pydantic/pydantic

### SQLAlchemy
- **Copyright**: © 2005–2026 Michael Bayer and individual contributors.
- **License**: MIT
- **SPDX Identifier**: `MIT`
- **Official Website**: https://www.sqlalchemy.org/

### Psycopg 3 (psycopg & psycopg-binary)
- **Copyright**: © 2020–2026 Daniele Varrazzo and contributors.
- **License**: GNU Lesser General Public License, Version 3.0
- **SPDX Identifier**: `LGPL-3.0-only`
- **Official Repository**: https://github.com/psycopg/psycopg
- **Compliance Details**: MarketScope.io dynamically imports psycopg as an independent library without modifying its source code, fully complying with LGPL-3.0 terms.

### HTTPX & HTTPCore
- **Copyright**: © 2019–2026 Encode OSS Ltd.
- **License**: BSD 3-Clause License
- **SPDX Identifier**: `BSD-3-Clause`
- **Official Repository**: https://github.com/encode/httpx

### Redis Python Client
- **Copyright**: © Redis Ltd.
- **License**: MIT
- **SPDX Identifier**: `MIT`
- **Official Repository**: https://github.com/redis/redis-py

### Python-dotenv
- **Copyright**: © 2014–2026 Saurabh Kumar.
- **License**: BSD 3-Clause License
- **SPDX Identifier**: `BSD-3-Clause`
- **Official Repository**: https://github.com/theskumar/python-dotenv

---

## 5. Summary of License Types in Use

| License Family | Count in Project | Distribution Permission | Commercial Use | Source Disclosure Required |
| :--- | :---: | :---: | :---: | :---: |
| **MIT** | 290+ | Full | Yes | No (Notice only) |
| **Apache-2.0** | 75+ | Full | Yes | No (Notice only) |
| **BSD-3-Clause / BSD-2-Clause** | 25+ | Full | Yes | No (Notice only) |
| **ISC** | 5+ | Full | Yes | No (Notice only) |
| **LGPL-3.0 (Dynamic Import)** | 3 | Full | Yes | No for consuming app |
| **MPL-2.0** | 1 (certifi) | Full | Yes | No for consuming app |
| **SIL OFL 1.1** | 1 (Geist Font) | Full | Yes | No |
