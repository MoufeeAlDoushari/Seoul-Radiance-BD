import type { OrderStatus } from '@/lib/validate';

/**
 * Order status chip. Colours stay inside the brand palette — rose for the
 * states that need attention, sage for delivered, muted for the rest — rather
 * than the usual traffic-light green/amber/red.
 */
const TONE: Record<OrderStatus, string> = {
  pending: 'border-rose/30 text-rose-deep',
  processing: 'border-rose/30 text-rose-deep',
  shipped: 'border-plum/20 text-plum',
  delivered: 'border-sage/40 text-sage',
  cancelled: 'border-plum/15 text-plum-soft line-through',
};

export default function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider ${TONE[status]}`}
    >
      {status}
    </span>
  );
}
