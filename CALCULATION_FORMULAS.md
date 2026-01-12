# Hesaplama Formülleri ve Mantığı

Bu dokümantasyon, Cloud Migration Cost Estimation sisteminin hesaplama mantığını açıklar.

## Hesaplama Sistemleri

Sistemde **iki farklı hesaplama yöntemi** bulunmaktadır:

### 1. Cost Analysis Sayfası (Detaylı Hesaplama)

Bu sayfada, **gerçek bulut sağlayıcı fiyatlandırmasına** dayalı hesaplama yapılır.

#### Formüller

**Aylık Toplam Maliyet = Compute Cost + Storage Cost + Network Cost**

##### 1. Compute (İşlem) Maliyeti

```
Compute Cost = vCPU × Base Rate (saatlik) × 730 saat/ay × RAM Multiplier × Use Case Multiplier × Region Multiplier
```

**Parametreler:**
- **vCPU**: Seçilen sanal CPU sayısı
- **Base Rate**: Sağlayıcı ve işletim sistemine göre saatlik maliyet (USD/saat)
  - AWS Linux: $0.0415/saat (t3.large)
  - AWS Windows: $0.083/saat
  - Azure Linux: $0.0468/saat (Standard_B4ms)
  - Azure Windows: $0.0936/saat
  - GCP Linux: $0.0495/saat (e2-standard-2)
  - GCP Windows: $0.099/saat
  - Huawei Linux: $0.042/saat
  - Huawei Windows: $0.084/saat
- **730 saat**: Bir ay içindeki toplam saat (30.4 gün × 24 saat)
- **RAM Multiplier**: RAM/vCPU oranına göre hesaplanan çarpan
  ```
  RAM Multiplier = 1 + ((RAM/vCPU - 4) / 4) × 0.25
  ```
  - Minimum: 0.85, Maximum: 1.4
  - Varsayılan: 4 GB RAM/vCPU için 1.0
- **Use Case Multiplier**: Kullanım durumuna göre çarpan
  - Web App: 1.0
  - General Server: 1.0
  - Database: 1.15
  - ERP: 1.2
  - High Traffic: 1.25
  - Archive/Backup: 0.9
- **Region Multiplier**: Bölgeye göre fiyat çarpanı
  - Europe: 1.0 (temel)
  - Middle East: AWS/Azure 1.05, GCP 1.08, Huawei 0.95
  - Asia Pacific: AWS 1.02, Azure 1.03, GCP 0.98, Huawei 0.92
  - North America: AWS/GCP 0.95, Azure 0.97, Huawei 1.1
  - Turkey Local: AWS/Azure 1.1, GCP 0.92, Huawei 0.85

##### 2. Storage (Depolama) Maliyeti

```
Storage Cost = Storage (GB) × Storage Rate (GB/ay) × Region Multiplier
```

**Storage Rate (GB/ay):**

**Standard HDD:**
- AWS: $0.045/GB-ay
- Azure: $0.04/GB-ay
- GCP: $0.04/GB-ay
- Huawei: $0.038/GB-ay

**Standard SSD:**
- AWS: $0.08/GB-ay (gp3)
- Azure: $0.10/GB-ay
- GCP: $0.17/GB-ay
- Huawei: $0.075/GB-ay

**Premium SSD:**
- AWS: $0.125/GB-ay (io1/io2)
- Azure: $0.15/GB-ay
- GCP: $0.24/GB-ay
- Huawei: $0.12/GB-ay

**Ultra SSD:**
- AWS: $0.16/GB-ay
- Azure: $0.18/GB-ay
- GCP: $0.30/GB-ay
- Huawei: $0.15/GB-ay

##### 3. Network (Ağ/Veri Transfer) Maliyeti

```
Network Cost = Compute Cost × Network Multiplier × Network Region Multiplier
```

