import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import Reveal from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import ProfileForm from '@/components/account/ProfileForm';
import { ACCOUNT_NAV } from '@/components/account/nav-items';
import { formatDateLong } from '@/lib/format';

export const metadata: Metadata = { title: 'Profile' };
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/profile');

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Your account</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Profile
        </h1>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ACCOUNT_NAV} />
        </aside>

        <div className="max-w-2xl">
          <Reveal>
            <div className="mb-5 flex items-center gap-4 rounded-2xl border border-plum/10 bg-white p-5">
              {/* Initials rather than an uploaded avatar: there is no file
                  storage in this project, and inventing one is out of scope. */}
              <span
                aria-hidden
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-rose/25 bg-rose/10 font-display text-xl"
              >
                {user.name
                  .split(' ')
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold">{user.name}</p>
                <p className="truncate text-sm text-plum-soft">{user.email}</p>
                <p className="mt-0.5 text-xs text-plum-soft">
                  {user.role === 'admin' ? 'Administrator' : 'Customer'} · joined{' '}
                  {formatDateLong(user.created_at)}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
              <h2 className="eyebrow mb-5">Account details</h2>
              <ProfileForm user={user} />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
