# SQLTools WSL2 Bağlantı Düzeltmesi

## ✅ Yapılan Değişiklikler

1. **Port Değişikliği**: PostgreSQL port'u **5433** olarak ayarlandı (5432 başka bir proje tarafından kullanılıyor)
2. **SQLTools Ayarları**: `backend/.vscode/settings.json` dosyası port 5433 ile güncellendi
3. **Docker Compose**: Healthcheck kaldırıldı, `restart: unless-stopped` eklendi

---

## 🔧 SQLTools Bağlantı Ayarları

SQLTools'ta bağlantıyı şu şekilde yapılandırın:

```
Connection Name: CloudGuide Database
Server: localhost
Port: 5433  ← ÖNEMLİ: 5433 kullanın!
Database: cloudguide_db
Username: cloudguide_user
Password: cloudguide_pass
```

---

## 📋 Container'ı Başlatma

### WSL2'den (Ubuntu):
```bash
cd /mnt/c/Users/Dell/Downloads/cloud/backend
docker compose up -d postgres
```

### Windows PowerShell'den:
```powershell
wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose up -d postgres"
```

---

## ✅ Bağlantıyı Test Etme

### 1. Container'ın Çalıştığını Kontrol Edin:
```bash
wsl docker ps --filter "name=cloudguide"
```

### 2. Database Bağlantısını Test Edin:
```bash
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT version();"
```

### 3. Tabloları Oluşturun:
Windows'tan (Python yüklü olmalı):
```powershell
cd C:\Users\Dell\Downloads\cloud\backend
python -m backend.database.migrations.init_db
```

---

## 🔍 SQLTools'ta Bağlantı Ekleme

1. SQLTools sidebar'ını açın
2. **"+"** butonuna tıklayın
3. **"PostgreSQL"** seçin
4. Bilgileri girin:
   - **Port: 5433** (önemli!)
   - Server: localhost
   - Database: cloudguide_db
   - Username: cloudguide_user
   - Password: cloudguide_pass
5. **"Test Connection"** yapın
6. Başarılıysa **"Save Connection"** tıklayın

---

## ⚠️ Sorun Giderme

### Container Duruyor
```bash
# Log'ları kontrol edin
wsl docker logs cloudguide_postgres

# Container'ı yeniden başlatın
wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose restart postgres"
```

### Port 5433 Kullanılamıyor
```bash
# Port'u kontrol edin
netstat -an | findstr 5433

# Container'ı durdurup yeniden başlatın
wsl docker stop cloudguide_postgres
wsl docker start cloudguide_postgres
```

### Database Bulunamıyor
Container içinden database'i kontrol edin:
```bash
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d postgres -c "\l"
```

---

## 📝 Notlar

- WSL2'de Docker çalışıyor
- Windows'tan `localhost:5433` ile bağlanabilirsiniz
- Container adı: `cloudguide_postgres`
- Database: `cloudguide_db`
- User: `cloudguide_user`
- Password: `cloudguide_pass`
