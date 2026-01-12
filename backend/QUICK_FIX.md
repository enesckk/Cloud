# Hızlı Düzeltme: Database Bağlantı Hatası

## Sorun
500 Internal Server Error - Database'e bağlanılamıyor.

## Çözüm

### 1. PostgreSQL Container'ını Başlatın

WSL'de (Ubuntu) çalıştırın:

```bash
# WSL'e girin
wsl

# Docker servisini başlatın
sudo service docker start

# Proje dizinine gidin
cd /mnt/c/Users/Dell/Downloads/cloud/backend

# PostgreSQL container'ını başlatın
docker-compose up -d postgres

# Container'ın çalıştığını kontrol edin
docker ps | grep cloudguide_postgres
```

### 2. Database'in Hazır Olduğunu Kontrol Edin

```bash
# Container içinde PostgreSQL'e bağlanın
docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT 1;"
```

### 3. Backend'i Yeniden Başlatın

Windows PowerShell'de:

```powershell
cd C:\Users\Dell\Downloads\cloud
python -m backend.app
```

### 4. Test Edin

Tarayıcıda `http://localhost:5000/api/health` adresine gidin veya frontend'den login deneyin.

## Sorun Devam Ederse

1. Container loglarını kontrol edin:
   ```bash
   docker logs cloudguide_postgres
   ```

2. Port 5433'ün kullanımda olup olmadığını kontrol edin:
   ```powershell
   netstat -an | findstr 5433
   ```

3. Container'ı yeniden başlatın:
   ```bash
   docker-compose restart postgres
   ```
