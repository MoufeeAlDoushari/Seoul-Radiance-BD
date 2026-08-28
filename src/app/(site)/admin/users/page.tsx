import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listUsers } from '@/lib/repo';
import Reveal, { RevealGroup } from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import UserRow from '@/components/admin/UserRow';
import { ADMIN_NAV } from '@/components/account/nav-items';

export const metadata: Metadata = { title: 'Users · Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const admin = await currentUser();
  if (!admin) redirect('/login?next=/admin/users');
  if (admin.role !== 'admin') redirect('/dashboard');

  const users = listUsers();

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Administration</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Users
        </h1>
        <p className="mt-3 max-w-xl text-sm text-plum-soft">
          {users.length} {users.length === 1 ? 'account' : 'accounts'}. Order counts and totals
          exclude cancelled orders. Suspending an account ends its sessions immediately.
        </p>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ADMIN_NAV} layoutId="admin-nav" />
        </aside>

        <div>
          <RevealGroup className="grid gap-3">
            {users.map((u) => (
              <UserRow key={u.id} user={u} isSelf={u.id === admin.id} />
            ))}
          </RevealGroup>
        </div>
      </div>
    </div>
  );
}
