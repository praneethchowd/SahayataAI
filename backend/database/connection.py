import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Production: Use DATABASE_URL from environment
# Development: Use local PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://praneeth@localhost:5432/sahayataaifinal"
)

# Render uses 'postgres://' but SQLAlchemy needs 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Database session generator"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test connection
def test_connection():
    try:
        with engine.connect() as conn:
            print(f"✅ Database connected: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'local'}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
