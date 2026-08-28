'use client';

import { MotionConfig } from 'motion/react';
import CinematicBackground from './CinematicBackground';

/**
 * One dark cinematic environment for the whole site.
 *
 * Every route — the landing included — sits inside .cine and shares a single
 * fixed backdrop, so the background never changes when you scroll or navigate.
 *
 * The native cursor is left alone: a decorative dot rendered on top of it
 * meant two cursors on screen at once, which read as a glitch rather than a
 * flourish.
 *
 * MotionConfig reducedMotion="user" is the single global switch for
 * prefers-reduced-motion: Motion drops transform and layout animations for
 * those users and keeps only opacity, so nothing is left invisible.
 */
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="cine">
        <CinematicBackground />
        {children}
      </div>
    </MotionConfig>
  );
}
