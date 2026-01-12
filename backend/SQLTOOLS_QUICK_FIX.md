# SQLTools Hızlı Düzeltme

## Problem: SQLTools Boş Görünüyor

### Çözüm 1: PostgreSQL Driver Yükleyin

1. **Extensions'ı açın** (`Ctrl+Shift+X`)
2. **"SQLTools PostgreSQL"** arayın
3. **"SQLTools PostgreSQL/Redshift"** extension'ını yükleyin
   - Extension ID: `mtxr.sqltools-driver-pg`
4. **VS Code'u yeniden başlatın**

### Çözüm 2: Bağlantı Ekleyin

**Yöntem A: UI ile**
1. SQLTools sidebar'ında **"+"** ikonuna tıklayın
2. **"PostgreSQL"** seçin
3. Bilgileri girin:
   ```
   Name: CloudGuide Database
   Server: localhost
   Port: 5432
   Database: cloudguide_db
   Username: cloudguide_user
   Password: cloudguide_pass
   ```
4. **"Test Connection"** → **"Save Connection"**

**Yöntem B: Settings.json ile (Otomatik)**
1. `backend/.vscode/settings.json` dosyası zaten hazırlandı
2. VS Code'u yeniden başlatın
3. SQLTools sidebar'ını açın
4. Bağlantı otomatik görünecek

### Çözüm 3: Manuel Settings.json Düzenleme

Eğer otomatik çalışmadıysa:

1. `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)"
2. Şunu ekleyin:

```json
{
  "sqltools.connections": [
    {
      "name": "CloudGuide Database",
      "driver": "PostgreSQL",
      "server": "localhost",
      "port": 5432,
      "database": "cloudguide_db",
      "username": "cloudguide_user",
      "password": "cloudguide_pass"
    }
  ]
}
```

3. VS Code'u yeniden başlatın

---

## Kontrol Listesi

- [ ] SQLTools extension yüklü mü? (`mtxr.sqltools`)
- [ ] PostgreSQL driver yüklü mü? (`mtxr.sqltools-driver-pg`)
- [ ] PostgreSQL çalışıyor mu? (port 5432)
- [ ] Database oluşturuldu mu? (`cloudguide_db`)
- [ ] Tablolar oluşturuldu mu? (`users`, `analyses`)

---

## Test

1. SQLTools sidebar'ını açın
2. "CloudGuide Database" bağlantısını genişletin
3. "Tables" klasörünü açın
4. **users** ve **analyses** tablolarını görmelisiniz

Eğer hala boşsa:
- VS Code'u tamamen kapatıp açın
- PostgreSQL'in çalıştığından emin olun
- Database'in var olduğunu kontrol edin
