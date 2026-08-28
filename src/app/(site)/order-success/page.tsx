'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { site, taka } from '@/data/site';
import { SESSION_KEY, whatsappOrderLink, type Order } from '@/lib/order';
import Reveal from '@/components/Reveal';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div className="container-x py-24 text-center text-plum-soft">Loading…</div>;
  }

  if (!order) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-4xl font-semibold">No recent order found</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-plum-soft">
          If you have just placed an order, we already have it — we will call you shortly to
          confirm. Otherwise, start a new one below.
        </p>
        <Link href="/shop" className="btn btn-primary mt-7">Back to the shop</Link>
      </div>
    );
  }

  return (
    <div className="container-x max-w-2xl py-14 md:py-20">
      <Reveal><div className="text-center">
        <span className="grid mx-auto h-16 w-16 place-items-center rounded-full bg-sage/25 text-3xl" aria-hidden>
          ✓
        </span>
        <h1 className="font-display mt-6 text-4xl font-semibold sm:text-5xl">Order placed!</h1>
        <p className="mt-3 text-sm leading-relaxed text-plum-soft">
          Thank you, {order.customer.name.split(' ')[0]}. We have received your order and will call{' '}
          <strong className="text-plum">{order.customer.phone}</strong> within a few hours to confirm it.
        </p>
        <p className="mt-5 inline-block rounded-full bg-blush px-5 py-2 text-sm font-semibold">
          Order ID: {order.id}
        </p>
      </div></Reveal>

      <Reveal delay={0.1}><div className="mt-9 rounded-2xl bg-blush/60 p-6 text-center">
        <p className="text-sm leading-relaxed text-plum-soft">
          Want it confirmed faster? Send us the order on WhatsApp and we will lock in your parcel
          right away.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappOrderLink(order)}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary"
          >
            Send order on WhatsApp
          </a>
          <a href={`tel:${site.phone}`} className="btn btn-outline">
            Call {site.phone}
          </a>
        </div>
      </div></Reveal>

      <Reveal delay={0.16}><div className="mt-6 rounded-2xl border border-plum/10 bg-white p-6">
        <h2 className="eyebrow mb-4">Order summary</h2>
        <ul className="space-y-3 border-b border-plum/10 pb-4">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between gap-4 text-sm">
              <span>
                <span className="font-semibold">{i.name}</span>
                <span className="block text-xs text-plum-soft">{i.brand} · {i.size} · qty {i.qty}</span>
              </span>
              <span className="shrink-0 font-semibold">{taka(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-plum-soft">Subtotal</dt>
            <dd>{taka(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-plum-soft">Delivery</dt>
            <dd>{order.shipping === 0 ? 'Free' : taka(order.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-plum/10 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="font-display text-xl">{taka(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-plum/10 pt-4 text-sm text-plum-soft">
          <p><strong className="text-plum">Deliver to:</strong> {order.customer.address}, {order.customer.district}</p>
          <p className="mt-1">
            <strong className="text-plum">Payment:</strong>{' '}
            {order.payment === 'cod' ? 'Cash on Delivery' : order.payment === 'bkash' ? 'bKash' : 'Nagad'}
            {order.trxId ? ` · TrxID ${order.trxId}` : ''}
          </p>
          <p className="mt-1">
            <strong className="text-plum">Expected:</strong>{' '}
            {order.zone === 'inside' ? '1–2 working days' : '2–4 working days'}
          </p>
        </div>
      </div></Reveal>

      <div className="mt-8 text-center">
        <Link href="/shop" className="text-sm font-semibold text-rose-deep hover:underline">
          Continue shopping →
        </Link>
      </div>
    </div>
  );
}
