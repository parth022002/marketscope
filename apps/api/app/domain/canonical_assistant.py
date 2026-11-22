"""
MarketScope.io — Canonical AI Assistant & Market Research Domain Models
Defines immutable data contracts for floating assistant conversations, message lineages,
grounded multi-tier citations, contextual intent routing, and user feedback telemetry.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class AssistantIntent(str, Enum):
    MARKET_STATUS = "MARKET_STATUS"         # "Is NSE open today?", "When does US market close?"
    PLATFORM_SUPPORT = "PLATFORM_SUPPORT"   # "How to add RSI?", "How to use screener?"
    MARKET_EDUCATION = "MARKET_EDUCATION"   # "What is ROCE?", "What is market breadth?"
    COMPANY_RESEARCH = "COMPANY_RESEARCH"   # "Reliance valuation", "TCS quarterly earnings"
    NEWS_ANALYSIS = "NEWS_ANALYSIS"         # "Summarize banking news", "RBI rate cut impact"
    GENERAL_FINANCE = "GENERAL_FINANCE"     # Broader analytical queries


class CitationType(str, Enum):
    EXCHANGE_SCHEDULE = "EXCHANGE_SCHEDULE"
    FINANCIAL_RATIO = "FINANCIAL_RATIO"
    AUDITED_FILING = "AUDITED_FILING"
    VERIFIED_NEWS = "VERIFIED_NEWS"
    ECONOMIC_CATALYST = "ECONOMIC_CATALYST"
    PLATFORM_MANUAL = "PLATFORM_MANUAL"


class AssistantCitation(BaseModel):
    citation_id: str
    title: str
    source_name: str
    url: str
    citation_type: CitationType
    snippet: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AssistantContext(BaseModel):
    route: str | None = None                # e.g., "/company/RELIANCE", "/charts", "/news"
    symbol: str | None = None               # e.g., "NSE:RELIANCE", "TCS"
    company_name: str | None = None
    timeframe: str | None = None            # e.g., "1D", "1W", "1M"
    active_indicators: list[str] = Field(default_factory=list) # e.g., ["RSI", "MACD", "ADX"]
    article_id: str | None = None


class AssistantMessage(BaseModel):
    id: str
    conversation_id: str
    sender: str                             # "user" | "assistant" | "system"
    content: str
    intent: AssistantIntent = AssistantIntent.GENERAL_FINANCE
    citations: list[AssistantCitation] = Field(default_factory=list)
    suggested_prompts: list[str] = Field(default_factory=list)
    context_used: AssistantContext | None = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    model_provider: str = "MarketScope Grounded Research Engine"
    disclaimer: str = (
        "STRICTLY FOR RESEARCH & ANALYTICAL DECISION SUPPORT. "
        "MarketScope.io is not a SEBI-registered investment advisor or broker. "
        "Zero investment advice, buy/sell recommendations, or price targets are provided."
    )


class AssistantConversation(BaseModel):
    conversation_id: str
    user_id: str = "default_user"
    title: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    messages: list[AssistantMessage] = Field(default_factory=list)


class AssistantQueryRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    context: AssistantContext | None = None


class AssistantFeedbackRequest(BaseModel):
    message_id: str
    conversation_id: str
    rating: str                             # "positive" | "negative"
    feedback_text: str | None = None
