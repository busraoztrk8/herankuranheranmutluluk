# Her An Kur'an, Her An Mutluluk

Premium, sinematik, tek sayfalık tanıtım sitesi. Saf HTML + CSS + JS —
derleme aracı yok, npm yok. GSAP + ScrollTrigger + Lenis yerel olarak
`js/vendor/` içinde durur; site internet bağlantısı olmadan da çalışır
(yalnızca Google Fonts çevrimiçi yüklenir, çevrimdışıysa serif yedek
yazı tipleri devreye girer).

## Çalıştırma

Site ES modülleri (`<script type="module">`) kullandığı için doğrudan
`index.html` dosyasına çift tıklayıp `file://` ile açmak, tarayıcıların
CORS kuralları nedeniyle JS'in çalışmasını engelleyebilir. Bu yüzden
küçük bir yerel sunucu ile açın:

```bash
cd heran_kuran_heran_mutluluk
python -m http.server 8000
```

Ardından tarayıcıda: <http://localhost:8000>

Alternatifler: `npx serve`, VS Code "Live Server" eklentisi vb.
(`file://` ile açarsanız sayfa yine görünür; yalnızca animasyonlar ve
veriden üretilen galeriler çalışmaz — bu bilinen ve kabul edilen bir
durumdur.)

## Logo

Gerçek logonuzu `assets/logo.png` olarak bırakmanız yeterli — navbar ve
footer'daki logo alanları otomatik olarak onu gösterir. Dosya yoksa
zarif bir "Her An Kur'an" yazı markası (serif) gösterilir.

## Veri (ileride gerçek API'ye geçiş)

- `js/data/instagram.js` — Instagram gönderileri (id, image, type, caption, url)
- `js/data/videos.js` — video öğeleri + kategoriler (id, title, thumbnail, youtubeId, category)
- `js/data/broadcasts.js` — yayın durumu: `'upcoming' | 'live' | 'ended'`,
  sonraki tarih (varsayılan: bir sonraki Cuma 21:00) ve youtubeId.
  `status: 'live'` yaptığınızda sarı, nabız atan "● CANLI" rozeti görünür.

DOM bu dosyalardan JS ile kurulur; ileride gerçek Instagram/YouTube API
yanıtlarını aynı şekle dönüştürmeniz yeterli.

## Yapı

- `index.html` — semantik iskelet (header/nav/main/section/footer)
- `css/base.css` — tasarım değişkenleri (renkler, tipografi ölçeği), reset
- `css/layout.css` — navbar, grain, özel imleç
- `css/sections/*.css` — her bölümün kendi stili
- `js/main.js` — giriş noktası; reduced-motion ve dokunmatik kapıları
- `js/animations/*` — Lenis + GSAP kablolama, imleç, manyetik hover, metin reveal
- `js/sections/*` — her bölüm kendi `init()` fonksiyonunu dışa aktarır

## Erişilebilirlik ve performans

- `prefers-reduced-motion` etkinse tüm pin/parallax/büyük dönüşümler
  kapatılır, içerik doğrudan görünür.
- Özel imleç ve manyetik hover yalnızca masaüstünde (`pointer: fine`).
- Görseller `loading="lazy"`, animasyonlar transform/opacity ile.
