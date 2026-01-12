"""
Database Repositories

Data access layer for database operations.
Separates business logic from database queries.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List, Dict, Any
from backend.database.models import User, Analysis, Education, Provider
import hashlib
import secrets

# Password hashing (simple for academic project - use bcrypt in production)
def hash_password(password: str) -> str:
    """Hash password using SHA256 (for academic purposes)."""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash."""
    return hash_password(password) == password_hash


class UserRepository:
    """Repository for user operations."""
    
    @staticmethod
    def create(db: Session, email: str, password: str, name: str, title: Optional[str] = None) -> User:
        """Create a new user."""
        user_id = f"user_{secrets.token_hex(8)}"
        password_hash = hash_password(password)
        
        user = User(
            id=user_id,
            email=email,
            password_hash=password_hash,
            name=name,
            title=title
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_by_id(db: Session, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_all(db: Session) -> List[User]:
        """Get all users."""
        return db.query(User).order_by(User.created_at.desc()).all()
    
    @staticmethod
    def update(db: Session, user_id: str, **updates) -> Optional[User]:
        """Update user fields."""
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return None
        
        if "email" in updates:
            user.email = updates["email"]
        if "name" in updates:
            user.name = updates["name"]
        if "title" in updates:
            user.title = updates["title"]
        if "password" in updates:
            user.password_hash = hash_password(updates["password"])
        if "is_admin" in updates:
            user.is_admin = updates["is_admin"]
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def delete(db: Session, user_id: str) -> bool:
        """Delete user."""
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return False
        
        db.delete(user)
        db.commit()
        return True
    
    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        user = UserRepository.get_by_email(db, email)
        if not user:
            return None
        
        if verify_password(password, user.password_hash):
            return user
        return None


class AnalysisRepository:
    """Repository for analysis operations."""
    
    @staticmethod
    def create(
        db: Session,
        user_id: str,
        title: str,
        config: dict,
        estimates: list,
        trends: Optional[list] = None
    ) -> Analysis:
        """Create a new analysis."""
        analysis_id = f"analysis_{secrets.token_hex(12)}"
        
        analysis = Analysis(
            id=analysis_id,
            user_id=user_id,
            title=title,
            config=config,
            estimates=estimates,
            trends=trends
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis
    
    @staticmethod
    def get_by_id(db: Session, analysis_id: str) -> Optional[Analysis]:
        """Get analysis by ID."""
        return db.query(Analysis).filter(Analysis.id == analysis_id).first()
    
    @staticmethod
    def get_by_user(db: Session, user_id: str) -> List[Analysis]:
        """Get all analyses for a user."""
        return db.query(Analysis).filter(Analysis.user_id == user_id).order_by(Analysis.created_at.desc()).all()
    
    @staticmethod
    def update(
        db: Session,
        analysis_id: str,
        title: Optional[str] = None,
        config: Optional[dict] = None,
        estimates: Optional[list] = None,
        trends: Optional[list] = None
    ) -> Optional[Analysis]:
        """Update analysis."""
        analysis = AnalysisRepository.get_by_id(db, analysis_id)
        if not analysis:
            return None
        
        if title:
            analysis.title = title
        if config:
            analysis.config = config
        if estimates:
            analysis.estimates = estimates
        if trends is not None:
            analysis.trends = trends
        
        db.commit()
        db.refresh(analysis)
        return analysis
    
    @staticmethod
    def delete(db: Session, analysis_id: str, user_id: str) -> bool:
        """Delete analysis (only if owned by user)."""
        analysis = db.query(Analysis).filter(
            and_(Analysis.id == analysis_id, Analysis.user_id == user_id)
        ).first()
        
        if not analysis:
            return False
        
        db.delete(analysis)
        db.commit()
        return True
    
    @staticmethod
    def count_all(db: Session) -> int:
        """Count all analyses (admin only)."""
        return db.query(Analysis).count()


class EducationRepository:
    """Repository for education content operations."""
    
    @staticmethod
    def create(
        db: Session,
        title: str,
        description: str,
        type: str,
        category: str,
        level: str,
        full_content: Optional[str] = None,
        duration: Optional[str] = None,
        provider: Optional[str] = None,
        tags: Optional[List[str]] = None,
        url: Optional[str] = None,
        education_id: Optional[str] = None
    ) -> Education:
        """Create a new education content."""
        if not education_id:
            education_id = f"edu_{secrets.token_hex(12)}"
        
        education = Education(
            id=education_id,
            title=title,
            description=description,
            full_content=full_content,
            type=type,
            category=category,
            level=level,
            duration=duration,
            provider=provider,
            tags=tags or [],
            url=url,
            is_active=True
        )
        
        db.add(education)
        db.commit()
        db.refresh(education)
        return education
    
    @staticmethod
    def get_by_id(db: Session, education_id: str) -> Optional[Education]:
        """Get education by ID."""
        return db.query(Education).filter(Education.id == education_id).first()
    
    @staticmethod
    def get_all(db: Session, active_only: bool = False) -> List[Education]:
        """Get all education content."""
        query = db.query(Education)
        if active_only:
            query = query.filter(Education.is_active == True)
        return query.order_by(Education.created_at.desc()).all()
    
    @staticmethod
    def update(
        db: Session,
        education_id: str,
        **updates
    ) -> Optional[Education]:
        """Update education content."""
        education = EducationRepository.get_by_id(db, education_id)
        if not education:
            return None
        
        for key, value in updates.items():
            if hasattr(education, key):
                setattr(education, key, value)
        
        db.commit()
        db.refresh(education)
        return education
    
    @staticmethod
    def delete(db: Session, education_id: str) -> bool:
        """Delete education content."""
        education = EducationRepository.get_by_id(db, education_id)
        if not education:
            return False
        
        db.delete(education)
        db.commit()
        return True


class ProviderRepository:
    """Repository for cloud provider operations."""
    
    @staticmethod
    def create(
        db: Session,
        name: str,
        display_name: str,
        short_name: str,
        compute_rates: Optional[Dict[str, float]] = None,
        storage_rates: Optional[Dict[str, Dict[str, float]]] = None,
        region_multipliers: Optional[Dict[str, float]] = None,
        available_regions: Optional[List[str]] = None,
        color: Optional[str] = None,
        logo: Optional[str] = None,
        description: Optional[str] = None,
        features: Optional[Dict[str, str]] = None
    ) -> Provider:
        """Create a new provider."""
        provider_id = f"provider_{secrets.token_hex(8)}"
        
        provider = Provider(
            id=provider_id,
            name=name,
            display_name=display_name,
            short_name=short_name,
            compute_rates=compute_rates,
            storage_rates=storage_rates,
            region_multipliers=region_multipliers,
            available_regions=available_regions or [],
            color=color,
            logo=logo,
            description=description,
            features=features,
            is_active=True
        )
        
        db.add(provider)
        db.commit()
        db.refresh(provider)
        return provider
    
    @staticmethod
    def get_by_id(db: Session, provider_id: str) -> Optional[Provider]:
        """Get provider by ID."""
        return db.query(Provider).filter(Provider.id == provider_id).first()
    
    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[Provider]:
        """Get provider by name."""
        return db.query(Provider).filter(Provider.name == name).first()
    
    @staticmethod
    def get_all(db: Session, active_only: bool = False) -> List[Provider]:
        """Get all providers."""
        query = db.query(Provider)
        if active_only:
            query = query.filter(Provider.is_active == True)
        return query.order_by(Provider.name).all()
    
    @staticmethod
    def update(
        db: Session,
        provider_id: str,
        **updates
    ) -> Optional[Provider]:
        """Update provider."""
        provider = ProviderRepository.get_by_id(db, provider_id)
        if not provider:
            return None
        
        for key, value in updates.items():
            if hasattr(provider, key):
                setattr(provider, key, value)
        
        db.commit()
        db.refresh(provider)
        return provider
    
    @staticmethod
    def delete(db: Session, provider_id: str) -> bool:
        """Delete provider."""
        provider = ProviderRepository.get_by_id(db, provider_id)
        if not provider:
            return False
        
        db.delete(provider)
        db.commit()
        return True
