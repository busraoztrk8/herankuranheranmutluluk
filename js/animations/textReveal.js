/**
 * Shared text reveal helpers — split into chars/words, blur-to-sharp
 * masked staggers. Uses Intl.Segmenter-safe splitting for Turkish.
 */

/**
 * Split an element's text into characters wrapped in .split-char spans,
 * each inside an overflow-hidden .split-mask.
 * @param {HTMLElement} el
 * @returns {HTMLElement[]} char spans
 */
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);
  const chars = [];
  for (const ch of text) {
    const mask = document.createElement('span');
    mask.className = 'split-mask';
    mask.setAttribute('aria-hidden', 'true');
    const span = document.createElement('span');
    span.className = 'split-char';
    span.textContent = ch === ' ' ? ' ' : ch;
    mask.appendChild(span);
    el.appendChild(mask);
    chars.push(span);
  }
  return chars;
}

/**
 * Split an element's text into words wrapped in .split-word spans.
 * @param {HTMLElement} el
 * @returns {HTMLElement[]} word spans
 */
export function splitWords(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);
  const words = [];
  text.split(/\s+/).filter(Boolean).forEach((word, i, arr) => {
    const mask = document.createElement('span');
    mask.className = 'split-mask';
    mask.setAttribute('aria-hidden', 'true');
    const span = document.createElement('span');
    span.className = 'split-word';
    span.textContent = word;
    mask.appendChild(span);
    el.appendChild(mask);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    words.push(span);
  });
  return words;
}

/**
 * Blur-to-sharp masked rise, staggered. Returns the tween.
 * @param {HTMLElement[]} targets
 * @param {object} [opts] gsap overrides
 */
export function revealRise(targets, opts = {}) {
  return gsap.from(targets, {
    yPercent: 110,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.045,
    ...opts,
  });
}

/**
 * Scroll-triggered masked line reveal for a set of line wrappers
 * (each line: overflow hidden parent + inner span).
 * @param {NodeListOf<Element>|Element[]} lines inner spans
 * @param {Element} trigger
 * @param {object} [opts]
 */
export function revealLinesOnScroll(lines, trigger, opts = {}) {
  return gsap.from(lines, {
    yPercent: 120,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.18,
    scrollTrigger: {
      trigger,
      start: 'top 72%',
      toggleActions: 'restart none restart none',
    },
    ...opts,
  });
}
