# Deployment Overview - Tüm Sistem

Bu dokümantasyon, tüm sistemin (Frontend, Backend, Database) deployment'ını özetler.

## 🏗️ Mimari

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │         │    Database     │
│   (Next.js)     │────────▶│   (Flask)       │────────▶│   (PostgreSQL)  │
│   Vercel        │         │   Render        │         │   Neon          │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 📍 Deployment Lokasyonları

| Bileşen | Platform | URL Formatı |
|---------|----------|-------------|
| **Frontend** | Vercel | `https://your-app.vercel.app` |
| **Backend** | Render | `https://your-backend.onrender.com` |
| **Database** | Neon | `postgresql://...@ep-xxx.neon.tech/...` |

---

## 🚀 Deployment Sırası

### 1. Database (Neon) - İlk Adım

1. [Neon Console](https://console.neon.tech)'da hesap oluşturun
2. Yeni project oluşturun
3. Connection string'i alın
4. **Detaylar**: `RENDER_DEPLOYMENT.md` dosyasındaki "Neon Database Kurulumu" bölümüne bakın

### 2. Backend (Render) - İkinci Adım

1. [Render Dashboard](https://dashboard.render.com)'da hesap oluşturun
2. Web Service oluşturun
3. Neon connection string'ini environment variable olarak ekleyin
4. Backend'i deploy edin
5. Database migration'ı çalıştırın
6. **Detaylar**: `RENDER_DEPLOYMENT.md` dosyasına bakın

### 3. Frontend (Vercel) - Son Adım

1. [Vercel Dashboard](https://vercel.com/dashboard)'da hesap oluşturun
2. Repository'yi bağlayın
3. Render backend URL'ini environment variable olarak ekleyin
4. Frontend'i deploy edin
5. **Detaylar**: `VERCEL_DEPLOYMENT.md` dosyasına bakın

---

## 🔐 Environment Variables Özeti

### Backend (Render)

| Variable | Değer | Açıklama |
|----------|-------|----------|
| `DATABASE_URL` | `postgresql://...@neon.tech/...` | Neon connection string |
| `FLASK_ENV` | `production` | Production ortamı |
| `FLASK_DEBUG` | `False` | Debug kapalı |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Vercel frontend URL (CORS için) |
| `PORT` | `5000` | Port (Render otomatik sağlar) |

### Frontend (Vercel)

| Variable | Değer | Açıklama |
|----------|-------|----------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com/api` | Render backend URL |

---

## 📝 Environment Dosyaları

### Backend için

Dosya: `backend/env.example`

```bash
# Backend klasöründe
cp env.example .env
# .env dosyasını düzenleyin
```

### Frontend için

Dosya: `env.example` (root)

```bash
# Root klasörde
cp env.example .env.local
# .env.local dosyasını düzenleyin
```

---

## 🔗 Bağlantılar

### Frontend → Backend

- Frontend, `NEXT_PUBLIC_API_URL` environment variable'ını kullanır
- Bu değişken Render backend URL'ini içerir
- Format: `https://service-name.onrender.com/api`

### Backend → Database

- Backend, `DATABASE_URL` environment variable'ını kullanır
- Bu değişken Neon connection string'ini içerir
- Format: `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require`

### Backend → Frontend (CORS)

- Backend, `FRONTEND_URL` environment variable'ını kullanır
- Bu değişken Vercel frontend URL'ini içerir
- CORS ayarları için kullanılır

---

## ✅ Deployment Checklist

### Database (Neon)
- [ ] Neon hesabı oluşturuldu
- [ ] Database project oluşturuldu
- [ ] Connection string alındı

### Backend (Render)
- [ ] Render hesabı oluşturuldu
- [ ] Web Service oluşturuldu
- [ ] Environment variables eklendi
- [ ] Backend deploy edildi
- [ ] Database migration çalıştırıldı
- [ ] Health check başarılı (`/api/health`)

### Frontend (Vercel)
- [ ] Vercel hesabı oluşturuldu
- [ ] Repository bağlandı
- [ ] `NEXT_PUBLIC_API_URL` environment variable eklendi
- [ ] Frontend deploy edildi
- [ ] Frontend backend'e bağlanabiliyor

### Test
- [ ] Frontend açılıyor
- [ ] API çağrıları çalışıyor
- [ ] Authentication çalışıyor
- [ ] Database operations çalışıyor

---

## 📚 Detaylı Dokümantasyon

- **Backend Deployment**: `RENDER_DEPLOYMENT.md`
- **Frontend Deployment**: `VERCEL_DEPLOYMENT.md`
- **Backend Environment**: `backend/env.example`
- **Frontend Environment**: `env.example`

---

## 🆘 Sorun Giderme

### Frontend backend'e bağlanamıyor

1. `NEXT_PUBLIC_API_URL` doğru mu? (Render backend URL'i)
2. Render backend aktif mi?
3. Browser console'da hata var mı?
4. CORS hatası var mı? (Render'da `FRONTEND_URL` ayarlı mı?)

### Backend database'e bağlanamıyor

1. `DATABASE_URL` doğru mu? (Neon connection string)
2. Connection string'de `?sslmode=require` var mı?
3. Neon database aktif mi?
4. Render logs'da hata var mı?

### Database migration hatası

1. Render Shell'den migration çalıştırın
2. Neon SQL Editor'den manuel tablo oluşturun
3. `backend/database/models.py` dosyasını kontrol edin

---

## 💰 Maliyet Tahmini

### Free Tier (Başlangıç)

- **Vercel**: Ücretsiz (hobby plan)
- **Render**: Ücretsiz (free plan, 15dk sleep)
- **Neon**: Ücretsiz (free tier, 0.5GB storage)

**Toplam**: $0/ay

### Production (Önerilen)

- **Vercel**: Ücretsiz veya Pro ($20/ay)
- **Render**: Starter ($7/ay) veya Professional ($25/ay)
- **Neon**: Launch ($19/ay) veya Scale ($69/ay)

**Toplam**: ~$26-114/ay (kullanıma göre)

---

## 🔄 Güncelleme Süreci

1. **Code Değişikliği**: Git repository'ye push
2. **Backend**: Render otomatik deploy eder
3. **Frontend**: Vercel otomatik deploy eder
4. **Database**: Migration gerekirse manuel çalıştırın

---

## 📞 Destek

Sorun yaşarsanız:
1. İlgili deployment guide'ı kontrol edin
2. Platform loglarını inceleyin (Render, Vercel, Neon)
3. Environment variables'ları doğrulayın
4. Local'de test edin
