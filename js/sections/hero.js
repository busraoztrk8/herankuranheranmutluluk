/**
 * Hero — tam genişlik canlı yayın afişi ve altındaki menü şeridi.
 * Afişe tıklanınca yayın yerinde açılır; kapağı gizleme işini
 * js/sections/broadcast.js yapıyor. Burada yalnızca giriş hareketi var.
 */
export function init({ reducedMotion }) {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reducedMotion) return; // içerik zaten görünür

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero__visual', { opacity: 0, scale: 1.03, duration: 1.2, ease: 'expo.out' }, 0)
    /* Düğme SADECE opacity ile geliyor. y/scale gibi bir transform
       tweenlenirse GSAP satır içi transform'u kendi yazıyor ve düğmeyi
       ortalayan translate(-50%, -50%)'in dikey yarısını düşürüyor —
       düğme yarım boy aşağı kayıyordu. Konumlama CSS'te kalsın. */
    .from('.hero__watch', { opacity: 0, duration: 0.8 }, 0.35);

  // Menü şeridi afişin dışında; telefonda gizli olduğunda hedef bulunmaz,
  // o yüzden varlığı önce kontrol ediliyor.
  const menuOgeleri = document.querySelectorAll('.mainnav__list > li');
  if (menuOgeleri.length) {
    tl.from(menuOgeleri, { opacity: 0, y: 10, duration: 0.6, stagger: 0.06 }, 0.5);
  }
}
