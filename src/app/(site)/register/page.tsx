import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { currentUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Create an account' };
export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const user = await currentUser();
  if (user) redirect(user.role === 'admin' ? '/admin' : '/dashboard');

  return (
    <Suspense
      fallback={<div className="container-x py-24 text-center text-plum-soft">Loading…</div>}
    >
      <AuthForm mode="register" />
    </Suspense>
  );
}
