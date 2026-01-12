"""
Database Models

SQLAlchemy models for users, analyses, and reports.
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, Boolean, Text
from sqlalchemy.sql import func
from backend.database.connection import Base

class User(Base):
    """User model for authentication and profile management."""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)  # Should be hashed
    name = Column(String, nullable=False)
    title = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False, nullable=False)  # Admin flag
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """Convert user to dictionary (excluding password)."""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "title": self.title,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Analysis(Base):
    """Cost analysis model for saved estimations."""
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Foreign key to users
    title = Column(String, nullable=False)
    
    # Configuration (stored as JSON)
    config = Column(JSON, nullable=False)
    
    # Estimates (stored as JSON)
    estimates = Column(JSON, nullable=False)
    
    # Trends (optional, stored as JSON)
    trends = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """Convert analysis to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "config": self.config,
            "estimates": self.estimates,
            "trends": self.trends,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Education(Base):
    """Education content model for learning materials."""
    __tablename__ = "education"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    full_content = Column(Text, nullable=True)  # Full article/video content
    type = Column(String, nullable=False)  # article, video, guide, case-study
    category = Column(String, nullable=False)  # basics, migration, providers, security, cost-optimization, best-practices
    duration = Column(String, nullable=True)  # e.g., "15 min"
    level = Column(String, nullable=False)  # beginner, intermediate, advanced
    provider = Column(String, nullable=True)  # aws, azure, gcp, huawei, general
    tags = Column(JSON, nullable=True)  # Array of tags
    url = Column(String, nullable=True)  # External URL if applicable
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """Convert education to dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "full_content": self.full_content,
            "type": self.type,
            "category": self.category,
            "duration": self.duration,
            "level": self.level,
            "provider": self.provider,
            "tags": self.tags or [],
            "url": self.url,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Provider(Base):
    """Cloud provider model for pricing and configuration."""
    __tablename__ = "providers"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)  # aws, azure, gcp, huawei
    display_name = Column(String, nullable=False)  # Amazon Web Services, Microsoft Azure, etc.
    short_name = Column(String, nullable=False)  # AWS, Azure, GCP, Huawei
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Pricing configuration (JSON)
    compute_rates = Column(JSON, nullable=True)  # {linux: 0.0415, windows: 0.083}
    storage_rates = Column(JSON, nullable=True)  # {standard-hdd: 0.045, standard-ssd: 0.08, ...}
    region_multipliers = Column(JSON, nullable=True)  # {europe: 1.0, middle-east: 1.05, ...}
    available_regions = Column(JSON, nullable=True)  # Array of available regions
    
    # Metadata
    color = Column(String, nullable=True)  # CSS color for UI
    logo = Column(String, nullable=True)  # Logo identifier
    description = Column(Text, nullable=True)
    features = Column(JSON, nullable=True)  # {feature_name: "yes" | "no" | "partial"}
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """Convert provider to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "display_name": self.display_name,
            "short_name": self.short_name,
            "is_active": self.is_active,
            "compute_rates": self.compute_rates,
            "storage_rates": self.storage_rates,
            "region_multipliers": self.region_multipliers,
            "available_regions": self.available_regions,
            "color": self.color,
            "logo": self.logo,
            "description": self.description,
            "features": self.features,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
