import pytest
from app.core.database import engine, Base, SessionLocal
from app.core.seed import seed_database


@pytest.fixture(scope="session", autouse=True)
def initialize_test_database():
    """
    Automatically creates all tables and idempotently seeds the test database
    before any pytest suite executes.
    """
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        seed_database(db)
        db.close()
    except Exception as e:
        print(f"[conftest] Database initialization: {e}")
