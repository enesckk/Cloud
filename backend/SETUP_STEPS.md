# PostgreSQL ve SQLTools Kurulum Adımları (Yönetici PowerShell)

## Adım 1: Container Durumunu Kontrol Et

```powershell
wsl docker ps --filter "name=cloudguide"
```

**Beklenen çıktı:** Container `Up` durumunda olmalı

Eğer çalışmıyorsa:
```powershell
wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose up -d postgres"
```

---

## Adım 2: Database Bağlantısını Test Et

```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT version();"
```

**Beklenen çıktı:** PostgreSQL version bilgisi

---

## Adım 3: Mevcut Tabloları Kontrol Et

```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

**Beklenen çıktı:** Eğer tablolar yoksa boş liste

---

## Adım 4: Python Dependencies Yükle

```powershell
cd C:\Users\Dell\Downloads\cloud\backend
pip install -r requirements.txt
```

**Beklenen çıktı:** Tüm paketler başarıyla yüklendi

---

## Adım 5: Tabloları Oluştur

```powershell
cd C:\Users\Dell\Downloads\cloud
python -m backend.database.migrations.init_db
```

**Beklenen çıktı:** `✓ Database tables created successfully!`

---

## Adım 6: Tabloları Doğrula

```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

**Beklenen çıktı:** `users` ve `analyses` tabloları görünmeli

---

## Adım 7: SQLTools Bağlantısını Yapılandır

1. VS Code'da SQLTools extension'ını açın
2. Sidebar'da **"+"** butonuna tıklayın
3. **"PostgreSQL"** seçin
4. Şu bilgileri girin:
   - **Connection Name:** `CloudGuide Database`
   - **Server:** `localhost`
   - **Port:** `5433` ⚠️ ÖNEMLİ: 5433 kullanın!
   - **Database:** `cloudguide_db`
   - **Username:** `cloudguide_user`
   - **Password:** `cloudguide_pass`
5. **"Test Connection"** tıklayın
6. Başarılıysa **"Save Connection"** tıklayın

---

## Adım 8: SQLTools'ta Tabloları Görüntüle

1. SQLTools sidebar'ında **"CloudGuide Database"** bağlantısını genişletin
2. **"Tables"** klasörünü açın
3. `users` ve `analyses` tablolarını görmelisiniz

---

## Sorun Giderme

### Container çalışmıyor
```powershell
wsl docker logs cloudguide_postgres --tail 50
```

### Port 5433 kullanılamıyor
```powershell
netstat -an | findstr 5433
```

### Python modülü bulunamıyor
```powershell
cd C:\Users\Dell\Downloads\cloud
python -c "import sys; print(sys.path)"
```

### Database bağlantı hatası
```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d postgres -c "\l"
```
