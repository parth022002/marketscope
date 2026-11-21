# Resident Indian Investment Access & Regulatory Eligibility

## 1. Statutory Context

A key architectural innovation in MarketScope.io is the **Resident Indian Regulatory Investment Access Classification System**. 

Under Indian foreign exchange and securities law, resident individual investors face distinct legal boundaries when allocating capital across domestic vs. international assets. MarketScope transparently annotates every tracked financial instrument with its exact legal investment route, statutory limit, tax compliance burden, and FEMA admissibility.

---

## 2. Standardized Classification Categories

```
                      Resident Indian Investment Access Classifications
       +-----------------------------------+-----------------------------------+
       |            CATEGORY               |        STATUTORY FRAMEWORK        |
       +-----------------------------------+-----------------------------------+
       | DOMESTIC_ACCESS                   | SEBI / RBI Domestic Demat Rules   |
       | INTERNATIONAL_ACCESS_SUBJECT_TO_LRS| RBI Liberalised Remittance Scheme |
       | ACCESS_VIA_IFSC_ROUTE             | IFSCA GIFT City SEZ Regulations   |
       | ACCESS_VIA_DOMESTIC_FUND          | SEBI Mutual Funds ($7B Cap)       |
       | ACCESS_SUBJECT_TO_INTERMEDIARY    | SEBI OBPP / Regulated Brokers     |
       | RESEARCH_ONLY                     | FEMA 1999 (Offshore Margins Ban)  |
       | RESTRICTED_OR_UNVERIFIED          | Verification In Progress          |
       +-----------------------------------+-----------------------------------+
```

### 2.1 DOMESTIC_ACCESS
- **Eligible Instruments**: All securities listed on NSE, BSE, MCX, NCDEX, RBI Retail Direct, and AMFI registered funds.
- **Route**: Standard Demat and trading account opened with a SEBI-registered broker.
- **Taxation**: Equity STCG at 20% (Section 111A) and LTCG at 12.5% above ₹1.25 Lakhs (Section 112A). Standard Securities Transaction Tax (STT) applies.

### 2.2 INTERNATIONAL_ACCESS_SUBJECT_TO_LRS
- **Eligible Instruments**: Direct foreign equities and listed ETFs in the US, Europe, and Asia (e.g. Apple, Microsoft, S&P 500 ETF).
- **Statutory Cap**: **USD 250,000 per financial year** (April 1 to March 31) per resident individual, covering all permissible capital and current account remittances combined.
- **Tax Collected at Source (TCS)**: Under Section 206C(1G) of the Income Tax Act, TCS of **20%** applies on foreign equity remittances exceeding ₹7 Lakhs in a financial year.
- **Mandatory ITR Disclosure**: Mandatory reporting of foreign assets in **Schedule FA** (Foreign Assets) of ITR-2 or ITR-3. Failure to disclose attracts penal provisions under the Black Money Act, 2015.
- **Strict Leverage Ban**: Borrowing or margin facilities abroad are strictly prohibited under FEMA; all transactions must be on a **fully-funded cash delivery basis**.

### 2.3 ACCESS_VIA_IFSC_ROUTE
- **Eligible Instruments**: Dollar-denominated equities, depository receipts, and global funds listed in GIFT City SEZ (India INX, NSE IX).
- **Route**: Account with an IFSCA-registered broker in GIFT City.
- **Rules**: Remittances from domestic INR accounts into GIFT City count towards the individual's USD 250,000 LRS limit. Once in IFSC, transactions are dollar-denominated with specified capital gains tax exemptions under Section 47(viiab).

### 2.4 ACCESS_VIA_DOMESTIC_FUND
- **Eligible Instruments**: Indian mutual fund schemes and ETFs that invest in overseas securities (e.g. Motilal Oswal Nasdaq 100 ETF, Edelweiss US Technology Feeder Fund).
- **Advantage**: Resident individuals invest in Indian Rupees (INR) without using their individual USD 250,000 LRS limit.
- **Industry Aggregate Cap**: Governed by the overall **RBI industry cap of USD 7 Billion** across all Indian mutual funds for overseas investments (plus USD 1 Billion for overseas ETFs).

### 2.5 RESEARCH_ONLY (FEMA Restricted)
- **Applicable Instruments**: Offshore equity futures, offshore index options, foreign currency margin trading (leveraged Forex), and overseas CFD contracts.
- **FEMA Rule**: Under RBI Master Direction and FEMA Notification No. FEMA 1/2000-RB, resident individuals are **strictly prohibited from remitting funds for margins or margin calls for trading in overseas derivatives or foreign exchange**.
- **Platform Stance**: MarketScope explicitly tags these instruments as `RESEARCH_ONLY`. They are displayed solely for institutional macro intelligence, volatility benchmarking, and academic research.
