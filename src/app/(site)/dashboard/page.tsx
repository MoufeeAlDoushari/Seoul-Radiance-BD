import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listOrdersForUser, userStats } from '@/lib/repo';
import { taka } from '@/data/site';
import Reveal, { RevealGroup } from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import StatCard from '@/components/account/StatCard';
import StatusPill from '@/components/account/StatusPill';
import { ACCOUNT_NAV } from '@/components/account/nav-items';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Server-side gate. Middleware only checks that a cookie exists; this is the
  // check that actually validates the session against the database.
  const user = await currentUser();
  if (!user) redirect('/login?next=/dashboard');

  const stats = userStats(user.id);
  const recent = listOrdersForUser(user.id).slice(0, 5);

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Your account</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Hello, {user.name.split(' ')[0]}
        </h1>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ACCOUNT_NAV} />
        </aside>

        <div>
          <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Total orders" value={stats.total} />
            <StatCard label="In progress" value={stats.pending} hint="Pending or processing" />
            <StatCard label="Delivered" value={stats.completed} />
            <StatCard label="Total spent" value={taka(stats.spent)} hint="Excludes cancelled" />
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="mt-8 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold">Recent orders</h2>
              <Link href="/orders" className="text-sm font-semibold text-rose-deep hover:underline">
                View all →
              </Link>
            </div>
          </Reveal>

          {recent.length === 0 ? (
            <Reveal delay={0.14}>
              <div className="mt-4 rounded-2xl border border-dashed border-plum/20 py-16 text-center">
                <p className="font-display text-2xl">No orders yet</p>
                <p className="mt-2 text-sm text-plum-soft">
                  When you place an order it will appear here with its status.
                </p>
                <Link href="/shop" className="btn btn-primary mt-6">
                  Start shopping
                </Link>
              </div>
            </Reveal>
          ) : (
            <RevealGroup className="mt-4 grid gap-3">
              {recent.map((o) => (
                <Link
                  key={o.id}
                  href={`/orders/${o.id}`}
                  className="card-hover flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-plum/10 bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{o.id}</p>
                    <p className="mt-0.5 text-xs text-plum-soft">
                      {formatDate(o.created_at)}
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
