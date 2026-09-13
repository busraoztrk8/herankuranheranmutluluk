/**
 * Hero — tam ekran canlı yayın kapağı. Marka imzası (logo + yazı) alttan
 * maskenin arkasından yükselir, kapak kaydırma boyunca yavaşça yaklaşır ve
 * bir sonraki bölüm üstüne süzülür.
 */
import { broadcast } from '../data/broadcasts.js';

export function init({ reducedMotion }) {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  initLiveBadge(hero);
  initPlayState(hero);
  initDust(hero, reducedMotion);

  if (reducedMotion) return; // içerik zaten görünür

  // ---- giriş zaman çizelgesi ----
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero__visual', { opacity: 0, scale: 1.06, duration: 1.6, ease: 'expo.out' }, 0)
    .from('.hero__mark', { opacity: 0, scale: 0.8, duration: 0.9, ease: 'back.out(1.6)' }, 0.35)
    .from('.hero__eyebrow', { opacity: 0, y: 12, duration: 0.7 }, 0.5)
    /* Yazı .hero__line maskesinin altından yükselir; <em> renkleri korunsun
       diye harf/kelimeye bölünmüyor, satır bütün olarak geliyor. */
    .from('.hero__line-in', {
      yPercent: 115, opacity: 0, filter: 'blur(10px)', duration: 1.2,
    }, 0.45)
    .from('.hero__rule', {
      scaleX: 0, transformOrigin: '0% 50%', duration: 0.9,
    }, 0.95)
    .from('.hero__meta', { opacity: 0, duration: 0.8 }, 1.05)
    .from('.hero__scrollcue', { opacity: 0, y: 12, duration: 0.8 }, 1.15);

  // ---- kaydırmada sabitlenip yaklaşma ----
  // pinSpacing:false — araya boşluk konmaz, manifesto (z-index 3, opak)
  // sabitlenmiş hero'nun ÜSTÜNE süzülür. Kapak yaklaşırken bir sonraki
  // sahne çoktan girmeye başlamış olur.
  const stage = hero.querySelector('.hero__stage');
  gsap.set(stage, { transformOrigin: '50% 50%' });

  // Masaüstünde kapak ekranı kapladığı için belirgin bir yaklaşma iyi durur.
  // Telefonda sahne başlık + pano + ipucu dizisi; aynı oranda büyütülürse
  // başlık üstten kırpılıyor, o yüzden orada çok daha hafif bir ölçek var.
  // matchMedia ekran sınıfı değişince eskisini temizleyip yenisini kurar.
  gsap.matchMedia().add(
    { genis: '(min-width: 901px)', dar: '(max-width: 900px)' },
    (mq) => {
      const { genis } = mq.conditions;
      gsap.timeline({
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
      })
        .to(stage, { scale: genis ? 1.14 : 1.035, ease: 'power1.in', duration: 1 }, 0)
        .to('.hero__copy', { yPercent: genis ? -14 : -5, opacity: 0, duration: 0.7 }, 0)
        .to('.hero__scrollcue', { opacity: 0, duration: 0.16 }, 0);
    }
  );
}

/* ---------------- CANLI rozeti ----------------
   Rozet elle açılmaz: yayın gerçekten canlıysa görünür.
   Anahtar js/data/broadcasts.js içinde, Canlı Yayın bölümüyle ortak. */
function initLiveBadge(hero) {
  const badge = hero.querySelector('[data-hero-live]');
  if (!badge || broadcast.status !== 'live') return;
  badge.hidden = false;
}

/* ---------------- yayın başlayınca ----------------
   Kapak gizlenince üstteki yazılar da çekilir; oynatıcının önünde
   metin kalmaz. Kapağın kendisini js/sections/broadcast.js açıyor. */
function initPlayState(hero) {
  const cover = hero.querySelector('[data-live-cover]');
  if (!cover) return;
  cover.addEventListener('click', () => hero.classList.add('is-playing'), { once: true });
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
      ctx.fillStyle = `rgba(233, 205, 140, ${tw})`;
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
