"""
Script to migrate static education data to database.

Run with: python -m backend.scripts.migrate_education_data --user_id <admin_user_id>
"""

import sys
import os
import argparse
import uuid

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.database.connection import SessionLocal
from backend.database.repositories import EducationRepository

# Static education data from frontend
STATIC_EDUCATION_DATA = [
    {
        "id": "1",
        "title": "Introduction to Cloud Computing",
        "description": "Learn the fundamentals of cloud computing, including IaaS, PaaS, and SaaS models, and understand how cloud services work.",
        "type": "article",
        "category": "basics",
        "duration": "15 min",
        "level": "beginner",
        "provider": "general",
        "tags": ["cloud basics", "fundamentals", "iaas", "paas", "saas"],
        "full_content": """# Introduction to Cloud Computing

Cloud computing has revolutionized how businesses and individuals access and use computing resources. Instead of owning and maintaining physical servers and data centers, organizations can now rent access to these resources from cloud providers over the internet.

## What is Cloud Computing?

Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.

## Key Benefits

### 1. Cost Efficiency
- **Pay-as-you-go pricing**: You only pay for what you use
- **No upfront capital investment**: Eliminate the need to purchase hardware
- **Reduced operational costs**: No need for on-site data centers or IT staff to manage infrastructure

### 2. Scalability
- **Elastic resources**: Scale up or down based on demand
- **Global reach**: Deploy applications closer to users worldwide
- **Automatic scaling**: Resources adjust automatically to traffic patterns

### 3. Performance
- **Latest technology**: Access to cutting-edge hardware and software
- **High availability**: Built-in redundancy and failover capabilities
- **Fast deployment**: Launch new services in minutes, not months

### 4. Security
- **Enterprise-grade security**: Cloud providers invest heavily in security
- **Compliance**: Meet regulatory requirements with built-in compliance features
- **Data backup**: Automatic backups and disaster recovery

## Service Models

### Infrastructure as a Service (IaaS)
IaaS provides virtualized computing resources over the internet. You rent IT infrastructure—servers, virtual machines, storage, networks, and operating systems—from a cloud provider on a pay-as-you-go basis.

**Examples**: Amazon EC2, Microsoft Azure Virtual Machines, Google Compute Engine

**Use cases**:
- Development and testing environments
- Website hosting
- Data storage and backup
- High-performance computing

### Platform as a Service (PaaS)
PaaS provides a platform allowing customers to develop, run, and manage applications without dealing with the underlying infrastructure. The provider manages servers, storage, and networking.

**Examples**: AWS Elastic Beanstalk, Azure App Service, Google App Engine

**Use cases**:
- Application development
- API development and management
- Business analytics
- Database management

### Software as a Service (SaaS)
SaaS delivers software applications over the internet, on a subscription basis. Users access the software through a web browser, eliminating the need for installation and maintenance.

**Examples**: Microsoft 365, Google Workspace, Salesforce, Dropbox

**Use cases**:
- Email and collaboration tools
- Customer relationship management (CRM)
- Enterprise resource planning (ERP)
- Human resources management

## Deployment Models

### Public Cloud
Services are delivered over the public internet and shared across organizations. Examples include AWS, Azure, and Google Cloud.

### Private Cloud
Cloud infrastructure is dedicated to a single organization, providing greater control and security.

### Hybrid Cloud
Combines public and private clouds, allowing data and applications to be shared between them.

## Getting Started

To begin your cloud journey:

1. **Assess your needs**: Identify what you want to achieve with cloud computing
2. **Choose a provider**: Research and compare cloud providers
3. **Start small**: Begin with a pilot project
4. **Learn continuously**: Cloud technology evolves rapidly
5. **Monitor costs**: Keep track of your cloud spending

## Conclusion

Cloud computing offers unprecedented flexibility, scalability, and cost savings. Whether you're a small business or a large enterprise, understanding cloud computing fundamentals is essential in today's digital landscape.""",
    },
    {
        "id": "2",
        "title": "Cloud Computing Explained: A Manager's Guide",
        "description": "A non-technical guide for business leaders to understand cloud computing benefits, risks, and strategic considerations.",
        "type": "guide",
        "category": "basics",
        "duration": "20 min",
        "level": "beginner",
        "provider": "general",
        "tags": ["business", "strategy", "management"],
        "full_content": "A non-technical guide for business leaders to understand cloud computing benefits, risks, and strategic considerations.",
    },
    {
        "id": "3",
        "title": "Understanding Cloud Service Models",
        "description": "Deep dive into Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
        "type": "video",
        "category": "basics",
        "duration": "12 min",
        "level": "beginner",
        "provider": "general",
        "tags": ["service models", "iaas", "paas", "saas"],
        "full_content": "Deep dive into Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
    },
    {
        "id": "4",
        "title": "Cloud Migration Strategies: Lift and Shift vs. Replatforming",
        "description": "Compare different migration approaches and learn when to use each strategy for optimal results.",
        "type": "article",
        "category": "migration",
        "duration": "18 min",
        "level": "intermediate",
        "provider": "general",
        "tags": ["migration", "strategies", "lift-and-shift", "replatforming"],
        "full_content": """# Cloud Migration Strategies: Lift and Shift vs. Replatforming

Choosing the right migration strategy is critical for a successful cloud transition. This guide compares the most common approaches and helps you decide which is best for your organization.

## Migration Strategy Overview

### Lift and Shift (Rehost)
**What it is**: Moving applications to the cloud without making any changes to the application architecture.

**Pros**:
- Fastest migration approach
- Lowest risk of breaking changes
- Minimal application modification required
- Good for quick wins and proof of concepts

**Cons**:
- Doesn't leverage cloud-native features
- May not reduce costs significantly
- Misses opportunities for optimization
- Legacy issues remain

**Best for**:
- Time-sensitive migrations
- Applications that work well as-is
- Organizations with limited cloud expertise
- Temporary solutions before refactoring

### Replatforming (Lift and Optimize)
**What it is**: Making minor adjustments to optimize applications for the cloud without changing core architecture.

**Pros**:
- Better cloud optimization than lift and shift
- Some cost reduction possible
- Improved performance and scalability
- Moderate risk level

**Cons**:
- Takes longer than lift and shift
- Requires some cloud expertise
- May need application modifications
- Doesn't fully leverage cloud capabilities

**Best for**:
- Applications that need some optimization
- Organizations with moderate cloud skills
- When you want better cost efficiency
- Applications with clear optimization opportunities

## Comparison Table

| Factor | Lift and Shift | Replatforming |
|--------|---------------|---------------|
| Speed | Fastest | Moderate |
| Risk | Low | Medium |
| Cost Reduction | Minimal | Moderate |
| Cloud Benefits | Limited | Better |
| Complexity | Low | Medium |
| Expertise Required | Low | Medium |

## Decision Framework

### Choose Lift and Shift if:
- You need to migrate quickly
- Application works well in current form
- Limited budget for modifications
- Planning to refactor later

### Choose Replatforming if:
- You want better cloud optimization
- Some cost reduction is important
- You have cloud expertise available
- Application can benefit from cloud features

## Best Practices

1. **Assess thoroughly**: Understand your applications before choosing a strategy
2. **Start small**: Begin with non-critical applications
3. **Monitor closely**: Track performance and costs after migration
4. **Plan for optimization**: Even lift and shift can be optimized later
5. **Train your team**: Ensure your team understands the chosen approach

## Conclusion

Both strategies have their place in cloud migration. Lift and shift offers speed and low risk, while replatforming provides better optimization. Choose based on your specific needs, timeline, and capabilities.""",
    },
    {
        "id": "5",
        "title": "Step-by-Step Migration Planning Guide",
        "description": "A comprehensive guide to planning your cloud migration, including assessment, preparation, and execution phases.",
        "type": "guide",
        "category": "migration",
        "duration": "30 min",
        "level": "intermediate",
        "provider": "general",
        "tags": ["planning", "migration", "checklist"],
        "full_content": "A comprehensive guide to planning your cloud migration, including assessment, preparation, and execution phases.",
    },
    {
        "id": "6",
        "title": "Common Migration Challenges and Solutions",
        "description": "Learn about typical migration pitfalls and how to avoid them, with real-world examples and solutions.",
        "type": "case-study",
        "category": "migration",
        "duration": "25 min",
        "level": "intermediate",
        "provider": "general",
        "tags": ["challenges", "solutions", "case study"],
        "full_content": "Learn about typical migration pitfalls and how to avoid them, with real-world examples and solutions.",
    },
    {
        "id": "7",
        "title": "AWS Cloud Services Overview",
        "description": "Introduction to Amazon Web Services, including EC2, S3, RDS, and other core services for enterprise workloads.",
        "type": "guide",
        "category": "providers",
        "duration": "22 min",
        "level": "intermediate",
        "provider": "aws",
        "tags": ["aws", "ec2", "s3", "services"],
        "full_content": "Introduction to Amazon Web Services, including EC2, S3, RDS, and other core services for enterprise workloads.",
    },
    {
        "id": "8",
        "title": "Microsoft Azure Fundamentals",
        "description": "Get started with Microsoft Azure, including virtual machines, storage, and networking services.",
        "type": "video",
        "category": "providers",
        "duration": "20 min",
        "level": "intermediate",
        "provider": "azure",
        "tags": ["azure", "microsoft", "fundamentals"],
        "full_content": "Get started with Microsoft Azure, including virtual machines, storage, and networking services.",
    },
    {
        "id": "9",
        "title": "Google Cloud Platform Essentials",
        "description": "Learn about GCP's core services, including Compute Engine, Cloud Storage, and BigQuery.",
        "type": "article",
        "category": "providers",
        "duration": "18 min",
        "level": "intermediate",
        "provider": "gcp",
        "tags": ["gcp", "google cloud", "compute engine"],
        "full_content": "Learn about GCP's core services, including Compute Engine, Cloud Storage, and BigQuery.",
    },
    {
        "id": "10",
        "title": "Huawei Cloud Services Guide",
        "description": "Explore Huawei Cloud offerings, including ECS, OBS, and region-specific services for Turkey and APAC markets.",
        "type": "guide",
        "category": "providers",
        "duration": "16 min",
        "level": "intermediate",
        "provider": "huawei",
        "tags": ["huawei", "ecs", "turkey", "apac"],
        "full_content": "Explore Huawei Cloud offerings, including ECS, OBS, and region-specific services for Turkey and APAC markets.",
    },
    {
        "id": "11",
        "title": "Cloud Security Best Practices",
        "description": "Essential security practices for cloud environments, including identity management, encryption, and compliance.",
        "type": "article",
        "category": "security",
        "duration": "20 min",
        "level": "intermediate",
        "provider": "general",
        "tags": ["security", "compliance", "encryption"],
        "full_content": "Essential security practices for cloud environments, including identity management, encryption, and compliance.",
    },
    {
        "id": "12",
        "title": "Shared Responsibility Model Explained",
        "description": "Understand what security responsibilities belong to you versus your cloud provider.",
        "type": "video",
        "category": "security",
        "duration": "10 min",
        "level": "beginner",
        "provider": "general",
        "tags": ["security", "responsibility", "compliance"],
        "full_content": "Understand what security responsibilities belong to you versus your cloud provider.",
    },
    {
        "id": "13",
        "title": "Cloud Cost Optimization Strategies",
        "description": "Learn how to reduce cloud costs through right-sizing, reserved instances, and cost monitoring best practices.",
        "type": "article",
        "category": "cost-optimization",
        "duration": "25 min",
        "level": "intermediate",
        "provider": "general",
        "tags": ["cost", "optimization", "savings"],
        "full_content": "Learn how to reduce cloud costs through right-sizing, reserved instances, and cost monitoring best practices.",
    },
    {
        "id": "14",
        "title": "Understanding Cloud Pricing Models",
        "description": "Compare pay-as-you-go, reserved instances, and spot instances to choose the best pricing model for your needs.",
        "type": "guide",
        "category": "cost-optimization",
        "duration": "15 min",
        "level": "beginner",
        "provider": "general",
        "tags": ["pricing", "cost", "models"],
        "full_content": "Compare pay-as-you-go, reserved instances, and spot instances to choose the best pricing model for your needs.",
    },
    {
        "id": "15",
        "title": "Cloud Architecture Best Practices",
        "description": "Design scalable, resilient, and cost-effective cloud architectures following industry best practices.",
        "type": "article",
        "category": "best-practices",
        "duration": "30 min",
        "level": "advanced",
        "provider": "general",
        "tags": ["architecture", "design", "scalability"],
        "full_content": "Design scalable, resilient, and cost-effective cloud architectures following industry best practices.",
    },
    {
        "id": "16",
        "title": "Disaster Recovery in the Cloud",
        "description": "Implement robust disaster recovery strategies using cloud-native backup and recovery services.",
        "type": "guide",
        "category": "best-practices",
        "duration": "22 min",
        "level": "intermediate",
        "provider": "general",
        "tags": ["disaster recovery", "backup", "resilience"],
        "full_content": "Implement robust disaster recovery strategies using cloud-native backup and recovery services.",
    },
]

