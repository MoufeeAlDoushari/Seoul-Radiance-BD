import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AddToCart from '@/components/AddToCart';
import ProductCard from '@/components/ProductCard';
import Reveal, { RevealGroup } from '@/components/Reveal';
import ProductGallery from '@/components/ProductGallery';
import { getProductBySlug, listProducts } from '@/lib/repo';
import { site, taka } from '@/data/site';

type Params = { params: Promise<{ slug: string }> };

// The catalogue is editable from the admin panel, so this route renders on
// demand rather than being pre-generated at build time.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.brand} ${product.name}`,
    description: product.short,
    openGraph: { title: `${product.brand} ${product.name}`, description: product.short },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const catalogue = listProducts();
  const related = catalogue
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 4);
  const fallbackRelated = catalogue.filter((p) => p.slug !== product.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    image: `${site.url}${product.image}`,
    offers: {
      '@type': 'Offer',
      url: `${site.url}/product/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: product.stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-x pt-6">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-plum-soft">
          <Link href="/" className="hover:text-rose-deep">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-rose-deep">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-rose-deep">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-plum">{product.name}</span>
        </nav>
      </div>

      <article className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-16 md:py-20">
        {/* image */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery src={product.image} alt={product.name}>
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.badges?.includes('bestseller') && (
                <span className="rounded-full bg-plum px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-cream">
                  Best seller
                </span>
              )}
              {product.badges?.includes('new') && (
                <span className="rounded-full bg-sage px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white">
                  New
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-rose-deep px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white">
                  Save {discount}%
                </span>
              )}
            </div>
          </ProductGallery>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[0.7rem] text-plum-soft">
            <div className="rounded-xl border border-plum/8 bg-white px-2 py-3">
              <svg className="mx-auto h-[18px] w-[18px] text-rose-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z"/><path d="M9.2 12.2l2 2 3.6-3.9"/></svg>
              <p className="mt-1 font-semibold text-plum">100% authentic</p>
            </div>
            <div className="rounded-xl border border-plum/8 bg-white px-2 py-3">
              <svg className="mx-auto h-[18px] w-[18px] text-rose-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 10v4M18 10v4"/></svg>
              <p className="mt-1 font-semibold text-plum">Cash on delivery</p>
            </div>
            <div className="rounded-xl border border-plum/8 bg-white px-2 py-3">
              <svg className="mx-auto h-[18px] w-[18px] text-rose-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>
              <p className="mt-1 font-semibold text-plum">1–4 day delivery</p>
            </div>
          </div>
        </div>

        {/* details */}
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-rose-deep">
            {product.brand}
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold leading-tight sm:text-[2.6rem]">
            {product.name}
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-plum-soft">{product.short}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-semibold">{taka(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-plum-soft line-through">{taka(product.oldPrice)}</span>
            )}
            <span className="rounded-full bg-blush px-3 py-1 text-xs font-medium">{product.size}</span>
            {product.stock ? (
              <span className="text-xs font-semibold text-sage">● In stock</span>
            ) : (
              <span className="text-xs font-semibold text-rose-deep">● Out of stock</span>
            )}
          </div>

          <AddToCart product={product} />

          <div className="mt-9 space-y-7 border-t border-plum/10 pt-7">
            <section>
              <h2 className="eyebrow mb-3">About this product</h2>
              <p className="text-[0.93rem] leading-relaxed text-plum-soft">{product.description}</p>
            </section>

            <section>
              <h2 className="eyebrow mb-3">Key ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {product.keyIngredients.map((i) => (
                  <span key={i} className="rounded-full border border-plum/12 bg-white px-3 py-1.5 text-xs font-medium">
                    {i}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="eyebrow mb-3">Best for</h2>
              <div className="flex flex-wrap gap-2">
                {product.skinTypes.map((s) => (
                  <span key={s} className="rounded-full bg-blush px-3 py-1.5 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="eyebrow mb-3">How to use</h2>
              <p className="text-[0.93rem] leading-relaxed text-plum-soft">{product.howToUse}</p>
            </section>

            <section className="rounded-2xl bg-blush/50 p-5">
              <h2 className="eyebrow mb-2">Delivery</h2>
              <ul className="space-y-1.5 text-sm text-plum-soft">
                <li>Inside Dhaka — {taka(site.delivery.insideDhaka)}, delivered in 1–2 days</li>
                <li>Outside Dhaka — {taka(site.delivery.outsideDhaka)}, delivered in 2–4 days</li>
                <li className="font-semibold text-plum">
                  Free delivery on orders over {taka(site.delivery.freeAbove)}
                </li>
              </ul>
            </section>
          </div>
        </div>
      </article>

      <section className="container-x py-16 md:py-20">
        <Reveal>
          <h2 className="font-display mb-6 text-2xl font-semibold sm:text-3xl">
            You might also like
          </h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {(related.length ? related : fallbackRelated).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
