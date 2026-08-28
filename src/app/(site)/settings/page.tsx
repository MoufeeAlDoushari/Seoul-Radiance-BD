import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { site } from '@/data/site';
import Reveal from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import LogoutButton from '@/components/account/LogoutButton';
import PasswordForm from '@/components/account/PasswordForm';
import EmailVerification from '@/components/account/EmailVerification';
import { ACCOUNT_NAV } from '@/components/account/nav-items';
import { formatDateLong } from '@/lib/format';

export const metadata: Metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/settings');

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Your account</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Settings
        </h1>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ACCOUNT_NAV} />
        </aside>

        <div className="max-w-2xl space-y-4">
          <Reveal>
            <div className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
              <h2 className="eyebrow mb-4">Account</h2>
              <dl className="space-y-3 text-sm">
                <Row label="Name" value={user.name} />
                <Row label="Email" value={user.email} />
                <Row label="Role" value={user.role === 'admin' ? 'Administrator' : 'Customer'} />
                <Row label="Member since" value={formatDateLong(user.created_at)} />
              </dl>
              <Link href="/profile" className="btn btn-outline mt-5 text-sm">
                Edit profile
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.04}>
            <div className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
              <h2 className="eyebrow mb-4">Email address</h2>
              <EmailVerification verifiedAt={user.email_verified_at} email={user.email} />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
              <h2 className="eyebrow mb-4">Change password</h2>
              <PasswordForm />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
              <h2 className="eyebrow mb-3">Sessions</h2>
              <p className="text-sm leading-relaxed text-plum-soft">
                Signing out ends this session on our server straight away, not just in your browser.
              </p>
              <LogoutButton className="btn btn-outline mt-4 text-sm" />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
              <h2 className="eyebrow mb-3">Need something changed?</h2>
              <p className="text-sm leading-relaxed text-plum-soft">
                Account deletion and email changes are handled by hand so we can check the request
                is really yours. Message us and we will sort it the same day.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary text-sm"
                >
                  WhatsApp us
                </a>
                <Link href="/contact" className="btn btn-outline text-sm">
                  Other ways to reach us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-plum/10 pb-3 last:border-0 last:pb-0">
      <dt className="text-plum-soft">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
