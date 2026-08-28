import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listOrdersForUser } from '@/lib/repo';
import { taka } from '@/data/site';
import Reveal, { RevealGroup } from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import StatusPill from '@/components/account/StatusPill';
import { ACCOUNT_NAV } from '@/components/account/nav-items';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'My orders' };
export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/orders');

  // Scoped by user id inside the query — there is no filter the visitor
  // controls, so no request can widen it to somebody else's orders.
  const orders = listOrdersForUser(user.id);

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Your account</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          My orders
        </h1>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ACCOUNT_NAV} />
        </aside>

        <div>
          {orders.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-dashed border-plum/20 py-20 text-center">
                <p className="font-display text-2xl">Nothing here yet</p>
                <p className="mt-2 text-sm text-plum-soft">
                  Your orders will appear here once you have placed one.
                </p>
                <Link href="/shop" className="btn btn-primary mt-6">
                  Browse the shop
                </Link>
              </div>
            </Reveal>
          ) : (
            <RevealGroup className="grid gap-3">
              {orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/orders/${o.id}`}
                  className="card-hover flex h-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-plum/10 bg-white p-4 sm:p-5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{o.id}</p>
                    <p className="mt-0.5 text-xs text-plum-soft">
                      {formatDate(o.created_at)} · {o.district} · {o.payment.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusPill status={o.status} />
                    <span className="font-display text-lg font-semibold">{taka(o.total)}</span>
                  </div>
                </Link>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>
    </div>
  );
}
