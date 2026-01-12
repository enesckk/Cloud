# Backend Başlatma - Hızlı Çözüm

## ❌ Sorun
`ERR_CONNECTION_REFUSED` hatası alıyorsunuz. Bu, backend'in çalışmadığı anlamına gelir.

## ✅ Çözüm

### Adım 1: Yeni bir PowerShell penceresi açın
Windows'ta yeni bir PowerShell veya Terminal penceresi açın.

### Adım 2: Backend dizinine gidin
```powershell
cd C:\Users\Dell\Downloads\cloud\backend
```

### Adım 3: Backend'i başlatın
```powershell
python app.py
```

### Beklenen Çıktı:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

---

## 🔍 Kontrol

Backend başladıktan sonra:

1. **Tarayıcıda test edin:**
   - `http://localhost:5000/api/health` adresine gidin
   - `{"status":"ok"}` gibi bir yanıt görmelisiniz

2. **Frontend'den giriş yapmayı deneyin:**
   - Email: `admin@cloudguide.com`
   - Şifre: `admin123`

---

## ⚠️ Sorun Giderme

### Python bulunamıyor
```powershell
python --version
```
Eğer hata veriyorsa, Python'u PATH'e ekleyin veya `py` komutunu deneyin:
```powershell
py app.py
```

### Port 5000 kullanımda
Başka bir uygulama port 5000'i kullanıyor olabilir. Port'u değiştirmek için:
```python
# app.py dosyasında son satırı değiştirin:
app.run(debug=True, host="0.0.0.0", port=5001)  # 5001 kullan
```

Ve `lib/api-client.ts` dosyasında:
```typescript
const API_BASE_URL = "http://localhost:5001/api"
```

### Database bağlantı hatası
Database container'ının çalıştığından emin olun:
```powershell
wsl docker ps --filter "name=cloudguide"
```

Çalışmıyorsa:
```powershell
wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose up -d postgres"
```

---

## 📝 Notlar

- Backend'i **ayrı bir terminal penceresinde** çalıştırın
- Backend çalışırken terminal penceresini **kapatmayın**
- Backend'i durdurmak için terminal'de `Ctrl+C` yapın

---

## 🚀 Hızlı Başlatma Script'i

`backend/quick_start.ps1` dosyasını çalıştırabilirsiniz:
```powershell
cd C:\Users\Dell\Downloads\cloud
.\backend\quick_start.ps1
```
