/**
 * router.js — menüyü sekme (SPA) gibi çalıştırır.
 *
 * Üst şerit + afiş + menü her zaman sabit kalır; afişin altındaki
 * içerik (data-page'li bölümler) tıklanan menüye göre değişir.
 * Sayfa "kaymadan" değişir: scroll anında en üste (afişe) alınır.
 *
 * Sayfalar data-page attribute'undan otomatik toplanır:
 *   anasayfa · hakkimizda · videolar · pazar-sohbeti
 */

export function init() {
  // Yalnızca içerik BÖLÜMLERİ sayfadır. Menü (.mainnav) de <main>
  // içinde durduğu için "[data-page]" menü linklerini de yakalardı;
  // bu yüzden seçim section ile sınırlı tutulur.
  const pages = [...document.querySelectorAll('section[data-page]')];
  if (!pages.length) return;

  const links = [...document.querySelectorAll('.mainnav__link[data-page], .navbar__mobile-list a[data-page]')];

  // Hangi sayfa anahtarları var?
  const keys = [...new Set(pages.map((p) => p.dataset.page))];

  const göster = (key, { scrollReset = true } = {}) => {
    if (!keys.includes(key)) key = keys[0];

    // İçerik bölümlerini aç/kapat
    pages.forEach((p) => { p.hidden = (p.dataset.page !== key); });

    // Menü linklerini işaretle (masaüstü + mobil)
    links.forEach((l) => {
      const aktif = l.dataset.page === key;
      l.classList.toggle('is-active', aktif);
      if (aktif) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });

    // URL'yi güncelle (geri/ileri tuşu çalışsın), sayfa zıplamadan
    if (history.replaceState) {
      history.replaceState({ page: key }, '', `#${key}`);
    }

    // "Kaymadan": afiş görünür olacak şekilde anında en üste al
    const enÜste = () => {
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };
    if (scrollReset) enÜste();

    // Yeni görünen bölümler gizliyken 0 ölçülmüş olabilir: yeniden ölç.
    // refresh/resize scroll'u itebildiği için en üste almayı SONRA tekrarla.
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();

      // Scroll-reveal animasyonları: gizliyken tetiklenmemiş olabilir —
      // görünür bölümde saydam kalan öğeler garanti görünür yapılır.
      pages.filter((p) => !p.hidden).forEach((p) => {
        p.querySelectorAll('[style*="opacity"]').forEach((el) => {
          if (parseFloat(el.style.opacity) < 0.01) el.style.opacity = '';
        });
      });

      if (scrollReset) enÜste();
    });
  };

  // Menü tıklamaları — sayfa içi kaymak yerine sekme değiştir
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      göster(link.dataset.page);
    });
  });

  // Geri/ileri tuşu
  window.addEventListener('popstate', () => {
    const key = (location.hash || '').replace('#', '');
    göster(keys.includes(key) ? key : keys[0], { scrollReset: false });
  });

  // İlk açılış: adres çubuğundaki hash varsa onu, yoksa anasayfayı göster.
  const ilk = (location.hash || '').replace('#', '');
  göster(keys.includes(ilk) ? ilk : 'anasayfa', { scrollReset: false });
}
