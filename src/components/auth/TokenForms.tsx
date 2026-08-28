'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import Reveal from '../Reveal';
import { interact } from '@/lib/motion';

/* --------------------------------------------------------- shared shell -- */

function Shell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x py-16 md:py-20">
      <div className="mx-auto max-w-md">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="font-display mt-2 text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-plum-soft">{intro}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-8">{children}</div>
        </Reveal>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  value,
  error,
  onChange,
  autoComplete,
  hint,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        className="field"
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
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

function Submit({ busy, label, busyLabel }: { busy: boolean; label: string; busyLabel: string }) {
  return (
    <motion.button
      type="submit"
      disabled={busy}
      whileHover={busy ? undefined : { y: -2 }}
      whileTap={busy ? undefined : { scale: 0.98 }}
      transition={interact}
      className="btn btn-primary w-full"
    >
      {busy ? busyLabel : label}
    </motion.button>
  );
}

/* ------------------------------------------------------ forgot password -- */

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Swallowed on purpose. The confirmation below is shown either way so
      // that neither the response nor a network hiccup reveals whether the
      // address has an account.
    } finally {
      setSent(true);
      setBusy(false);
    }
  }

  return (
    <Shell
      eyebrow="Password help"
      title="Forgot password"
      intro="Enter the email on your account and we will send a link to set a new password."
    >
      {sent ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-sage/40 bg-sage/10 px-4 py-3 text-sm">
            If that email has an account, a reset link is on its way. The link works once and
            expires in 45 minutes.
          </p>
          <Link href="/login" className="btn btn-outline w-full">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Submit busy={busy} label="Send reset link" busyLabel="Sending…" />
          <p className="pt-1 text-center text-sm text-plum-soft">
            Remembered it?{' '}
            <Link href="/login" className="font-semibold text-rose-deep hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------- reset password -- */

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const [values, setValues] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(data.error || 'Could not reset your password.');
        return;
      }
      setDone(true);
    } catch {
      setMessage('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <Shell
        eyebrow="Password help"
        title="Reset password"
        intro="This link is missing its token. Request a fresh one and try again."
      >
        <Link href="/forgot-password" className="btn btn-primary w-full">
          Request a new link
        </Link>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell
        eyebrow="Password help"
        title="Password set"
        intro="Your password has been changed and every previous session has been signed out."
      >
        <button type="button" onClick={() => router.push('/login')} className="btn btn-primary w-full">
          Sign in
        </button>
      </Shell>
    );
  }

  return (
    <Shell
      eyebrow="Password help"
      title="Set a new password"
      intro="Choose something you have not used on this site before."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {message && (
          <p role="alert" className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm">
            {message}
          </p>
        )}
        <Field
          label="New password"
          name="password"
          type="password"
          value={values.password}
          error={errors.password}
          onChange={(v) => setValues((s) => ({ ...s, password: v }))}
          autoComplete="new-password"
          hint="At least 8 characters, including a letter and a number."
        />
        <Field
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(v) => setValues((s) => ({ ...s, confirmPassword: v }))}
          autoComplete="new-password"
        />
        <Submit busy={busy} label="Set password" busyLabel="Saving…" />
      </form>
    </Shell>
  );
}

/* -------------------------------------------------------- verify email --- */

export function VerifyEmailPanel() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<'idle' | 'working' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('This link is missing its token.');
      return;
    }
    let cancelled = false;
    setState('working');
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) setState('ok');
        else {
          setState('error');
          setMessage(data.error || 'That verification link is invalid or has expired.');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState('error');
        setMessage('Could not reach the server.');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Shell
      eyebrow="Your account"
      title={state === 'ok' ? 'Email confirmed' : 'Confirm your email'}
      intro={
        state === 'ok'
          ? 'Thank you — your address is verified.'
          : state === 'error'
            ? message
            : 'Checking your link…'
      }
    >
      <div className="space-y-3">
        {state === 'ok' && (
          <Link href="/dashboard" className="btn btn-primary w-full">
            Go to your dashboard
          </Link>
        )}
        {state === 'error' && (
          <Link href="/settings" className="btn btn-outline w-full">
            Send a new link from settings
          </Link>
        )}
      </div>
    </Shell>
  );
}
