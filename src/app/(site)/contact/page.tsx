import type { Metadata } from 'next';
import { site, taka } from '@/data/site';
import Reveal, { RevealGroup } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Contact, delivery & returns',
  description:
    'Reach Seoul Radiance BD on WhatsApp, Instagram or phone. Delivery charges, payment options and our returns policy for Korean skincare orders across Bangladesh.',
};

const faqs = [
  {
    q: 'Are your products really authentic?',
    a: 'Yes. Everything is imported through authorised international channels with seals and batch codes intact. Ask us before ordering and we will happily send you a photo of the batch code on the exact unit we will ship you.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Inside Dhaka is usually 1–2 working days. Outside Dhaka is 2–4 working days depending on the courier route. We message you on WhatsApp when your parcel is picked up.',
  },
  {
    q: 'Can I pay after I receive it?',
    a: 'Yes — cash on delivery is our default and most popular option. If you prefer to pay in advance, bKash and Nagad are both accepted.',
  },
  {
    q: 'What if a product does not suit my skin?',
    a: 'Message us. If it is unopened and within 3 days of delivery, we will exchange it. If it is opened and genuinely caused a reaction, tell us what happened — we will work something out and, more importantly, help you find something that does suit you.',
  },
  {
    q: 'Can you build me a full routine?',
    a: 'That is our favourite thing to do. Send us your skin type, your main concern and your monthly budget on Instagram or WhatsApp, and we will write out a morning and night routine — including which steps you can skip.',
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-plum/10 bg-blush/40">
        <div className="container-x py-16 md:py-20">
          <Reveal><p className="eyebrow">We reply fast</p></Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display mt-4 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">Get in touch</h1>
          </Reveal>
          <Reveal delay={0.16}><p className="mt-5 max-w-xl text-[1.0rem] leading-relaxed text-plum-soft">
            Questions about a product, your skin, or an order already on its way — message us any
            day between 10:00 AM and 10:00 PM and you will hear back quickly.
          </p></Reveal>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank" rel="noreferrer noopener"
            className="card-hover rounded-2xl border border-plum/8 bg-white p-6"
          >
            <span className="block text-rose-deep"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 20.5l1.5-3.4A8.4 8.4 0 1 1 8 20.1l-5 .4z"/></svg></span>
            <h2 className="mt-3 font-semibold">WhatsApp</h2>
            <p className="mt-1 text-sm text-plum-soft">Fastest reply — usually within minutes.</p>
            <p className="mt-3 text-sm font-semibold text-rose-deep">{site.phone}</p>
          </a>

          <a
            href={site.instagram}
            target="_blank" rel="noreferrer noopener"
            className="card-hover rounded-2xl border border-plum/8 bg-white p-6"
          >
            <span className="block text-rose-deep"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg></span>
            <h2 className="mt-3 font-semibold">Instagram</h2>
            <p className="mt-1 text-sm text-plum-soft">Routine advice, reviews and restock alerts.</p>
            <p className="mt-3 text-sm font-semibold text-rose-deep">@seoulradiance_bd</p>
          </a>

          <a href={`tel:${site.phone}`} className="card-hover rounded-2xl border border-plum/8 bg-white p-6">
            <span className="block text-rose-deep"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6.5 3.5h3l1.6 4-2 1.4a12 12 0 0 0 6 6l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/></svg></span>
            <h2 className="mt-3 font-semibold">Call us</h2>
            <p className="mt-1 text-sm text-plum-soft">{site.hours}</p>
            <p className="mt-3 text-sm font-semibold text-rose-deep">{site.phone}</p>
          </a>

          <a href={`mailto:${site.email}`} className="card-hover rounded-2xl border border-plum/8 bg-white p-6">
            <span className="block text-rose-deep"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg></span>
            <h2 className="mt-3 font-semibold">Email</h2>
            <p className="mt-1 text-sm text-plum-soft">For wholesale and business enquiries.</p>
            <p className="mt-3 break-all text-sm font-semibold text-rose-deep">{site.email}</p>
          </a>
        </RevealGroup>
      </section>

      <section id="delivery" className="container-x scroll-mt-28 pb-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-plum/8 bg-white p-7">
            <h2 className="font-display text-2xl font-semibold">Delivery &amp; payment</h2>
            <ul className="mt-5 space-y-3 text-sm text-plum-soft">
              <li className="flex justify-between gap-4 border-b border-plum/8 pb-3">
                <span>Inside Dhaka (1–2 days)</span>
                <span className="font-semibold text-plum">{taka(site.delivery.insideDhaka)}</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-plum/8 pb-3">
                <span>Outside Dhaka (2–4 days)</span>
                <span className="font-semibold text-plum">{taka(site.delivery.outsideDhaka)}</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-plum/8 pb-3">
                <span>Orders over {taka(site.delivery.freeAbove)}</span>
                <span className="font-semibold text-sage">Free delivery</span>
              </li>
              <li className="pt-1">
                Pay by <strong className="text-plum">cash on delivery</strong>, or in advance via
                bKash / Nagad to {site.phone}.
              </li>
            </ul>
          </div>

          <div id="returns" className="scroll-mt-28 rounded-2xl border border-plum/8 bg-white p-7">
            <h2 className="font-display text-2xl font-semibold">Returns policy</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-plum-soft">
              <li>
                <strong className="text-plum">Wrong or damaged item:</strong> we replace it and cover
                the delivery both ways. Just send a photo within 24 hours of delivery.
              </li>
              <li>
                <strong className="text-plum">Changed your mind:</strong> unopened, unused items with
                the seal intact can be exchanged within 3 days.
              </li>
              <li>
                <strong className="text-plum">Reaction to a product:</strong> stop using it and
                message us. We will help you work out what caused it and make it right.
              </li>
              <li>
                Opened cosmetics cannot be resold, so we cannot accept them back for a refund — this
                is a hygiene rule, not a technicality.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x pb-20">
        <h2 className="font-display mb-6 text-3xl font-semibold sm:text-4xl">
          Frequently asked
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-plum/8 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                {f.q}
                <span className="shrink-0 text-rose-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-plum-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
