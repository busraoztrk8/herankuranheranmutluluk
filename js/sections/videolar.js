/**
 * Videolar — Pazar Sohbeti ile aynı perspektifli deste.
 * Öndeki kart büyük durur, diğerleri arkada derinlik, ölçek ve hafif
 * dönüşle bekler. Gezinme: oklar, sürükleme, klavye.
 *
 * Öndeki karta tıklamak videoyu kartın içinde açar; başka bir karta
 * geçilince oynatıcı kapanır. Tıklanana kadar hiçbir oynatıcı yüklenmez.
 */
import { videolarItems, videolarMeta } from '../data/videolar.js';

const THUMB = (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/maxresdefault.jpg`;
const THUMB_FALLBACK = (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;

export function init({ reducedMotion }) {
  const section = document.querySelector('.vlist');
  const deck = section?.querySelector('[data-vlist-deck]');
  const counter = section?.querySelector('[data-vlist-counter]');
  if (!section || !deck) return;

  applyMeta(section);

  const items = [...videolarItems];
  let index = 0;
  let cards = [];

  if (!items.length) {
    section.classList.add('vlist--empty');
    deck.innerHTML =
      '<p class="vlist__empty">Videolar yakında burada.' +
      '<span>js/data/videolar.js dosyasına video ekleyin.</span></p>';
    section.querySelector('.vlist__nav')?.setAttribute('hidden', '');
    return;
  }

  buildCards();

  section.querySelector('[data-vlist-prev]')?.addEventListener('click', () => goTo(index - 1));
  section.querySelector('[data-vlist-next]')?.addEventListener('click', () => goTo(index + 1));

  /* ---------- sürükleme ---------- */
  let startX = null;
  deck.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  window.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 48) goTo(index + (dx < 0 ? 1 : -1));
  });

  /* ---------- klavye ---------- */
  section.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  /* ---------- bölüm açılışı ---------- */
  if (!reducedMotion) {
    gsap.from(section.querySelector('.vlist__title'), {
      opacity: 0, y: 40, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 72%', toggleActions: 'restart none restart none' },
    });
    gsap.from(deck, {
      opacity: 0, y: 80, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: deck, start: 'top 85%', toggleActions: 'restart none restart none' },
    });
    gsap.from(section.querySelector('.vlist__cta'), {
      opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: section.querySelector('.vlist__foot'), start: 'top 94%', toggleActions: 'restart none restart none' },
    });
  }

  /* ---------------- kartlar ---------------- */

  function buildCards() {
    deck.innerHTML = '';
    cards = items.map((item, idx) => {
      const card = document.createElement('article');
      card.className = 'vlist__card';
      card.dataset.yt = item.youtubeId;
      card.innerHTML = faceHtml(item, idx);
      card.addEventListener('click', () => {
        const i = cards.indexOf(card);
        if (i !== index) { goTo(i); return; }
        if (card.classList.contains('is-playing')) return;
        playInCard(card, item);
      });
      deck.appendChild(card);
      return card;
    });
    layout(true);
  }

  /** Kapak yüzü. maxresdefault yoksa hqdefault'a düşer. */
  function faceHtml(item) {
    const title = (item.title || '').trim();
    return (
      `<img class="vids__thumb" src="${THUMB(item.youtubeId)}" alt=""` +
      ` loading="lazy" decoding="async"` +
      ` onerror="this.onerror=null;this.src='${THUMB_FALLBACK(item.youtubeId)}'">` +
      (title
        ? `<div class="vlist__card-meta"><h3 class="vlist__card-title">${escapeHtml(title)}</h3></div>`
        : '') +
      `<span class="vlist__card-play" aria-hidden="true">` +
      `<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>`
    );
  }

  function playInCard(card, item) {
    const frame = document.createElement('iframe');
    frame.className = 'vlist__embed';
    frame.src =
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.youtubeId)}` +
      '?autoplay=1&rel=0&playsinline=1';
    frame.title = labelOf(item, cards.indexOf(card));
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

  /** Kart öne çıkmayı bıraktığında oynatıcıyı kapatır. */
  function stopCard(card) {
    if (!card.classList.contains('is-playing')) return;
    const i = cards.indexOf(card);
    const item = items[i];
    if (!item) return;
    card.classList.remove('is-playing');
    card.innerHTML = faceHtml(item, i);
  }

  function layout(instant = false) {
    const n = cards.length;
    cards.forEach((card, i) => {
      let off = i - index;
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
        // açık zeminde koyu filtre sert duruyor; hafif soldurma yeterli
        filter: off === 0 ? 'brightness(1)' : 'brightness(0.82)',
        zIndex: 100 - abs,
        pointerEvents: abs > 2 ? 'none' : 'auto',
      };
      card.classList.toggle('is-front', off === 0);
      if (off !== 0) stopCard(card);

      if (reducedMotion || instant) gsap.set(card, state);
      else gsap.to(card, { ...state, duration: 0.9, ease: 'power3.out' });
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
}

/* ---------------- yardımcılar ---------------- */

function applyMeta(section) {
  const title = section.querySelector('.vlist__title');
  if (title && videolarMeta.title) title.textContent = videolarMeta.title;

  const cta = section.querySelector('.vlist__cta');
  if (cta) {
    if (videolarMeta.ctaUrl) cta.href = videolarMeta.ctaUrl;
    const label = cta.querySelector('[data-vlist-cta-label]');
    if (label && videolarMeta.cta) label.textContent = videolarMeta.cta;
  }
}

function labelOf(item, i) {
  return (item.title || '').trim() || `Video ${String(i + 1).padStart(2, '0')}`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
