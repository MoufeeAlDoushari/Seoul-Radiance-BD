'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { EASE } from '@/lib/motion';

/**
 * Route-change entrance.
 *
 * Deliberately enter-only: AnimatePresence exit animations in the App Router
 * require holding the outgoing tree while the new route streams in, which
 * fights Suspense and is a common source of hydration mismatches. Keying a
 * plain motion.div on the pathname gives the same perceived polish with none
 * of that risk.
 *
 * Travel is small and the duration short — navigation should feel immediate,
 * not staged.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
