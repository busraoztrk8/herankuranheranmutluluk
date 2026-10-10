/**
 * Dr. Abdulcabbar Boran — tek sayfalık özet kart.
 * 10.10.2026 toplantısında çok bölümlü anlatım kaldırıldı; geriye
 * kartın kaydırıldıkça belirmesi kaldı.
 */
export function init({ reducedMotion }) {
  const section = document.querySelector('.boran');
  if (!section) return;
  if (reducedMotion) return; // içerik zaten görünür

  const portre = section.querySelector('.boran__portre');
  const metin = [...section.querySelectorAll('.boran__ad, .boran__unvan, .boran__ozet, .boran__link')];

  gsap.from(portre, {
    opacity: 0,
    x: -24,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'restart none restart none' },
  });

  gsap.from(metin, {
    opacity: 0,
    y: 18,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'restart none restart none' },
  });
}
