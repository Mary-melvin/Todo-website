from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
import os
from dotenv import load_dotenv
from fastapi import Depends

# Load environment variables
load_dotenv()

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todoapp.db")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)

def get_db_session() -> Generator[Session, None, None]:
    """Get database session for FastAPI dependency injection"""
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise