# SQLTools Bağlantı Kurulumu

## SQLTools ile PostgreSQL Bağlantısı Ekleme

### Adım 1: SQLTools Sidebar'ı Açın
1. VS Code'un sol tarafında **SQLTools** ikonuna tıklayın (database simgesi)
2. Veya `Ctrl+Shift+P` → "SQLTools: Focus on SQLTools Activity Bar"

### Adım 2: Yeni Bağlantı Ekleme
1. SQLTools sidebar'ında **"Add New Connection"** butonuna tıklayın
2. Veya `Ctrl+Shift+P` → "SQLTools: Add New Connection"

### Adım 3: PostgreSQL Driver Seçin
1. Açılan listeden **"PostgreSQL"** seçin
2. Eğer PostgreSQL driver yüklü değilse, otomatik olarak yükleme önerisi çıkacak

### Adım 4: Bağlantı Bilgilerini Girin
Açılan formda şu bilgileri girin:

```
Connection Name: CloudGuide Database
Server: localhost
Port: 5432
Database: cloudguide_db
Username: cloudguide_user
Password: cloudguide_pass
```

**Önemli:** 
- "Save Password" seçeneğini işaretleyin
- "Test Connection" butonuna tıklayarak bağlantıyı test edin

### Adım 5: Bağlantıyı Kaydedin
1. "Test Connection" başarılı olursa
2. "Save Connection" butonuna tıklayın
3. Artık SQLTools sidebar'ında "CloudGuide Database" bağlantısını göreceksiniz

---

## Hızlı Yöntem: Settings.json ile

Eğer manuel eklemek istemiyorsanız, `backend/.vscode/settings.json` dosyası zaten hazırlandı.

1. VS Code'u yeniden başlatın
2. SQLTools sidebar'ını açın
3. Bağlantı otomatik olarak görünecek

---

## Bağlantıyı Kullanma

### Tabloları Görüntüleme
1. SQLTools sidebar'ında **"CloudGuide Database"** bağlantısını genişletin
2. **"Tables"** klasörünü açın
3. **users** ve **analyses** tablolarını göreceksiniz

### Tablo Verilerini Görüntüleme
1. Tabloya sağ tıklayın
2. **"Show Table Records"** seçin
3. Veya tabloyu çift tıklayın

### SQL Sorgusu Çalıştırma
1. `Ctrl+Shift+P` → "SQLTools: New Query"
2. SQL sorgunuzu yazın
3. `Ctrl+E` veya "Run Query" butonuna tıklayın

---

## Sorun Giderme

### PostgreSQL Driver Yüklü Değil
1. Extensions'a gidin (`Ctrl+Shift+X`)
2. "SQLTools PostgreSQL" arayın
3. **"SQLTools PostgreSQL/Redshift"** extension'ını yükleyin
4. VS Code'u yeniden başlatın

### Bağlantı Test Edilemiyor
1. PostgreSQL'in çalıştığından emin olun:
   ```bash
   # Docker kullanıyorsanız
   docker-compose ps
   
   # Veya local PostgreSQL
   # Servislerin çalıştığını kontrol edin
   ```

2. Port 5432'nin açık olduğundan emin olun

3. Kullanıcı adı ve şifrenin doğru olduğunu kontrol edin

### Tablolar Görünmüyor
1. Database'in doğru seçildiğinden emin olun (`cloudguide_db`)
2. Tabloların oluşturulduğundan emin olun:
   ```bash
   cd backend
   python -m backend.database.migrations.init_db
   ```

---

## Örnek SQL Sorguları

SQLTools'ta yeni bir query açıp şunları deneyin:

```sql
-- Tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Users tablosunu görüntüle
SELECT * FROM users;

-- Analyses tablosunu görüntüle
SELECT * FROM analyses;
```

---

## Faydalı Kısayollar

- `Ctrl+Shift+P` → "SQLTools: New Query" - Yeni sorgu aç
- `Ctrl+E` - Sorguyu çalıştır
- `Ctrl+Shift+E` - Sorguyu formatla
- Tabloya sağ tık → "Show Table Records" - Tablo verilerini göster
