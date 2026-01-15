# CORS ve API URL Sorunları - Çözüm

## Problemler

1. **CORS Hatası**: 
   ```
   Access to fetch at 'https://cloud-6c8h.onrender.com/providers?active_only=true' 
   from origin 'https://cloud-eight-flax.vercel.app' has been blocked by CORS policy
   ```

2. **404 Hatası**:
   ```
   GET https://cloud-6c8h.onrender.com/providers?active_only=true net::ERR_FAILED 404
   ```

## Çözümler

### 1. Render'da FRONTEND_URL Environment Variable'ı Ekleyin

Render Dashboard'da:
1. Service → **Environment** sekmesine gidin
2. **Add Environment Variable** butonuna tıklayın
3. Şu değişkeni ekleyin:

```
Key: FRONTEND_URL
Value: https://cloud-eight-flax.vercel.app
```

**Önemli**: Vercel frontend URL'inizi buraya ekleyin.

### 2. Frontend'de API_BASE_URL Kontrolü

Frontend'de `NEXT_PUBLIC_API_URL` environment variable'ının doğru olduğundan emin olun:

**Vercel Dashboard'da**:
```
NEXT_PUBLIC_API_URL=https://cloud-6c8h.onrender.com/api
```

**Önemli**: 
- URL'in sonunda `/api` olmalı
- Backend URL'i Render'dan alın: `https://cloud-6c8h.onrender.com`

### 3. Backend CORS Ayarları Güncellendi

`backend/app.py` dosyasında CORS ayarları güncellendi:
- Birden fazla origin desteği eklendi
- `supports_credentials` eklendi
- Tüm `/api/*` route'ları için CORS aktif

## Adım Adım Kontrol Listesi

### Backend (Render)
- [ ] `FRONTEND_URL` environment variable eklendi: `https://cloud-eight-flax.vercel.app`
- [ ] Backend çalışıyor: `https://cloud-6c8h.onrender.com/api/health` test edin
- [ ] CORS ayarları aktif (kod güncellendi)

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` environment variable eklendi: `https://cloud-6c8h.onrender.com/api`
- [ ] URL'in sonunda `/api` var
- [ ] Frontend yeniden deploy edildi

## Test

1. **Backend Health Check**:
   ```
   https://cloud-6c8h.onrender.com/api/health
   ```

2. **Providers Endpoint**:
   ```
   https://cloud-6c8h.onrender.com/api/providers?active_only=true
   ```

3. **Browser Console'da**:
   - CORS hatası olmamalı
   - API çağrıları başarılı olmalı

## Sorun Devam Ederse

1. **Render Logs Kontrolü**:
   - Render Dashboard → Service → Logs
   - CORS hatalarını kontrol edin

2. **Browser Network Tab**:
   - Request headers'ı kontrol edin
   - Response headers'da `Access-Control-Allow-Origin` olmalı

3. **Environment Variables Kontrolü**:
   - Render'da `FRONTEND_URL` doğru mu?
   - Vercel'de `NEXT_PUBLIC_API_URL` doğru mu?
