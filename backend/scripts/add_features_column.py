"""
Script to add 'features' column to providers table.

Run with: python -m backend.scripts.add_features_column
"""
import os
import sys

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from sqlalchemy import text
from backend.database.connection import engine

def add_features_column():
    """Add features column to providers table if it doesn't exist."""
    try:
        with engine.begin() as conn:  # Use begin() for auto-commit
            # Check if column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'providers' AND column_name = 'features'
            """))
            
            if result.fetchone():
                print("✓ 'features' column already exists in providers table")
            else:
                # Add the column
                conn.execute(text("""
                    ALTER TABLE providers 
                    ADD COLUMN features JSON
                """))
                print("✓ Added 'features' column to providers table")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    print("Adding 'features' column to providers table...")
    add_features_column()
    print("Done!")
