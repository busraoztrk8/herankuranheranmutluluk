/**
 * Footer — kapanış sahnesi. Bir önceki bölüm perspektifle geri çekilirken
 * footer arkadan yükselir; sütunlar sırayla belirir.
 */

export function init({ reducedMotion }) {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  // telif yılı her yıl elle güncellenmesin
  const year = footer.querySelector('[data-footer-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  if (reducedMotion) return;

  const prev = footer.previousElementSibling?.lastElementChild;

  // önceki bölüm perspektifle geri çekilir
  if (prev) {
    gsap.fromTo(prev,
      { scale: 1, transformOrigin: 'center bottom' },
      {
        scale: 0.92,
        opacity: 0.65,
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'top 35%',
          scrub: 0.8,
        },
      });
  }

  // sütunlar sırayla yükselir
  gsap.from(footer.querySelectorAll('.footer__col'), {
    opacity: 0,
    y: 34,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: footer.querySelector('.footer__inner'),
      start: 'top 92%',
      toggleActions: 'restart none restart none',
    },
  });

  gsap.from(footer.querySelector('.footer__bottom'), {
    opacity: 0,
    y: 20,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: footer.querySelector('.footer__bottom'),
      start: 'top 97%',
      toggleActions: 'restart none restart none',
    },
  });
}
