'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Logout. Posts to the API so the session row is deleted server-side — clearing
 * the cookie alone would leave a still-valid token in the database.
 */
export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/');
      router.refresh();
    }
  }

  return (
    <button type="button" onClick={logout} disabled={busy} className={className}>
      {busy ? 'Signing out…' : 'Log out'}
    </button>
  );
}
