import type { Transition, Variants } from 'motion/react';

/**
 * Seoul Radiance motion system.
 *
 * One vocabulary for the whole site so animation reads as a house style rather
 * than a pile of per-element effects. Everything here is short, low-amplitude
 * and opacity/transform only — the properties the compositor can handle without
 * layout work.
 *
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user"> in
 * SiteFrame, which strips transform animations for users who ask for that.
 */

/** Editorial ease — decisive start, long settle. Used for every entrance. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** A quicker curve for interaction feedback (hover, tap). */
export const EASE_OUT = [0.33, 1, 0.68, 1] as const;

export const DURATION = {
  fast: 0.22,
  base: 0.45,
  slow: 0.7,
} as const;

export const enter: Transition = { duration: DURATION.slow, ease: EASE };
export const interact: Transition = { duration: DURATION.fast, ease: EASE_OUT };

/** Standard section entrance: rise + un-blur. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: enter },
};

/** For blocks where vertical travel would fight the layout. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: enter },
};

/** Media entrance — settles from a hair oversized, never overshoots. */
export const imageIn: Variants = {
  hidden: { opacity: 0, scale: 1.04, filter: 'blur(10px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE } },
};

/**
 * Container that walks its children in. `stagger` is deliberately small: a grid
 * of 12 cards should feel like one gesture, not a queue.
 */
export const staggerContainer = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Child of staggerContainer. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
};

/** Shared viewport config so every reveal triggers at the same point. */
export const viewportOnce = { once: true, amount: 0.15, margin: '0px 0px -80px 0px' } as const;

/** Interaction feedback for buttons and links. Restrained on purpose. */
export const pressable = {
  whileHover: { y: -2, transition: interact },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
} as const;

/** Product card: the card lifts, the image scales — the copy stays put. */
export const cardHover: Variants = {
  rest: { y: 0, transition: interact },
  hover: { y: -6, transition: interact },
};

export const cardImage: Variants = {
  rest: { scale: 1, transition: { duration: 0.5, ease: EASE_OUT } },
  hover: { scale: 1.06, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Mobile drawer + its staggered items. */
export const drawer: Variants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.34, ease: EASE, staggerChildren: 0.045, delayChildren: 0.06 },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.24, ease: EASE_OUT } },
};

export const drawerItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/* ---------------------------------------------------------------------------
   Product reveal card
   Interaction adapted from the 21st.dev ProductRevealCard: the card lifts, the
   image zooms, and a glass panel rises from the bottom carrying the detail.
   Springs rather than durations here — the reveal should feel weighted.
   --------------------------------------------------------------------------- */

/** Card lift. Kept shallow so a grid of these doesn't feel bouncy. */
export const revealCard: Variants = {
  rest: { scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } },
  hover: {
    scale: 1.02,
    y: -7,
    transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
  },
};

/** Image zoom, clipped by the card's overflow so nothing reflows. */
export const revealImage: Variants = {
  rest: { scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  hover: { scale: 1.08, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

/** The glass panel itself: rises from the bottom edge, blur to sharp. */
export const revealOverlay: Variants = {
  rest: { y: '100%', opacity: 0, filter: 'blur(4px)' },
  hover: {
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
      mass: 0.6,
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

/** Rows inside the panel, walked in behind it. */
export const revealContent: Variants = {
  rest: { opacity: 0, y: 18 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.5 },
  },
};

/** Soft dark/rose wash over the product image on hover — deepens the plate
 *  without hiding the product itself. */
export const revealImageScrim: Variants = {
  rest: { opacity: 0, transition: { duration: 0.35, ease: EASE_OUT } },
  hover: { opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};
