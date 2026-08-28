import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import HeroLanding from '@/components/HeroLanding';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import { bestSellers, newArrivals, categories, products } from '@/data/products';
import { site } from '@/data/site';

const concerns = [
  { label: 'Acne & breakouts', href: '/shop?concern=Acne-prone', icon: '🎯' },
  { label: 'Dull, uneven tone', href: '/shop?concern=Dull skin', icon: '✨' },
  { label: 'Dry & dehydrated', href: '/shop?concern=Dehydrated', icon: '💦' },
  { label: 'Sensitive & red', href: '/shop?concern=Sensitive', icon: '🌸' },
];

const promises = [
  {
    title: '100% authentic',
    body: 'Every item is sourced from authorised international channels — batch codes and seals intact. No copies, ever.',
    icon: '🛡️',
  },
  {
    title: 'Cash on delivery',
    body: 'Pay when the parcel reaches your hand. bKash and Nagad also accepted if you prefer to pay ahead.',
    icon: '💵',
  },
  {
    title: 'Fast nationwide delivery',
    body: '1–2 days inside Dhaka, 2–4 days anywhere else in Bangladesh, with a tracking update on WhatsApp.',
    icon: '🚚',
  },
  {
    title: 'Advice, not just selling',
    body: 'Tell us your skin type and concern — we will build a routine that actually suits you before you buy.',
    icon: '💬',
  },
];

const testimonials = [
  {
    name: 'Nusrat J.',
    city: 'Dhanmondi, Dhaka',
    text: 'Ordered the Beauty of Joseon sunscreen and it arrived the very next day, sealed and original. My skin has never looked this calm.',
  },
  {
    name: 'Tahmina R.',
    city: 'Chattogram',
    text: 'They actually asked about my skin type before recommending anything. The snail essence cleared my acne marks in about six weeks.',
  },
  {
    name: 'Sumaiya A.',
    city: 'Sylhet',
    text: 'I was scared of buying fake products online. Seoul Radiance sent me photos of the batch code before shipping. Fully trustworthy.',
  },
];

