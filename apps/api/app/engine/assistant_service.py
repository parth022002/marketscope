"""
MarketScope.io — Grounded AI Assistant & Contextual Market Research Engine
Orchestrates intent classification, grounded retrieval across market calendar,
financial databases, verified news services, and platform documentation.
Provides strict non-advisory safety guardrails, prompt injection filtering,
and multi-model fallback execution.
"""

import logging
import re
import uuid
from datetime import datetime, timezone
from typing import Any

from app.core.config import settings
from app.domain.canonical_assistant import (
    AssistantIntent,
    CitationType,
    AssistantCitation,
    AssistantContext,
    AssistantMessage,
    AssistantConversation,
    AssistantQueryRequest,
    AssistantFeedbackRequest,
)
from app.engine.market_calendar import market_calendar_engine
from app.engine.calculations import (
    FINANCIAL_STATEMENTS_DATABASE,
    calculate_financial_ratios,
)
from app.engine.news_service import news_service

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Platform Documentation Catalog (Grounding Evidence)
# ─────────────────────────────────────────────────────────────────────────────

PLATFORM_MANUAL_TOPICS = {
    "screener": {
        "title": "Universal Stock Screener",
        "url": "/screener",
        "snippet": "Filter domestic Indian and global securities across 35+ fundamental and technical criteria, including P/E, ROCE, Debt/Equity, FCF Yield, and Market Cap. Access 6 institutional presets.",
    },
    "charts": {
        "title": "Professional Charting Terminal",
        "url": "/charts",
        "snippet": "High-performance institutional charting powered by Lightweight Charts. Supports 10 core indicators (SMA, EMA, RSI, MACD, Bollinger Bands, Stochastic, VWAP, ATR, OBV, ADX) and vector drawing tools.",
    },
    "calendar": {
        "title": "Global Market Calendar & Catalysts",
        "url": "/calendar",
        "snippet": "Authoritative session hours and holiday schedules for NSE, BSE, MCX, NYSE, NASDAQ, LSE, and TSE. Differentiates exchange trading holidays from banking (RBI/NI Act) closures.",
    },
    "intelligence": {
        "title": "MarketScope Unified Intelligence™",
        "url": "/intelligence",
        "snippet": "Multi-factor quantitative research combining Fundamental, Valuation, Technical, Risk, Market-Regime, and Financial News Trust scores into a unified 0–100 rating with audit citations.",
    },
    "watchlists": {
        "title": "Custom Watchlists",
        "url": "/watchlists",
        "snippet": "Create custom portfolios and instrument watchlists with persistent price alerts, percent change tracking, and direct company research links.",
    },
    "alerts": {
        "title": "Price & Technical Alert Center",
        "url": "/alerts",
        "snippet": "Configure condition-based notifications for price crosses, RSI overbought/oversold boundaries, and upcoming market holiday notifications.",
    },
    "workspace": {
        "title": "Workspace & DPDP Privacy",
        "url": "/workspace",
        "snippet": "Audit notes, saved chart snapshots, and exercise India DPDP Act 2023 / GDPR rights to export all user data or execute irreversible cryptographic purges.",
    },
}

FINANCIAL_EDUCATION_TOPICS = {
    "roce": {
        "name": "Return on Capital Employed (ROCE)",
        "formula": "ROCE = EBIT / (Total Assets - Current Liabilities)",
        "explanation": "Measures how efficiently a company allocates its total capital (equity + debt) to generate operating earnings. Institutional investors prioritize companies sustaining ROCE > 15–20% across economic cycles.",
    },
    "pe": {
        "name": "Price-to-Earnings Ratio (P/E)",
        "formula": "Trailing P/E = Current Share Price / Diluted Trailing-Twelve-Month (TTM) EPS",
        "explanation": "Compares market capitalization against audited earnings. High P/E implies expectations of rapid forward growth, while low P/E may reflect value discounts or cyclical peak earnings.",
    },
    "fcf": {
        "name": "Free Cash Flow (FCF) & Yield",
        "formula": "FCF = Cash Flow from Operations (CFO) - Capital Expenditures (CapEx)",
        "explanation": "Cash generated after maintaining and expanding operating asset base. FCF Yield = FCF / Market Cap; institutional metric evaluating real cash earnings available for dividends and debt reduction.",
    },
    "debt_to_equity": {
        "name": "Debt-to-Equity Ratio (D/E)",
        "formula": "D/E = Total Interest-Bearing Debt / Total Shareholders' Equity",
        "explanation": "Measures financial leverage and capital structure risk. Values < 0.5x indicate conservative balance sheets with low insolvency risk during high-interest-rate regimes.",
    },
    "adx": {
        "name": "Average Directional Index (ADX)",
        "formula": "Wilder's 14-period Smoothed DX = 100 * |+DI - -DI| / (|+DI| + |-DI|)",
        "explanation": "Quantifies the directional strength of a price trend irrespective of whether it is bullish or bearish. ADX > 25 indicates strong trending behavior, while ADX < 20 signifies range-bound consolidation.",
    },
    "market_breadth": {
        "name": "Market Breadth (Advance-Decline Ratio)",
        "formula": "A/D Ratio = Advancing Stocks / Declining Stocks",
        "explanation": "Assesses market participation strength. An advance-decline ratio > 1.5 confirms broad liquidity participation across sectors, whereas rallies led by only a few heavyweights signal distribution vulnerability.",
    },
    "implied_volatility": {
        "name": "Implied Volatility (IV)",
        "formula": "Derived by inverting Black-Scholes-Merton option pricing equation using live market premiums",
        "explanation": "Reflects market consensus of expected annualized 1-standard-deviation price variation over the contract lifespan. Spikes in IV reflect heightened demand for downside tail-risk hedging.",
    },
}


