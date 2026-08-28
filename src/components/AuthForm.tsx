'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import Reveal from './Reveal';
import { interact } from '@/lib/motion';

/**
 * Sign in / sign up form.
 *
 * One component for both: the layout, error handling and redirect behaviour are
 * identical, only the fields and the endpoint differ. Any validation shown here
 * is a convenience — the API validates everything again, and its response is
 * what the person actually sees on submit.
 */
export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register';
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function set(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? values : { email: values.email, password: values.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(data.error || 'Something went wrong.');
        setBusy(false);
        return;
      }

      // refresh() so the server components re-render with the new session.
      router.replace(data.user?.role === 'admin' ? '/admin' : next);
      router.refresh();
    } catch {
      setMessage('Could not reach the server. Check your connection and try again.');
      setBusy(false);
    }
  }

  return (
    <div className="container-x py-16 md:py-20">
      <div className="mx-auto max-w-md">
        <Reveal>
          <p className="eyebrow">{isRegister ? 'Create an account' : 'Welcome back'}</p>
          <h1 className="font-display mt-2 text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-5xl">
            {isRegister ? 'Join Seoul Radiance' : 'Sign in'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-plum-soft">
            {isRegister
              ? 'Track your orders, keep your delivery details to hand, and reorder in a tap.'
              : 'Sign in to see your orders and manage your account.'}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
            {message && (
              <p
                role="alert"
                className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm"
              >
                {message}
              </p>
            )}

            {isRegister && (
              <Field
                label="Full name"
                name="name"
                value={values.name}
                error={errors.name}
                onChange={set}
                autoComplete="name"
                placeholder="e.g. Nusrat Jahan"
              />
            )}

            <Field
              label="Email"
              name="email"
              type="email"
              value={values.email}
              error={errors.email}
              onChange={set}
              autoComplete="email"
              placeholder="you@example.com"
            />

            <Field
              label="Password"
              name="password"
              type="password"
              value={values.password}
              error={errors.password}
              onChange={set}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              hint={isRegister ? 'At least 8 characters, including a letter and a number.' : undefined}
            />

            {isRegister && (
              <Field
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                error={errors.confirmPassword}
                onChange={set}
                autoComplete="new-password"
              />
            )}

            <motion.button
              type="submit"
              disabled={busy}
              whileHover={busy ? undefined : { y: -2 }}
              whileTap={busy ? undefined : { scale: 0.98 }}
              transition={interact}
              className="btn btn-primary mt-2 w-full"
            >
              {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </motion.button>

            {!isRegister && (
              <p className="text-right text-sm">
                <Link href="/forgot-password" className="text-plum-soft hover:text-rose-deep">
                  Forgot your password?
                </Link>
              </p>
            )}

            <p className="pt-2 text-center text-sm text-plum-soft">
              {isRegister ? 'Already have an account? ' : 'New to Seoul Radiance? '}
              <Link
                href={isRegister ? '/login' : '/register'}
                className="font-semibold text-rose-deep hover:underline"
              >
                {isRegister ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </form>
        </Reveal>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (field: string, value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className="field"
      />
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-rose-deep">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-plum-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
