# PostgreSQL Database Başlatma

PostgreSQL container'ını başlatmak için:

## Windows PowerShell'den (Docker Ubuntu'da kuruluysa):

1. WSL'de Docker'ı başlatın:
```bash
wsl
sudo service docker start
```

2. PostgreSQL container'ını başlatın:
```bash
cd /mnt/c/Users/Dell/Downloads/cloud/backend
docker-compose up -d postgres
```

3. Container'ın çalıştığını kontrol edin:
```bash
docker ps | grep cloudguide_postgres
```

4. Database'in hazır olduğunu kontrol edin:
```bash
docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT 1;"
```

## Alternatif: Manuel PostgreSQL Başlatma

Eğer Docker kullanmıyorsanız, PostgreSQL'i manuel olarak başlatın ve `backend/database/connection.py` dosyasındaki `DATABASE_URL`'i güncelleyin.

## Backend'i Başlatma

Database başladıktan sonra backend'i başlatın:

```bash
cd C:\Users\Dell\Downloads\cloud
python -m backend.app
```

## Sorun Giderme

- **Connection refused**: PostgreSQL container'ı çalışmıyor. Yukarıdaki adımları takip edin.
- **Port 5433 kullanımda**: Başka bir PostgreSQL instance çalışıyor olabilir. Portu değiştirin veya diğer instance'ı durdurun.
- **Database yok**: Container ilk kez başlatılıyorsa, database otomatik oluşturulur. Eğer sorun varsa:
  ```bash
  docker exec cloudguide_postgres psql -U cloudguide_user -d postgres -c "CREATE DATABASE cloudguide_db;"
  ```
