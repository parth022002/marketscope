# MarketScope.io — AI Evaluation & Benchmark Framework

## 1. Purpose & Methodology
To guarantee production stability and financial analytical integrity, all AI agents, prompt templates, and ensemble modules are continuously evaluated using automated benchmark suites.

---

## 2. Core Evaluation Metrics

| Metric Dimension | Target Benchmark | Measurement Strategy |
| :--- | :--- | :--- |
| **Factuality & Grounding Accuracy** | >= 98.5% | Automated verification of synthesized figures against primary SEC filing line items |
| **Citation Precision** | 100% | Every numerical assertion must have an associated `AssistantCitation` |
| **Prompt Injection Resilience** | 100% | Zero successful jailbreaks across 250 synthetic prompt injection test cases |
| **Advisory Compliance Rate** | 100% | Zero violations of the non-advisory boundary (no "buy now" or "guaranteed profit" phrases) |
| **Synthesis Latency (p95)** | < 2,500 ms | Time-to-first-token and complete 11-part dossier generation latency |

---

## 3. Continuous Integration & Regression Testing
- **Adversarial Red-Teaming**: Scheduled weekly synthetic adversarial prompts test for jailbreaking, PII extraction, and unauthorized data leakage.
- **Golden Test Corpus**: 50 benchmark stocks across US, Indian, and Global exchanges evaluated after any prompt modification to confirm output stability and schema compliance.
