import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { getOrder, getOrderItems } from '@/lib/repo';
import { taka } from '@/data/site';
import Reveal from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import StatusPill from '@/components/account/StatusPill';
import { ACCOUNT_NAV } from '@/components/account/nav-items';
import { formatDateLong } from '@/lib/format';

export const metadata: Metadata = { title: 'Order details' };
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Params) {
  const user = await currentUser();
  if (!user) redirect('/login?next=/orders');

  const { id } = await params;
  const order = getOrder(id);

  // The ownership check that makes this page safe. Somebody else's order is a
  // 404 rather than a 403 — there is no reason to confirm the id even exists.
  if (!order || order.user_id !== user.id) notFound();

  const items = getOrderItems(order.id);

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <Link href="/orders" className="text-sm font-semibold text-rose-deep hover:underline">
          ← My orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-[2rem] font-semibold leading-tight sm:text-4xl">
            {order.id}
          </h1>
          <StatusPill status={order.status} />
        </div>
        <p className="mt-2 text-sm text-plum-soft">Placed {formatDateLong(order.created_at)}</p>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ACCOUNT_NAV} />
        </aside>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Reveal className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
            <h2 className="eyebrow mb-4">Items</h2>
            <ul className="space-y-3 border-b border-plum/10 pb-4">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 text-sm">
                  <span className="min-w-0">
                    <span className="font-semibold">{i.name}</span>
                    <span className="block text-xs text-plum-soft">
                      {i.brand} · {i.size} · qty {i.qty}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold">{taka(i.line_total)}</span>
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
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <div className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
              <h2 className="eyebrow mb-4">Delivery</h2>
              <div className="space-y-2 text-sm text-plum-soft">
                <p className="font-semibold text-plum">{order.customer_name}</p>
                <p>{order.phone}</p>
                <p>
                  {order.address}, {order.district}
                </p>
                <p className="pt-2">
                  <strong className="text-plum">Payment:</strong>{' '}
                  {order.payment === 'cod'
                    ? 'Cash on delivery'
                    : order.payment === 'bkash'
                      ? 'bKash'
                      : 'Nagad'}
                  {order.trx_id ? ` · TrxID ${order.trx_id}` : ''}
                </p>
                <p>
                  <strong className="text-plum">Zone:</strong>{' '}
                  {order.zone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                </p>
                {order.notes && (
                  <p>
                    <strong className="text-plum">Notes:</strong> {order.notes}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
