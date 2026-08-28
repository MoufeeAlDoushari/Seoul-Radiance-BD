import Link from 'next/link';
import { site } from '@/data/site';
import { categories } from '@/data/products';

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-plum/10 bg-blush/45">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 md:py-20">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-2xl">Seoul Radiance BD</p>
          <p className="eyebrow mt-2">Authentic skincare</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-plum-soft">
            Authentic Korean skincare, sourced internationally and delivered across Bangladesh.
            Every product is genuine, batch-checked and never a copy.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-plum/15 text-plum transition-colors hover:bg-plum hover:text-cream"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full border border-plum/15 text-plum transition-colors hover:bg-plum hover:text-cream"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full border border-plum/15 text-plum transition-colors hover:bg-plum hover:text-cream"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.6-4.9c-.4-.7-.7-1.5-.7-2.2 0-.8.4-1.5.8-1.8.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.5.8 1 1.4 1.7 1.9.5.4.8.5 1 .3l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.3.2.4.3 0 .1 0 .5-.1.7Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Shop</h3>
          <ul className="space-y-2.5 text-sm text-plum-soft">
            <li>
              <Link href="/shop" className="hover:text-rose-deep">All products</Link>
            </li>
            {categories.slice(0, 5).map((c) => (
              <li key={c.name}>
                <Link href={`/shop?category=${encodeURIComponent(c.name)}`} className="hover:text-rose-deep">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Help</h3>
          <ul className="space-y-2.5 text-sm text-plum-soft">
            <li><Link href="/about" className="hover:text-rose-deep">About us</Link></li>
            <li><Link href="/contact" className="hover:text-rose-deep">Contact</Link></li>
            <li><Link href="/contact#delivery" className="hover:text-rose-deep">Delivery &amp; payment</Link></li>
            <li><Link href="/contact#returns" className="hover:text-rose-deep">Returns policy</Link></li>
            <li><Link href="/cart" className="hover:text-rose-deep">Your cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Get in touch</h3>
          <ul className="space-y-2.5 text-sm text-plum-soft">
            <li>
              <a href={`tel:${site.phone}`} className="hover:text-rose-deep">{site.phone}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-rose-deep">{site.email}</a>
            </li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary mt-5 text-xs"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Closing wordmark — the bookend to the hero, so the last screen of
          the site rhymes with the first. */}
      <div aria-hidden className="container-x overflow-hidden pb-2">
        <p className="font-display select-none whitespace-nowrap text-center leading-[0.85] text-[clamp(3rem,13vw,15rem)] text-plum/10">
          Seoul Radiance
        </p>
      </div>

      <div className="border-t border-plum/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-plum-soft sm:flex-row">
          <p>© {new Date().getFullYear()} Seoul Radiance BD. All rights reserved.</p>
          <p>Cash on delivery all over Bangladesh · bKash &amp; Nagad accepted</p>
        </div>
      </div>
    </footer>
  );
}