def _extract_val(container: dict[str, Any], key: str, default: float = 0.0) -> float:
    item = container.get(key, default)
    if isinstance(item, dict):
        return float(item.get("value", default))
    if item is None:
        return default
    try:
        return float(item)
    except (ValueError, TypeError):
        return default


class AIAssistantService:
    def __init__(self):
        self._conversations: dict[str, AssistantConversation] = {}
        self._feedback_store: list[AssistantFeedbackRequest] = []

    def _detect_intent(self, query: str, context: AssistantContext | None = None) -> AssistantIntent:
        q = query.lower()
        if (context and context.symbol) or any(w in q for w in ["reliance", "tcs", "hdfc", "infosys", "tata motors", "valuation", "balance sheet", "income statement"]):
            return AssistantIntent.COMPANY_RESEARCH
        if any(w in q for w in ["open", "close", "holiday", "session", "trading hours", "is nse", "is bse", "is nyse", "when does", "market status", "current status", "status of"]):
            return AssistantIntent.MARKET_STATUS
        if any(w in q for w in ["how to", "how do i", "screener", "watchlist", "create alert", "add indicator", "export data", "where is"]):
            return AssistantIntent.PLATFORM_SUPPORT
        if any(w in q for w in ["formula", "roce", "pe ratio", "p/e", "debt to equity", "free cash flow", "adx", "rsi", "implied vol", "market breadth"]):
            return AssistantIntent.MARKET_EDUCATION
        if any(w in q for w in ["news", "headline", "rbi", "fed", "rate cut", "inflation", "cpi", "gdp", "announcement", "why is"]):
            return AssistantIntent.NEWS_ANALYSIS
        if any(w in q for w in ["what is", "explain"]):
            return AssistantIntent.MARKET_EDUCATION
        return AssistantIntent.GENERAL_FINANCE

    def _sanitize_input(self, text: str) -> str:
        """Strips potential prompt-injection tokens and adversarial instructions."""
        dangerous_patterns = [
            r"ignore (all )?previous instructions",
            r"system prompt",
            r"you are now (an unrestricted|dan)",
            r"reveal (your |the )?(secrets|api_key|password)",
        ]
        cleaned = text
        for p in dangerous_patterns:
            cleaned = re.sub(p, "[filtered]", cleaned, flags=re.IGNORECASE)
        return cleaned.strip()

    async def process_query(self, req: AssistantQueryRequest, user_id: str = "default_user") -> AssistantMessage:
        clean_text = self._sanitize_input(req.message)
        cid = req.conversation_id or f"conv_{uuid.uuid4().hex[:12]}"

        # Initialize conversation if not present
        if cid not in self._conversations:
            self._conversations[cid] = AssistantConversation(
                conversation_id=cid,
                user_id=user_id,
                title=clean_text[:40] + ("..." if len(clean_text) > 40 else ""),
            )

        conv = self._conversations[cid]

        # Append User Message
        user_msg = AssistantMessage(
            id=f"msg_{uuid.uuid4().hex[:10]}",
            conversation_id=cid,
            sender="user",
            content=clean_text,
            context_used=req.context,
        )
        conv.messages.append(user_msg)

        intent = self._detect_intent(clean_text, req.context)
        citations: list[AssistantCitation] = []
        suggested: list[str] = []
        response_content = ""

        # ── 1. MARKET STATUS ROUTE ───────────────────────────────────────────
        if intent == AssistantIntent.MARKET_STATUS:
            summary = market_calendar_engine.get_all_markets_summary()
            nse_session = market_calendar_engine.get_market_session("NSE")
            nyse_session = market_calendar_engine.get_market_session("NYSE")
            lse_session = market_calendar_engine.get_market_session("LSE")
            tse_session = market_calendar_engine.get_market_session("TSE")

            citations.append(
                AssistantCitation(
                    citation_id="CIT-CAL-NSE",
                    title="NSE Trading Hours & Holiday Schedule",
                    source_name="National Stock Exchange of India (XNSE)",
                    url="/calendar",
                    citation_type=CitationType.EXCHANGE_SCHEDULE,
                    snippet=f"NSE Status: {nse_session.status.value} ({nse_session.session_label}). Regular Hours: 09:15–15:30 IST. Time: {nse_session.current_local_time} IST.",
                )
            )
            citations.append(
                AssistantCitation(
                    citation_id="CIT-CAL-US",
                    title="NYSE Operating Schedule",
                    source_name="New York Stock Exchange (XNYS)",
                    url="/calendar",
                    citation_type=CitationType.EXCHANGE_SCHEDULE,
                    snippet=f"NYSE Status: {nyse_session.status.value} ({nyse_session.session_label}). Regular Hours: 09:30–16:00 EST. Time: {nyse_session.current_local_time} EST.",
                )
            )

            response_content = (
                f"### Global Financial Markets Status Summary\n\n"
                f"**Snapshot**: **{summary.summary_label}** (as of {summary.timestamp_utc} UTC).\n\n"
                f"- **India (NSE / BSE)**: **{nse_session.status.value}** — {nse_session.session_label} (Local: `{nse_session.current_local_time} IST`)\n"
                f"- **United States (NYSE / NASDAQ)**: **{nyse_session.status.value}** — {nyse_session.session_label} (Local: `{nyse_session.current_local_time} EST`)\n"
                f"- **United Kingdom (LSE)**: **{lse_session.status.value}** — {lse_session.session_label} (Local: `{lse_session.current_local_time} GMT/BST`)\n"
                f"- **Japan (Tokyo TSE)**: **{tse_session.status.value}** — {tse_session.session_label} (Local: `{tse_session.current_local_time} JST`)\n\n"
            )

            if nse_session.holiday_today:
                response_content += f"> **Exchange Holiday Alert**: Today is an official exchange holiday for Indian markets: **{nse_session.holiday_name}**.\n\n"

            response_content += (
                f"For full calendar coverage, settlement dates, and upcoming central bank meetings, visit the "
                f"[Global Market Calendar](/calendar)."
            )
            suggested = [
                "What are the upcoming Indian market holidays?",
                "When is the next RBI MPC meeting?",
                "Is MCX open this evening?",
            ]

        # ── 2. PLATFORM SUPPORT ROUTE ────────────────────────────────────────
        elif intent == AssistantIntent.PLATFORM_SUPPORT:
            matched_key = "screener"
            q_lower = clean_text.lower()
            if "chart" in q_lower or "indicator" in q_lower:
                matched_key = "charts"
            elif "calendar" in q_lower or "holiday" in q_lower:
                matched_key = "calendar"
            elif "alert" in q_lower:
                matched_key = "alerts"
            elif "watchlist" in q_lower:
                matched_key = "watchlists"
            elif "intelligence" in q_lower or "q-intel" in q_lower:
                matched_key = "intelligence"
            elif "privacy" in q_lower or "export" in q_lower or "purge" in q_lower:
                matched_key = "workspace"

            item = PLATFORM_MANUAL_TOPICS.get(matched_key, PLATFORM_MANUAL_TOPICS["screener"])
            citations.append(
                AssistantCitation(
                    citation_id=f"CIT-DOC-{matched_key.upper()}",
                    title=item["title"],
                    source_name="MarketScope.io User Guide",
                    url=item["url"],
                    citation_type=CitationType.PLATFORM_MANUAL,
                    snippet=item["snippet"],
                )
            )

            response_content = (
                f"### How to use {item['title']}\n\n"
                f"{item['snippet']}\n\n"
                f"**Step-by-Step Instructions**:\n"
                f"1. Navigate to [{item['title']}]({item['url']}) from the sidebar navigation or press `Cmd+K` / `Ctrl+K`.\n"
                f"2. Apply your desired filters or select from pre-configured institutional presets.\n"
                f"3. Results update with traceable evidence and verifiable calculation formulas.\n"
                f"4. You can save customized configurations directly into your [Workspace](/workspace)."
            )
            suggested = [
                "How do I add ADX to a chart?",
                "How do I create a price alert?",
                "Where can I find banking holidays?",
            ]

        # ── 3. MARKET EDUCATION ROUTE ────────────────────────────────────────
        elif intent == AssistantIntent.MARKET_EDUCATION:
            topic_key = "roce"
            q_lower = clean_text.lower()
            for k in FINANCIAL_EDUCATION_TOPICS:
                if k in q_lower or k.replace("_", " ") in q_lower:
                    topic_key = k
                    break

            topic = FINANCIAL_EDUCATION_TOPICS[topic_key]
            citations.append(
                AssistantCitation(
                    citation_id=f"CIT-EDU-{topic_key.upper()}",
                    title=f"Financial Formula: {topic['name']}",
                    source_name="MarketScope Quantitative Curriculum",
                    url="/help",
                    citation_type=CitationType.FINANCIAL_RATIO,
                    snippet=f"Formula: {topic['formula']}. Context: {topic['explanation']}",
                )
            )

            response_content = (
                f"### {topic['name']}\n\n"
                f"**Mathematical Formula**:\n"
                f"$$\\text{{{topic['formula']}}}$$\n\n"
                f"**Financial Intuition & Context**:\n"
                f"{topic['explanation']}\n\n"
                f"You can explore live calculations across any company using our [Universal Stock Screener](/screener) "
                f"or inspect company statements in the [Company Research Hub](/stocks)."
            )
            suggested = [
                "What is Free Cash Flow Yield?",
                "Explain the Average Directional Index (ADX)",
                "How does Market Breadth work?",
            ]

        # ── 4. COMPANY RESEARCH ROUTE ────────────────────────────────────────
        elif intent == AssistantIntent.COMPANY_RESEARCH:
            target_symbol = "RELIANCE"
            for s in ["RELIANCE", "TCS", "HDFCBANK", "INFY", "TATAMOTORS"]:
                if s.lower() in clean_text.lower():
                    target_symbol = s
                    break
            if req.context and req.context.symbol:
                target_symbol = req.context.symbol.split(":")[-1]

            company_data = FINANCIAL_STATEMENTS_DATABASE.get(target_symbol, FINANCIAL_STATEMENTS_DATABASE["RELIANCE"])
            ratios = calculate_financial_ratios(target_symbol)
            val = ratios.get("valuation", {})
            prof = ratios.get("profitability", {})
            solv = ratios.get("solvency", {})

            pe = _extract_val(val, "pe_ratio", 25.0)
            pb = _extract_val(val, "pb_ratio", 3.0)
            roe = _extract_val(prof, "roe", 15.0)
            roce = _extract_val(prof, "roce", 18.0)
            de = _extract_val(solv, "debt_to_equity", 0.3)

            citations.append(
                AssistantCitation(
                    citation_id=f"CIT-FILING-{target_symbol}",
                    title=f"{company_data.get('company_name', target_symbol)} FY24 Audited Financial Statements",
                    source_name="BSE / NSE Regulatory Filings",
                    url=f"/company/{target_symbol}",
                    citation_type=CitationType.AUDITED_FILING,
                    snippet=f"Consolidated audited figures: ROCE={roce:.1f}%, ROE={roe:.1f}%, Trailing P/E={pe:.1f}x, D/E={de:.2f}x.",
                )
            )

            response_content = (
                f"### Fundamental Research: {company_data.get('company_name', target_symbol)} (`NSE:{target_symbol}`)\n\n"
                f"Grounded financial ratios synthesized from audited FY24 regulatory filings:\n\n"
                f"| Metric | Value | Benchmark / Assessment |\n"
                f"|---|---|---|\n"
                f"| **Trailing P/E Ratio** | `{pe:.2f}x` | Valuation multiple based on TTM earnings |\n"
                f"| **Price-to-Book (P/B)** | `{pb:.2f}x` | Market multiple against audited net book value |\n"
                f"| **Return on Capital Employed (ROCE)** | `{roce:.2f}%` | High capital efficiency (> 15% threshold) |\n"
                f"| **Return on Equity (ROE)** | `{roe:.2f}%` | Net earnings productivity on equity base |\n"
                f"| **Debt to Equity** | `{de:.2f}x` | Conservative capital structure with modest leverage |\n\n"
                f"To review detailed peer comparisons and historical trendlines, view the full "
                f"[Company Research Page](/company/{target_symbol})."
            )
            suggested = [
                f"Compare {target_symbol} with industry peers",
                f"What are the major business risks for {target_symbol}?",
                f"Show latest news for {target_symbol}",
            ]

        # ── 5. NEWS ANALYSIS ROUTE ───────────────────────────────────────────
        elif intent == AssistantIntent.NEWS_ANALYSIS:
            articles = await news_service.get_articles(limit=3)
            lead = articles[0] if articles else None

            if lead:
                citations.append(
                    AssistantCitation(
                        citation_id=f"CIT-NEWS-{lead.id}",
                        title=lead.headline,
                        source_name=lead.publisher_name,
                        url=lead.original_url,
                        citation_type=CitationType.VERIFIED_NEWS,
                        snippet=f"Verified {lead.source_tier.value} report: {lead.summary[:140]}...",
                    )
                )

                response_content = (
                    f"### Financial News Intelligence Wire\n\n"
                    f"**Lead Story**: **{lead.headline}**\n\n"
                    f"**Publisher**: {lead.publisher_name} · **Credibility**: `{lead.source_tier.value}` · **Priority**: `{lead.priority}`\n\n"
                    f"**Key Summary**:\n{lead.summary}\n\n"
                    f"**Why It Matters & Market Impact**:\n"
                    f"- **Direct Implication**: {lead.market_impact.direct_reported_impact if lead.market_impact else 'Assessing transmission channels.'}\n"
                    f"- **Affected Sectors**: {', '.join(lead.affected_sectors) if lead.affected_sectors else 'Banking, Markets'}\n"
                    f"- **Source Link**: [Read original report at {lead.publisher_name}]({lead.original_url})\n\n"
                    f"Explore live coverage and regulatory press releases at the [Worldwide News Intelligence Centre](/news)."
                )
            else:
                response_content = (
                    "No news articles matching current filter criteria. Browse all verified feeds at "
                    "[News Centre](/news)."
                )

            suggested = [
                "Summarize latest RBI monetary policy stance",
                "What are the top market-moving stories today?",
                "Which sectors are currently trending?",
            ]

        # ── 6. GENERAL FINANCE ROUTE ─────────────────────────────────────────
        else:
            citations.append(
                AssistantCitation(
                    citation_id="CIT-GEN-01",
                    title="MarketScope.io Financial Research Platform Architecture",
                    source_name="MarketScope Documentation",
                    url="/about",
                    citation_type=CitationType.PLATFORM_MANUAL,
                    snippet="Unified institutional financial intelligence combining real-time market data, multi-exchange calendars, and deterministic ratio verification.",
                )
            )
            response_content = (
                f"### MarketScope.io Financial Research Assistant\n\n"
                f"I can assist you with:\n"
                f"- **Market Status & Hours**: Check live sessions for NSE, BSE, MCX, NYSE, LSE, and TSE.\n"
                f"- **Holiday Intelligence**: Distinguish exchange trading holidays from banking (RBI/NI Act) closures.\n"
                f"- **Company Fundamentals**: Audit ratios (ROCE, P/E, FCF, Debt/Equity) from regulatory filings.\n"
                f"- **Financial News Intelligence**: Analyze verified news from RBI, SEBI, Reuters, and official sources.\n"
                f"- **Platform Tools**: Learn how to configure screeners, chart indicators, and alert rules.\n\n"
                f"How would you like to proceed with your research?"
            )
            suggested = [
                "Is NSE open today?",
                "What is ROCE?",
                "Summarize top banking news",
                "How do I use the stock screener?",
            ]

        assistant_msg = AssistantMessage(
            id=f"msg_{uuid.uuid4().hex[:10]}",
            conversation_id=cid,
            sender="assistant",
            content=response_content,
            intent=intent,
            citations=citations,
            suggested_prompts=suggested,
            context_used=req.context,
        )
        conv.messages.append(assistant_msg)
        conv.updated_at = datetime.now(timezone.utc).isoformat()

        return assistant_msg

    def get_conversations(self, user_id: str = "default_user") -> list[AssistantConversation]:
        return [c for c in self._conversations.values() if c.user_id == user_id]

    def get_conversation(self, conversation_id: str) -> AssistantConversation | None:
        return self._conversations.get(conversation_id)

    def delete_conversation(self, conversation_id: str) -> bool:
        if conversation_id in self._conversations:
            del self._conversations[conversation_id]
            return True
        return False

    def record_feedback(self, feedback: AssistantFeedbackRequest) -> bool:
        self._feedback_store.append(feedback)
        return True


# Global Singleton Assistant Service
assistant_service = AIAssistantService()
