'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { drawer, drawerItem, interact } from '@/lib/motion';
import { useCart } from './CartProvider';
import { categories } from '@/data/products';
import { site } from '@/data/site';
import LogoutButton from './account/LogoutButton';
import type { User } from '@/lib/auth';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop All' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ user }: { user: User | null }) {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* announcement bar */}
      <div className="bg-plum text-cream text-[0.72rem] sm:text-xs tracking-wide">
        <div className="container-x flex items-center justify-center gap-2 py-2 text-center">
          <span aria-hidden>✦</span>
          <span>
            100% authentic &amp; imported · Free delivery over ৳{site.delivery.freeAbove.toLocaleString('en-US')} · Cash on delivery
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-plum/10 bg-cream/85 backdrop-blur-md">
        <div className="container-x flex items-center justify-between gap-4 py-3.5">
          {/* mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden -ml-1 p-2 text-plum"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>

          <Link href="/" className="shrink-0">
            <span className="leading-tight">
              <span className="font-display block text-lg sm:text-xl font-semibold tracking-wide">
                Seoul Radiance
              </span>
              <span className="block text-[0.6rem] tracking-[0.32em] text-plum-soft -mt-0.5">
                BANGLADESH
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`relative py-1 transition-colors hover:text-rose-deep ${
                  pathname === n.href ? 'text-rose-deep' : 'text-plum'
                }`}
              >
                {n.label}
                {/* A single shared element that slides between items on route
                    change, rather than one indicator per link fading in/out. */}
                {pathname === n.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-rose-deep"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            ))}
            <div className="group relative">
              <button className="flex items-center gap-1 text-plum transition-colors hover:text-rose-deep">
                Categories
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full w-60 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-plum/10 bg-white p-2 shadow-xl shadow-plum/10">
                  {categories.map((c) => (
                    <Link
                      key={c.name}
                      href={`/shop?category=${encodeURIComponent(c.name)}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-blush hover:text-rose-deep"
                    >
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Account entry point. Rendered from the session resolved on the
              server, so it is correct on first paint with no flash. */}
          <div className="group relative ml-auto hidden md:block">
            <button className="flex items-center gap-1.5 py-1 text-sm font-medium text-plum transition-colors hover:text-rose-deep">
              {user ? user.name.split(' ')[0] : 'Account'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="invisible absolute right-0 top-full w-52 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-plum/10 bg-white p-2 shadow-xl shadow-plum/10">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-deep transition-colors hover:bg-blush">
                        Admin panel
                      </Link>
                    )}
                    <Link href="/dashboard" className="block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-blush hover:text-rose-deep">
                      Dashboard
                    </Link>
                    <Link href="/orders" className="block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-blush hover:text-rose-deep">
                      My orders
                    </Link>
                    <Link href="/profile" className="block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-blush hover:text-rose-deep">
                      Profile
                    </Link>
                    <div className="my-1 border-t border-plum/10" />
                    <LogoutButton className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-plum-soft transition-colors hover:bg-blush hover:text-rose-deep" />
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-blush hover:text-rose-deep">
                      Sign in
                    </Link>
                    <Link href="/register" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-deep transition-colors hover:bg-blush">
                      Create an account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link href="/cart" className="relative shrink-0 p-2 text-plum hover:text-rose-deep" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {/* The badge pops on every count change — the site's one piece of
                "something happened" feedback outside the button itself. */}
            <AnimatePresence>
              {ready && count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={interact}
                  className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-deep px-1 text-[0.65rem] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* mobile drawer — height + opacity, with its rows walked in */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile-drawer"
              variants={drawer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden overflow-hidden border-t border-plum/10 bg-cream"
            >
              <div className="container-x py-4">
                <div className="flex flex-col">
                  {nav.map((n) => (
                    <motion.div key={n.href} variants={drawerItem}>
                      <Link href={n.href} className="block py-2.5 text-[0.95rem] font-medium">
                        {n.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.p variants={drawerItem} className="eyebrow mt-4 mb-2">
                  Categories
                </motion.p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <motion.div key={c.name} variants={drawerItem}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(c.name)}`}
                        className="block rounded-xl bg-blush/60 px-3 py-2.5 text-sm"
                      >
                        {c.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div variants={drawerItem} className="mt-4 border-t border-plum/10 pt-4">
                  {user ? (
                    <>
                      <p className="eyebrow mb-2">{user.name}</p>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="block py-2.5 text-[0.95rem] font-semibold text-rose-deep">
                          Admin panel
                        </Link>
                      )}
                      <Link href="/dashboard" className="block py-2.5 text-[0.95rem] font-medium">
                        Dashboard
                      </Link>
                      <Link href="/orders" className="block py-2.5 text-[0.95rem] font-medium">
                        My orders
                      </Link>
                      <Link href="/profile" className="block py-2.5 text-[0.95rem] font-medium">
                        Profile
                      </Link>
                      <LogoutButton className="block w-full py-2.5 text-left text-[0.95rem] text-plum-soft" />
                    </>
                  ) : (
                    <div className="flex gap-3">
                      <Link href="/login" className="btn btn-outline flex-1 text-sm">
                        Sign in
                      </Link>
                      <Link href="/register" className="btn btn-primary flex-1 text-sm">
                        Sign up
                      </Link>
                    </div>
                  )}
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
