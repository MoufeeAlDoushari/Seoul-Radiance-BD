'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import StatusPill from '../account/StatusPill';
import { taka } from '@/data/site';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/validate';
import { formatDateTime } from '@/lib/format';
import type { OrderItemRow, OrderRow as Row } from '@/lib/repo';

/**
 * One order in the admin list: expands to show its lines, and lets an admin
 * move it through the fulfilment statuses. The write goes to the admin API,
 * which re-checks the role — this component being rendered is not the
 * authorisation.
 */
export default function AdminOrderRow({ order, items }: { order: Row; items: OrderItemRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function change(next: OrderStatus) {
    const previous = status;
    setStatus(next); // optimistic
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(previous); // roll back on failure
        setError(data.error || 'Could not update the status.');
        return;
      }
      router.refresh();
    } catch {
      setStatus(previous);
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-plum/10 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-sm font-semibold">{order.id}</p>
          <p className="mt-0.5 text-xs text-plum-soft">
            {order.customer_name} · {order.phone} · {formatDateTime(order.created_at)}
            {order.user_id === null ? ' · guest' : ''}
          </p>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={status} />
          <span className="font-display text-lg font-semibold">{taka(order.total)}</span>
          <select
            aria-label={`Status for order ${order.id}`}
            className="field w-auto py-1.5 text-xs"
            value={status}
            disabled={busy}
            onChange={(e) => change(e.target.value as OrderStatus)}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="px-4 pb-3 text-xs text-rose-deep">
          {error}
        </p>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-plum/10"
          >
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow mb-2">Items</h3>
                <ul className="space-y-1.5 text-sm">
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-3">
                      <span className="min-w-0 text-plum-soft">
                        {i.name} <span className="text-xs">× {i.qty}</span>
                      </span>
                      <span className="shrink-0 font-semibold">{taka(i.line_total)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-plum/10 pt-2 text-sm">
                  <span className="text-plum-soft">Delivery</span>
                  <span>{order.shipping === 0 ? 'Free' : taka(order.shipping)}</span>
                </div>
              </div>

              <div>
                <h3 className="eyebrow mb-2">Delivery</h3>
                <div className="space-y-1 text-sm text-plum-soft">
                  <p>
                    {order.address}, {order.district}
                  </p>
                  <p>
                    {order.zone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'} ·{' '}
                    {order.payment.toUpperCase()}
                    {order.trx_id ? ` · ${order.trx_id}` : ''}
                  </p>
                  {order.email && <p>{order.email}</p>}
                  {order.notes && <p className="pt-1">Notes: {order.notes}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
