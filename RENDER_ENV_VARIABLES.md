# Render Environment Variables - Hızlı Referans

Render dashboard'da **Environment Variables** bölümüne şu değişkenleri ekleyin:

## 🔑 Eklenmesi Gereken Environment Variables

### 1. DATABASE_URL (Zorunlu)
```
Key: DATABASE_URL
Value: postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```
**Not**: Neon dashboard'dan connection string'i kopyalayın.

### 2. FLASK_ENV (Zorunlu)
```
Key: FLASK_ENV
Value: production
```

### 3. FLASK_DEBUG (Zorunlu)
```
Key: FLASK_DEBUG
Value: False
```

### 4. FLASK_RUN_HOST (Zorunlu)
```
Key: FLASK_RUN_HOST
Value: 0.0.0.0
```

### 5. FRONTEND_URL (Zorunlu - CORS için)
```
Key: FRONTEND_URL
Value: https://your-frontend-domain.vercel.app
```
**Not**: Vercel'de frontend deploy ettikten sonra URL'yi buraya ekleyin.

---

## 📝 Render Dashboard'da Nasıl Eklenecek?

1. **"+ Add Environment Variable"** butonuna tıklayın
2. Her bir değişken için:
   - **Key** alanına yukarıdaki key'i girin (örn: `DATABASE_URL`)
   - **Value** alanına yukarıdaki value'yu girin
   - **Save** butonuna tıklayın

---

## ⚠️ Önemli Notlar

- **PORT** değişkeni Render tarafından otomatik sağlanır, manuel eklemenize gerek yok
- **DATABASE_URL** değişkenini Neon'dan aldığınız connection string ile değiştirin
- **FRONTEND_URL** değişkenini Vercel frontend URL'iniz ile değiştirin
- Tüm değerler **tırnak işareti olmadan** girilmelidir

---

## ✅ Örnek Tam Liste

Render'da şu environment variables'lar olmalı:

| Key | Value Örneği |
|-----|-------------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `FLASK_ENV` | `production` |
| `FLASK_DEBUG` | `False` |
| `FLASK_RUN_HOST` | `0.0.0.0` |
| `FRONTEND_URL` | `https://cloudguide-app.vercel.app` |

**Not**: `PORT` değişkeni Render tarafından otomatik eklenir, siz eklemeyin.
