# SQLTools Connection Timeout Çözümü

## Sorun
"Connection terminated unexpectedly" hatası alıyorsunuz.

## Neden
- Authentication timeout (log'larda görüldü)
- WSL2 network gecikmesi
- SQLTools connection timeout ayarları yetersiz

## Çözümler

### 1. SQLTools Ayarlarını Güncelleme ✅
`.vscode/settings.json` dosyası güncellendi:
- `connectionTimeout`: 60 → 300 saniye
- `requestTimeout`: 60 → 300 saniye
- `pgOptions.connect_timeout`: 30 saniye eklendi

### 2. VS Code'u Yeniden Başlatın
Ayarların uygulanması için VS Code'u kapatıp açın.

### 3. SQLTools Bağlantısını Yeniden Test Edin
1. SQLTools sidebar'ını açın
2. "CloudGuide Database" bağlantısına sağ tıklayın
3. "Test Connection" seçin

### 4. Alternatif: Bağlantıyı Silip Yeniden Ekleyin
Eğer hala çalışmıyorsa:
1. SQLTools'ta bağlantıyı silin
2. "+" butonuna tıklayın
3. "PostgreSQL" seçin
4. Şu bilgileri girin:
   ```
   Connection Name: CloudGuide Database
   Server: localhost
   Port: 5433
   Database: cloudguide_db
   Username: cloudguide_user
   Password: cloudguide_pass
   ```
5. "Advanced Settings" bölümünde:
   - Connection Timeout: 300
   - Request Timeout: 300
6. "Test Connection" yapın

### 5. WSL2 Network Kontrolü
Eğer hala sorun varsa:
```powershell
# WSL2 IP'sini kontrol edin
wsl hostname -I

# Container'ın çalıştığını doğrulayın
wsl docker ps --filter "name=cloudguide"
```

### 6. PostgreSQL Log'larını Kontrol Edin
```powershell
wsl docker logs cloudguide_postgres --tail 50
```

## Test Komutları

### Container Durumu:
```powershell
wsl docker ps --filter "name=cloudguide"
```

### Database Bağlantısı:
```powershell
wsl docker exec cloudguide_postgres psql -U cloudguide_user -d cloudguide_db -c "SELECT 1;"
```

### Port Kontrolü:
```powershell
netstat -an | findstr 5433
```

## Beklenen Sonuç
- Container çalışıyor
- Port 5433 dinleniyor
- Database bağlantısı başarılı
- SQLTools bağlantısı başarılı

## Hala Sorun Varsa
1. Container'ı yeniden başlatın:
   ```powershell
   wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose restart postgres"
   ```

2. VS Code'u tamamen kapatıp açın

3. SQLTools extension'ını yeniden yükleyin
