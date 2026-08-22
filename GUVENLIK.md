# Yayına Alma — Güvenlik Notları

Site tamamen **statik**: veritabanı, form, kullanıcı girişi, sunucu kodu yok.
Bu, saldırı yüzeyini büyük ölçüde daraltıyor. Aşağıdakiler yapıldıktan sonra
canlıya alınabilir.

---

## 1. Yapılması zorunlu

### SSL sertifikası (HTTPS)
Sitenin `https://` ile açılması şart. Çoğu hosting panelinde ücretsiz
**Let's Encrypt** sertifikası tek tıkla kurulur. Kurduktan sonra:

- `http://` adresini `https://`'e yönlendirin.
- `.htaccess` dosyasındaki `Strict-Transport-Security` satırının başındaki
  `#` işaretini kaldırın. **Sertifika kurulmadan açmayın**, site erişilemez hâle gelir.

### Güvenlik başlıkları
Kök dizine `.htaccess` dosyası hazırlandı (Apache / cPanel / Plesk).
Başka bir sunucu kullanıyorsanız aşağıdaki karşılıklarını kullanın.

---

## 2. Sunucuya göre yapılandırma

### Netlify — `_headers` dosyası (kök dizine)
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://i.ytimg.com https://*.cdninstagram.com https://*.fbcdn.net; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.instagram.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'
```

### Vercel — `vercel.json` (kök dizine)
```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=()" },
      { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
    ]
  }]
}
```

### Nginx — sunucu bloğuna
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
autoindex off;
location ~ /\. { deny all; }
```

---

## 3. Yüklemeden önce kontrol listesi

- [ ] SSL sertifikası kuruldu, `https://` çalışıyor
- [ ] `.htaccess` (veya sunucu karşılığı) yüklendi
- [ ] `Strict-Transport-Security` satırı açıldı
- [ ] Dizin listeleme kapalı — `siteadi.com/assets/` adresi dosya listesi göstermemeli
- [ ] `GUVENLIK.md` ve `README.md` sunucuya **yüklenmedi** (yalnızca kendi bilgisayarınızda dursun)
- [ ] Footer'daki "Gizlilik Politikası" ve "Kullanım Koşulları" bağlantıları
      gerçek sayfalara yönlendiriliyor (şu an `#` ile boş)

---

## 4. Bilinçli kararlar

**Telefon numarası herkese açık.** `+90 543 460 04 60` numarası sitede ve
kaynak kodunda görünür durumda — iletişim numarası olduğu için bu istenen
davranış. Spam aramalar rahatsız ederse ayrı bir iş hattı düşünülebilir.

**Dış gömüler.** YouTube ve Instagram içerikleri kendi sunucularından
yükleniyor. Bu servislerin kendi izleme çerezleri vardır; YouTube tarafında
`youtube-nocookie.com` kullanıldığı için ziyaretçi videoyu oynatmadıkça çerez
bırakılmaz. Instagram gömüleri için böyle bir seçenek yok.

**KVKK / çerez bildirimi.** Site kendi çerezini kullanmıyor, ancak Instagram
gömüleri üçüncü taraf çerezi bırakabilir. Türkiye'de yayın yapan bir site için
kısa bir gizlilik metni ve çerez bilgilendirmesi eklenmesi tavsiye edilir.

---

## 5. Kodda düzeltilen açık

`js/sections/videos.js` dosyasında video başlıkları HTML'e **kaçış
yapılmadan** gömülüyordu. Başlıklar bugün elle yazıldığı için canlı bir risk
değildi; ancak ileride YouTube API'sinden başlık çekilirse, başlığı
değiştirilebilen bir video üzerinden sayfaya kod enjekte edilebilirdi
(XSS). Kaçış eklendi.

**Kural:** Dışarıdan gelen hiçbir metin (API, kullanıcı, URL parametresi)
`innerHTML` ile doğrudan sayfaya yazılmamalı; ya `textContent` kullanın ya da
`escapeHtml()` yardımcısından geçirin.
