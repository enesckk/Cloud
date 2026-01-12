"""
Create Admin User Script

Creates an admin user in the database.
Usage: 
  python backend/scripts/create_admin.py
  python backend/scripts/create_admin.py admin@example.com password123 "Admin User"
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.database.connection import get_db
from backend.database.repositories import UserRepository

def create_admin(email=None, password=None, name=None, title=None):
    """Create an admin user."""
    print("=" * 50)
    print("Admin User Creation")
    print("=" * 50)
    
    # Get user input from command line or prompt
    if not email:
        email = input("Enter admin email: ").strip()
    if not email:
        print("Error: Email is required")
        return
    
    if not password:
        password = input("Enter admin password: ").strip()
    if not password:
        print("Error: Password is required")
        return
    
    if not name:
        name = input("Enter admin name: ").strip()
    if not name:
        print("Error: Name is required")
        return
    
    if not title:
        title = input("Enter admin title (optional): ").strip() or None
    
    # Create user
    try:
        db = next(get_db())
        
        # Check if user exists
        existing_user = UserRepository.get_by_email(db, email)
        if existing_user:
            print(f"\nUser with email {email} already exists.")
            make_admin = input("Do you want to make this user an admin? (y/n): ").strip().lower()
            if make_admin == 'y':
                UserRepository.update(db, existing_user.id, is_admin=True)
                print(f"OK: User {email} is now an admin!")
            else:
                print("Operation cancelled.")
            return
        
        # Create new admin user
        user = UserRepository.create(db, email, password, name, title)
        
        # Set as admin
        UserRepository.update(db, user.id, is_admin=True)
        
        print("\n" + "=" * 50)
        print("OK: Admin user created successfully!")
        print("=" * 50)
        print(f"Email: {email}")
        print(f"Name: {name}")
        print(f"ID: {user.id}")
        print(f"Admin: True")
        print("=" * 50)
        
    except Exception as e:
        print(f"\nERROR: Error creating admin user: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Get arguments from command line
    if len(sys.argv) >= 4:
        email = sys.argv[1]
        password = sys.argv[2]
        name = sys.argv[3]
        title = sys.argv[4] if len(sys.argv) > 4 else None
        create_admin(email, password, name, title)
    else:
        create_admin()
