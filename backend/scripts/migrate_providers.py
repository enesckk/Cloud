"""
Script to migrate default providers to database.

Run with: python -m backend.scripts.migrate_providers
"""

import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from backend.database.connection import get_db
from backend.database.repositories import ProviderRepository
from datetime import datetime

# Default providers data from frontend
DEFAULT_PROVIDERS = [
    {
        "name": "aws",
        "display_name": "Amazon Web Services",
        "short_name": "AWS",
        "is_active": True,
        "compute_rates": {
            "linux": 0.0415,
            "windows": 0.083
        },
        "storage_rates": {
            "standard-hdd": 0.045,
            "standard-ssd": 0.08,
            "premium-ssd": 0.125,
            "ultra-ssd": 0.16
        },
        "region_multipliers": {
            "europe": 1.0,
            "middle-east": 1.0,
            "asia-pacific": 1.0,
            "north-america": 1.0,
            "latin-america": 1.0,
            "turkey-local": 1.0
        },
        "available_regions": ["europe", "middle-east", "asia-pacific", "north-america", "latin-america"],
        "logo": "AWS",
        "description": "Leading cloud provider with global infrastructure"
    },
    {
        "name": "azure",
        "display_name": "Microsoft Azure",
        "short_name": "Azure",
        "is_active": True,
        "compute_rates": {
            "linux": 0.0468,
            "windows": 0.0936
        },
        "storage_rates": {
            "standard-hdd": 0.04,
            "standard-ssd": 0.10,
            "premium-ssd": 0.15,
            "ultra-ssd": 0.18
        },
        "region_multipliers": {
            "europe": 1.0,
            "middle-east": 1.0,
            "asia-pacific": 1.0,
            "north-america": 1.0,
            "latin-america": 1.0,
            "turkey-local": 1.0
        },
        "available_regions": ["europe", "middle-east", "asia-pacific", "north-america", "latin-america"],
        "logo": "Azure",
        "description": "Enterprise-focused cloud platform with Microsoft integration"
    },
    {
        "name": "gcp",
        "display_name": "Google Cloud Platform",
        "short_name": "GCP",
        "is_active": True,
        "compute_rates": {
            "linux": 0.0495,
            "windows": 0.099
        },
        "storage_rates": {
            "standard-hdd": 0.04,
            "standard-ssd": 0.17,
            "premium-ssd": 0.24,
            "ultra-ssd": 0.30
        },
        "region_multipliers": {
            "europe": 1.0,
            "middle-east": 1.0,
            "asia-pacific": 1.0,
            "north-america": 1.0,
            "latin-america": 1.0,
            "turkey-local": 1.0
        },
        "available_regions": ["europe", "middle-east", "asia-pacific", "north-america", "latin-america", "turkey-local"],
        "logo": "GCP",
        "description": "Google's cloud platform with advanced analytics and AI"
    },
    {
        "name": "huawei",
        "display_name": "Huawei Cloud",
        "short_name": "Huawei",
        "is_active": True,
        "compute_rates": {
            "linux": 0.042,
            "windows": 0.084
        },
        "storage_rates": {
            "standard-hdd": 0.038,
            "standard-ssd": 0.075,
            "premium-ssd": 0.12,
            "ultra-ssd": 0.15
        },
        "region_multipliers": {
            "europe": 1.0,
            "middle-east": 1.0,
            "asia-pacific": 1.0,
            "north-america": 1.0,
            "latin-america": 1.0,
            "turkey-local": 0.95  # Local region discount
        },
        "available_regions": ["europe", "middle-east", "asia-pacific", "north-america", "latin-america", "turkey-local"],
        "logo": "Huawei",
        "description": "Global cloud provider with strong presence in Asia and Turkey"
    }
]

def migrate_providers():
    """Migrate default providers to database."""
    db = next(get_db())
    
    try:
        for provider_data in DEFAULT_PROVIDERS:
            # Check if provider already exists
            existing = ProviderRepository.get_by_name(db, provider_data["name"])
            
            if existing:
                print(f"Provider '{provider_data['name']}' already exists, updating...")
                # Update existing provider
                ProviderRepository.update(
                    db,
                    existing.id,
                    {
                        "display_name": provider_data["display_name"],
                        "short_name": provider_data["short_name"],
                        "is_active": provider_data["is_active"],
                        "compute_rates": provider_data["compute_rates"],
                        "storage_rates": provider_data["storage_rates"],
                        "region_multipliers": provider_data["region_multipliers"],
                        "available_regions": provider_data["available_regions"],
                        "logo": provider_data["logo"],
                        "description": provider_data["description"],
                    }
                )
                print(f"✓ Updated provider: {provider_data['display_name']}")
            else:
                # Create new provider
                ProviderRepository.create(
                    db,
                    name=provider_data["name"],
                    display_name=provider_data["display_name"],
                    short_name=provider_data["short_name"],
                    compute_rates=provider_data["compute_rates"],
                    storage_rates=provider_data["storage_rates"],
                    region_multipliers=provider_data["region_multipliers"],
                    available_regions=provider_data["available_regions"],
                    logo=provider_data["logo"],
                    description=provider_data["description"]
                )
                print(f"✓ Created provider: {provider_data['display_name']}")
        
        db.commit()
        print("\n✓ All providers migrated successfully!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"\n✗ Error migrating providers: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    migrate_providers()
