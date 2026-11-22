# Floating AI Assistant Test Report

## 1. Test Summary
- **Test File**: `apps/api/tests/test_floating_ai_assistant.py`
- **Execution Engine**: Pytest with FastAPI TestClient
- **Total Tests**: 8 test suites
- **Passed**: 8/8 (100%)
- **Execution Duration**: < 0.7s

## 2. Test Cases Executed & Validated
1. `test_assistant_market_status_intent`: Verified that queries like "What is the current status of the Indian stock market?" resolve to `MARKET_STATUS` and provide authoritative open/closed exchange status.
2. `test_assistant_company_research_intent`: Verified that queries regarding company metrics ("Analyze the valuation, ROCE, and debt of Reliance") route to `COMPANY_RESEARCH` and extract audited figures.
3. `test_assistant_platform_support_intent`: Verified that queries asking how to use charts or screeners route to `PLATFORM_SUPPORT`.
4. `test_assistant_market_education_intent`: Verified pedagogical explanations for concepts like ROCE vs ROE or option Greeks route to `MARKET_EDUCATION`.
5. `test_assistant_citation_lineage`: Confirmed that generated messages include structured citation records containing source names, document snippets, timestamps, and verifiable URLs.
6. `test_assistant_conversation_lifecycle`: Verified conversation thread creation, message appending, thread history retrieval, and conversation deletion.
7. `test_assistant_feedback_submission`: Verified submission of positive/negative feedback ratings with user comments via `POST /api/v1/assistant/feedback`.
8. `test_assistant_safety_and_disclaimer`: Verified that every message includes non-advisory compliance disclaimers and avoids guaranteed return promises.
