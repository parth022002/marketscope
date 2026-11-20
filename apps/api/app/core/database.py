import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

raw_db_url = os.getenv("DATABASE_URL", settings.database_url)

# Ensure modern psycopg 3 dialect scheme is used by SQLAlchemy
if raw_db_url.startswith("postgresql://"):
    sqlalchemy_db_url = raw_db_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif raw_db_url.startswith("postgres://"):
    sqlalchemy_db_url = raw_db_url.replace("postgres://", "postgresql+psycopg://", 1)
else:
    sqlalchemy_db_url = raw_db_url

# Configure connection pooling and SSL settings for Neon serverless
engine = create_engine(
    sqlalchemy_db_url,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=10,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
