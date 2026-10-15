/**
 * Hakkımızda — kaydırmayla tetiklenen yumuşak girişler.
 * Başlık bloğu yükselerek, metin ve davet cümleleri sırayla,
 * portre paneli hafif büyüyerek, canlı yayın bandı ve saat
 * satırları kademeli olarak belirir.
 */

export function init({ reducedMotion }) {
  const section = document.querySelector('.hk');
  if (!section || reducedMotion) return;

  const rise = (targets, vars = {}) => gsap.from(targets, {
    y: 36,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...vars,
  });

  // başlık bloğu: etiket → başlık → turuncu çizgi
  rise(['.hk__eyebrow', '.hk__title', '.hk__rule'], {
    stagger: 0.14,
    scrollTrigger: { trigger: section, start: 'top 72%' },
  });

  // metin paragrafı ve davet cümleleri
  rise(['.hk__metin > p', '.hk__davet'], {
    stagger: 0.18,
    scrollTrigger: { trigger: '.hk__govde', start: 'top 75%' },
  });

  // portre paneli: hafif büyüyerek ve yükselerek
  gsap.from('.hk__gorsel', {
    y: 52,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.hk__govde', start: 'top 75%' },
  });

  // canlı yayın bandı, ardından saat satırları soldan süzülür
  const bandTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: { trigger: '.hk__yayin', start: 'top 82%' },
  });
  bandTl
    .from('.hk__yayin', { y: 48, opacity: 0, duration: 1 })
    .from('.hk__saat', { x: -28, opacity: 0, duration: 0.7, stagger: 0.14 }, '-=0.45');
}