**Network Multiplier:**
- High Traffic: 0.08 (compute maliyetinin %8'i)
- Archive/Backup: 0.02 (compute maliyetinin %2'si)
- Diğerleri: 0.04 (compute maliyetinin %4'ü)

**Network Region Multiplier:**
- Turkey Local + Huawei: 0.7 (daha düşük ağ maliyeti)
- Diğerleri: 1.0

##### 4. Yıllık Maliyet

```
Yearly Cost = Monthly Cost × 12 × 0.95
```

(%5 indirim uygulanır - yıllık taahhüt indirimi)

---

### 2. Estimate/Wizard Sistemi (Genel Tahmin)

Bu sistemde, **şirket büyüklüğüne göre base cost** belirlenir ve **çeşitli faktörlere göre çarpanlar** uygulanır.

#### Formül

```
Final Cost = Base Cost × (Multiplier₁ × Multiplier₂ × Multiplier₃ × ... × Multiplierₙ)
```

**Base Cost (Şirket Büyüklüğüne Göre):**
- Startup: $10,000
- Small: $50,000
- Medium: $200,000
- Enterprise: $500,000

**Multipliers (Çarpanlar):**

1. **Infrastructure Type:**
   - On-Premise: 1.2
   - Hybrid: 1.1
   - Cloud Partial: 0.95
   - Virtualized: 1.0

2. **Data Size:**
   - Under 100GB: 0.9
   - 100GB-1TB: 1.0
   - 1TB-10TB: 1.15
   - 10TB-100TB: 1.3
   - Over 100TB: 1.5

3. **Database Complexity:**
   - Simple: 0.95
   - Moderate: 1.0
   - Complex: 1.2
   - Enterprise: 1.4

4. **Traffic Volume:**
   - Low: 0.9
   - Medium: 1.0
   - High: 1.2
   - Very High: 1.4

5. **Security Requirements** (checkbox - toplam):
   - Encryption: 1.05
   - VPN: 1.03
   - MFA: 1.02
   - Audit Logging: 1.04
   - Compliance Certifications: 1.1

6. **Compliance Requirements** (checkbox - toplam):
   - HIPAA: 1.15
   - GDPR: 1.12
   - PCI DSS: 1.18
   - SOX: 1.1
   - ISO27001: 1.08

7. **Migration Strategy:**
   - Lift & Shift: 1.0
   - Replatform: 1.15
   - Refactor: 1.4
   - Retire: 0.5
   - Hybrid: 1.2

**Maliyet Aralığı:**
- Minimum: Final Cost × 0.8 (%-20)
- Maximum: Final Cost × 1.3 (+%30)

---

## Hesaplama Doğruluğu

### Cost Analysis Sayfası

✅ **Gerçek Bulut Fiyatlarına Dayalı:**
- Base rates, gerçek bulut sağlayıcı fiyatlandırmasına dayanır
- AWS t3.large, Azure Standard_B4ms, GCP e2-standard-2 gibi gerçek instance tipleri kullanılır
- Storage rates, gerçek bulut depolama fiyatlarına dayanır

⚠️ **Yaklaşıklıklar:**
- Fiyatlar değişkenlik gösterebilir (sağlayıcılar fiyatları güncelleyebilir)
- Bölgeye göre fiyat farklılıkları tahmini çarpanlarla hesaplanır
- Reserved instances, spot instances gibi özel fiyatlandırmalar dahil değildir
- Data transfer maliyetleri basitleştirilmiş bir formülle hesaplanır
- Yıllık taahhüt indirimi tahmini olarak %5 olarak uygulanır

### Estimate/Wizard Sistemi

✅ **Genel Tahmin:**
- Şirket büyüklüğüne ve karmaşıklığına göre genel bir maliyet aralığı verir
- Farklı faktörlerin maliyete etkisini gösterir
- Proje başlangıcında genel bir fikir vermek için kullanılır

⚠️ **Sınırlamalar:**
- Gerçek bulut fiyatlarına dayalı değildir
- Base cost ve multipliers, endüstri ortalamalarına dayanır
- Spesifik gereksinimler için detaylı hesaplama gerekir

---

## Örnek Hesaplama

### Cost Analysis - AWS, 4 vCPU, 16 GB RAM, 500 GB SSD, Linux, Web App, Europe

1. **Compute Cost:**
   - Base Rate: $0.0415/saat (AWS Linux)
   - RAM Multiplier: 1 + ((16/4 - 4)/4) × 0.25 = 1.0
   - Use Case Multiplier: 1.0 (Web App)
   - Region Multiplier: 1.0 (Europe)
   - Compute = 4 × 0.0415 × 730 × 1.0 × 1.0 × 1.0 = **$121.18/ay**

2. **Storage Cost:**
   - Storage Rate: $0.08/GB-ay (Standard SSD)
   - Storage = 500 × 0.08 × 1.0 = **$40/ay**

3. **Network Cost:**
   - Network Multiplier: 0.04
   - Network = $121.18 × 0.04 = **$4.85/ay**

4. **Toplam:**
   - Monthly: $121.18 + $40 + $4.85 = **$166.03/ay**
   - Yearly: $166.03 × 12 × 0.95 = **$1,892.74/yıl**

---

## Sonuç

- **Cost Analysis sayfası**: Gerçek bulut fiyatlarına dayalı, daha detaylı ve doğru tahminler verir
- **Estimate/Wizard sistemi**: Genel bir maliyet aralığı vermek için kullanılır

Her iki sistem de **tahmin** amaçlıdır. Gerçek maliyetler, sağlayıcılardan alınan tekliflerle doğrulanmalıdır.
