'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { interact } from '@/lib/motion';

/**
 * Change password, from the settings page.
 *
 * The current password is required and verified server-side; this form only
 * collects it. On success the API ends every other session for the account, and
 * the count comes back so the person can see that happened.
 */
export default function PasswordForm() {
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);

  function set(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
    setDone('');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    setDone('');

    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(data.error || 'Could not change your password.');
        return;
      }

      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setDone(
        data.revokedSessions > 0
          ? `Password changed. ${data.revokedSessions} other ${
              data.revokedSessions === 1 ? 'session was' : 'sessions were'
            } signed out.`
          : 'Password changed.',
      );
    } catch {
      setMessage('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {message && (
        <p role="alert" className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm">
          {message}
        </p>
      )}
      {done && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-sage/40 bg-sage/10 px-4 py-3 text-sm"
        >
          {done}
        </motion.p>
      )}

      <PwField
        label="Current password"
        name="currentPassword"
        value={values.currentPassword}
        error={errors.currentPassword}
        onChange={set}
        autoComplete="current-password"
      />
      <PwField
        label="New password"
        name="newPassword"
        value={values.newPassword}
        error={errors.newPassword}
        onChange={set}
        autoComplete="new-password"
        hint="At least 8 characters, including a letter and a number."
      />
      <PwField
        label="Confirm new password"
        name="confirmPassword"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        onChange={set}
        autoComplete="new-password"
      />

      <motion.button
        type="submit"
        disabled={busy}
        whileHover={busy ? undefined : { y: -2 }}
        whileTap={busy ? undefined : { scale: 0.98 }}
        transition={interact}
        className="btn btn-primary mt-1"
      >
        {busy ? 'Changing…' : 'Change password'}
      </motion.button>
    </form>
  );
}

function PwField({
  label,
  name,
  value,
  error,
  onChange,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (f: string, v: string) => void;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type="password"
        className="field"
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={error ? true : undefined}
      />
      {error ? (
        <p role="alert" className="mt-1.5 text-xs text-rose-deep">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-plum-soft">{hint}</p>
      ) : null}
    </div>
  );
}
