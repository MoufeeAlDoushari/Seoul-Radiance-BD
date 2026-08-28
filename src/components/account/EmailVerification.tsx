'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { interact } from '@/lib/motion';

/**
 * Email verification status and re-send.
 *
 * Verification is not required to shop — guest checkout already exists, so
 * gating the site on a working mailbox would take away a capability rather than
 * add one. This is here so the address on an account can be confirmed when it
 * matters, e.g. before a password reset is ever needed.
 */
export default function EmailVerification({
  verifiedAt,
  email,
}: {
  verifiedAt: string | null;
  email: string;
}) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function resend() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not send the link.');
        return;
      }
      setSent(true);
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  if (verifiedAt) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-sage/40 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-sage">
          Verified
        </span>
        <p className="text-sm text-plum-soft">{email}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-rose/40 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-rose-deep">
          Unverified
        </span>
        <p className="text-sm text-plum-soft">{email}</p>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-plum-soft">
        Confirming your address means we can reach you about an order, and lets you reset your
        password if you ever lose it. You can shop without it.
      </p>

      {sent ? (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-sage/40 bg-sage/10 px-4 py-3 text-sm"
        >
          Link sent. It expires in 48 hours.
        </motion.p>
      ) : (
        <motion.button
          type="button"
          onClick={resend}
          disabled={busy}
          whileHover={busy ? undefined : { y: -2 }}
          whileTap={busy ? undefined : { scale: 0.98 }}
          transition={interact}
          className="btn btn-outline mt-4 text-sm"
        >
          {busy ? 'Sending…' : 'Send verification link'}
        </motion.button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs text-rose-deep">
          {error}
        </p>
      )}
    </div>
  );
}
