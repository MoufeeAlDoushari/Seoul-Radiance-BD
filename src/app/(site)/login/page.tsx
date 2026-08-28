import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { currentUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // Already signed in? There is no reason to show the form.
  const user = await currentUser();
  if (user) redirect(user.role === 'admin' ? '/admin' : '/dashboard');

  return (
    <Suspense
      fallback={<div className="container-x py-24 text-center text-plum-soft">Loading…</div>}
    >
      <AuthForm mode="login" />
    </Suspense>
  );
}
