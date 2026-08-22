/**
 * Lenis yumuşak kaydırma, GSAP ticker'ına bağlanır; böylece ScrollTrigger
 * ve Lenis tek bir rAF döngüsünü paylaşır.
 *
 * Ayrıca sayfa içi bağlantıların (#hero, #yayin ...) hedef konumunu
 * hesaplar. Bu hesap göründüğünden inceliklidir: ScrollTrigger ile
 * sabitlenen bölümler sabitliyken `position: fixed` olur, dolayısıyla
 * `getBoundingClientRect()` onların belge içindeki gerçek yerini değil,
 * ekrandaki anlık yerini verir. Hero sabitlendiği için "Ana Sayfa" ve
 * logo bağlantıları hedefi "bulunduğun yer" sanıp hiç kaydırmıyordu.
 */

export function initSmoothScroll({ reducedMotion }) {
  const useLenis =
    !reducedMotion && typeof Lenis !== 'undefined' && typeof gsap !== 'undefined';

  let lenis = null;

  if (useLenis) {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // dokunmatikte doğal ivme korunur
    });

    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  wireAnchors(lenis);
  return lenis;
}

/* ---------------- sayfa içi bağlantılar ---------------- */

function wireAnchors(lenis) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute('href');
    if (!id || id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const y = targetY(target);

    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  });
}

/**
 * Hedefin belge içindeki gerçek dikey konumu.
 * @param {Element} target
 * @returns {number}
 */
function targetY(target) {
  // 1) Bölüm ScrollTrigger ile sabitleniyorsa, tetikleyicinin başlangıç
  //    noktası hedefin gerçek konumudur (hero için bu 0'dır).
  if (typeof ScrollTrigger !== 'undefined') {
    const pinned = ScrollTrigger.getAll().find((t) => t.pin === target);
    if (pinned) return Math.max(0, pinned.start);
  }

  // 2) pinSpacing ile sarmalanmış olabilir; sarmalayıcı doğru konumu verir.
  const host = target.parentElement?.classList.contains('pin-spacer')
    ? target.parentElement
    : target;

  return Math.max(0, host.getBoundingClientRect().top + window.scrollY);
}
