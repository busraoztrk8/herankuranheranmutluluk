/**
 * Manifesto — lines reveal sequentially on scroll through masks.
 */

export function init({ reducedMotion }) {
  const section = document.querySelector('.manifesto');
  if (!section || reducedMotion) return;

  const inners = section.querySelectorAll('.manifesto__line > span');

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 62%',
      toggleActions: 'restart none restart none',
    },
    defaults: { ease: 'power3.out' },
  })
    .from(section.querySelector('.manifesto__eyebrow'), { opacity: 0, x: -24, duration: 0.8 })
    .from(inners, {
      yPercent: 118,
      duration: 1.25,
      stagger: 0.22,
    }, '-=0.3')
    .from(section.querySelectorAll('.manifesto__body p'), {
      opacity: 0,
      y: 26,
      duration: 1.0,
      stagger: 0.12,
    }, '-=0.6')
    .from(section.querySelector('.manifesto__meta'), {
      opacity: 0,
      y: 16,
      duration: 0.8,
    }, '-=0.5');

  // gentle drift of the whole block for depth (scrubbed parallax)
  gsap.fromTo(section.querySelector('.manifesto__inner'),
    { y: 60 },
    {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
}
