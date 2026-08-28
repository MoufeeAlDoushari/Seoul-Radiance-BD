'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';
import { staggerContainer, staggerItem, interact } from '@/lib/motion';
import { categories, type Category, type Product } from '@/data/products';

type Sort = 'featured' | 'priceAsc' | 'priceDesc' | 'newest' | 'bestselling';

const sortOptions: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'bestselling', label: 'Best selling' },
  { value: 'newest', label: 'Newest first' },
  { value: 'priceAsc', label: 'Price: low to high' },
  { value: 'priceDesc', label: 'Price: high to low' },
];

// Products now arrive from the database via the server component, so an admin
// editing the catalogue is reflected here immediately.
export default function ShopClient({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();

  const urlCategory = params.get('category') as Category | null;
  const urlConcern = params.get('concern');
  const urlSort = params.get('sort') as Sort | null;

  const [category, setCategory] = useState<Category | 'All'>(urlCategory ?? 'All');
  const [concern, setConcern] = useState<string | null>(urlConcern);
  const [sort, setSort] = useState<Sort>(urlSort ?? 'featured');
  const [query, setQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // keep state in sync when the user navigates with header/footer links
  useEffect(() => {
    setCategory((params.get('category') as Category | null) ?? 'All');
    setConcern(params.get('concern'));
    setSort((params.get('sort') as Sort | null) ?? 'featured');
  }, [params]);

  const shown = useMemo(() => {
    let list = [...products];

    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (concern) {
      const c = concern.toLowerCase();
      list = list.filter((p) => p.skinTypes.some((s) => s.toLowerCase().includes(c)));
    }
    if (inStockOnly) list = list.filter((p) => p.stock);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.keyIngredients.some((i) => i.toLowerCase().includes(q)),
      );
    }

    switch (sort) {
      case 'priceAsc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort(
          (a, b) => Number(!!b.badges?.includes('new')) - Number(!!a.badges?.includes('new')),
        );
        break;
      case 'bestselling':
        list.sort(
          (a, b) =>
            Number(!!b.badges?.includes('bestseller')) - Number(!!a.badges?.includes('bestseller')),
        );
        break;
      default:
        break;
    }

    return list;
  }, [products, category, concern, sort, query, inStockOnly]);

  function pickCategory(c: Category | 'All') {
    setCategory(c);
    setConcern(null);
    const sp = new URLSearchParams();
    if (c !== 'All') sp.set('category', c);
    if (sort !== 'featured') sp.set('sort', sort);
    router.replace(sp.toString() ? `/shop?${sp}` : '/shop', { scroll: false });
  }

  return (
    <div className="container-x py-16 md:py-20">
      <div className="mb-8">
        <p className="eyebrow">The full shelf</p>
        <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">
          {category === 'All' ? 'All products' : category}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-plum-soft">
          {concern
            ? `Products suited to ${concern.toLowerCase()} skin.`
            : 'Every product is imported, sealed and 100% authentic. Cash on delivery all over Bangladesh.'}
        </p>
      </div>

      {/* filter bar */}
      <div className="sticky top-[68px] z-30 -mx-5 mb-8 border-y border-plum/10 bg-cream/90 px-5 py-3 backdrop-blur-md md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[190px] flex-1 sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-plum-soft"
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or ingredients…"
              className="field pl-9"
              aria-label="Search products"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="field w-auto"
            aria-label="Sort products"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-plum-soft">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 accent-[#c98a92]"
            />
            In stock only
          </label>

          <span className="ml-auto text-sm text-plum-soft">
            {shown.length} {shown.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(['All', ...categories.map((c) => c.name)] as (Category | 'All')[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pickCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-[0.8rem] font-medium transition-colors ${
                category === c
                  ? 'chip-active'
                  : 'border-plum/15 bg-white text-plum hover:border-plum/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Filtering swaps the whole grid rather than animating 24 cards
          individually — one entrance reads calmer and costs far less.

          Deliberately NOT AnimatePresence `mode="wait"`: that holds the old
          grid in the DOM until its exit animation finishes, so if the animation
          ever stalls the shop shows stale products while the counter reports the
          new total. Keying the grid on the filter state remounts it immediately
          and the entrance still plays — correctness never waits on motion. */}
      <div>
        {shown.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-dashed border-plum/20 py-20 text-center"
          >
            <p className="font-display text-2xl">Nothing matches that search</p>
            <p className="mt-2 text-sm text-plum-soft">
              Try a different keyword, or clear the filters to see everything.
            </p>
            <motion.button
              type="button"
              onClick={() => {
                setQuery('');
                setInStockOnly(false);
                pickCategory('All');
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={interact}
              className="btn btn-outline mt-6"
            >
              Clear filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key={`${category}-${sort}-${inStockOnly}-${query}`}
            variants={staggerContainer(0.035)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {shown.map((p) => (
              <motion.div key={p.slug} variants={staggerItem}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
