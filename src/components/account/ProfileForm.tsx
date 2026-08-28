'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { interact } from '@/lib/motion';
import { districts } from '@/data/site';
import type { User } from '@/lib/auth';

/**
 * Profile editor.
 *
 * Note there is no user id in the payload: the API takes the id from the
 * session, so this form can only ever edit the person who is signed in.
 */
export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: user.name,
    phone: user.phone ?? '',
    address: user.address ?? '',
    district: user.district ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function set(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
    if (status === 'saved') setStatus('idle');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrors({});
    setMessage('');

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(data.error || 'Could not save your changes.');
        setStatus('error');
        return;
      }

      setStatus('saved');
      // Pull the server components back in step with the new name.
      router.refresh();
    } catch {
      setMessage('Could not reach the server. Check your connection.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {message && (
        <p role="alert" className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm">
          {message}
        </p>
      )}

      <div>
        <label className="field-label" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          className="field"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          autoComplete="name"
        />
        {errors.name && <p className="mt-1.5 text-xs text-rose-deep">{errors.name}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="email">
          Email
        </label>
        {/* Read-only: the email identifies the account and changing it would
            need a verification flow this project does not have. */}
        <input id="email" className="field" value={user.email} readOnly disabled />
        <p className="mt-1.5 text-xs text-plum-soft">
          Contact us if you need to change the email on your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="phone">
            Mobile number
          </label>
          <input
            id="phone"
            className="field"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="01XXXXXXXXX"
            autoComplete="tel"
          />
          {errors.phone && <p className="mt-1.5 text-xs text-rose-deep">{errors.phone}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="district">
            District
          </label>
          <select
            id="district"
            className="field"
            value={values.district}
            onChange={(e) => set('district', e.target.value)}
          >
            <option value="">Select your district</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="address">
          Delivery address
        </label>
        <textarea
          id="address"
          className="field min-h-[92px]"
          value={values.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder="House / road / area, nearby landmark"
          autoComplete="street-address"
        />
        {errors.address && <p className="mt-1.5 text-xs text-rose-deep">{errors.address}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <motion.button
          type="submit"
          disabled={status === 'saving'}
          whileHover={status === 'saving' ? undefined : { y: -2 }}
          whileTap={status === 'saving' ? undefined : { scale: 0.98 }}
          transition={interact}
          className="btn btn-primary"
        >
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </motion.button>
        {status === 'saved' && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-rose-deep"
          >
            Saved.
          </motion.span>
        )}
      </div>
    </form>
  );
}
