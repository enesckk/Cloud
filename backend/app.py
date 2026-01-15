"""
Flask Application Entry Point

Initializes the Flask application, registers blueprints,
configures CORS, and initializes database.
"""

import os
import sys

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from backend.routes.estimate import estimate_bp
from backend.routes.auth import auth_bp
from backend.routes.analyses import analyses_bp
from backend.routes.admin import admin_bp
from backend.routes.education import education_bp
from backend.routes.providers import providers_bp
from backend.routes.pricing import pricing_bp
from backend.database.connection import init_db

# Load environment variables
load_dotenv()

def create_app():
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    # Enable CORS for frontend integration
    # Get frontend URL from environment variable or allow all origins
    frontend_url = os.getenv("FRONTEND_URL", "*")
    
    # Support multiple origins (comma-separated) or single origin
    if frontend_url != "*" and "," in frontend_url:
        allowed_origins = [url.strip() for url in frontend_url.split(",")]
    elif frontend_url != "*":
        allowed_origins = [frontend_url]
    else:
        allowed_origins = "*"
    
    # Enable CORS for all routes
    CORS(app, 
         resources={
             r"/api/*": {
                 "origins": allowed_origins,
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "supports_credentials": True
             }
         },
         supports_credentials=True)
    
    # Initialize database
    try:
        init_db()
        print("✓ Database initialized successfully")
    except Exception as e:
        print(f"⚠ Database initialization warning: {e}")
    
    # Register blueprints
    app.register_blueprint(estimate_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(analyses_bp, url_prefix="/api/analyses")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(education_bp, url_prefix="/api/education")
    app.register_blueprint(providers_bp, url_prefix="/api")
    app.register_blueprint(pricing_bp, url_prefix="/api")
    
    return app

if __name__ == "__main__":
    app = create_app()
    # Render provides PORT environment variable, fallback to 5000 for local development
    port = int(os.getenv("PORT", 5000))
    app.run(debug=os.getenv("FLASK_DEBUG", "False").lower() == "true", host="0.0.0.0", port=port)
