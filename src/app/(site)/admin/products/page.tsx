import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listProducts } from '@/lib/repo';
import { CATEGORY_NAMES } from '@/lib/product-input';
import Reveal from '@/components/Reveal';
import AccountNav from '@/components/account/AccountNav';
import ProductManager from '@/components/admin/ProductManager';
import { ADMIN_NAV } from '@/components/account/nav-items';

export const metadata: Metadata = { title: 'Products · Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/admin/products');
  if (user.role !== 'admin') redirect('/dashboard');

  return (
    <div className="container-x py-16 md:py-20">
      <Reveal>
        <p className="eyebrow">Administration</p>
        <h1 className="font-display mt-2 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Products
        </h1>
        <p className="mt-3 max-w-xl text-sm text-plum-soft">
          Changes here are live on the shop immediately. Removing a product does not affect orders
          that already contain it — each order keeps its own copy of what was bought.
        </p>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav items={ADMIN_NAV} layoutId="admin-nav" />
        </aside>

        <div>
          <ProductManager products={listProducts()} categories={[...CATEGORY_NAMES]} />
        </div>
      </div>
    </div>
  );
}
