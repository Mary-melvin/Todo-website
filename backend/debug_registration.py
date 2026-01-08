#!/usr/bin/env python3
"""Debug script to test user registration"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlmodel import SQLModel, Field, create_engine, Session
from models import User
from auth import hash_password
import uuid
from datetime import datetime

# Use the same database URL as in the app
DATABASE_URL = "sqlite:///./todoapp.db"
engine = create_engine(DATABASE_URL)

def test_user_creation():
    """Test creating a user directly to debug the issue"""
    print("Testing user creation...")

    # Create tables
    SQLModel.metadata.create_all(engine)

    # Create a new user
    hashed_password = hash_password("password123")
    new_user = User(
        id=str(uuid.uuid4()),  # Explicitly set the ID
        email="test2@example.com",
        name="Test User",
        password=hashed_password,
    )

    print(f"Created user object: {new_user}")
    print(f"User ID: {new_user.id}")

    # Try to save to database
    with Session(engine) as session:
        try:
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            print(f"Successfully saved user with ID: {new_user.id}")
        except Exception as e:
            print(f"Error saving user: {e}")
            session.rollback()
            return False

    return True

if __name__ == "__main__":
    test_user_creation()