# Database Entegrasyonu - Özet

## ✅ Tüm Veriler PostgreSQL'e Kaydediliyor

### 1. **Yeni Kullanıcılar (Users)**
- **Kayıt (Sign Up)**: `POST /api/auth/register`
  - Email, şifre, isim, unvan → `users` tablosuna kaydediliyor
  - Şifreler hash'lenerek güvenli şekilde saklanıyor
  
- **Giriş (Login)**: `POST /api/auth/login`
  - Database'den kullanıcı doğrulanıyor
  - Başarılı girişte kullanıcı bilgileri döndürülüyor

- **Profil Güncelleme**: `PUT /api/auth/profile/<user_id>`
  - İsim, email, unvan güncellemeleri database'e kaydediliyor

- **Şifre Değiştirme**: `PUT /api/auth/profile/<user_id>/password`
  - Yeni şifre hash'lenerek database'de güncelleniyor

**Tablo:** `users`
```sql
- id (String, Primary Key)
- email (String, Unique)
- password_hash (String)
- name (String)
- title (String, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)
```

---

### 2. **Yeni Hesaplamalar (Analyses)**
- **Hesaplama Kaydetme**: `POST /api/analyses`
  - Maliyet analizi sonuçları → `analyses` tablosuna kaydediliyor
  - Config (vCPU, RAM, storage, vb.) JSON olarak saklanıyor
  - Estimates (tahminler) JSON olarak saklanıyor
  - Trends (trendler) JSON olarak saklanıyor

- **Hesaplamaları Listeleme**: `GET /api/analyses?user_id=<id>`
  - Kullanıcıya ait tüm hesaplamalar database'den getiriliyor

- **Hesaplama Detayı**: `GET /api/analyses/<analysis_id>`
  - Belirli bir hesaplama database'den getiriliyor

- **Hesaplama Güncelleme**: `PUT /api/analyses/<analysis_id>`
  - Hesaplama bilgileri database'de güncelleniyor

- **Hesaplama Silme**: `DELETE /api/analyses/<analysis_id>?user_id=<id>`
  - Hesaplama database'den siliniyor

**Tablo:** `analyses`
```sql
- id (String, Primary Key)
- user_id (String, Foreign Key → users.id)
- title (String)
- config (JSON) - Hesaplama konfigürasyonu
- estimates (JSON) - Maliyet tahminleri
- trends (JSON, Optional) - Trend verileri
- created_at (Timestamp)
- updated_at (Timestamp)
```

---

### 3. **Yeni Raporlar**
Raporlar aslında **analyses** tablosunda saklanıyor. Her kaydedilen hesaplama bir rapordur.

- **Raporlar Sayfası**: Dashboard → Reports
  - Tüm kaydedilmiş hesaplamalar database'den listeleniyor
  - Her rapor detaylı görüntülenebiliyor

- **Rapor Silme**: 
  - Rapor database'den siliniyor

---

## 🔄 Veri Akışı

### Kullanıcı Kaydı:
```
Frontend (Sign Up) 
  → auth-context.tsx 
  → registerUser() 
  → POST /api/auth/register 
  → UserRepository.create() 
  → PostgreSQL (users tablosu)
```

### Hesaplama Kaydetme:
```
Frontend (Cost Analysis) 
  → reports-storage.ts 
  → saveAnalysis() 
  → createAnalysis() 
  → POST /api/analyses 
  → AnalysisRepository.create() 
  → PostgreSQL (analyses tablosu)
```

### Rapor Listeleme:
```
Frontend (Reports Page) 
  → reports-storage.ts 
  → getSavedAnalyses() 
  → getUserAnalyses() 
  → GET /api/analyses?user_id=<id> 
  → AnalysisRepository.get_by_user() 
  → PostgreSQL (analyses tablosu)
```

---

## 📊 Database Yapısı

### İlişkiler:
- `analyses.user_id` → `users.id` (Foreign Key)
- Her kullanıcının birden fazla analizi olabilir
- Her analiz bir kullanıcıya aittir

### JSON Alanları:
- `config`: Hesaplama parametreleri (vCPU, RAM, storage, region, vb.)
- `estimates`: Provider bazlı maliyet tahminleri
- `trends`: Zaman içindeki maliyet trendleri

---

## 🔍 SQLTools'ta Görüntüleme

### Kullanıcıları Görüntüleme:
```sql
SELECT id, email, name, title, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Hesaplamaları Görüntüleme:
```sql
SELECT id, user_id, title, created_at 
FROM analyses 
ORDER BY created_at DESC;
```

### Kullanıcı ve Hesaplamalarını Birlikte Görüntüleme:
```sql
SELECT 
  u.name, 
  u.email, 
  a.title, 
  a.created_at 
FROM users u 
LEFT JOIN analyses a ON u.id = a.user_id 
ORDER BY a.created_at DESC;
```

---

## ✅ Kontrol Listesi

- [x] Kullanıcı kayıtları database'e kaydediliyor
- [x] Kullanıcı girişleri database'den doğrulanıyor
- [x] Hesaplamalar database'e kaydediliyor
- [x] Raporlar database'den getiriliyor
- [x] Profil güncellemeleri database'de saklanıyor
- [x] Şifre değişiklikleri database'de güncelleniyor
- [x] Silme işlemleri database'den yapılıyor

---

## 🚀 Backend Çalıştırma

Backend'in çalıştığından emin olun:

```powershell
cd C:\Users\Dell\Downloads\cloud\backend
python app.py
```

Backend `http://localhost:5000` adresinde çalışmalı.

---

## 📝 Notlar

- **Fallback Mekanizması**: Frontend'de backend kullanılamazsa localStorage'a düşer, ancak öncelik her zaman database'dir.
- **Güvenlik**: Şifreler hash'lenerek saklanıyor (bcrypt).
- **Veri Bütünlüğü**: Foreign key ilişkileri sayesinde veri tutarlılığı korunuyor.

**Artık tüm veriler PostgreSQL database'inde güvenli şekilde saklanıyor!** 🎉
