# Render Deployment Guide - Backend

Bu dokümantasyon, Flask backend'ini Render'da yayınlamak için gerekli tüm adımları içerir.

## 📋 İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [Neon Database Kurulumu](#neon-database-kurulumu)
3. [Render'da Backend Oluşturma](#renderda-backend-oluşturma)
4. [Environment Variables](#environment-variables)
5. [Database Migration](#database-migration)
6. [Sorun Giderme](#sorun-giderme)

---

## Gereksinimler

- Render hesabı ([render.com](https://render.com))
- Neon hesabı ([neon.tech](https://neon.tech)) - Database için
- Git repository (GitHub, GitLab, veya Bitbucket)
- Backend kodu hazır olmalı

---

## Neon Database Kurulumu

### 1. Neon Hesabı Oluşturma

1. [Neon Console](https://console.neon.tech)'a gidin
2. Hesap oluşturun veya giriş yapın
3. **Create Project** butonuna tıklayın

### 2. Database Oluşturma

1. Project adını girin (örn: `cloudguide-db`)
2. Region seçin (en yakın bölgeyi seçin)
3. PostgreSQL version seçin (15 veya üzeri önerilir)
4. **Create Project** butonuna tıklayın

### 3. Connection String'i Alma

1. Oluşturduğunuz project'e tıklayın
2. **Connection Details** sekmesine gidin
3. **Connection string** bölümünden connection string'i kopyalayın
   - Format: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require`
4. Bu connection string'i Render environment variables'a ekleyeceğiz

**Not**: Neon connection string'i zaten `?sslmode=require` içerir, bu güvenlik için gereklidir.

---

## Render'da Backend Oluşturma

### Yöntem 1: Render Dashboard (Önerilen)

1. **Yeni Web Service Oluşturma**
   - [Render Dashboard](https://dashboard.render.com)'a giriş yapın
   - **New +** butonuna tıklayın
   - **Web Service** seçin

2. **Repository Bağlama**
   - Git repository'nizi seçin (GitHub, GitLab, veya Bitbucket)
   - Repository'yi bağlayın

3. **Service Ayarları**
   - **Name**: `cloudguide-backend` (veya istediğiniz isim)
   - **Region**: En yakın bölgeyi seçin
   - **Branch**: `main` (veya default branch)
   - **Root Directory**: `backend` (backend klasörü root olarak ayarlayın)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

4. **Plan Seçimi**
   - **Free** plan (başlangıç için yeterli)
   - veya **Starter/Professional** (daha fazla kaynak için)

5. **Environment Variables Ekleme**
   - Aşağıdaki bölümde detaylı açıklama var

6. **Deploy**
   - **Create Web Service** butonuna tıklayın
   - Build işlemi başlayacak
   - İlk deployment 5-10 dakika sürebilir

### Yöntem 2: Render.yaml ile (Otomatik)

1. Repository'nize `render.yaml` dosyasını ekleyin (zaten oluşturuldu)
2. Render Dashboard'da **New +** → **Blueprint** seçin
3. Repository'nizi seçin
4. Render otomatik olarak `render.yaml` dosyasını okuyacak ve servisleri oluşturacak

**Not**: `render.yaml` dosyasındaki environment variables'ları Render dashboard'dan manuel olarak eklemeniz gerekecek.

---

## Environment Variables

Render Dashboard'da environment variables ekleyin:

### Render Dashboard'dan Ekleme

1. Web Service'inize gidin
2. **Environment** sekmesine tıklayın
3. **Add Environment Variable** butonuna tıklayın
4. Aşağıdaki değişkenleri ekleyin:

#### Gerekli Değişkenler

| Variable Name | Value | Açıklama |
|--------------|-------|----------|
| `DATABASE_URL` | `postgresql://...` | Neon connection string (yukarıdan kopyaladığınız) |
| `FLASK_ENV` | `production` | Production ortamı |
| `FLASK_DEBUG` | `False` | Debug modunu kapatır |
| `FLASK_RUN_HOST` | `0.0.0.0` | Tüm interface'lerden erişim için |
| `FLASK_RUN_PORT` | `5000` | Port numarası |
| `FRONTEND_URL` | `https://your-domain.vercel.app` | Vercel frontend URL'iniz (CORS için) |

#### Örnek DATABASE_URL Formatı

```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Önemli**: 
- Connection string'de `?sslmode=require` olmalı (Neon zaten ekler)
- Username ve password Neon dashboard'dan alınır
- Hostname `ep-xxx-xxx.region.aws.neon.tech` formatındadır

### Environment Variables Kontrolü

Deployment sonrası environment variables'ların doğru yüklendiğini kontrol edin:

1. Render Dashboard → Service → **Environment** sekmesi
2. Tüm değişkenlerin listede olduğundan emin olun
3. Değerlerin doğru olduğunu kontrol edin (özellikle `DATABASE_URL`)

---

## Database Migration

Render'da ilk deployment'tan sonra database tablolarını oluşturmanız gerekiyor.

### Yöntem 1: Render Shell ile (Önerilen)

1. Render Dashboard → Service → **Shell** sekmesine gidin
2. Shell açıldığında şu komutları çalıştırın:

```bash
cd backend
python -m backend.database.migrations.init_db
```

### Yöntem 2: Local'den Migration

```bash
# Local'de Neon connection string'i kullanarak
export DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Migration script'ini çalıştırın
cd backend
python -m backend.database.migrations.init_db
```

### Yöntem 3: Neon SQL Editor

1. [Neon Console](https://console.neon.tech)'a gidin
2. Project'inize gidin
3. **SQL Editor** sekmesine gidin
4. `backend/database/models.py` dosyasındaki model tanımlarına göre tabloları manuel oluşturun

**Not**: Migration script'i kullanmak daha kolay ve güvenlidir.

---

## CORS Yapılandırması

Backend'in frontend'den gelen istekleri kabul edebilmesi için CORS ayarları yapılmıştır.

`backend/app.py` dosyasında:
- `FRONTEND_URL` environment variable'ı kullanılır
- Eğer `FRONTEND_URL` ayarlanmamışsa, tüm origin'ler kabul edilir (`*`)

**Production için önerilen**:
- `FRONTEND_URL` değişkenini Vercel frontend URL'inize ayarlayın
- Örnek: `https://your-app.vercel.app`

---

## Sorun Giderme

### 1. Database Connection Hatası

**Hata**: `could not connect to server` veya `connection refused`

**Çözüm**:
- `DATABASE_URL` environment variable'ının doğru olduğundan emin olun
- Connection string'de `?sslmode=require` olduğunu kontrol edin
- Neon database'inin aktif olduğunu kontrol edin
- Neon dashboard'da connection string'i tekrar kopyalayın

### 2. Build Hatası

**Hata**: Build sırasında `ModuleNotFoundError` veya import hataları

**Çözüm**:
- `backend/requirements.txt` dosyasının doğru olduğundan emin olun
- Render build loglarını kontrol edin
- Root directory'nin `backend` olarak ayarlandığını kontrol edin

### 3. Port Hatası

**Hata**: `Port already in use` veya connection refused

**Çözüm**:
- Render otomatik olarak `PORT` environment variable'ını sağlar
- `app.py` dosyasında port'u environment variable'dan alın:
  ```python
  port = int(os.getenv("PORT", 5000))
  app.run(host="0.0.0.0", port=port)
  ```

### 4. CORS Hatası

**Hata**: Frontend'den API çağrıları CORS hatası veriyor

**Çözüm**:
- `FRONTEND_URL` environment variable'ının doğru ayarlandığını kontrol edin
- Vercel frontend URL'inizi `FRONTEND_URL`'e ekleyin
- Render logs'da CORS hatalarını kontrol edin

### 5. Slow Cold Start

**Hata**: İlk istek çok yavaş (30+ saniye)

**Çözüm**:
- Render Free plan'da cold start normaldir (15-30 saniye)
- Starter plan'a geçerek cold start'ı azaltabilirsiniz
- Render'ın **Auto-Deploy** özelliğini kullanarak servisi aktif tutabilirsiniz

---

## Render URL ve Endpoints

Deployment sonrası:

- **Backend URL**: `https://your-service-name.onrender.com`
- **Health Check**: `https://your-service-name.onrender.com/api/health`
- **API Base**: `https://your-service-name.onrender.com/api`

Bu URL'yi frontend'deki `NEXT_PUBLIC_API_URL` environment variable'ına ekleyin.

---

## Post-Deployment Checklist

- [ ] Neon database oluşturuldu ve connection string alındı
- [ ] Render'da web service oluşturuldu
- [ ] Tüm environment variables eklendi
- [ ] Database migration çalıştırıldı
- [ ] Health check endpoint çalışıyor (`/api/health`)
- [ ] CORS ayarları doğru (FRONTEND_URL ayarlandı)
- [ ] Frontend backend'e bağlanabiliyor

---

## Render Plan Karşılaştırması

| Özellik | Free | Starter | Professional |
|---------|------|---------|--------------|
| Cold Start | 15-30s | 5-10s | <5s |
| RAM | 512MB | 512MB | 2GB+ |
| CPU | Shared | Shared | Dedicated |
| Sleep | 15 dk inactivity | No sleep | No sleep |
| Fiyat | $0 | $7/ay | $25+/ay |

**Öneri**: Başlangıç için Free plan yeterli, production için Starter veya Professional plan düşünün.

---

## Ek Kaynaklar

- [Render Documentation](https://render.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Flask Deployment](https://flask.palletsprojects.com/en/latest/deploying/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)

---

## Destek

Sorun yaşarsanız:
1. Render build ve runtime loglarını kontrol edin
2. Neon dashboard'da database connection'ı kontrol edin
3. Environment variables'ları doğrulayın
4. Local'de test edin ve hataları tespit edin
