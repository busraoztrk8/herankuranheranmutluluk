/**
 * Custom cursor — desktop (pointer: fine) only.
 * Contextual labels come from [data-cursor] attributes;
 * a faint purple halo activates over dark sections.
 */

export function initCursor({ isTouch, reducedMotion }) {
  if (isTouch || !window.matchMedia('(pointer: fine)').matches) return;

  const el = document.querySelector('.cursor');
  if (!el || typeof gsap === 'undefined') return;

  document.documentElement.classList.add('has-cursor');
  const labelEl = el.querySelector('.cursor__label');

  const setX = gsap.quickTo(el, 'x', { duration: reducedMotion ? 0 : 0.35, ease: 'power3.out' });
  const setY = gsap.quickTo(el, 'y', { duration: reducedMotion ? 0 : 0.35, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    setX(e.clientX);
    setY(e.clientY);

    // label context
    const hit = e.target.closest('[data-cursor]');
    if (hit) {
      labelEl.textContent = hit.dataset.cursor;
      el.classList.add('has-label');
    } else if (e.target.closest('.vids__deck')) {
      labelEl.textContent = 'İZLE';
      el.classList.add('has-label');
    } else if (e.target.closest('.ig__viewport')) {
      labelEl.textContent = 'KEŞFET';
      el.classList.add('has-label');
    } else {
      el.classList.remove('has-label');
    }

    // purple halo over dark sections
    const section = e.target.closest('[data-theme]');
    el.classList.toggle('is-dark', !!section && section.dataset.theme === 'dark');
  }, { passive: true });

  document.addEventListener('mouseleave', () => gsap.to(el, { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => gsap.to(el, { opacity: 1, duration: 0.3 }));
}
