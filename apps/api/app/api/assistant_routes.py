"""
MarketScope.io — Floating AI Support & Market Research Chatbot API Routes
Full implementation of endpoints for conversation session lifecycle, message streaming/querying,
grounded multi-tier citations, and user feedback telemetry.
"""

from typing import Any
from fastapi import APIRouter, HTTPException, Query, status

from app.domain.canonical_assistant import (
    AssistantMessage,
    AssistantConversation,
    AssistantQueryRequest,
    AssistantFeedbackRequest,
)
from app.engine.assistant_service import assistant_service

assistant_router = APIRouter(prefix="", tags=["Floating AI Assistant & Research"])


@assistant_router.post(
    "/assistant/chat",
    response_model=AssistantMessage,
    summary="Interactive AI Assistant Chat Query",
)
async def query_assistant(
    request: AssistantQueryRequest,
    user_id: str = Query("default_user", description="Authenticated user ID"),
):
    """
    Submits a user query with optional page context (symbol, route, indicators).
    Returns grounded response with traceable citations to exchange calendars,
    audited financial filings, verified news, or platform documentation.
    """
    return await assistant_service.process_query(request, user_id=user_id)


@assistant_router.get(
    "/assistant/conversations",
    response_model=list[AssistantConversation],
    summary="List User Conversations",
)
def list_conversations(
    user_id: str = Query("default_user", description="Authenticated user ID"),
):
    """Returns active assistant conversation histories for the current user."""
    return assistant_service.get_conversations(user_id=user_id)


@assistant_router.post(
    "/assistant/conversations",
    response_model=AssistantConversation,
    summary="Create New Conversation",
)
def create_conversation(
    user_id: str = Query("default_user", description="Authenticated user ID"),
    title: str = Query("New Research Session", description="Optional conversation title"),
):
    """Initializes a new isolated assistant session."""
    import uuid
    from datetime import datetime, timezone

    cid = f"conv_{uuid.uuid4().hex[:12]}"
    conv = AssistantConversation(
        conversation_id=cid,
        user_id=user_id,
        title=title,
        created_at=datetime.now(timezone.utc).isoformat(),
        updated_at=datetime.now(timezone.utc).isoformat(),
        messages=[],
    )
    assistant_service._conversations[cid] = conv
    return conv


@assistant_router.get(
    "/assistant/conversations/{conversation_id}",
    response_model=AssistantConversation,
    summary="Get Conversation Detail",
)
def get_conversation_detail(conversation_id: str):
    """Retrieves full message history and citations for a conversation."""
    conv = assistant_service.get_conversation(conversation_id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation '{conversation_id}' not found.",
        )
    return conv


@assistant_router.post(
    "/assistant/conversations/{conversation_id}/messages",
    response_model=AssistantMessage,
    summary="Send Message in Conversation",
)
async def send_message_in_conversation(
    conversation_id: str,
    request: AssistantQueryRequest,
    user_id: str = Query("default_user", description="Authenticated user ID"),
):
    """Sends a follow-up prompt within an existing conversation thread."""
    request.conversation_id = conversation_id
    return await assistant_service.process_query(request, user_id=user_id)


@assistant_router.delete(
    "/assistant/conversations/{conversation_id}",
    summary="Delete Conversation",
)
def delete_conversation(conversation_id: str):
    """Permanently purges a conversation and its messages."""
    success = assistant_service.delete_conversation(conversation_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation '{conversation_id}' not found.",
        )
    return {"status": "deleted", "conversation_id": conversation_id}


@assistant_router.post(
    "/assistant/feedback",
    summary="Submit Assistant Feedback",
)
def submit_feedback(feedback: AssistantFeedbackRequest):
    """Records user quality feedback (positive/negative) for continuous validation."""
    assistant_service.record_feedback(feedback)
    return {"status": "recorded", "message_id": feedback.message_id}
