// ---------------------------------------------------------------------------
// EDIT ME: your product catalogue. Add / remove / change entries freely.
//
//   slug        unique url-safe id  ->  /product/<slug>
//   image       put the photo in /public/products/ and write "/products/name.jpg"
//   price       selling price in BDT (numbers only)
//   oldPrice    optional - shows a struck-through "was" price + discount badge
//   stock       false hides the buy button and shows "Out of stock"
//   badges      "bestseller" | "new"  (drives the home page sections)
// ---------------------------------------------------------------------------

export type Category =
  | 'Cleanser'
  | 'Toner'
  | 'Serum'
  | 'Moisturizer'
  | 'Sunscreen'
  | 'Mask'
  | 'Lip & Eye';

export const categories: { name: Category; blurb: string; icon: string }[] = [
  { name: 'Cleanser', blurb: 'Gentle low-pH washes & oil cleansers', icon: '\u{1FAE7}' },
  { name: 'Toner', blurb: 'Hydrating and exfoliating toners', icon: '\u{1F4A7}' },
  { name: 'Serum', blurb: 'Targeted actives for every concern', icon: '\u{1F9EA}' },
  { name: 'Moisturizer', blurb: 'Barrier creams and gel-creams', icon: '\u{1F33F}' },
  { name: 'Sunscreen', blurb: 'Daily SPF 50+ PA++++ protection', icon: '☀️' },
  { name: 'Mask', blurb: 'Sheet masks & overnight treatments', icon: '\u{1F338}' },
  { name: 'Lip & Eye', blurb: 'Lip masks, tints and eye care', icon: '\u{1F497}' },
];

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  oldPrice?: number;
  size: string;
  image: string;
  stock: boolean;
  badges?: ('bestseller' | 'new')[];
  short: string;
  description: string;
  keyIngredients: string[];
  howToUse: string;
  skinTypes: string[];
};

