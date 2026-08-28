'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartProvider';
import { taka } from '@/data/site';
import {
  revealCard,
  revealImage,
  revealImageScrim,
  revealOverlay,
  revealContent,
  interact,
} from '@/lib/motion';
import type { Product } from '@/data/products';

/**
 * Product card with a hover reveal, adapted from the 21st.dev ProductRevealCard
 * interaction onto Seoul Radiance's own data and design system.
 *
 * Two things differ from the reference on purpose:
 *
 *  - No rating, review count or favourite button. The catalogue has no such
 *    fields and no favourites feature, so inventing them would put fake
 *    information on a real shop.
 *  - The reveal is an enhancement, never the only route to an action. The card
 *    keeps its always-visible Add to cart, and the panel is gated to
 *    hover-capable pointers (.has-reveal) so touch users are never asked to
 *    hover for something they need.
 *
 * The card is a <div>, not a <Link>: the panel's buttons sit as siblings of the
 * image link rather than nested inside an anchor, which keeps the markup valid
 * and stops the two click targets fighting.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  function handleAdd() {
    if (!product.stock) return;
    add(product.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  const href = `/product/${product.slug}`;

  return (
    <motion.article
      variants={revealCard}
      initial="rest"
      whileHover="hover"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-plum/8 bg-white"
    >
      <Link href={href} className="flex flex-1 flex-col" aria-label={product.name}>
        <div className="relative aspect-[4/5] overflow-hidden bg-blush/50">
          <motion.div variants={revealImage} className="absolute inset-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </motion.div>

          {/* Weighted toward the bottom edge so the plate deepens where the
              panel rises from, while the product itself stays recognisable. */}
          <motion.div
            variants={revealImageScrim}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(232,180,184,0.06) 0%, rgba(12,9,10,0.10) 45%, rgba(9,7,8,0.42) 100%)',
            }}
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.badges?.includes('bestseller') && (
              <span className="rounded-full bg-plum px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-cream">
                Best seller
              </span>
            )}
            {product.badges?.includes('new') && (
              <span className="rounded-full bg-sage px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-rose-deep px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                -{discount}%
              </span>
            )}
          </div>

          {!product.stock && (
            <div className="absolute inset-0 grid place-items-center bg-cream/70 backdrop-blur-[1px]">
              <span className="rounded-full bg-plum px-4 py-1.5 text-xs font-semibold text-cream">
                Out of stock
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-rose-deep">
            {product.brand}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[0.92rem] font-semibold leading-snug">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-plum-soft">{product.size}</p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold">{taka(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-plum-soft line-through">{taka(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Always available, on every device — the reveal never gates this. */}
      <div className="px-4 pb-4">
        <motion.button
          type="button"
          onClick={handleAdd}
          disabled={!product.stock}
          whileTap={product.stock ? { scale: 0.97 } : undefined}
          transition={interact}
          className={`btn w-full text-[0.8rem] ${added ? 'btn-primary' : 'btn-outline'}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={!product.stock ? 'oos' : added ? 'added' : 'add'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              {!product.stock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Reveal panel — hover pointers only, and inert until hovered so it can
          never swallow a click meant for the card beneath it. */}
      <motion.div
        variants={revealOverlay}
        aria-hidden
        // Covers the whole card, not just the lower strip: at partial height the
        // card's own name and price showed through the panel behind the copy.
        // Softer blur than the reference's blur-xl: at 24px the plate behind
        // turned to mush. flex-col + the mt-auto block below anchors price and
        // CTAs to the bottom edge, so cards stay aligned no matter how long a
        // product's short description runs.
        // justify-end, the same composition the reference uses: the block flows
        // naturally — details, description, ingredients, price, CTAs — and sits
        // against the bottom padding. The slack lands at the top, where the
        // tinted glass over the product image reads as intentional rather than
        // as a void in the middle of the panel.
        //
        // An earlier flex-1/shrink-0 split pinned the CTAs to the bottom for
        // pixel-identical offsets, but it parked ~250px of emptiness between the
        // ingredients and the price. Compactness matters more here than
        // mathematically equal CTA positions.
        className="has-reveal reveal-glass pointer-events-none absolute inset-0 flex-col justify-end overflow-hidden rounded-2xl p-4 backdrop-blur-md group-hover:pointer-events-auto"
      >
        <motion.p variants={revealContent} className="eyebrow">
          Product details
        </motion.p>

        <motion.p
          variants={revealContent}
          className="mt-2 line-clamp-2 text-[0.78rem] leading-relaxed text-plum-soft"
        >
          {product.short}
        </motion.p>

        {/* The reference's feature grid, filled with real keyIngredients rather
            than invented specs. Only rendered when the product has them. */}
        {product.keyIngredients.length > 0 && (
          <motion.div variants={revealContent} className="mt-3">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-plum-soft">
              Key ingredients
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {product.keyIngredients.slice(0, 2).map((ing) => (
                <span
                  key={ing}
                  className="reveal-tile line-clamp-2 rounded-lg px-2 py-1.5 text-center text-[0.6rem] leading-tight text-plum"
                >
                  {ing}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={revealContent}
          className="mt-3 flex items-baseline gap-2 border-t border-rose/15 pt-3"
        >
          <span className="font-display text-xl font-semibold">{taka(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[0.7rem] text-plum-soft line-through">
              {taka(product.oldPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-auto text-[0.65rem] font-semibold text-rose-deep">
              Save {discount}%
            </span>
          )}
        </motion.div>

        <motion.div variants={revealContent} className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.stock}
            className="btn btn-primary w-full text-[0.78rem]"
          >
            {!product.stock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
          </button>
          <Link href={href} className="btn btn-outline w-full text-[0.78rem]">
            View details
          </Link>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
