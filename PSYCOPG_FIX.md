# psycopg2-binary Python 3.13 Uyumluluk Sorunu - Çözüm

## Problem

`psycopg2-binary==2.9.9` Python 3.13 ile uyumlu değil. Hata:
```
ImportError: undefined symbol: _PyInterpreterState_Get
```

## Çözüm

`psycopg2-binary` yerine `psycopg` (psycopg3) kullanıldı. Bu:
- Python 3.13 ile tam uyumlu
- Modern ve aktif olarak geliştirilen bir kütüphane
- SQLAlchemy 2.0+ ile uyumlu

## Yapılan Değişiklikler

### 1. requirements.txt
```txt
psycopg[binary]>=3.1.0  # psycopg2-binary yerine
```

### 2. connection.py
Connection string otomatik olarak `postgresql+psycopg://` formatına dönüştürülüyor.

## Notlar

- `psycopg` (psycopg3) SQLAlchemy 2.0+ ile otomatik olarak çalışır
- Connection string formatı: `postgresql+psycopg://user:pass@host/db`
- Neon database ile tam uyumlu
- SSL bağlantıları desteklenir

## Alternatif Çözüm

Eğer hala sorun yaşarsanız, Python 3.11 kullanın:
1. Render Dashboard → Settings → Python Version → 3.11
2. `runtime.txt` dosyasını backend klasöründe tutun: `python-3.11.10`
