import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/TokenForms';

export const metadata: Metadata = { title: 'Reset password' };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense
      fallback={<div className="container-x py-24 text-center text-plum-soft">Loading…</div>}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
