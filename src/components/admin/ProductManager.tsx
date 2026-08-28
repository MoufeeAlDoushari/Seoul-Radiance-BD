'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { taka } from '@/data/site';
import { interact } from '@/lib/motion';
import type { Product } from '@/data/products';

/**
 * Product CRUD.
 *
 * Writes go through /api/admin/products, which re-validates every field and
 * re-checks the admin role. Nothing here is trusted — this is just the form.
 */

type Draft = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  oldPrice: string;
  size: string;
  image: string;
  stock: boolean;
  badges: string;
  short: string;
  description: string;
  keyIngredients: string;
  howToUse: string;
  skinTypes: string;
};

const EMPTY: Draft = {
  slug: '',
  name: '',
  brand: '',
  category: '',
  price: '',
  oldPrice: '',
  size: '',
  image: '',
  stock: true,
  badges: '',
  short: '',
  description: '',
  keyIngredients: '',
  howToUse: '',
  skinTypes: '',
};

function toDraft(p: Product): Draft {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: String(p.price),
    oldPrice: p.oldPrice ? String(p.oldPrice) : '',
    size: p.size,
    image: p.image,
    stock: p.stock,
    badges: (p.badges ?? []).join(', '),
    short: p.short,
    description: p.description,
    keyIngredients: p.keyIngredients.join(', '),
    howToUse: p.howToUse,
    skinTypes: p.skinTypes.join(', '),
  };
}

export default function ProductManager({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null); // slug, or '__new__'
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openNew() {
    setDraft(EMPTY);
    setErrors({});
    setMessage('');
    setEditing('__new__');
  }

  function openEdit(p: Product) {
    setDraft(toDraft(p));
    setErrors({});
    setMessage('');
    setEditing(p.slug);
  }

  function close() {
    setEditing(null);
    setErrors({});
    setMessage('');
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: '' }));
  }

  async function save() {
    setBusy(true);
    setErrors({});
    setMessage('');

    const isNew = editing === '__new__';
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${editing}`;

    try {
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          price: Number(draft.price),
          oldPrice: draft.oldPrice === '' ? null : Number(draft.oldPrice),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(data.error || 'Could not save the product.');
        return;
      }

      close();
      router.refresh();
    } catch {
      setMessage('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(slug: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || 'Could not delete the product.');
        return;
      }
      setConfirmDelete(null);
      router.refresh();
    } catch {
      setMessage('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-plum-soft">
          {products.length} {products.length === 1 ? 'product' : 'products'} in the catalogue.
        </p>
        <motion.button
          type="button"
          onClick={openNew}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={interact}
          className="btn btn-primary text-sm"
        >
          Add product
        </motion.button>
      </div>

      {message && !editing && (
        <p role="alert" className="mb-4 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm">
          {message}
        </p>
      )}

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.slug} className="rounded-2xl border border-plum/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-blush/50">
                <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-rose-deep">
                  {p.brand} · {p.category}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold">{p.name}</p>
                <p className="mt-0.5 text-xs text-plum-soft">
                  {p.slug} · {p.size}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-semibold">{taka(p.price)}</span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider ${
                    p.stock ? 'border-sage/40 text-sage' : 'border-plum/15 text-plum-soft'
                  }`}
                >
                  {p.stock ? 'In stock' : 'Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="text-xs font-semibold text-rose-deep hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(p.slug)}
                  className="text-xs text-plum-soft underline underline-offset-2 hover:text-rose-deep"
                >
                  Delete
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {confirmDelete === p.slug && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-plum/10 pt-4">
                    <p className="flex-1 text-sm text-plum-soft">
                      Remove <strong className="text-plum">{p.name}</strong> from the catalogue?
                      Past orders keep their own copy and are unaffected.
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(p.slug)}
                      disabled={busy}
                      className="btn btn-primary text-xs"
                    >
                      {busy ? 'Removing…' : 'Yes, remove'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="btn btn-outline text-xs"
                    >
                      Keep it
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* editor */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={editing === '__new__' ? 'Add product' : 'Edit product'}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="my-8 w-full max-w-2xl rounded-2xl border border-plum/15 bg-[rgba(14,11,12,0.98)] p-5 sm:p-6"
            >
              <h2 className="font-display text-2xl font-semibold">
                {editing === '__new__' ? 'Add product' : 'Edit product'}
              </h2>

              {message && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm"
                >
                  {message}
                </p>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Text label="Slug" k="slug" draft={draft} errors={errors} set={set} hint="lowercase-with-hyphens" />
                <Text label="Name" k="name" draft={draft} errors={errors} set={set} />
                <Text label="Brand" k="brand" draft={draft} errors={errors} set={set} />
                <div>
                  <label className="field-label" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    className="field"
                    value={draft.category}
                    onChange={(e) => set('category', e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1.5 text-xs text-rose-deep">{errors.category}</p>
                  )}
                </div>
                <Text label="Price (৳)" k="price" draft={draft} errors={errors} set={set} type="number" />
                <Text
                  label="Old price (৳)"
                  k="oldPrice"
                  draft={draft}
                  errors={errors}
                  set={set}
                  type="number"
                  hint="Leave blank for no discount"
                />
                <Text label="Size" k="size" draft={draft} errors={errors} set={set} hint="e.g. 50 ml" />
                <Text
                  label="Image path"
                  k="image"
                  draft={draft}
                  errors={errors}
                  set={set}
                  hint="/products/name.svg"
                />
                <Text
                  label="Badges"
                  k="badges"
                  draft={draft}
                  errors={errors}
                  set={set}
                  hint="bestseller, new"
                />
                <Text
                  label="Key ingredients"
                  k="keyIngredients"
                  draft={draft}
                  errors={errors}
                  set={set}
                  hint="Comma separated"
                />
                <Text
                  label="Skin types"
                  k="skinTypes"
                  draft={draft}
                  errors={errors}
                  set={set}
                  hint="Comma separated"
                />
                <div className="flex items-end pb-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.stock}
                      onChange={(e) => set('stock', e.target.checked)}
                      className="h-4 w-4 accent-[#e8b4b8]"
                    />
                    In stock (visible in the shop)
                  </label>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <Area label="Short description" k="short" draft={draft} set={set} />
                <Area label="Full description" k="description" draft={draft} set={set} />
                <Area label="How to use" k="howToUse" draft={draft} set={set} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={save} disabled={busy} className="btn btn-primary">
                  {busy ? 'Saving…' : editing === '__new__' ? 'Create product' : 'Save changes'}
                </button>
                <button type="button" onClick={close} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Text({
  label,
  k,
  draft,
  errors,
  set,
  type = 'text',
  hint,
}: {
  label: string;
  k: keyof Draft;
  draft: Draft;
  errors: Record<string, string>;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={String(k)}>
        {label}
      </label>
      <input
        id={String(k)}
        type={type}
        className="field"
        value={draft[k] as string}
        onChange={(e) => set(k, e.target.value as Draft[typeof k])}
      />
      {errors[k as string] ? (
        <p className="mt-1.5 text-xs text-rose-deep">{errors[k as string]}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-plum-soft">{hint}</p>
      ) : null}
    </div>
  );
}

function Area({
  label,
  k,
  draft,
  set,
}: {
  label: string;
  k: keyof Draft;
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={String(k)}>
        {label}
      </label>
      <textarea
        id={String(k)}
        className="field min-h-[80px]"
        value={draft[k] as string}
        onChange={(e) => set(k, e.target.value as Draft[typeof k])}
      />
    </div>
  );
}
