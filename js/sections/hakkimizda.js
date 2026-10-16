/** Hakkımızda — referans afişteki blokları sırayla görünür kılar. */

export function init({ reducedMotion }) {
  const section = document.querySelector('.hk');
  if (!section || reducedMotion) return;

  const intro = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 74%',
      toggleActions: 'play none none reverse',
    },
  });

  intro
    .from('.hk__eyebrow', { x: -42, opacity: 0, duration: 0.75 })
    .from('.hk__eyebrow span', { scaleX: 0, transformOrigin: 'left', duration: 0.6 }, '-=0.45')
    .from('.hk__metin > p', {
      x: 48,
      opacity: 0,
      duration: 0.85,
      stagger: 0.14,
    }, '-=0.75')
    .from('.hk__davet', {
      y: 28,
      scale: 0.97,
      opacity: 0,
      filter: 'blur(5px)',
      duration: 1,
    }, '-=0.45')
    .from('.hk__tirnak', {
      scale: 0.4,
      rotation: -12,
      opacity: 0,
      duration: 0.65,
      stagger: 0.12,
    }, '-=0.75');

  // Başlık satırları yalnızca kullanıcı Hakkımızda bölümüne kaydırınca
  // sağdan sırayla gelir. Bölümden çıkıp geri dönüldüğünde tekrar oynar.
  gsap.fromTo('.hk__title-line',
    {
      x: 120,
      autoAlpha: 0,
      skewX: -8,
      filter: 'blur(8px)',
    },
    {
      x: 0,
      autoAlpha: 1,
      skewX: 0,
      filter: 'blur(0px)',
      duration: 0.95,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hk__title',
        start: 'top 88%',
        toggleActions: 'restart none restart reverse',
      },
    }
  );

  const bandTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: { trigger: '.hk__yayin', start: 'top 82%' },
  });
  bandTl
    .from('.hk__yayin', { y: 44, opacity: 0, scale: 0.985, duration: 0.9 })
    .from(['.hk__canli', '.hk__takvim-baslik', '.hk__saat'], {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
    }, '-=0.45');
}
