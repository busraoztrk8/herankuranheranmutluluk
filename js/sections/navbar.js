/**
 * Navbar — scrolled state, dark-section auto theme flip,
 * active-section indicator, mobile menu.
 */

export function init() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const themed = [...document.querySelectorAll('[data-theme]')];

  /* ---------- navbar height as a CSS var (mobile overlay uses it) ---------- */
  const setNavH = () => {
    const h = nav.querySelector('.navbar__inner')?.offsetHeight || 66;
    document.documentElement.style.setProperty('--nav-h', `${Math.round(h)}px`);
  };
  setNavH();
  window.addEventListener('resize', setNavH, { passive: true });

  /* ---------- scrolled state + theme flip ----------
     The theme is resolved geometrically instead of with an
     IntersectionObserver band: we ask which themed section actually sits
     under the navbar's own lower edge. That makes the flip happen exactly
     at the section boundary, with no dark strip lingering over a light
     section (or vice versa). */
  let ticking = false;

  const syncNav = () => {
    ticking = false;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);

    // probe line: just below the navbar bar itself
    const inner = nav.querySelector('.navbar__inner');
    const probe = (inner ? inner.getBoundingClientRect().bottom : 66) - 1;

    let current = null;
    for (const s of themed) {
      const r = s.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) current = s;
    }
    // above the first section (rubber-band / overscroll) → first section's theme
    if (!current) {
      current = themed.find((s) => s.getBoundingClientRect().top > probe) || themed[themed.length - 1];
    }
    nav.classList.toggle('is-dark', current?.dataset.theme === 'dark');
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(syncNav);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  syncNav();

  /* ---------- active link ---------- */
  const links = [...nav.querySelectorAll('.navbar__link')];
  const sectionForLink = new Map();
  links.forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) sectionForLink.set(target, link);
  });

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = sectionForLink.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );
  sectionForLink.forEach((_, section) => activeObserver.observe(section));

  /* ---------- mobile menu ---------- */
  const burger = nav.querySelector('.navbar__burger');
  const mobile = nav.querySelector('.navbar__mobile');
  if (burger && mobile) {
    const setOpen = (open) => {
      document.body.classList.toggle('menu-locked', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');

      if (open) {
        // Panel önce görünür yapılır, sonra bir yeniden akış zorlanır ki
        // tarayıcı satırların başlangıç durumunu (aşağıda, saydam) hesaplasın;
        // ancak ondan sonra sınıf eklenirse geçiş gerçekten oynar.
        // requestAnimationFrame KULLANILMIYOR: sekme arka plandayken
        // çağrılmayabiliyor ve menü hiç açılmıyordu.
        mobile.hidden = false;
        void mobile.offsetHeight;
        nav.classList.add('menu-open');
        // katman, arkasındaki bölümden bağımsız olarak açık tonda
        nav.classList.remove('is-dark');
      } else {
        nav.classList.remove('menu-open');
        // satırlar geri süzülene kadar panel açık kalsın
        const done = () => { if (!nav.classList.contains('menu-open')) mobile.hidden = true; };
        setTimeout(done, 420);
        syncNav();
      }
    };

    burger.addEventListener('click', () => setOpen(!nav.classList.contains('menu-open')));
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('menu-open')) setOpen(false);
    });
  }
}
