'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { districts, site, taka } from '@/data/site';
import { SESSION_KEY, type Order } from '@/lib/order';

type Payment = 'cod' | 'bkash' | 'nagad';

export default function CheckoutPage() {
  const { detailed, ready, subtotal, shipping, total, zone, setZone, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    notes: '',
    trxId: '',
  });
  const [payment, setPayment] = useState<Payment>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          payment,
          zone,
          lines: detailed.map((l) => ({ slug: l.slug, qty: l.qty })),
        }),
      });

      const data = (await res.json()) as { order?: Order; errors?: Record<string, string>; error?: string };

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          const first = document.querySelector<HTMLElement>('[data-error="true"]');
          first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          setServerError(data.error ?? 'Something went wrong. Please try again.');
        }
        return;
      }

      if (data.order) {
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(data.order));
        } catch {
          /* ignore blocked storage */
        }
        clear();
        router.push('/order-success');
      }
    } catch {
      setServerError(
        'Could not reach the server. Please check your connection, or order on WhatsApp instead.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <div className="container-x py-24 text-center text-plum-soft">Loading checkout…</div>;
  }

  if (detailed.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-4xl font-semibold">Nothing to check out</h1>
        <p className="mt-3 text-sm text-plum-soft">Add a product to your cart first.</p>
        <Link href="/shop" className="btn btn-primary mt-7">Go to the shop</Link>
      </div>
    );
  }

  const payNumber = site.phone;

  return (
    <div className="container-x py-16 md:py-20">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-sm text-plum-soft">
        Fill in your delivery details — we will call to confirm before dispatch.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 grid gap-8 lg:grid-cols-[1fr_380px]" noValidate>
        {/* ------------------------------------------------------------ form */}
        <div className="min-w-0 space-y-7">
          <section className="rounded-2xl border border-plum/10 bg-white p-6">
            <h2 className="font-display text-2xl font-semibold">Delivery details</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2" data-error={!!errors.name}>
                <label className="field-label" htmlFor="name">Full name *</label>
                <input
                  id="name" className="field" value={form.name} autoComplete="name"
                  onChange={(e) => update('name', e.target.value)} placeholder="e.g. Nusrat Jahan"
                />
                {errors.name && <p className="mt-1 text-xs text-rose-deep">{errors.name}</p>}
              </div>

              <div data-error={!!errors.phone}>
                <label className="field-label" htmlFor="phone">Mobile number *</label>
                <input
                  id="phone" className="field" value={form.phone} inputMode="tel" autoComplete="tel"
                  onChange={(e) => update('phone', e.target.value)} placeholder="01XXXXXXXXX"
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-deep">{errors.phone}</p>}
              </div>

              <div data-error={!!errors.email}>
                <label className="field-label" htmlFor="email">Email (optional)</label>
                <input
                  id="email" className="field" value={form.email} type="email" autoComplete="email"
                  onChange={(e) => update('email', e.target.value)} placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-rose-deep">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2" data-error={!!errors.address}>
                <label className="field-label" htmlFor="address">Full address *</label>
                <textarea
                  id="address" className="field min-h-[92px] resize-y" value={form.address}
                  autoComplete="street-address"
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="House / road / area, nearby landmark"
                />
                {errors.address && <p className="mt-1 text-xs text-rose-deep">{errors.address}</p>}
              </div>

              <div data-error={!!errors.district}>
                <label className="field-label" htmlFor="district">District *</label>
                <select
                  id="district" className="field" value={form.district}
                  onChange={(e) => {
                    update('district', e.target.value);
                    setZone(e.target.value === 'Dhaka' ? 'inside' : 'outside');
                  }}
                >
                  <option value="">Select your district</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <p className="mt-1 text-xs text-rose-deep">{errors.district}</p>}
              </div>

              <div>
                <label className="field-label" htmlFor="zone">Delivery area *</label>
                <select
                  id="zone" className="field" value={zone}
                  onChange={(e) => setZone(e.target.value as 'inside' | 'outside')}
                >
                  <option value="inside">Inside Dhaka — {taka(site.delivery.insideDhaka)}</option>
                  <option value="outside">Outside Dhaka — {taka(site.delivery.outsideDhaka)}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="notes">Order notes (optional)</label>
                <textarea
                  id="notes" className="field min-h-[72px] resize-y" value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Anything we should know — skin concerns, preferred delivery time…"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-plum/10 bg-white p-6">
            <h2 className="font-display text-2xl font-semibold">Payment method</h2>

            <div className="mt-5 space-y-3">
              {([
                { id: 'cod', title: 'Cash on Delivery', desc: 'Pay the courier when your parcel arrives. Most popular.' },
                { id: 'bkash', title: 'bKash', desc: `Send money to ${payNumber}, then enter the transaction ID.` },
                { id: 'nagad', title: 'Nagad', desc: `Send money to ${payNumber}, then enter the transaction ID.` },
              ] as const).map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                    payment === opt.id ? 'option-selected' : 'border-plum/15 hover:border-plum/35'
                  }`}
                >
                  <input
                    type="radio" name="payment" value={opt.id} checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)} className="mt-1 h-4 w-4 accent-[#e8b4b8]"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{opt.title}</span>
                    <span className="mt-0.5 block text-xs text-plum-soft">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>

            {payment !== 'cod' && (
              <div className="mt-4" data-error={!!errors.trxId}>
                <label className="field-label" htmlFor="trxId">
                  {payment === 'bkash' ? 'bKash' : 'Nagad'} transaction ID *
                </label>
                <input
                  id="trxId" className="field" value={form.trxId}
                  onChange={(e) => update('trxId', e.target.value)} placeholder="e.g. 8N7A2K9QX1"
                />
                {errors.trxId && <p className="mt-1 text-xs text-rose-deep">{errors.trxId}</p>}
                <p className="mt-2 text-xs text-plum-soft">
                  Send {taka(total)} to <strong>{payNumber}</strong> (personal), then paste the TrxID above.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* --------------------------------------------------------- summary */}
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-plum/10 bg-white p-6">
            <h2 className="font-display text-2xl font-semibold">Your order</h2>

            <ul className="mt-5 space-y-3 border-b border-plum/10 pb-5">
              {detailed.map((l) => (
                <li key={l.slug} className="flex gap-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-blush/50">
                    <Image src={l.image} alt={l.name} fill sizes="48px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-plum px-1 text-[0.6rem] font-bold text-cream">
                      {l.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{l.name}</p>
                    <p className="text-[0.7rem] text-plum-soft">{l.brand} · {l.size}</p>
                  </div>
                  <span className="text-sm font-semibold">{taka(l.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-plum-soft">Subtotal</dt>
                <dd className="font-semibold">{taka(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-plum-soft">Delivery</dt>
                <dd className="font-semibold">{shipping === 0 ? 'Free' : taka(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-plum/10 pt-3">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-2xl font-semibold">{taka(total)}</dd>
              </div>
            </dl>

            {errors.lines && <p className="mt-4 text-xs text-rose-deep">{errors.lines}</p>}
            {serverError && (
              <p className="mt-4 rounded-xl bg-rose/20 px-4 py-3 text-xs leading-relaxed text-plum">
                {serverError}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary mt-5 w-full">
              {submitting ? 'Placing order…' : `Place order · ${taka(total)}`}
            </button>

            <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-plum-soft">
              By ordering you agree to our delivery and returns policy. We will call to confirm
              before dispatch.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
