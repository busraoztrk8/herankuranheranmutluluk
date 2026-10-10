/**
 * Footer — tek satırlık sade kapanış.
 * 10.10.2026'da sütunlu yapı kaldırıldığı için sütun animasyonu da
 * kalktı; geriye telif yılının kendiliğinden güncellenmesi ve
 * satırın yumuşak girişi kaldı.
 */
export function init({ reducedMotion }) {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  // Telif yılı her yıl elle güncellenmesin
  const year = footer.querySelector('[data-footer-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  if (reducedMotion) return;

  gsap.from(footer.querySelector('.footer__inner'), {
    opacity: 0,
    y: 18,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: footer, start: 'top 92%', toggleActions: 'restart none restart none' },
  });
}
