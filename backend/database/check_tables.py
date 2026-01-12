"""
Database Tables Check Script

Run this script to check if database tables exist and show their structure.
Usage: python -m backend.database.check_tables
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from sqlalchemy import inspect
from backend.database.connection import engine, Base
from backend.database.models import User, Analysis

def check_tables():
    """Check database tables and their structure."""
    print("=" * 60)
    print("DATABASE TABLES CHECK")
    print("=" * 60)
    
    try:
        # Create inspector
        inspector = inspect(engine)
        
        # Get all table names
        table_names = inspector.get_table_names()
        
        print(f"\n✓ Connected to database successfully")
        print(f"\nFound {len(table_names)} table(s):")
        print("-" * 60)
        
        if not table_names:
            print("⚠ No tables found in database!")
            print("\nTo create tables, run:")
            print("  python -m backend.database.migrations.init_db")
            return
        
        # Check each table
        for table_name in table_names:
            print(f"\n📊 Table: {table_name}")
            print("-" * 60)
            
            # Get columns
            columns = inspector.get_columns(table_name)
            print(f"Columns ({len(columns)}):")
            for col in columns:
                nullable = "NULL" if col['nullable'] else "NOT NULL"
                default = f" DEFAULT {col['default']}" if col.get('default') is not None else ""
                print(f"  • {col['name']:20} {str(col['type']):30} {nullable}{default}")
            
            # Get primary keys
            pk_constraint = inspector.get_pk_constraint(table_name)
            if pk_constraint['constrained_columns']:
                print(f"\nPrimary Key: {', '.join(pk_constraint['constrained_columns'])}")
            
            # Get foreign keys
            fks = inspector.get_foreign_keys(table_name)
            if fks:
                print(f"\nForeign Keys:")
                for fk in fks:
                    print(f"  • {', '.join(fk['constrained_columns'])} -> {fk['referred_table']}.{', '.join(fk['referred_columns'])}")
            
            # Get indexes
            indexes = inspector.get_indexes(table_name)
            if indexes:
                print(f"\nIndexes:")
                for idx in indexes:
                    unique = "UNIQUE" if idx['unique'] else ""
                    print(f"  • {idx['name']} ({', '.join(idx['column_names'])}) {unique}")
        
        # Check expected tables
        print("\n" + "=" * 60)
        print("EXPECTED TABLES CHECK")
        print("=" * 60)
        
        expected_tables = ['users', 'analyses']
        for table in expected_tables:
            if table in table_names:
                print(f"✓ {table} - EXISTS")
            else:
                print(f"✗ {table} - MISSING")
        
        # Count records
        print("\n" + "=" * 60)
        print("RECORD COUNTS")
        print("=" * 60)
        
        from sqlalchemy.orm import Session
        from backend.database.connection import SessionLocal
        
        db = SessionLocal()
        try:
            user_count = db.query(User).count()
            analysis_count = db.query(Analysis).count()
            
            print(f"Users: {user_count}")
            print(f"Analyses: {analysis_count}")
        except Exception as e:
            print(f"⚠ Error counting records: {e}")
        finally:
            db.close()
        
        print("\n" + "=" * 60)
        print("✓ Check completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error connecting to database: {e}")
        print("\nMake sure:")
        print("  1. PostgreSQL is running")
        print("  2. DATABASE_URL environment variable is set correctly")
        print("  3. Database credentials are correct")
        sys.exit(1)

if __name__ == "__main__":
    check_tables()