export default function HomePage() {
  const bs = bestSellers();
  const na = newArrivals();

  return (
    <>
      {/* ------------------------------------------------- LOOPSTACK HERO */}
      <HeroLanding />

      {/* Hero settles into the shared ground. Both ends are near-black, so this
          reads as depth rather than a colour change between sections. */}
      <div
        aria-hidden
        className="h-20 w-full md:h-28"
        style={{
          background:
            'linear-gradient(180deg, #080707 0%, rgba(23,17,19,0.75) 45%, rgba(232,180,184,0.05) 72%, #080707 100%)',
        }}
      />

      {/* ------------------------------------------------ BRAND / INTRO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              // A warm rose bloom instead of the old cream wash — atmosphere over
              // the shared ground, not a section fill.
              'radial-gradient(110% 80% at 78% 12%, rgba(232,180,184,0.07) 0%, rgba(232,180,184,0.02) 45%, rgba(8,7,7,0) 75%)',
          }}
        />
        <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-8">
          <div className="fade-up">
            <p className="eyebrow">Imported K-Beauty · Bangladesh</p>
            <h1 className="font-display mt-4 text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
              Glass skin,
              <br />
              <span className="text-rose-deep italic">delivered to your door.</span>
            </h1>
            <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-plum-soft">
              Authentic Korean skincare, hand-picked and imported for Bangladeshi skin and
              Bangladeshi weather. Cleansers, toners, serums and SPF that actually work — with
              honest advice before you spend a taka.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop all products
              </Link>
              <Link href="/shop?sort=bestselling" className="btn btn-outline">
                Best sellers
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="font-display text-2xl font-semibold">{products.length}+</p>
                <p className="text-xs text-plum-soft">Curated products</p>
              </div>
              <div className="h-8 w-px bg-plum/15" />
              <div>
                <p className="font-display text-2xl font-semibold">100%</p>
                <p className="text-xs text-plum-soft">Authentic guarantee</p>
              </div>
              <div className="h-8 w-px bg-plum/15" />
              <div>
                <p className="font-display text-2xl font-semibold">64</p>
                <p className="text-xs text-plum-soft">Districts covered</p>
              </div>
            </div>
          </div>

          <div className="relative fade-up">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-plum/10 bg-blush shadow-2xl shadow-plum/15">
              <Image
                src="/hero.svg"
                alt="Korean skincare products from Seoul Radiance BD"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 460px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-2 hidden rounded-2xl border border-plum/10 bg-white p-4 shadow-xl shadow-plum/10 sm:block">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-rose-deep">
                Free delivery
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                on orders over ৳{site.delivery.freeAbove.toLocaleString('en-US')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- MARQUEE */}
      <section className="border-y border-plum/10 bg-plum py-3.5 text-cream">
        <div className="overflow-hidden">
          <div className="marquee-track gap-10 text-[0.7rem] uppercase tracking-[0.25em]">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex shrink-0 gap-10 pr-10" aria-hidden={rep === 1}>
                {[
                  '100% Authentic',
                  'Cash on Delivery',
                  'Nationwide Shipping',
                  'Free Skin Consultation',
                  'Imported from Korea',
                  'Sealed & Batch-Checked',
                ].map((t) => (
                  <span key={t} className="flex shrink-0 items-center gap-10">
                    {t}
                    <span className="text-rose">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- CATEGORIES */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="mb-9 text-center">
          <p className="eyebrow">Browse the shelf</p>
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
            Shop by category
          </h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/shop?category=${encodeURIComponent(c.name)}`}
              className="card-hover group flex h-full flex-col items-center gap-2.5 rounded-2xl border border-plum/8 bg-white px-3 py-6 text-center"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-blush text-xl transition-colors group-hover:bg-rose/50">
                {c.icon}
              </span>
              <span className="text-sm font-semibold">{c.name}</span>
              <span className="text-[0.68rem] leading-snug text-plum-soft">{c.blurb}</span>
            </Link>
          ))}
        </RevealGroup>
      </section>

      {/* --------------------------------------------------------- BEST SELLERS */}
      <section className="container-x pb-16 md:pb-20">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Loved by our customers</p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Best sellers</h2>
          </div>
          <Link href="/shop?sort=bestselling" className="hidden text-sm font-semibold text-rose-deep hover:underline sm:block">
            View all →
          </Link>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {bs.slice(0, 5).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </RevealGroup>
      </section>

      {/* ------------------------------------------------------------- CONCERNS */}
      <section className="bg-blush/50 py-16 md:py-20">
        <div className="container-x">
          <Reveal className="mb-9 text-center">
            <p className="eyebrow">Not sure where to start?</p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
              Shop by skin concern
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-plum-soft">
              Tell us what your skin is doing and we will point you to the products that fix it —
              not the most expensive ones.
            </p>
          </Reveal>
          <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {concerns.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="card-hover flex h-full items-center gap-4 rounded-2xl border border-plum/8 bg-white px-5 py-5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-lg">
                  {c.icon}
                </span>
                <span className="text-sm font-semibold leading-snug">{c.label}</span>
                <span className="ml-auto text-rose-deep">→</span>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* --------------------------------------------------------- NEW ARRIVALS */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Fresh off the plane</p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">New arrivals</h2>
          </div>
          <Link href="/shop?sort=newest" className="hidden text-sm font-semibold text-rose-deep hover:underline sm:block">
            View all →
          </Link>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {na.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </RevealGroup>
      </section>

      {/* -------------------------------------------------------------- PROMISE */}
      <section className="bg-plum py-16 text-cream md:py-20">
        <div className="container-x">
          <Reveal className="mb-10 text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-rose">
              The Seoul Radiance promise
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
              Why people keep coming back
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p) => (
              <div key={p.title} className="rounded-2xl border border-cream/12 bg-cream/5 p-6">
                <span className="text-2xl">{p.icon}</span>
                <h3 className="font-display mt-3 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{p.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* --------------------------------------------------------- TESTIMONIALS */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="mb-9 text-center">
          <p className="eyebrow">Real customers</p>
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
            What Bangladesh is saying
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-plum/8 bg-white p-6">
              <div className="text-gold" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-plum-soft">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-4 border-t border-plum/8 pt-3">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-plum-soft">{t.city}</p>
              </figcaption>
            </figure>
          ))}
        </RevealGroup>
      </section>

      {/* ------------------------------------------------------------ INSTAGRAM */}
      <section className="container-x pb-8">
        <div className="overflow-hidden rounded-3xl border border-plum/10 bg-blush/60">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow">@seoulradiance_bd</p>
              <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
                Skincare advice, every day on Instagram
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-plum-soft">
                Routine breakdowns, ingredient explainers, honest reviews and restock alerts. Send
                us a DM with your skin concern and we will reply with a routine — free, no pressure
                to buy.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary"
                >
                  Follow on Instagram
                </a>
                <Link href="/contact" className="btn btn-outline">
                  Ask a question
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {products.slice(0, 6).map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="relative aspect-square overflow-hidden rounded-xl bg-white"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="140px"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
