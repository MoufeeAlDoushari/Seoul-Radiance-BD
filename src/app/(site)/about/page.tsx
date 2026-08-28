import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/data/site';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Seoul Radiance BD imports 100% authentic Korean skincare into Bangladesh and gives honest routine advice before you buy.',
};

const steps = [
  {
    n: '01',
    title: 'We source it properly',
    body: 'Products come from authorised international suppliers — never grey-market resellers. Seals, batch codes and expiry dates are checked on arrival.',
  },
  {
    n: '02',
    title: 'We only stock what works',
    body: 'Every product on this site is one we have used or seen work on real Bangladeshi skin, in real Bangladeshi weather. Hype alone does not get a product listed.',
  },
  {
    n: '03',
    title: 'We advise before we sell',
    body: 'Tell us your skin type, budget and concern. If a ৳900 cleanser is the right answer, we will not push you toward a ৳2,500 serum.',
  },
  {
    n: '04',
    title: 'We deliver anywhere',
    body: 'Cash on delivery to all 64 districts, with a WhatsApp update when your parcel is picked up and when it is out for delivery.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-plum/10 bg-blush/40">
        <div className="container-x py-16 md:py-24">
          <Reveal><p className="eyebrow">Our story</p></Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display mt-4 max-w-4xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Korean skincare, honestly sold in Bangladesh.
            </h1>
          </Reveal>
          <Reveal delay={0.16}><p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-plum-soft">
            Seoul Radiance BD started with a simple frustration: buying K-beauty in Bangladesh meant
            gambling on whether the product in the box was real, and getting sold whatever had the
            biggest margin. We wanted the opposite — genuine products, fair prices, and advice from
            someone who actually knows what niacinamide does.
          </p></Reveal>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">How we work</p>
            <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
              Four things we refuse to compromise on
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-plum-soft">
              We are a small business, which means we cannot afford an unhappy customer — and that
              turns out to be the best possible incentive.
            </p>
            <Link href="/shop" className="btn btn-primary mt-7">Browse the shop</Link>
          </div>

          <div className="space-y-5">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07}>
              <div className="flex gap-5 rounded-2xl border border-plum/8 bg-white p-6">
                <span className="font-display text-3xl font-semibold text-rose">{s.n}</span>
                <div>
                  <h3 className="text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-plum-soft">{s.body}</p>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-plum py-16 text-cream md:py-20">
        <div className="container-x text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-rose">
            Still deciding?
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
            Send us a photo of your current routine and we will tell you what to keep.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/70">
            Free, no obligation, and we will happily tell you when you do not need to buy anything
            new at all.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-primary"
            >
              DM us on Instagram
            </a>
            <Link href="/contact" className="btn btn-outline">
              Other ways to reach us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