export const products: Product[] = [
  {
    slug: 'beauty-of-joseon-relief-sun',
    name: 'Relief Sun : Rice + Probiotics SPF50+ PA++++',
    brand: 'Beauty of Joseon',
    category: 'Sunscreen',
    price: 1450,
    oldPrice: 1650,
    size: '50 ml',
    image: '/products/relief-sun.svg',
    stock: true,
    badges: ['bestseller'],
    short: 'The cult organic-rice sunscreen - no white cast, no greasy finish.',
    description:
      'A lightweight chemical sunscreen with rice extract and probiotic ferment that sinks in like a moisturiser. It leaves a soft dewy finish with zero white cast, which makes it a perfect daily SPF under makeup - and comfortable even in Dhaka humidity.',
    keyIngredients: ['Rice Extract 30%', 'Grain Ferment', 'Niacinamide'],
    howToUse:
      'Last step of your morning routine. Apply two finger-lengths evenly and reapply every 2-3 hours outdoors.',
    skinTypes: ['All skin types', 'Dry', 'Normal'],
  },
  {
    slug: 'cosrx-snail-96-mucin-essence',
    name: 'Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    category: 'Serum',
    price: 1390,
    oldPrice: 1600,
    size: '100 ml',
    image: '/products/snail-mucin.svg',
    stock: true,
    badges: ['bestseller'],
    short: '96% snail secretion filtrate for repair, bounce and glass-skin glow.',
    description:
      'The essence that started the K-beauty repair craze. 96% snail secretion filtrate hydrates, fades post-acne marks and strengthens a damaged barrier over time. Slightly viscous, absorbs fast, and layers beautifully under any moisturiser.',
    keyIngredients: ['Snail Secretion Filtrate 96%', 'Sodium Hyaluronate', 'Panthenol'],
    howToUse:
      'After toner, pat 2-3 drops onto damp skin morning and night, then seal with moisturiser.',
    skinTypes: ['All skin types', 'Acne-prone', 'Dehydrated'],
  },
  {
    slug: 'anua-heartleaf-77-toner',
    name: 'Heartleaf 77% Soothing Toner',
    brand: 'Anua',
    category: 'Toner',
    price: 1650,
    size: '250 ml',
    image: '/products/heartleaf-toner.svg',
    stock: true,
    badges: ['bestseller'],
    short: 'Houttuynia cordata toner that calms redness and angry breakouts.',
    description:
      'A watery, fragrance-free toner built on 77% heartleaf extract - the ingredient Korean derms reach for when skin is red, reactive or breaking out. Use it as a 5-minute toner pack on irritated days and the difference by morning is real.',
    keyIngredients: ['Houttuynia Cordata 77%', 'Panthenol', 'Centella Asiatica'],
    howToUse:
      'Sweep over clean skin with hands, or soak a cotton pad and rest on inflamed areas for 5 minutes.',
    skinTypes: ['Sensitive', 'Oily', 'Acne-prone'],
  },
  {
    slug: 'skin1004-centella-ampoule',
    name: 'Madagascar Centella Ampoule',
    brand: 'SKIN1004',
    category: 'Serum',
    price: 1550,
    size: '100 ml',
    image: '/products/centella-ampoule.svg',
    stock: true,
    badges: ['bestseller'],
    short: 'One ingredient, one purpose: pure centella water for stressed skin.',
    description:
      'A single-ingredient ampoule of 100% Centella Asiatica extract from Madagascar. No fragrance, no essential oils, no alcohol - just a clean, weightless layer of hydration that takes the heat out of irritated, sun-stressed or over-exfoliated skin.',
    keyIngredients: ['Centella Asiatica Extract 100%'],
    howToUse:
      'Apply after toner morning and night. Safe to layer generously whenever skin feels hot or tight.',
    skinTypes: ['Sensitive', 'All skin types'],
  },
  {
    slug: 'round-lab-1025-dokdo-toner',
    name: '1025 Dokdo Toner',
    brand: 'Round Lab',
    category: 'Toner',
    price: 1480,
    size: '200 ml',
    image: '/products/dokdo-toner.svg',
    stock: true,
    short: 'Deep-sea mineral water toner with a whisper of gentle exfoliation.',
    description:
      'Dokdo deep-sea water plus a low dose of PHA gives you hydration and a soft, non-stinging exfoliation in one step. It is the toner for people whose skin cannot tolerate AHAs but still want smooth, refined texture.',
    keyIngredients: ['Dokdo Deep Sea Water', 'PHA', 'Panthenol'],
    howToUse: 'Apply to clean skin morning and night before serums.',
    skinTypes: ['Sensitive', 'Combination', 'Textured'],
  },
  {
    slug: 'torriden-dive-in-serum',
    name: 'DIVE-IN Low Molecular Hyaluronic Acid Serum',
    brand: 'Torriden',
    category: 'Serum',
    price: 1350,
    size: '50 ml',
    image: '/products/dive-in-serum.svg',
    stock: true,
    badges: ['new'],
    short: '5 kinds of hyaluronic acid - hydration that actually holds all day.',
    description:
      'A vegan, fragrance-free hydrating serum using five molecular weights of hyaluronic acid so water is held at several depths at once. Light enough for oily skin in summer, layerable enough for dry skin in winter.',
    keyIngredients: ['5D Hyaluronic Acid', 'Centella Asiatica', 'Allantoin'],
    howToUse: 'Press 2-3 drops into damp skin after toner, morning and night.',
    skinTypes: ['All skin types', 'Dehydrated', 'Oily'],
  },
  {
    slug: 'cosrx-low-ph-good-morning-cleanser',
    name: 'Low pH Good Morning Gel Cleanser',
    brand: 'COSRX',
    category: 'Cleanser',
    price: 950,
    size: '150 ml',
    image: '/products/low-ph-cleanser.svg',
    stock: true,
    short: 'pH 5.0 gel wash that cleans without stripping your barrier.',
    description:
      'The gentle daily cleanser that made low-pH washing mainstream. Tea tree oil and BHA keep pores clear while the mild formula leaves skin comfortable - never squeaky, never tight.',
    keyIngredients: ['Tea Tree Oil', 'Betaine Salicylate (BHA)', 'Allantoin'],
    howToUse:
      'Massage a coin-size amount over damp skin, rinse with lukewarm water. Morning and night.',
    skinTypes: ['All skin types', 'Oily', 'Acne-prone'],
  },
  {
    slug: 'banila-co-clean-it-zero',
    name: 'Clean It Zero Cleansing Balm Original',
    brand: 'Banila Co',
    category: 'Cleanser',
    price: 1580,
    size: '100 ml',
    image: '/products/clean-it-zero.svg',
    stock: true,
    badges: ['bestseller'],
    short: 'Sherbet balm that melts sunscreen and makeup in seconds.',
    description:
      'The first step of every proper double cleanse. This sherbet-textured balm turns to oil on contact, dissolves stubborn sunscreen and long-wear makeup, then rinses off milky-clean with water and no oily film.',
    keyIngredients: ['Acerola Extract', 'Vitamin C', 'Papaya Extract'],
    howToUse:
      'On dry skin, massage over face for 30 seconds. Add water to emulsify, rinse, then follow with a water-based cleanser.',
    skinTypes: ['All skin types'],
  },
  {
    slug: 'laneige-water-sleeping-mask',
    name: 'Water Sleeping Mask',
    brand: 'Laneige',
    category: 'Mask',
    price: 2250,
    oldPrice: 2600,
    size: '70 ml',
    image: '/products/water-sleeping-mask.svg',
    stock: true,
    short: 'Overnight gel mask - wake up plump, dewy and calm.',
    description:
      'A cooling gel mask you leave on overnight. Squalane and hydro ionised mineral water rebuild moisture while you sleep, and the Sleep-Scent complex genuinely helps you drift off. Two nights a week is enough to change dull skin.',
    keyIngredients: ['Squalane', 'Hydro Ionized Mineral Water', 'Sleep-Scent Complex'],
    howToUse: 'Last step at night, 2-3 times a week. Apply an even layer and rinse in the morning.',
    skinTypes: ['Dry', 'Dehydrated', 'Normal'],
  },
  {
    slug: 'numbuzin-no3-serum',
    name: 'No.3 Skin Softening Serum',
    brand: 'numbuzin',
    category: 'Serum',
    price: 1890,
    size: '50 ml',
    image: '/products/numbuzin-no3.svg',
    stock: true,
    badges: ['new'],
    short: 'Niacinamide + rice ferment for that lit-from-within tone-up.',
    description:
      'A milky serum loaded with rice ferment filtrate and niacinamide that visibly softens texture and evens out dull, uneven tone. The "glass skin in a bottle" serum people repurchase again and again.',
    keyIngredients: ['Rice Ferment Filtrate', 'Niacinamide 3%', 'Panthenol'],
    howToUse: 'Apply after toner, morning and night. Pairs well with sunscreen in the day.',
    skinTypes: ['Dull skin', 'Uneven tone', 'All skin types'],
  },
  {
    slug: 'medicube-zero-pore-pad',
    name: 'Zero Pore Pad 2.0',
    brand: 'Medicube',
    category: 'Toner',
    price: 2100,
    size: '70 pads',
    image: '/products/zero-pore-pad.svg',
    stock: true,
    short: 'Textured exfoliating pads for blackheads and rough pores.',
    description:
      'Dual-textured pads soaked in a gentle AHA/BHA/PHA blend that clear congestion and visibly tighten the look of pores. Use two or three nights a week - this one works fast, so do not overdo it.',
    keyIngredients: ['AHA / BHA / PHA', 'Witch Hazel', 'Centella'],
    howToUse:
      'After cleansing, wipe the embossed side over T-zone 2-3 nights a week. Always follow with sunscreen the next day.',
    skinTypes: ['Oily', 'Congested', 'Combination'],
  },
  {
    slug: 'isntree-hyaluronic-acid-toner',
    name: 'Hyaluronic Acid Toner Plus',
    brand: 'ISNTREE',
    category: 'Toner',
    price: 1590,
    size: '200 ml',
    image: '/products/isntree-toner.svg',
    stock: true,
    short: 'Eight hyaluronic acids in a slippery, deeply quenching toner.',
    description:
      'A thicker, essence-like toner with eight types of hyaluronic acid. If your skin drinks product and still feels tight an hour later, this is the layer that finally fixes it.',
    keyIngredients: ['8 Types Hyaluronic Acid', 'Beta-Glucan', 'Trehalose'],
    howToUse: 'Pat 2-3 layers into damp skin after cleansing, morning and night.',
    skinTypes: ['Dry', 'Dehydrated', 'Sensitive'],
  },
  {
    slug: 'axis-y-dark-spot-serum',
    name: 'Dark Spot Correcting Glow Serum',
    brand: 'Axis-Y',
    category: 'Serum',
    price: 1720,
    size: '50 ml',
    image: '/products/dark-spot-serum.svg',
    stock: true,
    short: 'Squalane + niacinamide targeted at post-acne marks.',
    description:
      'A lightweight glow serum formulated around 5% niacinamide and squalane to fade the brown marks acne leaves behind. Gentle enough for daily use, and it doubles as a soft luminous base under makeup.',
    keyIngredients: ['Niacinamide 5%', 'Squalane', 'Papaya Extract'],
    howToUse: 'Apply after toner, morning and night. Sunscreen is essential while using it.',
    skinTypes: ['Acne-prone', 'Hyperpigmentation', 'Combination'],
  },
  {
    slug: 'some-by-mi-aha-bha-pha-toner',
    name: 'AHA-BHA-PHA 30 Days Miracle Toner',
    brand: 'SOME BY MI',
    category: 'Toner',
    price: 1390,
    size: '150 ml',
    image: '/products/miracle-toner.svg',
    stock: true,
    short: 'The famous 30-day reset for bumpy, breakout-prone skin.',
    description:
      'A daily chemical exfoliating toner with a low, tolerable dose of three acids plus tea tree water. Over about a month it smooths closed comedones and keeps new breakouts from settling in.',
    keyIngredients: ['AHA', 'BHA', 'PHA', 'Tea Tree Water 10%'],
    howToUse:
      'Start 3 nights a week on a cotton pad, build up as tolerated. Sunscreen every morning.',
    skinTypes: ['Oily', 'Acne-prone', 'Textured'],
  },
  {
    slug: 'illiyoon-ceramide-ato-cream',
    name: 'Ceramide Ato Concentrate Cream',
    brand: 'ILLIYOON',
    category: 'Moisturizer',
    price: 1250,
    size: '200 ml',
    image: '/products/ceramide-ato.svg',
    stock: true,
    short: 'Big-tub ceramide cream for face and body - barrier rescue.',
    description:
      'A no-nonsense ceramide cream that rebuilds a compromised moisture barrier. Fragrance-free, thick but fast-absorbing, and generous enough to use on arms and legs in dry season too.',
    keyIngredients: ['Ceramide NP', 'Panthenol', 'Shea Butter'],
    howToUse: 'Apply as the final moisture step, morning and night. Layer thicker on flaky patches.',
    skinTypes: ['Dry', 'Eczema-prone', 'Sensitive'],
  },
  {
    slug: 'dr-althea-147-barrier-cream',
    name: '147 Barrier Cream',
    brand: 'Dr.Althea',
    category: 'Moisturizer',
    price: 1980,
    size: '50 ml',
    image: '/products/barrier-cream.svg',
    stock: true,
    badges: ['new'],
    short: 'Peptide-rich cream that repairs and firms overnight.',
    description:
      'A rich but never-heavy cream with peptides, ceramides and panthenol. It seals in everything underneath and, used nightly, skin looks visibly bouncier within a couple of weeks.',
    keyIngredients: ['5 Peptides', 'Ceramide', 'Panthenol'],
    howToUse: 'Final step at night, or in the morning under sunscreen for dry skin.',
    skinTypes: ['Dry', 'Mature', 'Normal'],
  },
  {
    slug: 'mixsoon-bean-essence',
    name: 'Bean Essence',
    brand: 'mixsoon',
    category: 'Serum',
    price: 1690,
    size: '50 ml',
    image: '/products/bean-essence.svg',
    stock: true,
    short: 'Single-ingredient fermented soybean essence for smooth, clear skin.',
    description:
      'One ingredient - fermented soybean - and that is the whole point. It dissolves dead surface cells softly, so blackheads loosen and skin turns noticeably smoother without any acid sting.',
    keyIngredients: ['Fermented Soybean Extract 100%'],
    howToUse:
      'On clean dry skin, massage a few drops for 1-2 minutes, then continue your routine.',
    skinTypes: ['All skin types', 'Congested', 'Sensitive'],
  },
  {
    slug: 'tirtir-mask-fit-red-cushion',
    name: 'Mask Fit Red Cushion',
    brand: 'TIRTIR',
    category: 'Lip & Eye',
    price: 2450,
    size: '18 g',
    image: '/products/red-cushion.svg',
    stock: true,
    badges: ['bestseller'],
    short: 'Full-coverage cushion foundation with a skin-like satin finish.',
    description:
      'The cushion that broke the internet for its shade range and staying power. Buildable full coverage, SPF 40 PA++, and it holds up through a humid Dhaka afternoon without sliding.',
    keyIngredients: ['SPF 40 PA++', 'Ceramide', 'Niacinamide'],
    howToUse: 'Press onto skin with the puff after sunscreen. Build in thin layers where needed.',
    skinTypes: ['All skin types'],
  },
  {
    slug: 'laneige-lip-sleeping-mask',
    name: 'Lip Sleeping Mask Berry',
    brand: 'Laneige',
    category: 'Lip & Eye',
    price: 1850,
    size: '20 g',
    image: '/products/lip-mask.svg',
    stock: true,
    short: 'Overnight lip balm that ends flaky, peeling lips for good.',
    description:
      'A thick berry-scented lip mask you apply before bed. The Moisture Wrap technology holds hydration in all night, and the vitamin C complex sloughs off dead skin, so you wake up with soft lips.',
    keyIngredients: ['Berry Mix Complex', 'Shea Butter', 'Vitamin C'],
    howToUse: 'Apply a generous layer to lips before sleeping. Wipe off in the morning.',
    skinTypes: ['All skin types'],
  },
  {
    slug: 'mediheal-tea-tree-mask-10',
    name: 'Tea Tree Care Solution Mask (10 sheets)',
    brand: 'MEDIHEAL',
    category: 'Mask',
    price: 1150,
    size: '10 x 25 ml',
    image: '/products/tea-tree-mask.svg',
    stock: true,
    short: 'Korea’s best-selling sheet mask for calming angry skin.',
    description:
      'A pack of ten tea-tree sheet masks that cool inflammation and take the redness out of active breakouts. Keep them in the fridge - 15 minutes after a long day is genuinely restorative.',
    keyIngredients: ['Tea Tree Extract', 'Centella Asiatica', 'Panthenol'],
    howToUse: 'Apply to clean skin for 15-20 minutes, remove and pat in the remaining essence.',
    skinTypes: ['Oily', 'Acne-prone', 'Sensitive'],
  },
  {
    slug: 'innisfree-green-tea-seed-serum',
    name: 'Green Tea Seed Hyaluronic Serum',
    brand: 'innisfree',
    category: 'Serum',
    price: 1990,
    size: '80 ml',
    image: '/products/green-tea-serum.svg',
    stock: true,
    short: 'Jeju green tea and 16 hyaluronic acids for weightless moisture.',
    description:
      'Made with green tea harvested on Jeju island, this serum delivers deep hydration with a completely weightless, non-sticky finish - which is why it works so well in hot, humid weather.',
    keyIngredients: ['Jeju Green Tea', '16 Hyaluronic Acids', 'Amino Acids'],
    howToUse: 'Apply 2-3 pumps after toner, morning and night.',
    skinTypes: ['Combination', 'Oily', 'Normal'],
  },
  {
    slug: 'skin1004-poremizing-clear-pad',
    name: 'Poremizing Clear Pad',
    brand: 'SKIN1004',
    category: 'Cleanser',
    price: 1780,
    size: '70 pads',
    image: '/products/poremizing-pad.svg',
    stock: false,
    short: 'Centella + PHA pads that clear pores without irritation.',
    description:
      'Gentle daily pore pads combining centella with PHA and a mild BHA. They lift oil and dead skin from congested areas while keeping the barrier calm - a milder alternative to strong exfoliating pads.',
    keyIngredients: ['Centella Asiatica', 'PHA', 'BHA'],
    howToUse: 'Wipe over the T-zone after cleansing, up to once daily.',
    skinTypes: ['Oily', 'Combination', 'Sensitive'],
  },
  {
    slug: 'purito-daily-go-to-sunscreen',
    name: 'Daily Go-To Sunscreen SPF50+ PA++++',
    brand: 'PURITO SEOUL',
    category: 'Sunscreen',
    price: 1520,
    size: '60 ml',
    image: '/products/purito-sunscreen.svg',
    stock: true,
    badges: ['new'],
    short: 'Fragrance-free daily SPF that behaves like a light moisturiser.',
    description:
      'A gentle, fragrance-free chemical sunscreen designed for sensitive and reactive skin. It spreads easily, disappears without a cast and sits happily under makeup all day.',
    keyIngredients: ['Panthenol', 'Centella Asiatica', 'Hyaluronic Acid'],
    howToUse:
      'Final morning step. Two finger-lengths for the face, reapply every 2-3 hours in the sun.',
    skinTypes: ['Sensitive', 'All skin types'],
  },
  {
    slug: 'cosrx-snail-92-cream',
    name: 'Advanced Snail 92 All In One Cream',
    brand: 'COSRX',
    category: 'Moisturizer',
    price: 1490,
    size: '100 ml',
    image: '/products/snail-cream.svg',
    stock: true,
    short: 'Gel-cream with 92% snail mucin - repair without heaviness.',
    description:
      'The moisturiser companion to the famous 96 essence. A springy gel-cream that hydrates, fades marks and repairs the barrier, light enough that oily skin can wear it year-round.',
    keyIngredients: ['Snail Secretion Filtrate 92%', 'Shea Butter', 'Betaine'],
    howToUse: 'Final step morning and night, after serums.',
    skinTypes: ['All skin types', 'Combination', 'Acne-prone'],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function bestSellers() {
  return products.filter((p) => p.badges?.includes('bestseller'));
}

export function newArrivals() {
  return products.filter((p) => p.badges?.includes('new'));
}
