'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import LogoutButton from './LogoutButton';

/**
 * Side navigation shared by the account and admin areas.
 *
 * The active item is marked with the same sliding rose underline the main
 * header uses, so the two navigations feel like one system.
 */
export default function AccountNav({
  items,
  layoutId = 'account-nav',
}: {
  items: { href: string; label: string }[];
  layoutId?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`relative rounded-xl px-3 py-2.5 text-sm transition-colors ${
              active ? 'text-rose-deep' : 'text-plum-soft hover:text-plum'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl border border-rose/20 bg-white/5"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
      <div className="mt-2 border-t border-plum/10 pt-2">
        <LogoutButton className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-plum-soft transition-colors hover:text-rose-deep" />
      </div>
    </nav>
  );
}
