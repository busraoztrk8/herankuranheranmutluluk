/**
 * Quote — calm masked reveal, a long slow breath in the story.
 */

export function init({ reducedMotion }) {
  const section = document.querySelector('.quote');
  if (!section || reducedMotion) return;

  const lines = section.querySelectorAll('.quote__line');

  gsap.from(lines, {
    yPercent: 115,
    opacity: 0,
    filter: 'blur(6px)',
    duration: 1.6,
    ease: 'power3.out',
    stagger: 0.35,
    scrollTrigger: {
      trigger: section,
      start: 'top 58%',
      toggleActions: 'restart none restart none',
    },
  });

  // slow parallax drift while the section passes
  gsap.fromTo(section.querySelector('.quote__block'),
    { y: 40 },
    {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4,
      },
    });
}
