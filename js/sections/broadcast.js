/**
 * Live broadcast — YouTube canlı yayın gömülü oynatıcısı ve
 * küçükten tama yaklaşan scale scrub'ı.
 * Yayın canlıyken sol üstte bir CANLI rozeti belirir.
 * Oynatma kontrolü YouTube oynatıcısının kendisinde.
 */
import { broadcast } from '../data/broadcasts.js';

export function init({ reducedMotion }) {
  const section = document.querySelector('.bcast');
  if (!section) return;

  initLiveCovers();
  renderStatus(section);

  if (reducedMotion) return;

  // headline reveal
  gsap.from(section.querySelectorAll('.bcast__eyebrow, .bcast__title, .bcast__time'), {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'restart none restart none' },
  });

  // stage scales from small to near-fullscreen (scrubbed)
  const frame = section.querySelector('.bcast__frame');
  gsap.fromTo(frame,
    { scale: 0.62, y: 60 },
    {
      scale: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section.querySelector('.bcast__stage'),
        start: 'top 92%',
        end: 'top 18%',
        scrub: 0.9,
      },
    });

  gsap.from(section.querySelector('.bcast__caption'), {
    opacity: 0,
    y: 24,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: { trigger: section.querySelector('.bcast__caption'), start: 'top 92%', toggleActions: 'restart none restart none' },
  });
}

/* ---------------- yayın kapakları ---------------- */
function initLiveCovers() {
  document.querySelectorAll('[data-live-cover]').forEach((cover) => {
    cover.addEventListener('click', () => {
      const frame = cover.parentElement;
      const iframe = frame?.querySelector('iframe');

      if (iframe && iframe.dataset.liveSrc) {
        const separator = iframe.dataset.liveSrc.includes('?') ? '&' : '?';
        iframe.src = `${iframe.dataset.liveSrc}${separator}autoplay=1`;
      }

      cover.classList.add('is-hidden');
    }, { once: true });
  });
}

/* ---------------- durum rozeti ---------------- */
/* Yalnızca yayın canlıyken rozet gösterilir.
   "Sonraki canlı yayın" bildirimi ve geri sayım kaldırıldı. */
function renderStatus(section) {
  const holder = section.querySelector('[data-bcast-status]');
  const label = section.querySelector('[data-bcast-status-label]');
  if (!holder) return;

  if (broadcast.status === 'live') {
    holder.classList.add('bcast__status--live');
    holder.innerHTML =
      '<span class="bcast__status-chip"><span class="dot"></span>CANLI</span>';
    if (label) label.textContent = 'Şu An Canlı Yayındayız';
    return;
  }

  holder.innerHTML = '';
  if (label) label.textContent = 'Canlı Yayın';
}
