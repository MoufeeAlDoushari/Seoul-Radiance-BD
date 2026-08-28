'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { imageIn } from '@/lib/motion';
import type { ReactNode } from 'react';

/**
 * Product image plate with a settling entrance.
 *
 * A thin client island: the product page stays a server component and just
 * hands the badges through as children, so nothing about data fetching or
 * metadata moves to the client.
 */
export default function ProductGallery({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      variants={imageIn}
      initial="hidden"
      animate="show"
      className="relative aspect-square overflow-hidden rounded-3xl border border-plum/8 bg-blush/50"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 560px"
        className="object-cover"
      />
      {children}
    </motion.div>
  );
}
