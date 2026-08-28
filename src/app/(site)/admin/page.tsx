import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { adminStats, listAllOrders } from '@/lib/repo';
import { taka } from '@/data/site';
import Reveal, { RevealGroup } from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import StatCard from '@/components/account/StatCard';
import StatusPill from '@/components/account/StatusPill';
import { ADMIN_NAV } from '@/components/account/nav-items';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Admin' };
export const dynamic = 'force-dynamic';

/**
 * Every admin page repeats this guard. Middleware only proves a cookie exists;
 * the role has to be read from the database, and it is read here rather than
 * trusted from anything the browser sent.
 */
async function requireAdminPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/admin');
  if (user.role !== 'admin') redirect('/dashboard');
  return user;
}

export default async function AdminPage() {
  await requireAdminPage();

  const stats = adminStats();
  const recent = listAllOrders().slice(0, 8);

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Administration</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Overview
        </h1>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ADMIN_NAV} layoutId="admin-nav" />
        </aside>

        <div>
          <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Customers" value={stats.users} hint={`${stats.admins} admin`} />
            <StatCard label="Products" value={stats.productCount} />
            <StatCard label="Orders" value={stats.orderCount} />
            <StatCard label="Revenue" value={taka(stats.revenue)} hint="Excludes cancelled" />
          </RevealGroup>

          {stats.byStatus.length > 0 && (
            <Reveal delay={0.08}>
              <div className="mt-4 flex flex-wrap gap-2">
                {stats.byStatus.map((s) => (
                  <Link
                    key={s.status}
                    href={`/admin/orders?status=${s.status}`}
                    className="rounded-full border border-plum/15 bg-white px-3 py-1.5 text-xs transition-colors hover:border-rose/40"
                  >
                    <span className="capitalize">{s.status}</span>{' '}
                    <span className="font-semibold text-rose-deep">{s.n}</span>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.12}>
            <div className="mt-8 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold">Recent orders</h2>
              <Link
                href="/admin/orders"
                className="text-sm font-semibold text-rose-deep hover:underline"
              >
                View all →
              </Link>
            </div>
          </Reveal>

          {recent.length === 0 ? (
            <Reveal delay={0.16}>
              <div className="mt-4 rounded-2xl border border-dashed border-plum/20 py-16 text-center">
                <p className="font-display text-2xl">No orders yet</p>
                <p className="mt-2 text-sm text-plum-soft">
                  Orders placed on the site will appear here in real time.
                </p>
              </div>
            </Reveal>
          ) : (
            <RevealGroup className="mt-4 grid gap-3">
              {recent.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders?status=${o.status}`}
                  className="card-hover flex h-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-plum/10 bg-white p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{o.id}</p>
                    <p className="mt-0.5 text-xs text-plum-soft">
                      {o.customer_name} · {formatDate(o.created_at)}
                      {o.user_id === null ? ' · guest' : ''}
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
