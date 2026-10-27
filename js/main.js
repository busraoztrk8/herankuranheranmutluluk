/**
 * main.js — entry point.
 * Order: gates (reduced motion / touch) → smooth scroll → sections.
 * Vendor globals (gsap, ScrollTrigger, Lenis) load before this module.
 */
import { initSmoothScroll } from './animations/smoothScroll.js';
import { initMagnetic } from './animations/magnetic.js';
import * as router from './router.js?v=20261027-8';

import * as navbar from './sections/navbar.js?v=20261027-1';
import * as hero from './sections/hero.js?v=20261010-1';
import * as hakkimizda from './sections/hakkimizda.js?v=20261016-2';
import * as instagram from './sections/instagram.js';
import * as broadcast from './sections/broadcast.js?v=20261016-2';
import * as boran from './sections/boran.js?v=20261010-6';
import * as videos from './sections/videos.js?v=20261018-1';
import * as videolar from './sections/videolar.js?v=20261018-1';
import * as footer from './sections/footer.js?v=20261010-1';

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

/* 2 — sections (each owns its motion) */
navbar.init(ctx);
hero.init(ctx);
hakkimizda.init(ctx);
instagram.init(ctx);
broadcast.init(ctx);
boran.init(ctx);
videos.init(ctx);
videolar.init(ctx);
footer.init(ctx);

/* 3 — magnetic hover last, after DOM built by sections */
initMagnetic(ctx);

/* 4 — menü: tıklanınca ilgili bölüme git, kaydırırken aktif menüyü işaretle */
router.init(ctx);

/* Recalculate pinned distances once everything (fonts, images) settles */
if (hasGsap) {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
