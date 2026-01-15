# Vercel Otomatik Deploy Sorunu - Çözüm

## Problem

GitHub'a push yaptığınızda Vercel otomatik olarak deploy etmiyor.

## Olası Nedenler ve Çözümler

### 1. Git Repository Bağlantısı Kontrolü

**Kontrol**:
1. Vercel Dashboard → Project → Settings → **Git**
2. Repository bağlantısının olduğunu kontrol edin

**Çözüm**:
- Eğer repository bağlı değilse:
  1. **Connect Git Repository** butonuna tıklayın
  2. GitHub/GitLab/Bitbucket hesabınızı bağlayın
  3. Repository'nizi seçin
  4. **Connect** butonuna tıklayın

### 2. Auto-Deploy Ayarları

**Kontrol**:
1. Vercel Dashboard → Project → Settings → **Git**
2. **Production Branch** ayarını kontrol edin
3. **Auto-Deploy** seçeneğinin açık olduğundan emin olun

**Çözüm**:
- **Production Branch**: `main` veya `master` olmalı (push yaptığınız branch)
- **Auto-Deploy**: Açık olmalı (enabled)

### 3. Branch Ayarları

**Kontrol**:
1. Vercel Dashboard → Project → Settings → **Git**
2. **Production Branch** hangi branch'i gösteriyor?

**Çözüm**:
- Push yaptığınız branch ile Production Branch aynı olmalı
- Örnek: Eğer `main` branch'ine push yapıyorsanız, Production Branch `main` olmalı

### 4. Vercel CLI ile Manuel Deploy

Eğer Git entegrasyonu çalışmıyorsa, manuel deploy yapabilirsiniz:

```bash
# Vercel CLI yükle
npm i -g vercel

# Projeyi bağla
vercel link

# Production'a deploy et
vercel --prod
```

### 5. Webhook Kontrolü

**Kontrol**:
1. GitHub → Repository → Settings → **Webhooks**
2. Vercel webhook'unun olduğunu kontrol edin

**Çözüm**:
- Eğer webhook yoksa, Vercel'de repository'yi yeniden bağlayın
- Vercel otomatik olarak webhook oluşturur

### 6. Build Ayarları Hatası

**Kontrol**:
1. Vercel Dashboard → Project → **Deployments**
2. Son deployment'ı kontrol edin
3. Build loglarını inceleyin

**Çözüm**:
- Build hatası varsa, logları kontrol edin
- `next.config.mjs` dosyasını kontrol edin
- Dependencies'lerin doğru yüklendiğinden emin olun

### 7. Vercel Projesi Manuel Oluşturulmuş Olabilir

**Kontrol**:
1. Vercel Dashboard → Project → Settings → **General**
2. Projenin nasıl oluşturulduğunu kontrol edin

**Çözüm**:
- Eğer proje manuel oluşturulduysa (drag & drop), Git entegrasyonu yoktur
- Yeni bir proje oluşturun ve Git repository'den import edin

## Adım Adım Çözüm

### Yöntem 1: Git Repository'yi Yeniden Bağlama

1. Vercel Dashboard → Project → Settings → **Git**
2. **Disconnect** butonuna tıklayın (eğer bağlıysa)
3. **Connect Git Repository** butonuna tıklayın
4. Repository'nizi seçin ve bağlayın
5. **Production Branch** olarak `main` seçin
6. **Auto-Deploy** seçeneğinin açık olduğundan emin olun

### Yöntem 2: Yeni Proje Oluşturma

1. Vercel Dashboard → **Add New Project**
2. Git repository'nizi seçin
3. **Import** butonuna tıklayın
4. Ayarları kontrol edin:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build` (otomatik)
   - **Output Directory**: `.next` (otomatik)
5. **Deploy** butonuna tıklayın

### Yöntem 3: Manuel Deploy (Geçici Çözüm)

```bash
# Vercel CLI ile
vercel --prod

# veya GitHub Actions kullanarak
# .github/workflows/deploy.yml dosyası oluşturun
```

## Kontrol Listesi

- [ ] Git repository Vercel'e bağlı mı?
- [ ] Production Branch doğru mu? (`main` veya `master`)
- [ ] Auto-Deploy açık mı?
- [ ] Son push başarılı mı? (GitHub'da kontrol edin)
- [ ] Vercel Dashboard'da yeni deployment görünüyor mu?
- [ ] Build hatası var mı? (Deployments sekmesinde kontrol edin)

## Test

1. Küçük bir değişiklik yapın (örn: README'ye bir satır ekleyin)
2. Commit ve push yapın:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push
   ```
3. Vercel Dashboard → **Deployments** sekmesine gidin
4. Yeni bir deployment başlamalı (birkaç saniye içinde)

## Sorun Devam Ederse

1. **Vercel Logs Kontrolü**:
   - Vercel Dashboard → Project → **Deployments**
   - Son deployment'ın loglarını kontrol edin

2. **GitHub Webhook Kontrolü**:
   - GitHub → Repository → Settings → **Webhooks**
   - Vercel webhook'unun aktif olduğunu kontrol edin

3. **Vercel Support**:
   - Vercel Dashboard → Help → **Contact Support**
   - Sorununuzu bildirin

## Önemli Notlar

- Vercel sadece **Production Branch**'e yapılan push'larda otomatik deploy yapar
- Preview deployments için pull request'lerde otomatik deploy yapılır
- Build hatası varsa, otomatik deploy başarısız olur ama yine de tetiklenir
