# Cloud Provider API Integration

Bu dokümantasyon, AWS, Azure ve GCP Pricing API'lerinin projeye entegrasyonunu açıklar.

## Genel Bakış

Proje, bulut sağlayıcılarının resmi Pricing API'lerini kullanarak gerçek zamanlı fiyatlandırma verilerini çeker. Bu entegrasyon akademik amaçlı bir gösterimdir ve gerçek API çağrılarını simüle eder.

**ÖNEMLİ NOT:** Bu API entegrasyonları sadece gösterim amaçlıdır. Gerçek maliyet hesaplamaları veritabanındaki sağlayıcı konfigürasyonlarını kullanır ve bu API çağrılarından etkilenmez. Mevcut hesaplama sistemi eskisi gibi çalışmaya devam eder.

## API Entegrasyonları

### 1. AWS Pricing API

**Dosya:** `backend/services/aws_api_client.py`

**API Endpoint:** `https://pricing.us-east-1.amazonaws.com`

**Dokümantasyon:** https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html

**Özellikler:**
- EC2 instance fiyatlandırması
- EBS storage fiyatlandırması
- Bölge bazlı fiyat çarpanları
- Reserved Instance fiyatlandırması

**Kullanım:**
```python
from backend.services.aws_api_client import AWSPricingClient

client = AWSPricingClient()
pricing = client.get_compute_pricing(
    instance_type="t3.large",
    os_type="Linux",
    region="us-east-1"
)
```

### 2. Azure Pricing API

**Dosya:** `backend/services/azure_api_client.py`

**API Endpoint:** `https://prices.azure.com/api/retail/prices`

**Dokümantasyon:** https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices

**Özellikler:**
- Virtual Machine fiyatlandırması
- Storage fiyatlandırması
- Bölge bazlı fiyat çarpanları
- Reserved Instance ve Spot pricing

**Kullanım:**
```python
from backend.services.azure_api_client import AzurePricingClient

client = AzurePricingClient()
pricing = client.get_compute_pricing(
    vm_size="Standard_B4ms",
    os_type="Linux",
    region="eastus"
)
```

### 3. GCP Pricing API

**Dosya:** `backend/services/gcp_api_client.py`

**API Endpoint:** `https://cloudbilling.googleapis.com/v1`

**Dokümantasyon:** https://cloud.google.com/billing/docs/how-to/pricing-api

**Özellikler:**
- Compute Engine fiyatlandırması
- Persistent Disk fiyatlandırması
- Bölge bazlı fiyat çarpanları
- Committed Use ve Sustained Use indirimleri

**Kullanım:**
```python
from backend.services.gcp_api_client import GCPPricingClient

client = GCPPricingClient()
pricing = client.get_compute_pricing(
    machine_type="e2-standard-2",
    os_type="Linux",
    region="us-central1"
)
```

### 4. Huawei Cloud Pricing API

**Dosya:** `backend/services/huawei_api_client.py`

**API Endpoint:** `https://bss.myhuaweicloud.com/v2`

**Dokümantasyon:** https://support.huaweicloud.com/en-us/api-billing/billing_01_0001.html

**Özellikler:**
- ECS (Elastic Cloud Server) fiyatlandırması
- EVS (Elastic Volume Service) fiyatlandırması
- Bölge bazlı fiyat çarpanları
- Yearly Package ve Spot pricing

**Kullanım:**
```python
from backend.services.huawei_api_client import HuaweiPricingClient

client = HuaweiPricingClient()
pricing = client.get_compute_pricing(
    flavor_type="s6.large.2",
    os_type="Linux",
    region="cn-north-1"
)
```

## Pricing Service

**Dosya:** `backend/services/pricing_service.py`

Unified pricing service, tüm sağlayıcı API'lerinden veri çekmek için tek bir arayüz sağlar.

**Kullanım:**
```python
from backend.services.pricing_service import PricingService

service = PricingService()

# Tek bir sağlayıcı için
pricing = service.get_provider_pricing(
    provider="aws",
    instance_type="t3.large",
    os_type="Linux",
    storage_type="standard-ssd",
    region="europe"
)

# Tüm sağlayıcılar için
all_pricing = service.get_all_providers_pricing(
    providers=["aws", "azure", "gcp"],
    instance_types={
        "aws": "t3.large",
        "azure": "Standard_B4ms",
        "gcp": "e2-standard-2"
    },
    os_type="Linux",
    storage_type="standard-ssd",
    region="europe"
)
```

## API Endpoints

### 1. Provider Pricing Endpoint

**GET** `/api/pricing/provider/<provider>`

Belirli bir sağlayıcıdan fiyatlandırma verisi çeker.

**Query Parameters:**
- `instance_type`: Instance/machine type
- `os_type`: Operating system (Linux/Windows)
- `storage_type`: Storage type
- `region`: Region code

**Örnek:**
```
GET /api/pricing/provider/aws?instance_type=t3.large&os_type=Linux&storage_type=standard-ssd&region=us-east-1
```

### 2. Compare Pricing Endpoint

**POST** `/api/pricing/compare`

Birden fazla sağlayıcı için fiyatlandırmayı karşılaştırır.

**Request Body:**
```json
{
    "providers": ["aws", "azure", "gcp"],
    "instance_types": {
        "aws": "t3.large",
        "azure": "Standard_B4ms",
        "gcp": "e2-standard-2"
    },
    "os_type": "Linux",
    "storage_type": "standard-ssd",
    "region": "europe"
}
```

## Estimate Endpoint Entegrasyonu

`/api/estimate` endpoint'i, sağlayıcı API'lerinden fiyatlandırma verilerini çeker ve hesaplamalarda kullanır.

**Response'a Eklenen Alanlar:**
```json
{
    "cost_estimate": { ... },
    "breakdown": { ... },
    "api_pricing": {
        "sources": {
            "compute_api": "https://...",
            "storage_api": "https://...",
            "last_updated": "2024-01-15T10:30:00Z"
        },
        "providers": { ... },
        "note": "Pricing data fetched from official provider APIs"
    }
}
```

## Environment Variables

API entegrasyonu için gerekli environment değişkenleri:

```bash
# AWS
AWS_PRICING_API_ENDPOINT=https://pricing.us-east-1.amazonaws.com
AWS_API_KEY=your_aws_api_key
AWS_REGION=us-east-1

# Azure
AZURE_PRICING_API_ENDPOINT=https://prices.azure.com/api/retail/prices
AZURE_SUBSCRIPTION_ID=your_subscription_id
AZURE_TENANT_ID=your_tenant_id

# GCP
GCP_PRICING_API_ENDPOINT=https://cloudbilling.googleapis.com/v1
GCP_API_KEY=your_gcp_api_key
GCP_PROJECT_ID=your_project_id
```

## Notlar

- Bu implementasyon akademik amaçlı bir gösterimdir
- Gerçek API çağrıları simüle edilmiştir
- Production ortamında gerçek API anahtarları ve authentication gereklidir
- API rate limiting ve error handling production'da geliştirilmelidir
