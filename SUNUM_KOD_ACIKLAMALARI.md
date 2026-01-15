# Sunumda Anlatılacak Önemli Kodlar ve Açıklamaları

## 📋 İçindekiler
1. [Veritabanı Bağlantısı](#1-veritabanı-bağlantısı)
2. [API Route'ları](#2-api-routeları)
3. [Hesaplama Motoru](#3-hesaplama-motoru)
4. [Repository Pattern](#4-repository-pattern)
5. [API Client Entegrasyonu](#5-api-client-entegrasyonu)
6. [Authentication Sistemi](#6-authentication-sistemi)
7. [Frontend-Backend İletişimi](#7-frontend-backend-iletişimi)

---

## 1. VERİTABANI BAĞLANTISI

### Kod: `backend/database/connection.py`

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://cloudguide_user:cloudguide_pass@localhost:5433/cloudguide_db"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Bağlantı kontrolü
    pool_size=10,            # Bağlantı havuzu boyutu
    max_overflow=20          # Maksimum ekstra bağlantı
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Veritabanı session'ı sağlar - Dependency Injection"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Nasıl Anlatılır:

**"Veritabanı bağlantısı için SQLAlchemy ORM kullanıyoruz. Bu kod şunları yapar:"**

1. **Connection Pooling**: 
   - "`pool_size=10` ile 10 bağlantı havuzu oluşturuyoruz. Bu performans için önemli çünkü her istekte yeni bağlantı açmak yerine mevcut bağlantıları kullanıyoruz."

2. **Dependency Injection**:
   - "`get_db()` fonksiyonu Flask'ın dependency injection pattern'ini kullanıyor. Her API endpoint'i bu fonksiyonu çağırarak veritabanı session'ı alıyor."

3. **Connection Management**:
   - "`pool_pre_ping=True` ile bağlantıların sağlıklı olduğunu kontrol ediyoruz. Eğer bağlantı kopmuşsa otomatik yeniden bağlanıyor."

4. **Environment Variables**:
   - "`DATABASE_URL` environment variable'dan alınıyor. Bu production'da güvenlik için önemli - şifreler kodda değil environment'ta."

---

## 2. API ROUTE'LARI

### Kod: `backend/routes/estimate.py`

```python
from flask import Blueprint, request, jsonify
from backend.calculation.engine import calculate_estimate
from backend.services.pricing_service import PricingService
from backend.utils.error_handler import handle_calculation_error

estimate_bp = Blueprint("estimate", __name__)
pricing_service = PricingService()

@estimate_bp.route("/estimate", methods=["POST"])
def estimate():
    """
    POST /api/estimate
    
    Accepts wizard answers and returns cost estimation with breakdown.
    """
    try:
        # 1. Request validation
        validated_data = validate_estimate_request(request.json)
        
        # 2. Optional: Fetch pricing from provider APIs (for display only)
        api_pricing_data = None
        if "providers" in validated_data and validated_data.get("providers"):
            try:
                instance_types = {
                    "aws": "t3.large",
                    "azure": "Standard_B4ms",
                    "gcp": "e2-standard-2",
                    "huawei": "s6.large.2"
                }
                
                api_pricing_data = pricing_service.get_all_providers_pricing(
                    providers=validated_data.get("providers", []),
                    instance_types=instance_types,
                    os_type=validated_data.get("os_type", "Linux"),
                    storage_type=validated_data.get("storage_type", "standard-ssd"),
                    region=validated_data.get("region", "europe")
                )
            except Exception as api_error:
                # Log but don't fail - API is optional
                print(f"Warning: API pricing unavailable: {api_error}")
        
        # 3. Core calculation (uses database configurations)
        result = calculate_estimate(validated_data)
        
        # 4. Add API pricing metadata (for display only)
        if api_pricing_data:
            result["api_pricing"] = {
                "sources": api_pricing_data.get("api_sources", {}),
                "providers": api_pricing_data.get("providers", {}),
                "note": "Pricing data fetched from official provider APIs"
            }
        
        return jsonify(result), 200
        
    except ValueError as e:
        return handle_validation_error(e)
    except Exception as e:
        return handle_calculation_error(e)
```

### Nasıl Anlatılır:

**"Bu endpoint maliyet tahmini yapıyor. İşleyişi şöyle:"**

1. **Blueprint Pattern**:
   - "Flask Blueprint kullanarak route'ları modüler hale getirdik. Her modül (estimate, auth, admin) kendi blueprint'ine sahip."

2. **Request Validation**:
   - "Önce gelen veriyi validate ediyoruz. Eğer eksik veya hatalı veri varsa hemen hata döndürüyoruz."

3. **Optional API Integration**:
   - "Provider API'lerinden veri çekmeyi deniyoruz ama bu opsiyonel. Eğer API çağrısı başarısız olursa sistem çalışmaya devam ediyor çünkü asıl hesaplama veritabanındaki konfigürasyonları kullanıyor."

4. **Core Calculation**:
   - "`calculate_estimate()` fonksiyonu veritabanındaki provider konfigürasyonlarını kullanarak hesaplama yapıyor. Bu gerçek maliyet tahmini."

5. **Error Handling**:
   - "Her hata tipi için özel handler'larımız var. Validation hataları 400, server hataları 500 döndürüyor."

---

## 3. HESAPLAMA MOTORU

### Kod: `backend/calculation/engine.py` (Örnek)

```python
def calculate_estimate(data: dict) -> dict:
    """
    Ana hesaplama fonksiyonu
    
    Formül:
    Monthly Cost = Compute + Storage + Network
    
    Compute = vCPU × Rate × 730 × RAM_Mult × UseCase_Mult × Region_Mult
    Storage = GB × Storage_Rate × Region_Mult
    Network = Compute × Network_Mult
    """
    
    vcpu = data["vcpu"]
    ram = data["ram"]
    storage = data["storage"]
    os_type = data["os_type"]
    disk_type = data["disk_type"]
    use_case = data["use_case"]
    region = data["region"]
    providers = data["providers"]
    
    results = {}
    
    for provider_name in providers:
        # 1. Provider konfigürasyonunu veritabanından al
        provider = get_provider_from_db(provider_name)
        
        # 2. Base rate'leri al
        base_rate = provider.compute_rates[os_type.lower()]
        storage_rate = provider.storage_rates[disk_type]
        region_multiplier = provider.region_multipliers[region]
        
        # 3. RAM çarpanını hesapla
        ram_multiplier = calculate_ram_multiplier(vcpu, ram)
        
        # 4. Use case çarpanını al
        use_case_multiplier = USE_CASE_MULTIPLIERS[use_case]
        
        # 5. Compute maliyetini hesapla
        compute_cost = (
            vcpu * 
            base_rate * 
            730 *  # Saat/ay
            ram_multiplier * 
            use_case_multiplier * 
            region_multiplier
        )
        
        # 6. Storage maliyetini hesapla
        storage_cost = storage * storage_rate * region_multiplier
        
        # 7. Network maliyetini hesapla
        network_multiplier = get_network_multiplier(use_case)
        network_cost = compute_cost * network_multiplier
        
        # 8. Toplam aylık maliyet
        monthly_cost = compute_cost + storage_cost + network_cost
        
        # 9. Yıllık maliyet (%5 indirim)
        yearly_cost = monthly_cost * 12 * 0.95
        
        results[provider_name] = {
            "monthly": round(monthly_cost, 2),
            "yearly": round(yearly_cost, 2),
            "breakdown": {
                "compute": round(compute_cost, 2),
                "storage": round(storage_cost, 2),
                "network": round(network_cost, 2)
            }
        }
    
    # 10. En ekonomik sağlayıcıyı bul
    most_economical = min(results.items(), key=lambda x: x[1]["monthly"])
    
    return {
        "estimates": results,
        "most_economical": most_economical[0],
        "region": region,
        "config": data
    }
```

### Nasıl Anlatılır:

**"Hesaplama motoru projenin kalbi. Şöyle çalışıyor:"**

1. **Provider Konfigürasyonu**:
   - "Her provider için veritabanından base rate'leri çekiyoruz. Bu rate'ler provider'a ve OS tipine göre değişiyor."

2. **Çarpanlar**:
   - "RAM çarpanı: RAM/vCPU oranına göre hesaplanıyor. Örneğin 4 vCPU için 16 GB RAM = 1.0 çarpanı."
   - "Use case çarpanı: Database için 1.15, ERP için 1.2, Archive için 0.9."
   - "Region çarpanı: Her provider'ın bölgelere göre farklı fiyatlandırması var."

3. **Formül**:
   - "Compute = vCPU × Saatlik Ücret × 730 saat × Tüm Çarpanlar"
   - "Storage = GB × GB/ay Ücreti × Region Çarpanı"
   - "Network = Compute × Network Çarpanı (use case'e göre %2-8)"

4. **Sonuç**:
   - "Her provider için aylık ve yıllık maliyet hesaplanıyor."
   - "En ekonomik sağlayıcı otomatik bulunuyor."

---

## 4. REPOSITORY PATTERN

### Kod: `backend/database/repositories.py` (Örnek)

```python
class UserRepository:
    """User veritabanı işlemleri için repository"""
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Email ile kullanıcı bul"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def create(db: Session, email: str, password: str, name: str, 
               title: str = None, is_admin: bool = False) -> User:
        """Yeni kullanıcı oluştur"""
        user_id = str(uuid.uuid4())
        password_hash = hash_password(password)
        
        user = User(
            id=user_id,
            email=email,
            password_hash=password_hash,
            name=name,
            title=title,
            is_admin=is_admin
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def update(db: Session, user_id: str, **kwargs) -> Optional[User]:
        """Kullanıcı güncelle"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        return user
```

### Nasıl Anlatılır:

**"Repository Pattern kullanarak veri erişim katmanını business logic'ten ayırdık:"**

1. **Separation of Concerns**:
   - "Route handler'lar business logic ile uğraşmıyor, sadece repository metodlarını çağırıyor."
   - "Veritabanı sorguları tek bir yerde toplanmış, bakımı kolay."

2. **Reusability**:
   - "Aynı repository metodunu farklı route'larda kullanabiliyoruz."
   - "Örneğin `get_by_email()` hem login hem de profile endpoint'lerinde kullanılıyor."

3. **Testability**:
   - "Repository'leri mock'layarak unit test yazmak kolay."
   - "Business logic'i veritabanından bağımsız test edebiliyoruz."

4. **Maintainability**:
   - "Veritabanı şeması değiştiğinde sadece repository'yi güncelliyoruz."
   - "Route handler'lar değişmiyor."

---

## 5. API CLIENT ENTEGRASYONU

### Kod: `backend/services/pricing_service.py`

```python
class PricingService:
    """Unified pricing service - tüm provider API'lerini yönetir"""
    
    def __init__(self):
        self.aws_client = AWSPricingClient()
        self.azure_client = AzurePricingClient()
        self.gcp_client = GCPPricingClient()
        self.huawei_client = HuaweiPricingClient()
    
    def get_provider_pricing(
        self,
        provider: str,
        instance_type: str,
        os_type: str,
        storage_type: str,
        region: str
    ) -> Dict[str, Any]:
        """Tek bir provider için fiyatlandırma al"""
        
        if provider.lower() == "aws":
            compute = self.aws_client.get_compute_pricing(instance_type, os_type, region)
            storage = self.aws_client.get_storage_pricing(storage_type, region)
            region_mult = self.aws_client.get_region_multiplier(region)
            
        elif provider.lower() == "azure":
            compute = self.azure_client.get_compute_pricing(instance_type, os_type, region)
            storage = self.azure_client.get_storage_pricing(storage_type, region)
            region_mult = self.azure_client.get_region_multiplier(region)
        
        # ... diğer provider'lar
        
        return {
            "provider": provider,
            "compute": compute,
            "storage": storage,
            "region_multiplier": region_mult,
            "api_sources": {
                "compute_api": compute.get("metadata", {}).get("api_endpoint"),
                "storage_api": storage.get("metadata", {}).get("api_endpoint"),
                "last_updated": compute.get("metadata", {}).get("last_updated")
            }
        }
```

### Nasıl Anlatılır:

**"API entegrasyonu için unified service pattern kullandık:"**

1. **Unified Interface**:
   - "Tüm provider'lar için aynı interface'i kullanıyoruz. Kod tekrarı yok."
   - "Yeni provider eklemek kolay - sadece yeni client ekliyoruz."

2. **Abstraction**:
   - "Route handler'lar provider API detaylarını bilmiyor."
   - "Sadece `get_provider_pricing()` metodunu çağırıyor."

3. **Error Handling**:
   - "Bir provider API'si başarısız olursa diğerleri çalışmaya devam ediyor."
   - "Graceful degradation - sistem çalışmaya devam ediyor."

4. **Metadata Tracking**:
   - "API endpoint'lerini ve son güncelleme zamanını metadata olarak saklıyoruz."
   - "Bu bilgiler response'da gösteriliyor - şeffaflık için."

---

## 6. AUTHENTICATION SİSTEMİ

### Kod: `backend/routes/auth.py` (Örnek)

```python
@auth_bp.route("/login", methods=["POST"])
def login():
    """Kullanıcı girişi"""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        
        # 1. Kullanıcıyı bul
        db = next(get_db())
        user = UserRepository.get_by_email(db, email)
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # 2. Şifreyi kontrol et
        if not verify_password(password, user.password_hash):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # 3. Session oluştur
        session["user_id"] = user.id
        session["is_admin"] = user.is_admin
        
        return jsonify({
            "success": True,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return handle_calculation_error(e)
```

### Nasıl Anlatılır:

**"Authentication için session-based approach kullanıyoruz:"**

1. **Password Hashing**:
   - "Şifreler düz metin olarak saklanmıyor. `hash_password()` ile hash'leniyor."
   - "Login'de `verify_password()` ile kontrol ediliyor."

2. **Session Management**:
   - "Flask session kullanarak kullanıcı bilgilerini saklıyoruz."
   - "Her request'te session'dan user_id ve is_admin bilgisi alınıyor."

3. **Security**:
   - "401 Unauthorized döndürüyoruz - hangi bilginin yanlış olduğunu söylemiyoruz."
   - "Brute force saldırılarına karşı koruma."

4. **Error Handling**:
   - "Tüm hatalar standart format'ta döndürülüyor."
   - "Frontend'de tutarlı error handling yapılabiliyor."

---

## 7. FRONTEND-BACKEND İLETİŞİMİ

### Kod: `lib/api-client.ts` (Örnek)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function calculateEstimate(data: EstimateRequest): Promise<EstimateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || "calculation_failed",
        errorData.message || "Failed to calculate estimate"
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "network_error", "Network error occurred");
  }
}
```

### Nasıl Anlatılır:

**"Frontend-Backend iletişimi için centralized API client kullanıyoruz:"**

1. **Centralized Client**:
   - "Tüm API çağrıları tek bir dosyada (`api-client.ts`)."
   - "URL'ler ve error handling tek yerde yönetiliyor."

2. **Type Safety**:
   - "TypeScript ile request/response tiplerini tanımlıyoruz."
   - "Compile-time'da hataları yakalıyoruz."

3. **Error Handling**:
   - "Custom `ApiError` class ile tutarlı error handling."
   - "Network hataları ve API hataları ayrı ayrı handle ediliyor."

4. **Environment Variables**:
   - "API URL environment variable'dan alınıyor."
   - "Development ve production için farklı URL'ler kullanılabiliyor."

---

## 8. VERİTABANI MODELLERİ

### Kod: `backend/database/models.py` (Örnek)

```python
class Provider(Base):
    """Cloud provider model"""
    __tablename__ = "providers"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # aws, azure, gcp
    display_name = Column(String, nullable=False)  # Amazon Web Services
    short_name = Column(String, nullable=False)  # AWS
    
    # JSON fields for flexible configuration
    compute_rates = Column(JSON, nullable=True)  # {linux: 0.0415, windows: 0.083}
    storage_rates = Column(JSON, nullable=True)  # {standard-hdd: 0.045, ...}
    region_multipliers = Column(JSON, nullable=True)  # {europe: 1.0, ...}
    available_regions = Column(JSON, nullable=True)  # ["europe", "middle-east", ...]
    
    logo = Column(String, nullable=True)  # Logo identifier
    is_active = Column(Boolean, default=True, nullable=False)
    
    def to_dict(self):
        """Model'i dictionary'ye çevir - API response için"""
        return {
            "id": self.id,
            "name": self.name,
            "display_name": self.display_name,
            "short_name": self.short_name,
            "compute_rates": self.compute_rates,
            "storage_rates": self.storage_rates,
            "region_multipliers": self.region_multipliers,
            "available_regions": self.available_regions,
            "logo": self.logo,
            "is_active": self.is_active,
        }
```

### Nasıl Anlatılır:

**"SQLAlchemy ORM ile veritabanı modellerini tanımlıyoruz:"**

1. **JSON Fields**:
   - "PostgreSQL'in JSON desteğini kullanıyoruz."
   - "Esnek yapılandırma için compute_rates, storage_rates gibi alanlar JSON."
   - "Schema değişikliği yapmadan yeni rate'ler eklenebiliyor."

2. **to_dict() Method**:
   - "Her model'in `to_dict()` metodu var."
   - "API response'ları için model'i dictionary'ye çeviriyor."
   - "Sensitive data'yı filtreleyebiliyoruz."

3. **Indexes**:
   - "`primary_key=True` ve `index=True` ile performans optimizasyonu."
   - "Sık sorgulanan alanlar index'leniyor."

---

## 9. FRONTEND STATE YÖNETİMİ

### Kod: `lib/auth-context.tsx` (Örnek)

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı bilgisini kontrol et
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        const userData = await getUserProfile(userId);
        setUser(userData);
      }
    } catch (error) {
      // Kullanıcı giriş yapmamış
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      setUser(response.user);
      localStorage.setItem("user_id", response.user.id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_id");
    logoutUser(); // Backend'e logout isteği gönder
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Nasıl Anlatılır:

**"React Context API ile global state yönetimi yapıyoruz:"**

1. **Context Pattern**:
   - "Auth bilgisi tüm uygulamada erişilebilir."
   - "Prop drilling yok - her component'te prop geçirmiyoruz."

2. **Persistence**:
   - "localStorage kullanarak kullanıcı bilgisini saklıyoruz."
   - "Sayfa yenilendiğinde kullanıcı bilgisi korunuyor."

3. **Loading State**:
   - "`isLoading` state'i ile loading durumunu yönetiyoruz."
   - "Kullanıcı bilgisi yüklenene kadar loading gösteriyoruz."

4. **Error Handling**:
   - "Try-catch ile hataları yakalıyoruz."
   - "Kullanıcıya uygun mesajlar gösteriyoruz."

---

## 10. ÖNEMLİ KOD ÖRNEKLERİ ÖZETİ

### Sunumda Mutlaka Anlatılması Gerekenler:

1. ✅ **Veritabanı Bağlantısı** (`connection.py`)
   - Connection pooling
   - Dependency injection
   - Environment variables

2. ✅ **API Route'ları** (`routes/estimate.py`)
   - Blueprint pattern
   - Request validation
   - Error handling

3. ✅ **Hesaplama Motoru** (`calculation/engine.py`)
   - Formül açıklaması
   - Çarpanlar
   - Provider konfigürasyonu

4. ✅ **Repository Pattern** (`repositories.py`)
   - Separation of concerns
   - Reusability
   - Maintainability

5. ✅ **API Client** (`pricing_service.py`)
   - Unified interface
   - Error handling
   - Metadata tracking

### İsteğe Bağlı Ama İyi Olur:

6. **Authentication** (`routes/auth.py`)
   - Password hashing
   - Session management

7. **Frontend API Client** (`api-client.ts`)
   - Type safety
   - Centralized error handling

8. **Database Models** (`models.py`)
   - JSON fields
   - to_dict() method

9. **State Management** (`auth-context.tsx`)
   - Context API
   - Persistence

---

## SUNUM İPUÇLARI

### Kod Gösterirken:

1. **Basit Başla**:
   - Önce genel yapıyı göster
   - Sonra detaylara in

2. **Açıklama Yap**:
   - Her kod bloğunun ne yaptığını söyle
   - Neden bu şekilde yazıldığını açıkla

3. **Pattern'leri Vurgula**:
   - Repository Pattern
   - Dependency Injection
   - Blueprint Pattern
   - Context API

4. **Best Practices**:
   - Error handling
   - Security
   - Performance
   - Maintainability

5. **Görselleştir**:
   - Mimari diyagramları göster
   - Akış şemaları çiz
   - Ekran görüntüleri kullan

---

**Bu kodlar ve açıklamalarıyla sunumda teknik detayları eksiksiz anlatabilirsiniz!**
