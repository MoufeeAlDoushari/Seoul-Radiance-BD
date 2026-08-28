'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { taka } from '@/data/site';
import { formatDate } from '@/lib/format';
import type { AdminUserRow } from '@/lib/repo';

/**
 * One customer in the admin list, with role and status controls.
 *
 * `isSelf` disables the controls for the signed-in admin. The API enforces the
 * same rule — this only avoids offering a button that would be refused.
 */
export default function UserRow({ user, isSelf }: { user: AdminUserRow; isSelf: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function patch(body: Record<string, string>) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not update this account.');
        return;
      }
      router.refresh();
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-4">
      <div className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rose/25 bg-rose/10 font-display text-sm"
        >
          {user.name
            .split(' ')
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {user.name}
            {isSelf && <span className="ml-2 text-xs text-plum-soft">(you)</span>}
          </p>
          <p className="truncate text-xs text-plum-soft">{user.email}</p>
          <p className="mt-0.5 text-xs text-plum-soft">
            Joined {formatDate(user.created_at)}
            {user.phone ? ` · ${user.phone}` : ''}
            {user.district ? ` · ${user.district}` : ''}
          </p>
        </div>

        <div className="text-right text-xs text-plum-soft">
          <p>
            <span className="font-semibold text-plum">{user.order_count}</span>{' '}
            {user.order_count === 1 ? 'order' : 'orders'}
          </p>
          <p className="mt-0.5">{taka(user.total_spent)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider ${
              user.role === 'admin' ? 'border-rose/40 text-rose-deep' : 'border-plum/15 text-plum-soft'
            }`}
          >
            {user.role}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider ${
              user.status === 'active' ? 'border-sage/40 text-sage' : 'border-plum/15 text-plum-soft'
            }`}
          >
            {user.status}
          </span>

          {!isSelf && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => patch({ role: user.role === 'admin' ? 'user' : 'admin' })}
                className="text-xs font-semibold text-rose-deep hover:underline"
              >
                {user.role === 'admin' ? 'Make customer' : 'Make admin'}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => patch({ status: user.status === 'active' ? 'suspended' : 'active' })}
                className="text-xs text-plum-soft underline underline-offset-2 hover:text-rose-deep"
              >
                {user.status === 'active' ? 'Suspend' : 'Reactivate'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs text-rose-deep">
          {error}
        </p>
      )}
    </div>
  );
}
