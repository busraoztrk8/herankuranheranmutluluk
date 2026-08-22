/**
 * Instagram — gerçek gönderiler js/data/instagram.js'ten gömülür.
 *
 * Her kart Instagram'ın kendi `/embed/` çerçevesidir; video, başlık ve
 * beğeni bilgisi doğrudan Instagram'dan gelir. `loading="lazy"` sayesinde
 * çerçeveler ekrana yaklaşmadan indirilmez.
 *
 * Masaüstü: bölüm sabitlenir, dikey kaydırma yatay yolculuğu sürer.
 * Mobil / dokunmatik: parmakla yatay kaydırma (CSS).
 */
import { instagramPosts, instagramMeta } from '../data/instagram.js';

export function init({ reducedMotion, isTouch }) {
  const section = document.querySelector('.ig');
  const track = document.querySelector('[data-ig-track]');
  if (!section || !track) return;

  applyMeta(section);

  if (!instagramPosts.length) {
    track.innerHTML =
      '<p class="ig__empty">Gönderiler yakında burada.' +
      '<span>js/data/instagram.js dosyasına ekleyin.</span></p>';
    return;
  }

  track.innerHTML = instagramPosts.map(cardHtml).join('');

  if (reducedMotion) return;

  // header reveal
  gsap.from(section.querySelectorAll('.ig__eyebrow, .ig__title'), {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'restart none restart none' },
  });

  const isNarrow = window.matchMedia('(max-width: 820px)').matches;

  if (isTouch || isNarrow) {
    gsap.from(track.querySelectorAll('.ig__item'), {
      opacity: 0,
      x: 60,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: track, start: 'top 85%', toggleActions: 'restart none restart none' },
    });
    return;
  }

  initHorizontalScrub(section, track);
}

/* ---------------- render ---------------- */

function applyMeta(section) {
  const cta = section.querySelector('.ig__cta');
  if (cta && instagramMeta.profileUrl) cta.href = instagramMeta.profileUrl;
}

function cardHtml(post, i) {
  const code = String(post.code || '').trim();
  const type = post.type === 'p' ? 'p' : 'reel';
  const num = String(i + 1).padStart(2, '0');

  return `
    <article class="ig__item">
      <iframe class="ig__embed"
        src="https://www.instagram.com/${type}/${encodeURIComponent(code)}/embed/"
        title="Instagram gönderisi ${num}"
        loading="lazy" frameborder="0" scrolling="no"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="encrypted-media; picture-in-picture; web-share"
        allowtransparency="true" allowfullscreen></iframe>
    </article>`;
}

/**
 * Masaüstü: bölümü sabitler, dikey kaydırmayı yatay yolculuğa çevirir.
 * Kartlar ekrana sığıyorsa sabitleme yapılmaz — yoksa boşta pinlenmiş
 * bir bölüm oluşur ve kullanıcı hiçbir şey olmadan kaydırmaya çalışır.
 */
function initHorizontalScrub(section, track) {
  const viewport = section.querySelector('.ig__viewport');
  if (!viewport || section._igPinned) return;

  const distance = () =>
    Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

  if (distance() < 40) return;
  section._igPinned = true;

  const range = {
    trigger: viewport,
    start: 'top 12%',
    end: () => `+=${distance()}`,
    invalidateOnRefresh: true,
  };

  // ana yolculuk: dikey kaydırma -> yatay hareket
  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: { ...range, pin: section, scrub: 1 },
  });

  // kartlar sıra sıra farklı hızda süzülür — düz bir şerit yerine derinlik.
  // Sadece dikey kayma; eğim (rotate) YOK — kartlar kaydırırken yamulmasın.
  [...track.querySelectorAll('.ig__item')].forEach((item, i) => {
    const drift = ((i % 3) - 1) * 22;   // -22, 0, +22 döngüsü
    gsap.fromTo(item,
      { y: drift },
      {
        y: -drift,
        ease: 'none',
        scrollTrigger: { ...range, scrub: 1.4 },
      });
  });

  // ray içine girerken her kart hafifçe belirir
  gsap.from(track.querySelectorAll('.ig__item'), {
    opacity: 0,
    y: 70,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.09,
    scrollTrigger: {
      trigger: viewport,
      start: 'top 88%',
      toggleActions: 'restart none restart none',
    },
  });
}
