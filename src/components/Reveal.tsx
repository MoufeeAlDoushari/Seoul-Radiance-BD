'use client';

import { motion } from 'motion/react';
import { Children, isValidElement, type ReactNode } from 'react';
import { fadeUp, fadeIn, staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

type Common = {
  children: ReactNode;
  className?: string;
  /** Seconds to hold before starting. */
  delay?: number;
};

/**
 * Single block entrance: fade + rise + un-blur, once, on scroll into view.
 *
 * Reduced motion is honoured globally by MotionConfig in SiteFrame, and a
 * <noscript> rule in the root layout forces these visible when JS is off —
 * Motion writes its `initial` state into the SSR HTML.
 */
export default function Reveal({ children, className, delay = 0, plain = false }: Common & { plain?: boolean }) {
  return (
    <motion.div
      className={className}
      variants={plain ? fadeIn : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Walks a row/grid of children in. Pair with <RevealItem> for each child —
 * one gesture across the group rather than N independent animations.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  as = 'div',
}: Common & { stagger?: number; as?: 'div' | 'ul' }) {
  const Tag = as === 'ul' ? motion.ul : motion.div;
  return (
    <Tag
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {/* Each child is wrapped so the stagger actually reaches it — variants
          only propagate to motion elements, and these children are plain
          Links/figures. h-full keeps grid rows even, since the wrapper (not the
          child) is now the grid item. */}
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <motion.div variants={staggerItem} className="h-full">
            {child}
          </motion.div>
        ) : (
          child
        ),
      )}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag className={className} variants={staggerItem}>
      {children}
    </Tag>
  );
}