def migrate_education_data():
    """Migrate static education data to database."""
    db = SessionLocal()
    try:
        print("=" * 50)
        print("Education Data Migration")
        print("=" * 50)
        
        created_count = 0
        updated_count = 0
        
        for data in STATIC_EDUCATION_DATA:
            # Check if education already exists
            existing = EducationRepository.get_by_id(db, data["id"])
            
            if existing:
                # Update existing
                EducationRepository.update(
                    db,
                    data["id"],
                    title=data["title"],
                    description=data["description"],
                    type=data["type"],
                    category=data["category"],
                    level=data["level"],
                    full_content=data.get("full_content", data["description"]),
                    duration=data.get("duration"),
                    provider=data.get("provider", "general"),
                    tags=data.get("tags", []),
                    url=data.get("url"),
                    is_active=True,
                )
                updated_count += 1
                print(f"Updated: {data['title']}")
            else:
                # Create new
                EducationRepository.create(
                    db,
                    title=data["title"],
                    description=data["description"],
                    type=data["type"],
                    category=data["category"],
                    level=data["level"],
                    full_content=data.get("full_content", data["description"]),
                    duration=data.get("duration"),
                    provider=data.get("provider", "general"),
                    tags=data.get("tags", []),
                    url=data.get("url"),
                    education_id=data["id"],  # Use the static ID
                )
                created_count += 1
                print(f"Created: {data['title']}")
        
        print("\n" + "=" * 50)
        print(f"Migration completed!")
        print(f"Created: {created_count}")
        print(f"Updated: {updated_count}")
        print("=" * 50)
        
    except Exception as e:
        print(f"ERROR: Error migrating education data: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    migrate_education_data()
