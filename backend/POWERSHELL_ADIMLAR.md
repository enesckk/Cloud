# PowerShell Adım Adım Kurulum (Yönetici)

## ✅ Tamamlanan Adımlar

### 1. Container Durumu Kontrol
```powershell
wsl docker ps --filter "name=cloudguide"
```
**Sonuç:** Container çalışıyor ✓

### 2. Database Bağlantısı Test
```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT version();"
```
**Sonuç:** PostgreSQL 15.15 bağlantı başarılı ✓

### 3. Python Dependencies Yükleme
```powershell
cd C:\Users\Dell\Downloads\cloud\backend
pip install -r requirements.txt
```
**Sonuç:** Tüm paketler yüklendi ✓

### 4. Tabloları Oluşturma
```powershell
cd C:\Users\Dell\Downloads\cloud
python -m backend.database.migrations.init_db
```
**Sonuç:** Tablolar oluşturuldu ✓

---

## 📋 SQLTools Bağlantısı Yapılandırma

### Adım 1: SQLTools Extension'ını Açın
- VS Code'da sol sidebar'da SQLTools ikonuna tıklayın

### Adım 2: Yeni Bağlantı Ekle
1. **"+"** butonuna tıklayın
2. **"PostgreSQL"** seçin

### Adım 3: Bağlantı Bilgilerini Girin
```
Connection Name: CloudGuide Database
Server: localhost
Port: 5433  ⚠️ ÖNEMLİ: 5433 kullanın!
Database: cloudguide_db
Username: cloudguide_user
Password: cloudguide_pass
```

### Adım 4: Bağlantıyı Test Edin
- **"Test Connection"** butonuna tıklayın
- Başarılı mesajı görmelisiniz

### Adım 5: Bağlantıyı Kaydedin
- **"Save Connection"** butonuna tıklayın

---

## 🔍 Tabloları Görüntüleme

### SQLTools'ta:
1. SQLTools sidebar'ında **"CloudGuide Database"** bağlantısını genişletin
2. **"Tables"** klasörünü açın
3. Şu tabloları görmelisiniz:
   - `users` - Kullanıcı bilgileri
   - `analyses` - Maliyet analizleri

### PowerShell'den Kontrol:
```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
```

---

## 📊 Tablo Yapılarını Görüntüleme

### Users Tablosu:
```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "\d users"
```

### Analyses Tablosu:
```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "\d analyses"
```

---

## ⚠️ Sorun Giderme

### Container Çalışmıyor
```powershell
wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose up -d postgres"
```

### Port 5433 Kullanılamıyor
```powershell
netstat -an | findstr 5433
```

### SQLTools Bağlantı Hatası
1. Port'un **5433** olduğundan emin olun
2. Container'ın çalıştığını kontrol edin:
   ```powershell
   wsl docker ps --filter "name=cloudguide"
   ```
3. Bağlantıyı silip yeniden ekleyin

### Tablolar Görünmüyor
```powershell
cd C:\Users\Dell\Downloads\cloud
python -m backend.database.migrations.init_db
```

---

## ✅ Başarı Kontrolü

Tüm adımlar tamamlandıysa:
- ✅ Container çalışıyor
- ✅ Database bağlantısı başarılı
- ✅ Tablolar oluşturuldu (`users`, `analyses`)
- ✅ SQLTools bağlantısı yapılandırıldı

**Artık SQLTools'tan database'i görüntüleyebilirsiniz!** 🎉
