"""
Database migration script to initialize tables per @specs/database/schema.md
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import create_db_and_tables

def run_migrations():
    """
    Run database migrations to initialize all tables
    """
    print("Running database migrations...")
    create_db_and_tables()
    print("Database migrations completed successfully!")

if __name__ == "__main__":
    run_migrations()