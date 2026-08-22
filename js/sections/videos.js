/**
 * Videos — perspective deck built from js/data/videos.js.
 * Active video sits large in the center; the rest wait behind with
 * depth, scale and slight rotation. Navigation: arrows, drag, keyboard.
 * Öndeki karta tıklamak videoyu kartın içinde açar; başka bir karta
 * geçilince oynatıcı kapanır. Tıklanana kadar hiçbir oynatıcı yüklenmez.
 */
import { videoItems } from '../data/videos.js';

export function init({ reducedMotion, isTouch }) {
  const section = document.querySelector('.vids');
  const deck = section?.querySelector('[data-vids-deck]');
  const counter = section?.querySelector('[data-vids-counter]');
  if (!section || !deck) return;

  let items = [...videoItems];
  let index = 0;
  let cards = [];

  /* ---------- cards ---------- */
  function buildCards() {
    deck.innerHTML = '';
    cards = items.map((item) => {
      const card = document.createElement('article');
      card.className = 'vids__card';
      const idx = String(items.indexOf(item) + 1).padStart(2, '0');
      card.dataset.yt = item.youtubeId;
      card.innerHTML = faceHtml(item, idx);
      card.addEventListener('click', () => {
        const i = cards.indexOf(card);
        if (i !== index) { goTo(i); return; }
        if (card.classList.contains('is-playing')) return; // zaten oynuyor
        playInCard(card, item);
      });
      deck.appendChild(card);
      return card;
    });
    layout(true);
  }

  /** Kartın kapak yüzü. Kapak YouTube'dan gelir; maxresdefault çoğu
      videoda üretilmediği için her zaman var olan hqdefault kullanılır. */
  function faceHtml(item, idx) {
    const id = encodeURIComponent(item.youtubeId);
    return (
      `<img class="vids__thumb" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg"` +
      ` alt="" loading="lazy" decoding="async"` +
      ` onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/mqdefault.jpg'">` +
      `<div class="vids__card-meta">` +
      `<h3 class="vids__card-title">${escapeHtml(item.title)}</h3>` +
      `</div>` +
      `<span class="vids__card-play" aria-hidden="true">` +
      `<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>`
    );
  }

  /** Öndeki kartta videoyu yerinde açar (yeni sekme yok). */
  function playInCard(card, item) {
    const frame = document.createElement('iframe');
    frame.className = 'vids__embed';
    frame.src =
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.youtubeId)}` +
      '?autoplay=1&rel=0&playsinline=1';
    frame.title = item.title;
    frame.allow =
      'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    card.innerHTML = '';
    card.appendChild(frame);
    card.appendChild(closeButton(() => stopCard(card)));
    card.classList.add('is-playing');
  }

  /** Oynatıcıyı kapatan yuvarlak düğme (özellikle dokunmatikte gerekli). */
  function closeButton(onClose) {
    const btn = document.createElement('button');
    btn.className = 'video-close';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Videoyu kapat');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8"' +
      ' stroke-linecap="round" fill="none"/></svg>';
    btn.addEventListener('click', (e) => { e.stopPropagation(); onClose(); });
    return btn;
  }

  /** Kart öne çıkmayı bıraktığında oynatıcıyı kapatır — arkada ses kalmasın. */
  function stopCard(card) {
    if (!card.classList.contains('is-playing')) return;
    const item = items[cards.indexOf(card)];
    if (!item) return;
    const idx = String(cards.indexOf(card) + 1).padStart(2, '0');
    card.classList.remove('is-playing');
    card.innerHTML = faceHtml(item, idx);
  }

  function layout(instant = false) {
    const n = cards.length;
    cards.forEach((card, i) => {
      let off = i - index;
      // shortest way around for a looped feel
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;

      const abs = Math.abs(off);
      const state = {
        xPercent: -50 + off * 44,
        yPercent: -50,
        scale: off === 0 ? 1 : Math.max(0.55, 0.8 - (abs - 1) * 0.12),
        rotationY: off * -14,
        z: -abs * 220,
        opacity: abs > 2 ? 0 : off === 0 ? 1 : 0.5 - (abs - 1) * 0.18,
        filter: off === 0 ? 'brightness(1)' : 'brightness(0.55)',
        zIndex: 100 - abs,
        pointerEvents: abs > 2 ? 'none' : 'auto',
      };
      card.classList.toggle('is-front', off === 0);
      if (off !== 0) stopCard(card);

      if (reducedMotion || instant) {
        gsap.set(card, state);
      } else {
        gsap.to(card, { ...state, duration: 0.9, ease: 'power3.out' });
      }
    });

    if (counter) {
      counter.textContent =
        `${String(index + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    }
  }

  function goTo(i) {
    const n = cards.length;
    index = ((i % n) + n) % n;
    layout(false);
  }

  section.querySelector('[data-vids-prev]')?.addEventListener('click', () => goTo(index - 1));
  section.querySelector('[data-vids-next]')?.addEventListener('click', () => goTo(index + 1));

  /* ---------- drag ---------- */
  let startX = null;
  deck.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  window.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 48) goTo(index + (dx < 0 ? 1 : -1));
  });

  /* ---------- keyboard ---------- */
  section.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  buildCards();

  /* ---------- section reveal ---------- */
  if (!reducedMotion) {
    gsap.from(section.querySelectorAll('.vids__title'), {
      opacity: 0,
      y: 40,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'restart none restart none' },
    });
    gsap.from(deck, {
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: deck, start: 'top 85%', toggleActions: 'restart none restart none' },
    });
  }
}

/**
 * HTML'e gömülen metni kaçırır.
 * Başlıklar bugün elle yazılıyor; ileride YouTube API'sinden gelirse
 * kaçış yapılmadan gömmek script enjeksiyonuna açık kapı bırakırdı.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
