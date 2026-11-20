import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    memberships = relationship("WorkspaceMembership", back_populates="workspace", cascade="all, delete-orphan")
    notes = relationship("ResearchNote", back_populates="workspace", cascade="all, delete-orphan")
    snapshots = relationship("ResearchSnapshot", back_populates="workspace", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_identity_id = Column(Text, unique=True, nullable=True)
    email = Column(Text, nullable=True)
    display_name = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    memberships = relationship("WorkspaceMembership", back_populates="user", cascade="all, delete-orphan")


class WorkspaceMembership(Base):
    __tablename__ = "workspace_memberships"

    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role = Column(Text, nullable=False, default="EDITOR")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    workspace = relationship("Workspace", back_populates="memberships")
    user = relationship("User", back_populates="memberships")


class Issuer(Base):
    __tablename__ = "issuers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    canonical_name = Column(Text, nullable=False)
    country_code = Column(String(2), nullable=False, default="IN")
    sector = Column(Text, nullable=True)
    industry = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    instruments = relationship("Instrument", back_populates="issuer")


class Instrument(Base):
    __tablename__ = "instruments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    issuer_id = Column(UUID(as_uuid=True), ForeignKey("issuers.id"), nullable=False)
    symbol = Column(Text, nullable=False)
    exchange_code = Column(Text, nullable=False)
    instrument_type = Column(Text, nullable=False, default="EQUITY")
    isin = Column(Text, nullable=True)
    currency = Column(String(3), nullable=False, default="INR")
    listing_status = Column(Text, nullable=False, default="ACTIVE")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    issuer = relationship("Issuer", back_populates="instruments")
    notes = relationship("ResearchNote", back_populates="instrument")


class DataProvider(Base):
    __tablename__ = "data_providers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_key = Column(Text, unique=True, nullable=False)
    display_name = Column(Text, nullable=False)
    environment = Column(Text, nullable=False, default="DEMO")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)


class ProviderEntitlement(Base):
    __tablename__ = "provider_entitlements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("data_providers.id"), nullable=False)
    market_code = Column(Text, nullable=False)
    field_scope = Column(JSONB, nullable=False, default=dict)
    permitted_purposes = Column(JSONB, nullable=False, default=list)
    storage_allowed = Column(Boolean, nullable=False, default=False)
    redistribution_allowed = Column(Boolean, nullable=False, default=False)
    effective_from = Column(DateTime(timezone=True), nullable=True)
    effective_until = Column(DateTime(timezone=True), nullable=True)
    status = Column(Text, nullable=False, default="PENDING")


class FinancialFact(Base):
    __tablename__ = "financial_facts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(UUID(as_uuid=True), ForeignKey("instruments.id"), nullable=False)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("data_providers.id"), nullable=True)
    fact_key = Column(Text, nullable=False)
    value_numeric = Column(Numeric(28, 8), nullable=True)
    value_text = Column(Text, nullable=True)
    unit = Column(Text, nullable=False)
    currency = Column(String(3), nullable=True, default="INR")
    period_start = Column(Date, nullable=True)
    period_end = Column(Date, nullable=True)
    period_type = Column(Text, nullable=True)
    reporting_basis = Column(Text, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    retrieved_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    quality_status = Column(Text, nullable=False, default="UNVERIFIED")
    is_synthetic = Column(Boolean, nullable=False, default=False)
    source_locator = Column(Text, nullable=True)
    source_version = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)


class MetricDefinition(Base):
    __tablename__ = "metric_definitions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_key = Column(Text, nullable=False)
    label = Column(Text, nullable=False)
    formula_text = Column(Text, nullable=False)
    formula_version = Column(Text, nullable=False)
    unit = Column(Text, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)


class MetricObservation(Base):
    __tablename__ = "metric_observations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(UUID(as_uuid=True), ForeignKey("instruments.id"), nullable=False)
    metric_definition_id = Column(UUID(as_uuid=True), ForeignKey("metric_definitions.id"), nullable=False)
    value_numeric = Column(Numeric(28, 8), nullable=True)
    period_end = Column(Date, nullable=True)
    calculation_inputs = Column(JSONB, nullable=False, default=dict)
    quality_status = Column(Text, nullable=False, default="UNVERIFIED")
    calculated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("data_providers.id"), nullable=True)
    instrument_id = Column(UUID(as_uuid=True), ForeignKey("instruments.id"), nullable=True)
    title = Column(Text, nullable=False)
    source_type = Column(Text, nullable=False)
    source_locator = Column(Text, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    retrieved_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    quality_status = Column(Text, nullable=False, default="UNVERIFIED")
    item_metadata = Column("metadata", JSONB, nullable=False, default=dict)


class ResearchNote(Base):
    __tablename__ = "research_notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    instrument_id = Column(UUID(as_uuid=True), ForeignKey("instruments.id"), nullable=False)
    author_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    title = Column(Text, nullable=False)
    thesis = Column(Text, nullable=True)
    counterpoints = Column(Text, nullable=True)
    open_questions = Column(JSONB, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    workspace = relationship("Workspace", back_populates="notes")
    instrument = relationship("Instrument", back_populates="notes")


class ResearchSnapshot(Base):
    __tablename__ = "research_snapshots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    instrument_id = Column(UUID(as_uuid=True), ForeignKey("instruments.id"), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    snapshot_label = Column(Text, nullable=True)
    data_as_of = Column(DateTime(timezone=True), nullable=False)
    payload = Column(JSONB, nullable=False)
    checksum = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    workspace = relationship("Workspace", back_populates="snapshots")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=True)
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    action = Column(Text, nullable=False)
    resource_type = Column(Text, nullable=False)
    resource_id = Column(Text, nullable=True)
    item_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    occurred_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
