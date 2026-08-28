import type { ReactNode } from 'react';

/** Small figure tile used across both dashboards. */
export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-plum-soft">
        {label}
      </p>
      <p className="font-display mt-2 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-plum-soft">{hint}</p>}
    </div>
  );
}
