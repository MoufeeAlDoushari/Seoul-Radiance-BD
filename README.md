# Seoul Radiance BD

An e-commerce website for **Seoul Radiance BD** — authentic Korean skincare, imported and
delivered across Bangladesh. Built with Next.js 15 (App Router), React 19, TypeScript and
Tailwind CSS v4.

---

## Run it

```bash
npm install      # only needed once
npm run dev      # http://localhost:3000
```

For a production build:

```bash
npm run build
npm start
```

---

## What's in it

| Page | Path | What it does |
| --- | --- | --- |
| Home | `/` | Hero, category tiles, best sellers, shop-by-concern, new arrivals, promise, reviews, Instagram block |
| Shop | `/shop` | Live search, category chips, sort, in-stock filter. Deep links work: `/shop?category=Serum`, `/shop?concern=Sensitive`, `/shop?sort=bestselling` |
| Product | `/product/<slug>` | Gallery, price + discount, quantity, add-to-cart, buy-now, WhatsApp order, ingredients, how-to-use, related products |
| Cart | `/cart` | Quantity editing, delivery-zone toggle, free-delivery progress, live totals |
| Checkout | `/checkout` | Delivery form + district picker, Cash on Delivery / bKash / Nagad, validated on the server |
| Order placed | `/order-success` | Order ID, full summary, "send on WhatsApp" fallback |
| About | `/about` | Your story and how you work |
| Contact | `/contact` | WhatsApp / Instagram / phone / email, delivery charges, returns policy, FAQ |

Plus: sticky header with cart badge, mobile menu, floating WhatsApp button, 404 page,
`sitemap.xml`, `robots.txt`, and Product structured data for Google Shopping results.

The cart lives in the browser's `localStorage`, so it survives a refresh or a closed tab.

---

## The three files you'll actually edit

### 1. `src/data/site.ts` — your business details

**Do this first.** Phone number, WhatsApp number, Instagram/Facebook links, email, delivery
charges, and the free-delivery threshold all come from here.

```ts
phone: '+8801XXXXXXXXX',     // <- replace
whatsapp: '8801XXXXXXXXX',   // <- replace: digits only, country code, no "+"
url: 'https://seoulradiancebd.com',  // <- your real domain once you have one
```

The WhatsApp number **must** be digits only with the country code (`8801712345678`), otherwise
the order buttons will open an empty chat.

### 2. `src/data/products.ts` — your catalogue

The 24 products in there right now are realistic **placeholders** — Instagram blocks scraping,
so I couldn't pull your real listings, prices or photos. Replace them with yours. Each entry
looks like this:

```ts
{
  slug: 'cosrx-snail-96-mucin-essence',   // must be unique — becomes the URL
  name: 'Advanced Snail 96 Mucin Power Essence',
  brand: 'COSRX',
  category: 'Serum',                       // one of the 7 categories at the top of the file
  price: 1390,                             // BDT, numbers only
  oldPrice: 1600,                          // optional — shows a "was" price + discount badge
  size: '100 ml',
  image: '/products/snail-mucin.svg',      // see below
  stock: true,                             // false = "Out of stock" + notify-me button
  badges: ['bestseller'],                  // 'bestseller' and/or 'new' — drives the home page
  short: 'One-line hook shown on the card.',
  description: 'The full paragraph on the product page.',
  keyIngredients: ['Snail Secretion Filtrate 96%', 'Panthenol'],
  howToUse: 'When and how to apply it.',
  skinTypes: ['Acne-prone', 'Dehydrated'],  // also powers the shop-by-concern filter
},
```

To add a category, add it to both the `Category` type and the `categories` array at the top of
the file — the header menu, footer and shop filters all read from there automatically.

### 3. Product photos

Put your real photos in `public/products/` and point `image` at them:

```ts
image: '/products/snail-mucin.jpg',
```

Square or 4:5 portrait works best, around 1000px wide. The current `.svg` files are generated
placeholders — you can delete each one as you replace it. (To regenerate them all after editing
the catalogue: `node scripts/gen-placeholders.mjs`.)

---

## Where orders go

When a customer submits checkout, `POST /api/order` rebuilds the cart **from your catalogue on
the server** — so prices and stock can't be faked by editing the page — validates the phone
number and address, then:

1. prints the full order into the server log, and
2. posts it to `ORDER_WEBHOOK_URL` if you've set one.

The customer then lands on the success page with a **"Send order on WhatsApp"** button that
pre-fills the entire order, so nothing gets lost even if step 2 isn't set up.

### Getting orders into your phone / a spreadsheet

Copy `.env.example` to `.env.local` and set a webhook URL:

```
ORDER_WEBHOOK_URL=https://hooks.zapier.com/...
```

Anything that accepts a JSON POST works — Zapier, Make, n8n, a Google Apps Script bound to a
Sheet, or Formspree. The payload is the full order object plus a ready-to-read `text` field.

---

## Deploying

**Vercel** is the easiest (free tier, built by the Next.js team):

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), *Add New → Project*, import the repo.
3. Add the `ORDER_WEBHOOK_URL` environment variable if you're using one.
4. Deploy, then point your domain at it in *Settings → Domains*.

Netlify and Cloudflare Pages both work too. There's no database, so there's nothing else to set up.

---

## Before you go live — checklist

- [ ] Real phone + WhatsApp number in `src/data/site.ts`
- [ ] Real Facebook page URL (Instagram is already correct)
- [ ] Real domain in `site.url`
- [ ] Your actual products, prices and photos in `src/data/products.ts`
- [ ] Delivery charges and free-delivery threshold match what you actually charge
- [ ] Replace the three placeholder reviews in `src/app/page.tsx` with real customer messages
- [ ] Check the returns policy wording in `src/app/contact/page.tsx` says what you mean
- [ ] Set up `ORDER_WEBHOOK_URL` so orders reach you automatically

---

## Notes

- `next.config.mjs` enables SVG images (needed for the placeholder art) and allows product
  photos from any HTTPS host. Once all your images are real JPG/PNG files in `public/`, you can
  safely remove `dangerouslyAllowSVG`.
- Colours and fonts are defined once in the `@theme` block at the top of `src/app/globals.css`.
