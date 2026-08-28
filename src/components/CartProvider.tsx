'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { products } from '@/data/products';
import { site } from '@/data/site';

export type CartLine = { slug: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  zone: Zone;
  setZone: (z: Zone) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  detailed: { slug: string; qty: number; name: string; brand: string; price: number; image: string; size: string; lineTotal: number }[];
};

export type Zone = 'inside' | 'outside';

const STORAGE_KEY = 'srbd.cart.v1';
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [zone, setZone] = useState<Zone>('inside');
  const [ready, setReady] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { lines?: CartLine[]; zone?: Zone };
        if (Array.isArray(parsed.lines)) {
          // drop anything that is no longer in the catalogue
          setLines(parsed.lines.filter((l) => products.some((p) => p.slug === l.slug)));
        }
        if (parsed.zone === 'inside' || parsed.zone === 'outside') setZone(parsed.zone);
      }
    } catch {
      /* private mode / blocked storage - just start empty */
    }
    setReady(true);
  }, []);

  // Persist on every change (after the initial load).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, zone }));
    } catch {
      /* ignore */
    }
  }, [lines, zone, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      }
      return [...prev, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const detailed = useMemo(
    () =>
      lines.flatMap((l) => {
        const p = products.find((x) => x.slug === l.slug);
        if (!p) return [];
        return [
          {
            slug: p.slug,
            qty: l.qty,
            name: p.name,
            brand: p.brand,
            price: p.price,
            image: p.image,
            size: p.size,
            lineTotal: p.price * l.qty,
          },
        ];
      }),
    [lines],
  );

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => detailed.reduce((s, l) => s + l.lineTotal, 0), [detailed]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal >= site.delivery.freeAbove) return 0;
    return zone === 'inside' ? site.delivery.insideDhaka : site.delivery.outsideDhaka;
  }, [subtotal, zone]);

  const value: CartContextValue = {
    lines,
    ready,
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    zone,
    setZone,
    add,
    setQty,
    remove,
    clear,
    detailed,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
