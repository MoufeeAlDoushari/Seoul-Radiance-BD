'use client';

import { useReducedMotion } from 'motion/react';

/**
 * Shared cinematic backdrop for every page except the landing at "/".
 *
 * Fixed to the viewport at z-index -1. <html> carries no background, so body's
 * background propagates to the canvas and this layer paints above it — the same
 * mechanism the landing hero relies on. It paints its own charcoal so there is
 * no cream flash before the video decodes.
 *
 * The video sits at low opacity under two scrims; that combination is what keeps
 * body copy readable over moving footage.
 */
export default function CinematicBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="cine-bg" aria-hidden="true">
      {/* Reduced motion gets the graded stills only — no moving footage. */}
      {!reduceMotion && (
        <video
          className="cine-bg__video"
          src="/cinematic.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      <div className="cine-bg__scrim" />
      <div className="cine-bg__vignette" />
    </div>
  );
}
