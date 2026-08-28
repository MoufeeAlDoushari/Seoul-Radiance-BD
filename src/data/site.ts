// ---------------------------------------------------------------------------
// EDIT ME: every piece of business info on the site comes from this one file.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Seoul Radiance BD',
  // Your live domain, used for sitemap.xml and social previews. No trailing slash.
  url: 'https://seoulradiancebd.com',
  tagline: 'Authentic Korean skincare, imported for Bangladesh',
  description:
    'Seoul Radiance BD brings 100% authentic, internationally sourced Korean skincare to your door. Cleansers, toners, serums, moisturisers and sunscreens — cash on delivery all over Bangladesh.',

  // ---- Contact — REPLACE THESE WITH YOUR REAL DETAILS ----------------------
  phone: '+8801XXXXXXXXX',            // shown on the site, e.g. +8801712345678
  whatsapp: '8801XXXXXXXXX',          // digits only, with country code, no +
  email: 'seoulradiancebd@gmail.com',
  instagram: 'https://www.instagram.com/seoulradiance_bd',
  facebook: 'https://www.facebook.com/',
  address: 'Dhaka, Bangladesh',
  hours: 'Every day, 10:00 AM – 10:00 PM',

  // ---- Delivery (in BDT) ---------------------------------------------------
  delivery: {
    insideDhaka: 70,
    outsideDhaka: 130,
    freeAbove: 3000, // free delivery when the cart subtotal reaches this
  },
} as const;

export const districts = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur',
  'Mymensingh', 'Cumilla', 'Narayanganj', 'Gazipur', 'Bogura', 'Jashore',
  'Cox’s Bazar', 'Dinajpur', 'Faridpur', 'Feni', 'Jamalpur', 'Kushtia',
  'Noakhali', 'Pabna', 'Rangamati', 'Savar', 'Tangail', 'Other',
];

export function taka(amount: number): string {
  return '৳' + amount.toLocaleString('en-US');
}
