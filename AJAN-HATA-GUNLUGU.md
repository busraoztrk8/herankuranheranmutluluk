# Ajan Hata Günlüğü

> Bu dosya 2026-10-27 tarihinde kullanıcı düzeyindeki bir kancayla
> (`~/.claude/hooks/hata-gunlugu.mjs`) kendiliğinden açıldı. Kullanıcı isteği:
> *"bizim yaptığımız hatalardan hemen not alsın; bir proje oluşurken md
> dosyası olmak zorunda."*

Bu dosya **ajanın bu projede yaptığı gerçek hataları** tutar. Başarıları değil,
yalnızca hataları: ne yapıldı, neden yanlıştı, nasıl anlaşıldı, bir daha
olmaması için ne değişti.

## Nasıl işliyor

- Ajan bir hata fark ettiği anda (kullanıcı düzeltir, test kırılır, ölçüm
  yanlış çıkar) **aynı turda** buraya bir giriş ekler — en yeni en üstte.
- Genellenebilir ders ayrıca `~/.claude/AJAN-DERSLERI.md` dosyasına yazılır;
  o dosya **bütün projelerde** her oturumun başında okunur.
- Oturum açılışında bu dosyanın dersleri ajana kendiliğinden gösterilir.
- "Dikkatli olunacak" bir önlem değildir; önlem bir bekçi testi, bir kontrol
  ya da bir kuraldır.

### Giriş biçimi

```
## YYYY-AA-GG · Kısa başlık

**Ne yapıldı:** …
**Neden yanlış:** …
**Nasıl anlaşıldı:** …
**Önlem:** …
```

---

## 2026-10-27 · Sekme router'ı menü linklerini de "sayfa" sanıp gizledi

**Ne yapıldı:** router.js sayfaları `querySelectorAll('[data-page]').filter(el => el.closest('main'))` ile topladı; menü linklerine de `data-page` verilmişti.
**Neden yanlış:** Menü (`.mainnav`) `<main>` içinde duruyor; filtre linkleri dışlamadı. Router aktif olmayan "sayfaları" `hidden` yapınca 4 menü linkinden 3'ü gizlendi — yalnız "Ana Sayfa" kaldı, diğer sayfalara ulaşılamadı. Testte yalnız aktif sekmenin bölümünü ölçtüm, menünün bütün linklerinin görünür kaldığını hiç kontrol etmedim; ilk ekran görüntüsünde de tek link görünüyordu ama fark etmedim.
**Nasıl anlaşıldı:** Kullanıcı "menüler ve sayfalar nereye kayboldu" dedi. Canlıda link `display:none` çıktı; eşleşen kural `[hidden]` idi.
**Önlem:** Seçim `section[data-page]` ile sınırlandı. Aynı attribute'u hem içerik hem gezinme öğesine veren bir düzende seçici öğe türüyle daraltılır. Sekme/görünürlük değiştiren her değişiklikten sonra BÜTÜN gezinme öğelerinin görünürlüğü her sekmede ölçülür (yalnız açılan bölüm değil).

---

## 2026-10-27 · Sticky menü, overflow-x:hidden yüzünden titriyordu

**Ne yapıldı:** Menü (.mainnav) `position: sticky; top: var(--nav-h)` yapıldı; ama `body { overflow-x: hidden }` duruyordu.
**Neden yanlış:** Bir eksende `overflow: hidden` vermek, tarayıcıda o elemanı scroll konteynerine çevirir (diğer eksen `visible` değil `auto` gibi davranır). Sticky öğe artık viewport'a değil bu konteynere göre hesaplanınca, özellikle Lenis smooth-scroll ile ilk sticky geçişinde titriyor / yerine oturmuyordu. Önceki turda menüyü sticky yaparken bu etkiyi gözden kaçırdım.
**Nasıl anlaşıldı:** Kullanıcı "ilk aşağı kaydırınca menü saçma şekilde titreyip yukarı yerleşmiyor" dedi. Overflow kuralları tarandı; `base.css`'te body `overflow-x: hidden` bulundu.
**Önlem:** Yatay taşmayı kesmek için `overflow-x: clip` kullan (scroll konteyneri OLUŞTURMAZ, sticky bozulmaz). Bir sayfada sticky varsa, atalarında `overflow: hidden/auto/scroll` olup olmadığı ÖNCE kontrol edilir; taşma kesmesi gerekiyorsa `clip` tercih edilir.

---

## Tekrar eden desen

Henüz giriş yok. Aynı kökten iki hata görüldüğünde buraya bir satır eklenir.
