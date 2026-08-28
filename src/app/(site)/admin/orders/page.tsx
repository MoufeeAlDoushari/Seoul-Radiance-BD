import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { getOrderItems, listAllOrders } from '@/lib/repo';
import { ORDER_STATUSES, isOrderStatus } from '@/lib/validate';
import Reveal, { RevealGroup } from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import AdminOrderRow from '@/components/admin/OrderRow';
import { ADMIN_NAV } from '@/components/account/nav-items';

export const metadata: Metadata = { title: 'Orders · Admin' };
export const dynamic = 'force-dynamic';

type Search = { searchParams: Promise<{ status?: string }> };

export default async function AdminOrdersPage({ searchParams }: Search) {
  const user = await currentUser();
  if (!user) redirect('/login?next=/admin/orders');
  if (user.role !== 'admin') redirect('/dashboard');

  const { status } = await searchParams;
  const filter = isOrderStatus(status) ? status : undefined;
  const orders = listAllOrders(filter);

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Administration</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Orders
        </h1>
        <p className="mt-3 text-sm text-plum-soft">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          {filter ? ` with status “${filter}”` : ' in total'}. Open one to see its lines.
        </p>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ADMIN_NAV} layoutId="admin-nav" />
        </aside>

        <div>
          <Reveal>
            <div className="mb-5 flex flex-wrap gap-2">
              <Link
                href="/admin/orders"
                className={`rounded-full border px-4 py-1.5 text-[0.8rem] font-medium transition-colors ${
                  !filter ? 'chip-active' : 'border-plum/15 bg-white hover:border-plum/40'
                }`}
              >
                All
              </Link>
              {ORDER_STATUSES.map((s) => (
                <Link
                  key={s}
                  href={`/admin/orders?status=${s}`}
                  className={`rounded-full border px-4 py-1.5 text-[0.8rem] font-medium capitalize transition-colors ${
                    filter === s ? 'chip-active' : 'border-plum/15 bg-white hover:border-plum/40'
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </Reveal>

          {orders.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-dashed border-plum/20 py-20 text-center">
                <p className="font-display text-2xl">No orders here</p>
                <p className="mt-2 text-sm text-plum-soft">
                  {filter ? 'Nothing with that status yet.' : 'Orders will appear as they come in.'}
                </p>
              </div>
            </Reveal>
          ) : (
            <RevealGroup className="grid gap-3">
              {orders.map((o) => (
                <AdminOrderRow key={o.id} order={o} items={getOrderItems(o.id)} />
              ))}
            </RevealGroup>
          )}
        </div>
      </div>
    </div>
  );
}
