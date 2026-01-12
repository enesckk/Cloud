# WSL2 ve Docker Kurulum Notları

## Port Yapılandırması

CloudGuide projesi **port 5433** kullanıyor (5432 başka bir proje tarafından kullanılıyor).

### Docker Compose
- PostgreSQL container: `cloudguide_postgres`
- Port mapping: `5433:5432` (host:container)
- Database: `cloudguide_db`
- User: `cloudguide_user`
- Password: `cloudguide_pass`

### SQLTools Bağlantı Ayarları
- Server: `localhost`
- Port: `5433` (Windows'tan bağlanırken)
- Database: `cloudguide_db`
- Username: `cloudguide_user`
- Password: `cloudguide_pass`

---

## Container'ı Başlatma

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

## Container Durumunu Kontrol Etme

```bash
# WSL2'den
cd /mnt/c/Users/Dell/Downloads/cloud/backend
docker compose ps

# Veya
docker ps | grep cloudguide
```

---

## Database ve Tabloları Oluşturma

```bash
cd /mnt/c/Users/Dell/Downloads/cloud/backend
python -m backend.database.migrations.init_db
```

Veya Docker container içinden:
```bash
docker compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\dt"
```

---

## SQLTools'tan Bağlanma

1. SQLTools sidebar'ını açın
2. "CloudGuide Database" bağlantısını seçin
3. **Port: 5433** olduğundan emin olun
4. "Test Connection" yapın

Eğer bağlantı yoksa:
1. "+" butonuna tıklayın
2. "PostgreSQL" seçin
3. Port'u **5433** olarak ayarlayın
4. Diğer bilgileri girin ve kaydedin

---

## Sorun Giderme

### Port 5433 Kullanılamıyor
```bash
# Port'u kontrol edin
netstat -an | grep 5433

# Container'ı yeniden başlatın
docker compose restart postgres
```

### Database Bulunamıyor
```bash
# Database'i oluşturun
docker compose exec postgres psql -U cloudguide_user -d postgres -c "CREATE DATABASE cloudguide_db;"
```

### Tablolar Görünmüyor
```bash
# Tabloları oluşturun
cd backend
python -m backend.database.migrations.init_db
```

---

## Notlar

- WSL2'de Docker çalışıyor
- Windows'tan `localhost:5433` ile bağlanabilirsiniz
- Container'lar WSL2 içinde çalışıyor
- Port forwarding otomatik olarak yapılıyor
