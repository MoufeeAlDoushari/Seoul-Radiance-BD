import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShopClient from '@/components/ShopClient';
import { listProducts } from '@/lib/repo';

export const metadata: Metadata = {
  title: 'Shop all Korean skincare',
  description:
    'Browse every authentic Korean skincare product in stock at Seoul Radiance BD — cleansers, toners, serums, moisturisers, sunscreens and masks, with cash on delivery across Bangladesh.',
};

// The catalogue is editable from the admin panel, so this page reads it fresh
// rather than baking it in at build time.
export const dynamic = 'force-dynamic';

export default function ShopPage() {
  const products = listProducts();
  return (
    <Suspense
      fallback={
        <div className="container-x py-24 text-center text-plum-soft">Loading products…</div>
      }
    >
      <ShopClient products={products} />
    </Suspense>
  );
}
