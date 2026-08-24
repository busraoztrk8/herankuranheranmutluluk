/**
 * main.js — entry point.
 * Order: gates (reduced motion / touch) → smooth scroll → sections.
 * Vendor globals (gsap, ScrollTrigger, Lenis) load before this module.
 */
import { initSmoothScroll } from './animations/smoothScroll.js';
import { initCursor } from './animations/cursor.js';
import { initMagnetic } from './animations/magnetic.js';

import * as navbar from './sections/navbar.js';
import * as hero from './sections/hero.js';
import * as manifesto from './sections/manifesto.js';
import * as instagram from './sections/instagram.js';
import * as broadcast from './sections/broadcast.js';
import * as boran from './sections/boran.js';
import * as videos from './sections/videos.js';
import * as videolar from './sections/videolar.js';
import * as quote from './sections/quote.js';
import * as footer from './sections/footer.js';

const ctx = {
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isTouch: window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window,
};

// If GSAP failed to load (missing vendor files), degrade gracefully:
// content is fully visible without JS animation.
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
} else {
  ctx.reducedMotion = true;
}

/* 1 — global systems */
// exposed for debugging / programmatic scrolling
window.lenis = initSmoothScroll(ctx);
initCursor(ctx);

/* 2 — sections (each owns its motion) */
navbar.init(ctx);
hero.init(ctx);
manifesto.init(ctx);
instagram.init(ctx);
broadcast.init(ctx);
boran.init(ctx);
videos.init(ctx);
videolar.init(ctx);
quote.init(ctx);
footer.init(ctx);

/* 3 — magnetic hover last, after DOM built by sections */
initMagnetic(ctx);

/* Recalculate pinned distances once everything (fonts, images) settles */
if (hasGsap) {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
