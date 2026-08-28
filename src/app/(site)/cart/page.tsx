'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { interact } from '@/lib/motion';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { site, taka } from '@/data/site';

export default function CartPage() {
  const { detailed, ready, setQty, remove, subtotal, shipping, total, zone, setZone, count } =
    useCart();

  if (!ready) {
    return <div className="container-x py-24 text-center text-plum-soft">Loading your cart…</div>;
  }

  if (detailed.length === 0) {
    return (
      <div className="container-x py-20 text-center md:py-28">
        <svg className="mx-auto h-10 w-10 text-rose-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <h1 className="font-display mt-5 text-4xl font-semibold">Your cart is empty</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-plum-soft">
          Nothing here yet. Have a look at what our customers are repurchasing most.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">Start shopping</Link>
          <Link href="/shop?sort=bestselling" className="btn btn-outline">See best sellers</Link>
        </div>
      </div>
    );
  }

  const remaining = site.delivery.freeAbove - subtotal;

  return (
    <div className="container-x py-16 md:py-20">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Your cart</h1>
      <p className="mt-2 text-sm text-plum-soft">
        {count} {count === 1 ? 'item' : 'items'} ready to order
      </p>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* lines */}
        <div className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
          {detailed.map((l) => (
            <motion.div
              key={l.slug}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.22 } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 rounded-2xl border border-plum/8 bg-white p-3 sm:p-4"
            >
              <Link
                href={`/product/${l.slug}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-blush/50 sm:h-28 sm:w-24"
              >
                <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-rose-deep">
                  {l.brand}
                </p>
                <Link href={`/product/${l.slug}`} className="mt-0.5 text-sm font-semibold leading-snug hover:text-rose-deep">
                  {l.name}
                </Link>
                <p className="mt-0.5 text-xs text-plum-soft">{l.size}</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center rounded-full border border-plum/20">
                    <button
                      type="button"
                      onClick={() => setQty(l.slug, l.qty - 1)}
                      className="grid h-8 w-9 place-items-center hover:text-rose-deep"
                      aria-label={`Decrease quantity of ${l.name}`}
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(l.slug, l.qty + 1)}
                      className="grid h-8 w-9 place-items-center hover:text-rose-deep"
                      aria-label={`Increase quantity of ${l.name}`}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg font-semibold">{taka(l.lineTotal)}</span>
                    <button
                      type="button"
                      onClick={() => remove(l.slug)}
                      className="text-xs text-plum-soft underline underline-offset-2 hover:text-rose-deep"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>

          <Link href="/shop" className="inline-block pt-2 text-sm font-semibold text-rose-deep hover:underline">
            ← Continue shopping
          </Link>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-plum/10 bg-white p-6">
            <h2 className="font-display text-2xl font-semibold">Order summary</h2>

            <div className="mt-5">
              <p className="field-label">Delivery area</p>
              <div className="grid grid-cols-2 gap-2">
                {(['inside', 'outside'] as const).map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZone(z)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                      zone === z
                        ? 'chip-active'
                        : 'border-plum/15 text-plum hover:border-plum/40'
                    }`}
                  >
                    {z === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                    <span className="mt-0.5 block text-[0.65rem] font-normal opacity-75">
                      {taka(z === 'inside' ? site.delivery.insideDhaka : site.delivery.outsideDhaka)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <dl className="mt-6 space-y-2.5 border-t border-plum/10 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-plum-soft">Subtotal</dt>
                <dd className="font-semibold">{taka(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-plum-soft">Delivery</dt>
                <dd className="font-semibold">{shipping === 0 ? 'Free' : taka(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-plum/10 pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-2xl font-semibold">{taka(total)}</dd>
              </div>
            </dl>

            {remaining > 0 && (
              <p className="mt-4 rounded-xl bg-blush/60 px-4 py-3 text-xs leading-relaxed">
                Add <strong>{taka(remaining)}</strong> more and delivery is on us.
              </p>
            )}

            <Link href="/checkout" className="btn btn-primary mt-5 w-full">
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-[0.7rem] text-plum-soft">
              Cash on delivery · bKash &amp; Nagad accepted
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
