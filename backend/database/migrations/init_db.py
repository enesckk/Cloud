"""
Database Initialization Script

Run this script to initialize the database schema.
Usage: python -m backend.database.migrations.init_db
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.database.connection import init_db, engine
from backend.database.models import Base

def main():
    """Initialize database tables."""
    print("Initializing database...")
    try:
        init_db()
        print("OK: Database tables created successfully!")
    except Exception as e:
        print(f"ERROR: Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
