# SQLTools Bağlantı Hatası Düzeltme

## Hata: `Error opening connection Error, {"code":-32001}`

Bu hata genellikle PostgreSQL'e bağlanılamadığında oluşur.

---

## Adım 1: PostgreSQL'in Çalıştığını Kontrol Edin

### Docker Kullanıyorsanız:
```bash
# Terminal'de çalıştırın:
cd backend
docker-compose ps

# Veya
docker ps
```

PostgreSQL container'ı çalışmıyorsa:
```bash
cd backend
docker-compose up -d postgres
```

### Local PostgreSQL Kullanıyorsanız:
Windows Services'te PostgreSQL servisinin çalıştığını kontrol edin:
1. `Win + R` → `services.msc`
2. "postgresql" servisini bulun
3. Durumu "Running" olmalı

---

## Adım 2: Port 5432'nin Açık Olduğunu Kontrol Edin

PowerShell'de:
```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

Eğer "TcpTestSucceeded : False" dönerse, PostgreSQL çalışmıyor demektir.

---

## Adım 3: Bağlantı Bilgilerini Doğrulayın

SQLTools'ta bağlantıyı düzenleyin:

1. SQLTools sidebar'ında **"CloudGuide Database"** bağlantısına sağ tıklayın
2. **"Edit Connection"** seçin
3. Şu bilgileri kontrol edin:

```
Connection Name: CloudGuide Database
Server: localhost
Port: 5432
Database: cloudguide_db
Username: cloudguide_user
Password: cloudguide_pass
```

**Önemli:** 
- "Save Password" işaretli olmalı
- Port 5432 olmalı (eğer farklı bir port kullanıyorsanız değiştirin)

---

## Adım 4: Database'in Var Olduğunu Kontrol Edin

Eğer Docker kullanıyorsanız:
```bash
cd backend
docker-compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\l"
```

Eğer database yoksa:
```bash
cd backend
docker-compose exec postgres psql -U cloudguide_user -d postgres -c "CREATE DATABASE cloudguide_db;"
```

---

## Adım 5: Test Bağlantısı

SQLTools'ta:
1. Bağlantıya sağ tıklayın
2. **"Test Connection"** seçin
3. Hata mesajını okuyun

### Yaygın Hata Mesajları:

**"Connection refused"**
- PostgreSQL çalışmıyor
- Port 5432 kapalı

**"Authentication failed"**
- Kullanıcı adı veya şifre yanlış
- `pg_hba.conf` ayarları yanlış

**"Database does not exist"**
- `cloudguide_db` database'i oluşturulmamış

**"Connection timeout"**
- PostgreSQL çalışmıyor
- Firewall port 5432'yi engelliyor

---

## Adım 6: Alternatif Bağlantı Yöntemi

Eğer hala çalışmıyorsa, bağlantıyı silip yeniden ekleyin:

1. SQLTools sidebar'ında bağlantıya sağ tıklayın
2. **"Delete Connection"** seçin
3. **"+"** butonuna tıklayın
4. **"PostgreSQL"** seçin
5. Bilgileri tekrar girin ve **"Test Connection"** yapın

---

## Adım 7: SQLTools Log'larını Kontrol Edin

1. `Ctrl+Shift+P` → "SQLTools: Show Output Channel"
2. Hata mesajlarını okuyun
3. Detaylı hata bilgisi göreceksiniz

---

## Hızlı Çözüm: Docker Compose'u Başlatın

Eğer Docker kullanıyorsanız ve container'lar çalışmıyorsa:

```bash
cd backend
docker-compose up -d
```

Bu komut:
- PostgreSQL container'ını başlatır
- Database'i oluşturur (eğer yoksa)
- Port 5432'yi açar

Ardından SQLTools'ta bağlantıyı tekrar deneyin.

---

## Manuel Database Oluşturma

Eğer database yoksa:

```bash
# Docker ile
docker-compose exec postgres psql -U cloudguide_user -d postgres -c "CREATE DATABASE cloudguide_db;"

# Local PostgreSQL ile
psql -U cloudguide_user -d postgres -c "CREATE DATABASE cloudguide_db;"
```

---

## Tabloları Oluşturma

Database oluşturulduktan sonra tabloları oluşturun:

```bash
cd backend
python -m backend.database.migrations.init_db
```

---

## Test

Bağlantı başarılı olduktan sonra:

1. SQLTools sidebar'ında "CloudGuide Database" bağlantısını genişletin
2. "Tables" klasörünü açın
3. **users** ve **analyses** tablolarını görmelisiniz
