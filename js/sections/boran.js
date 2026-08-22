/**
 * Abdulcabbar Boran — the strongest editorial scene.
 * Pinned: giant name typography; portrait reveals through it via
 * clip-path; side annotations slide in. Chapters activate as huge
 * editorial numbers along a scroll spine.
 */
import { splitChars } from '../animations/textReveal.js';

export function init({ reducedMotion }) {
  const section = document.querySelector('.boran');
  if (!section) return;

  if (reducedMotion) {
    // fully visible, static
    const portrait = section.querySelector('.boran__portrait');
    if (portrait) portrait.style.clipPath = 'inset(0% 0% 0% 0%)';
    section.querySelectorAll('.boran__mot').forEach((m) => {
      m.style.opacity = '1';
      m.style.transform = 'none';
    });
    section.querySelectorAll('.boran__chapter').forEach((c) => c.classList.add('is-active'));
    return;
  }

  const rows = section.querySelectorAll('[data-split]');
  const charsTop = splitChars(rows[0]);
  const charsBottom = splitChars(rows[1]);

  // entrance of the name
  gsap.from([...charsTop, ...charsBottom], {
    yPercent: 112,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.035,
    scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'restart none restart none' },
  });

  // ---- açılış ----
  // Sabitleme (pin) KALDIRILDI. Önceden bölüm ekrana kilitleniyor ve
  // portre ancak ~2 ekran boyu kaydırdıktan sonra tamamlanıyordu; siteye
  // ilk kez giren biri hiçbir şey olmuyor sanıp geçiyordu. Şimdi bölüm
  // görüş alanına girdiği anda yazı ve fotoğraf birlikte açılıyor.
  const pin = section.querySelector('.boran__pin');
  const portrait = section.querySelector('.boran__portrait');
  const mots = section.querySelectorAll('.boran__mot');

  gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: 'top 74%',
      toggleActions: 'restart none restart none',
    },
    defaults: { ease: 'power3.out' },
  })
    .to(portrait, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15 }, 0)
    .to(portrait.querySelector('img'), { scale: 1, duration: 1.4 }, 0)
    .to(mots, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.35)
    .from('.boran__deco', { scaleY: 0, transformOrigin: 'top', duration: 0.9 }, 0.1);

  // ---- lead line ----
  const lead = section.querySelector('.boran__lead');
  if (lead) {
    gsap.from(lead, {
      opacity: 0, y: 34, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: lead, start: 'top 82%', toggleActions: 'restart none restart none' },
    });
  }

  // ---- chapters activate along the spine ----
  section.querySelectorAll('.boran__chapter').forEach((chapter) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 62%',
      end: 'bottom 38%',
      onToggle: (self) => chapter.classList.toggle('is-active', self.isActive),
    });

    gsap.from(chapter.querySelector('.boran__chapter-body'), {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: chapter, start: 'top 78%', toggleActions: 'restart none restart none' },
    });

    gsap.from(chapter.querySelector('.boran__num'), {
      xPercent: -18,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: chapter, start: 'top 80%', toggleActions: 'restart none restart none' },
    });
  });
}
