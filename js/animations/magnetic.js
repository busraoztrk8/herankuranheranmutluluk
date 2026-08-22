/**
 * Restrained magnetic hover (desktop only) for [data-magnetic] elements.
 * Elements drift 4–8px toward the cursor and glide back on leave.
 */

const PULL = 8; // max px

export function initMagnetic({ isTouch, reducedMotion }) {
  if (isTouch || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const relY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      xTo(relX * PULL);
      yTo(relY * PULL * 0.6);
    });

    el.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}
