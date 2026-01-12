# Admin Giriş Bilgileri

## Admin Kullanıcı

**Email:** `admin@cloudguide.com`  
**Şifre:** `admin123`  
**İsim:** Admin User  
**Unvan:** System Administrator  
**Admin:** ✅ True

---

## Giriş Yapma

1. Tarayıcıda uygulamayı açın: `http://localhost:3000`
2. Login sayfasına gidin: `/login`
3. Şu bilgileri girin:
   - **Email:** `admin@cloudguide.com`
   - **Şifre:** `admin123`
4. "Sign In" butonuna tıklayın

---

## Admin Paneline Erişim

Giriş yaptıktan sonra:
1. Sidebar'da **"Admin Panel"** linki görünecek (Shield ikonu)
2. Veya direkt `/dashboard/admin` adresine gidin

---

## Admin Panel Özellikleri

### 1. Kullanıcı Yönetimi
- Tüm kullanıcıları görüntüleme
- Yeni kullanıcı oluşturma
- Kullanıcı düzenleme (email, name, title, admin yetkisi)
- Kullanıcı silme

### 2. Eğitim Kaynakları Yönetimi
- Tüm eğitim içeriklerini görüntüleme
- Yeni içerik ekleme (article, video, guide, case-study)
- İçerik düzenleme
- İçerik silme

### 3. Sağlayıcı Yönetimi
- Tüm cloud sağlayıcılarını görüntüleme
- Yeni sağlayıcı ekleme
- Sağlayıcı düzenleme (pricing, regions, vb.)
- Sağlayıcı silme

---

## Yeni Admin Kullanıcı Oluşturma

### Yöntem 1: Script ile
```powershell
cd C:\Users\Dell\Downloads\cloud
python backend/scripts/create_admin.py email@example.com password123 "User Name" "Title"
```

### Yöntem 2: SQL ile
```sql
-- Mevcut kullanıcıyı admin yap
UPDATE users SET is_admin = true WHERE email = 'user@example.com';

-- Veya yeni admin kullanıcı oluştur (şifre hash'lenmeli)
-- Önce normal kayıt yapın, sonra admin yapın
```

### Yöntem 3: Admin Panelden
1. Admin panel → Users tab
2. "Add User" butonuna tıklayın
3. Bilgileri girin ve "Admin User" checkbox'ını işaretleyin

---

## Güvenlik Notları

⚠️ **Production ortamında:**
- Şifreyi mutlaka değiştirin
- Güçlü bir şifre kullanın
- Admin kullanıcı sayısını sınırlayın
- Düzenli olarak log'ları kontrol edin

---

## Sorun Giderme

### Admin paneli görünmüyor
- Kullanıcının `is_admin = true` olduğundan emin olun
- Sayfayı yenileyin (F5)
- Logout yapıp tekrar giriş yapın

### Giriş yapamıyorum
- Email ve şifrenin doğru olduğundan emin olun
- Backend'in çalıştığından emin olun (`http://localhost:5000`)
- Database bağlantısını kontrol edin

### Admin yetkisi yok hatası
- Database'de kullanıcının `is_admin` kolonunu kontrol edin:
  ```sql
  SELECT email, is_admin FROM users WHERE email = 'your@email.com';
  ```
