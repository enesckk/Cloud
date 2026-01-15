# Vercel Deployment Guide - Frontend

Bu dokümantasyon, Next.js frontend'ini Vercel'de yayınlamak için gerekli tüm adımları içerir.

**Not**: Backend Render'da, Database Neon'da olacak. Sadece frontend Vercel'de deploy edilecek.

## 📋 İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [Environment Variables](#environment-variables)
3. [Deployment Adımları](#deployment-adımları)
4. [Frontend-Backend Bağlantısı](#frontend-backend-bağlantısı)
5. [Sorun Giderme](#sorun-giderme)

---

## Gereksinimler

- Vercel hesabı ([vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, veya Bitbucket)
- Render'da deploy edilmiş backend (backend deployment için `RENDER_DEPLOYMENT.md` dosyasına bakın)
- Vercel CLI (opsiyonel, terminal üzerinden deploy için)

**Not**: Database Neon'da olacak, backend Render'da olacak. Sadece frontend Vercel'de deploy edilecek.

---

## Environment Variables

Vercel Dashboard'da veya CLI ile environment variables ekleyin:

### Vercel Dashboard'dan Ekleme

1. Projenizin **Settings** → **Environment Variables** sekmesine gidin
2. Aşağıdaki değişkenleri ekleyin:

#### Gerekli Değişkenler

| Variable Name | Value | Açıklama |
|--------------|-------|----------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-name.onrender.com/api` | Render backend URL'iniz (önemli!) |

**Örnek**:
```
NEXT_PUBLIC_API_URL=https://cloudguide-backend.onrender.com/api
```

**Not**: 
- Backend URL'inizi Render deployment'tan sonra alacaksınız
- URL formatı: `https://service-name.onrender.com/api`
- `/api` suffix'ini eklemeyi unutmayın

### Vercel CLI ile Ekleme

```bash
# Vercel CLI'yi yükleyin (eğer yoksa)
npm i -g vercel

# Projeyi bağlayın
vercel link

# Environment variables ekleyin
vercel env add NEXT_PUBLIC_API_URL
```

---

## Deployment Adımları

### Yöntem 1: Vercel Dashboard (Önerilen)

1. **Git Repository'yi Bağlama**
   - [Vercel Dashboard](https://vercel.com/dashboard)'a giriş yapın
   - **Add New Project** butonuna tıklayın
   - Git repository'nizi seçin (GitHub, GitLab, veya Bitbucket)
   - Repository'yi import edin

2. **Proje Ayarları**
   - **Framework Preset**: Next.js (otomatik algılanır)
   - **Root Directory**: `.` (root dizin)
   - **Build Command**: `npm run build` (otomatik)
   - **Output Directory**: `.next` (otomatik)
   - **Install Command**: `npm install` (otomatik)

3. **Environment Variables Ekleme**
   - **Environment Variables** sekmesine gidin
   - Yukarıdaki tabloda belirtilen değişkenleri ekleyin
   - Her değişken için **Production**, **Preview**, ve **Development** ortamlarını seçin

4. **Deploy**
   - **Deploy** butonuna tıklayın
   - Build işlemi tamamlanana kadar bekleyin
   - Deployment başarılı olduğunda URL'yi alın

### Yöntem 2: Vercel CLI

```bash
# Vercel CLI'yi yükleyin
npm i -g vercel

# Projeyi deploy edin
vercel

# Production'a deploy etmek için
vercel --prod
```

**Not**: Database migration Render'da yapılacak. `RENDER_DEPLOYMENT.md` dosyasına bakın.

---

## Frontend-Backend Bağlantısı

Frontend'in backend'e bağlanabilmesi için `lib/api-client.ts` dosyasındaki `API_BASE_URL` değişkeni otomatik olarak `NEXT_PUBLIC_API_URL` environment variable'ını kullanır.

**Önemli**: 
- `NEXT_PUBLIC_API_URL` değişkenini Render backend URL'inize ayarlayın
- Format: `https://your-backend-name.onrender.com/api`
- Backend URL'ini Render deployment'tan sonra alın

Deployment sonrası:
- Frontend URL: `https://your-domain.vercel.app`
- Backend URL: `https://your-backend-name.onrender.com/api` (Render'dan)

---

## Sorun Giderme

### 1. Backend Connection Hatası

**Hata**: Frontend backend'e bağlanamıyor veya CORS hatası

**Çözüm**:
- `NEXT_PUBLIC_API_URL` environment variable'ının doğru olduğundan emin olun
- Render backend'inin aktif olduğunu kontrol edin
- Backend URL formatı: `https://service-name.onrender.com/api`
- Render'da `FRONTEND_URL` environment variable'ının Vercel URL'inize ayarlandığını kontrol edin

### 2. Build Hatası

**Hata**: Next.js build sırasında hata oluşuyor

**Çözüm**:
- Vercel build loglarını kontrol edin
- Local'de `npm run build` komutunu çalıştırarak hataları tespit edin
- TypeScript hatalarını düzeltin
- Dependencies'lerin doğru yüklendiğini kontrol edin

### 3. CORS Hatası

**Hata**: `CORS policy` hatası veya preflight request başarısız

**Çözüm**:
- Render'da `FRONTEND_URL` environment variable'ının Vercel frontend URL'inize ayarlandığını kontrol edin
- Backend CORS ayarlarının doğru olduğunu kontrol edin (`RENDER_DEPLOYMENT.md` dosyasına bakın)
- Browser console'da CORS hatalarını kontrol edin
- Network tab'ında preflight (OPTIONS) request'in başarılı olduğunu kontrol edin

---

## Post-Deployment Checklist

- [ ] Render'da backend deploy edildi (`RENDER_DEPLOYMENT.md` dosyasına bakın)
- [ ] Neon database oluşturuldu ve migration yapıldı
- [ ] `NEXT_PUBLIC_API_URL` environment variable'ı Render backend URL'ine ayarlandı
- [ ] Frontend backend'e bağlanabiliyor (browser console'da hata yok)
- [ ] API endpoint'leri çalışıyor (frontend'den API çağrıları başarılı)
- [ ] Authentication çalışıyor (login/register test edin)
- [ ] CORS ayarları doğru (Render'da `FRONTEND_URL` ayarlandı)

---

## Ek Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Python Runtime](https://vercel.com/docs/functions/runtimes/python)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Destek

Sorun yaşarsanız:
1. Vercel build loglarını kontrol edin
2. Vercel Dashboard → Project → Functions → Logs bölümünü inceleyin
3. Local'de test edin ve hataları tespit edin
