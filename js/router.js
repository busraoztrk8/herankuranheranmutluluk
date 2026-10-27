/**
 * router.js — tek sayfa gezinmesi.
 *
 * Bütün bölümler tek sayfada alt alta durur. Menüye tıklanınca sayfa
 * kaymadan ilgili bölüme atlar; bölümün başı, sabit üst şerit + yapışkan menünün
 * hemen altına oturur. Kaydırırken o an bakılan bölümün menüsü işaretlenir.
 */

export function init() {
  const links = [...document.querySelectorAll('.mainnav__link, .navbar__mobile-list a')]
    .filter((l) => (l.getAttribute('href') || '').startsWith('#'));
  if (!links.length) return;

  const hedefOf = (link) => document.querySelector(link.getAttribute('href'));

  // Sabit üst şerit + yapışkan menü yüksekliği: bölüm bunların altına otursun.
  const ustPay = () => {
    const nav = document.querySelector('.navbar__inner');
    const menu = document.querySelector('.mainnav');
    const menuH = menu && getComputedStyle(menu).display !== 'none' ? menu.offsetHeight : 0;
    return (nav ? nav.offsetHeight : 0) + menuH;
  };

  // Kaymadan: bölüme animasyonsuz, doğrudan atlanır.
  const git = (hedef) => {
    const ilk = hedef.id === 'hero';
    const y = Math.max(0, ilk ? 0 : hedef.getBoundingClientRect().top + window.scrollY - ustPay());
    if (window.lenis) window.lenis.scrollTo(y, { immediate: true, force: true });
    // html'de scroll-behavior: smooth tanımlı; açıkça 'instant' denmezse
    // tarayıcı da yumuşak kaydırır ve Lenis'le çakışıp hedefe varamaz.
    window.scrollTo({ top: y, behavior: 'instant' });
  };

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const hedef = hedefOf(link);
      if (!hedef) return;
      e.preventDefault();
      // smoothScroll.js de belge düzeyinde #bağlantıları yakalayıp üst payı
      // hesaba katmadan yumuşak kaydırıyor; menü tıklaması oraya ulaşmasın.
      e.stopPropagation();
      git(hedef);
      isaretle();
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  // Aktif menü: menü çizgisinin altında başlamış SON bölüm işaretlenir.
  const masaustu = links.filter((l) => l.classList.contains('mainnav__link'));
  const isaretle = () => {
    const cizgi = ustPay() + 4;
    let aktif = masaustu[0];
    masaustu.forEach((l) => {
      const h = hedefOf(l);
      if (h && h.getBoundingClientRect().top <= cizgi) aktif = l;
    });
    masaustu.forEach((l) => l.classList.toggle('is-active', l === aktif));
  };

  let bekliyor = false;
  window.addEventListener('scroll', () => {
    if (bekliyor) return;
    bekliyor = true;
    requestAnimationFrame(() => { bekliyor = false; isaretle(); });
  }, { passive: true });
  window.addEventListener('resize', isaretle, { passive: true });
  isaretle();
}
