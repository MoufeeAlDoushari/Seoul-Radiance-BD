'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { interact } from '@/lib/motion';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';
import { site, taka } from '@/data/site';
import type { Product } from '@/data/products';

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const waMessage = encodeURIComponent(
    `Hi Seoul Radiance BD! I want to order:\n\n${product.brand} — ${product.name} (${product.size})\nQuantity: ${qty}\nPrice: ${taka(product.price)} each\n\nPlease confirm availability.`,
  );

  if (!product.stock) {
    return (
      <div className="mt-8">
        <div className="rounded-2xl border border-plum/15 bg-blush/50 p-5">
          <p className="font-semibold">Currently out of stock</p>
          <p className="mt-1 text-sm text-plum-soft">
            Message us on WhatsApp and we will tell you the moment it lands — usually within 2 weeks.
          </p>
          <a
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
              `Hi! Please let me know when "${product.name}" is back in stock.`,
            )}`}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary mt-4"
          >
            Notify me on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  function handleAdd(goToCart: boolean) {
    add(product.slug, qty);
    if (goToCart) {
      router.push('/cart');
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-plum/20">
          <motion.button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            whileTap={{ scale: 0.86 }}
            transition={interact}
            className="grid h-11 w-11 place-items-center text-lg text-plum hover:text-rose-deep"
            aria-label="Decrease quantity"
          >
            −
          </motion.button>
          {/* The number itself swaps with direction-aware travel, so a change
              is legible without moving the surrounding controls. */}
          <span className="relative grid h-6 w-9 place-items-center overflow-hidden text-sm font-semibold" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={qty}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
                className="absolute"
              >
                {qty}
              </motion.span>
            </AnimatePresence>
          </span>
          <motion.button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            whileTap={{ scale: 0.86 }}
            transition={interact}
            className="grid h-11 w-11 place-items-center text-lg text-plum hover:text-rose-deep"
            aria-label="Increase quantity"
          >
            +
          </motion.button>
        </div>

        <motion.button
          type="button"
          onClick={() => handleAdd(false)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={interact}
          className="btn btn-outline flex-1 min-w-[150px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'added' : 'add'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <motion.button
          type="button"
          onClick={() => handleAdd(true)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={interact}
          className="btn btn-primary flex-1 min-w-[150px]"
        >
          Buy now
        </motion.button>
      </div>

      <a
        href={`https://wa.me/${site.whatsapp}?text=${waMessage}`}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-3 flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/8 py-3 text-sm font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/15"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.6-4.9c-.4-.7-.7-1.5-.7-2.2 0-.8.4-1.5.8-1.8.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.5.8 1 1.4 1.7 1.9.5.4.8.5 1 .3l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.3.2.4.3 0 .1 0 .5-.1.7Z" />
        </svg>
        Order directly on WhatsApp
      </a>
    </div>
  );
}
