# Backend Başlatma Kılavuzu

## Hızlı Başlatma

### Windows PowerShell'den:
```powershell
cd C:\Users\Dell\Downloads\cloud\backend
python app.py
```

### WSL2'den (Ubuntu):
```bash
cd /mnt/c/Users/Dell/Downloads/cloud/backend
python app.py
```

---

## Backend Çalışıyor mu Kontrol

### Port Kontrolü:
```powershell
netstat -an | findstr ":5000"
```

Eğer `LISTENING` görüyorsanız backend çalışıyor.

### API Test:
Tarayıcıda açın: `http://localhost:5000/api/health`

Veya PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET
```

---

## Sorun Giderme

### Port 5000 Kullanımda
```powershell
# Hangi process port 5000'i kullanıyor?
netstat -ano | findstr ":5000"

# Process'i sonlandır (PID'yi yukarıdaki komuttan alın)
taskkill /PID <PID> /F
```

### Backend Başlamıyor
1. Python yüklü mü kontrol edin:
   ```powershell
   python --version
   ```

2. Dependencies yüklü mü kontrol edin:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

3. Database bağlantısını kontrol edin:
   ```powershell
   wsl docker ps --filter "name=cloudguide"
   ```

### ERR_CONNECTION_REFUSED Hatası
- Backend'in çalıştığından emin olun
- Port 5000'in açık olduğunu kontrol edin
- Firewall'u kontrol edin
- Frontend'in `http://localhost:5000/api` adresine bağlanabildiğini kontrol edin

---

## Backend'i Arka Planda Çalıştırma

### Windows'ta:
```powershell
Start-Process python -ArgumentList "app.py" -WorkingDirectory "C:\Users\Dell\Downloads\cloud\backend" -WindowStyle Hidden
```

### WSL2'de:
```bash
nohup python app.py > backend.log 2>&1 &
```

---

## Backend Log'ları

Backend çalışırken terminal'de şunları görmelisiniz:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

Eğer hata görüyorsanız, hata mesajını kontrol edin.

---

## Frontend Bağlantısı

Frontend'in backend'e bağlanabilmesi için:
1. Backend `http://localhost:5000` adresinde çalışmalı
2. `lib/api-client.ts` dosyasında `API_BASE_URL` doğru olmalı:
   ```typescript
   const API_BASE_URL = "http://localhost:5000/api"
   ```

---

## Otomatik Başlatma (Opsiyonel)

### Windows Task Scheduler ile:
1. Task Scheduler'ı açın
2. "Create Basic Task" seçin
3. Backend'i başlatacak bir task oluşturun

### Docker Compose ile:
`docker-compose.yml` dosyasında backend service'i zaten var. Çalıştırmak için:
```powershell
wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose up -d backend"
```
