"""
Database Connection Management

Handles PostgreSQL database connection and session management.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration from environment variables
# Supports Neon PostgreSQL (for Render/Vercel) and local PostgreSQL
# Neon connection strings: postgresql://user:pass@host/db?sslmode=require
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://cloudguide_user:cloudguide_pass@localhost:5433/cloudguide_db"
)

# Ensure SSL mode for Neon PostgreSQL (if not already specified)
# Neon requires SSL connections
if "neon.tech" in DATABASE_URL or "neon.tech" in DATABASE_URL.lower():
    if "sslmode" not in DATABASE_URL:
        separator = "&" if "?" in DATABASE_URL else "?"
        DATABASE_URL = f"{DATABASE_URL}{separator}sslmode=require"
    
    # Convert postgres:// to postgresql:// if needed (Neon uses postgresql://)
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create SQLAlchemy engine
# Use psycopg (psycopg3) driver for Python 3.13 compatibility
# If using psycopg3, connection string should use postgresql+psycopg://
# Otherwise, SQLAlchemy will auto-detect the driver
if DATABASE_URL.startswith("postgresql://"):
    # Use psycopg (psycopg3) driver for better Python 3.13 support
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=10,
    max_overflow=20
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    """
    Dependency function to get database session.
    Yields a database session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Initialize database tables.
    Creates all tables defined in models.
    """
    Base.metadata.create_all(bind=engine)
