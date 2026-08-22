/**
 * Hero — cinematic intro (blur-to-sharp masked chars), floating dust
 * canvas, pinned scale-out where letters overflow the viewport
 * and the next section emerges beneath.
 */
import { splitChars, splitWords, revealRise } from '../animations/textReveal.js';

export function init({ reducedMotion, isTouch }) {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  initDust(hero, reducedMotion);

  if (reducedMotion) return; // content is visible by default

  const words = hero.querySelectorAll('[data-split]');
  const chars = [];
  words.forEach((w) => chars.push(...splitChars(w)));
  const subWords = splitWords(hero.querySelector('[data-split-words]'));

  // ---- intro timeline ----
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.add(revealRise(chars, { duration: 1.25, stagger: 0.05 }), 0)
    .add(revealRise(subWords, { duration: 1.0, stagger: 0.1 }), '-=0.5')
    .from('.hero__visual img', {
      opacity: 0, scale: 1.08, duration: 1.6, ease: 'expo.out',
    }, 0.25)
    .from('.hero__scrollcue', { opacity: 0, y: 12, duration: 0.8 }, '-=0.6');

  // ---- pinned scale-out on scroll ----
  // pinSpacing:false — no spacer is inserted, so the manifesto (z-index 3,
  // opaque) slides up *over* the pinned hero. The headline scales out while
  // the next scene is already entering: the two overlap instead of leaving
  // a full viewport of empty ivory between them.
  const stage = hero.querySelector('.hero__stage');
  const heroTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=80%',
      pin: true,
      pinSpacing: false,
      scrub: 0.8,
      anticipatePin: 1,
    },
  });
  gsap.set(stage, { transformOrigin: '14% 50%' });
  heroTl
    .to(stage, { scale: 1.85, yPercent: -5, ease: 'power2.in', duration: 1 }, 0)
    // fade lands late, as the manifesto is already covering the stage
    .to(stage, { opacity: 0, ease: 'power1.in', duration: 0.45 }, 0.55)
    .to('.hero__scrollcue', { opacity: 0, duration: 0.16 }, 0)
    .to('.hero__bloom--purple', { opacity: 0.2, scale: 1.3, duration: 1 }, 0)
    .to('.hero__bloom--gold', { opacity: 1, scale: 1.5, xPercent: -12, yPercent: -12, duration: 1 }, 0);

}

/* ---------------- dust particles ---------------- */
function initDust(hero, reducedMotion) {
  const canvas = hero.querySelector('.hero__dust');
  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext('2d');
  let w, h, raf;
  const N = 42;
  const parts = [];

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < N; i++) {
    parts.push({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.00006,
      vy: -0.00003 - Math.random() * 0.00008,
      a: 0.08 + Math.random() * 0.22,
      p: Math.random() * Math.PI * 2,
    });
  }

  function tick(t) {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
      if (p.x < -0.02) p.x = 1.02;
      if (p.x > 1.02) p.x = -0.02;
      const tw = p.a * (0.7 + 0.3 * Math.sin(t * 0.001 + p.p));
      ctx.beginPath();
      ctx.fillStyle = `rgba(200, 168, 90, ${tw})`;
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // pause when off-screen
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        if (!raf) raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
  }).observe(hero);
}
