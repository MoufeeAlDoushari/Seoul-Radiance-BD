/**
 * Generates soft placeholder product images (SVG) into /public/products.
 * Delete a file and drop in a real photo with the same name to replace it.
 *
 *   node scripts/gen-placeholders.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outDir = resolve(root, 'public/products');
mkdirSync(outDir, { recursive: true });

// ---- read slugs + names straight out of the catalogue ----------------------
const src = readFileSync(resolve(root, 'src/data/products.ts'), 'utf8');
const entries = [];
const blockRe = /\{\s*slug: '([^']+)',\s*name: '([^']+)',\s*brand: '([^']+)',\s*category: '([^']+)',[\s\S]*?image: '\/products\/([^']+)'/g;
let m;
while ((m = blockRe.exec(src)) !== null) {
  entries.push({ slug: m[1], name: m[2], brand: m[3], category: m[4], file: m[5] });
}

const palettes = {
  Cleanser: ['#e7f0f4', '#c6dce6', '#5b7f8c'],
  Toner: ['#eaf3ee', '#c9e0d3', '#4f7a63'],
  Serum: ['#fbeef0', '#f0cdd3', '#9c5a66'],
  Moisturizer: ['#f6efe6', '#e6d3bd', '#8a6b4a'],
  Sunscreen: ['#fdf3e0', '#f7dfae', '#a37a2c'],
  Mask: ['#f2eef8', '#d9cfec', '#6a5a92'],
  'Lip & Eye': ['#fceaee', '#f2c2ce', '#a3495f'],
};

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** wrap a product name into <=3 short lines */
function wrap(text, max = 20) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines.slice(0, 3);
}

const W = 800;
const H = 1000;

for (const e of entries) {
  const [bg1, bg2, ink] = palettes[e.category] ?? palettes.Serum;
  const lines = wrap(e.name, 22);
  const isTub = e.category === 'Moisturizer' || e.category === 'Mask';
  const isTube = e.category === 'Cleanser' || e.category === 'Sunscreen';

  // simple vessel silhouette per category
  let vessel;
  if (isTub) {
    vessel = `
      <rect x="290" y="400" width="220" height="150" rx="26" fill="#fff" opacity="0.92"/>
      <rect x="278" y="378" width="244" height="40" rx="18" fill="${ink}" opacity="0.22"/>`;
  } else if (isTube) {
    vessel = `
      <rect x="335" y="300" width="130" height="300" rx="20" fill="#fff" opacity="0.92"/>
      <rect x="368" y="262" width="64" height="46" rx="12" fill="${ink}" opacity="0.28"/>
      <rect x="335" y="580" width="130" height="18" rx="8" fill="${ink}" opacity="0.16"/>`;
  } else {
    vessel = `
      <rect x="325" y="330" width="150" height="280" rx="26" fill="#fff" opacity="0.92"/>
      <rect x="372" y="268" width="56" height="70" rx="10" fill="#fff" opacity="0.75"/>
      <rect x="360" y="248" width="80" height="30" rx="12" fill="${ink}" opacity="0.3"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(e.brand)} ${esc(e.name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.55">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="400" cy="430" r="250" fill="url(#glow)"/>
  <ellipse cx="400" cy="630" rx="150" ry="26" fill="${ink}" opacity="0.12"/>
  ${vessel}

  <text x="400" y="${isTub ? 470 : 420}" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="${ink}" opacity="0.85">${esc(e.brand)}</text>

  <text x="400" y="740" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="4" fill="${ink}" opacity="0.7">${esc(e.brand.toUpperCase())}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="400" y="${790 + i * 40}" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${ink}">${esc(l)}</text>`,
    )
    .join('\n  ')}
  <text x="400" y="${800 + lines.length * 40}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" letter-spacing="3" fill="${ink}" opacity="0.55">${esc(e.category.toUpperCase())}</text>
</svg>
`;

  writeFileSync(resolve(outDir, e.file), svg, 'utf8');
}

// ---- hero image ------------------------------------------------------------
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-label="Korean skincare shelf">
  <defs>
    <linearGradient id="hbg" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#fbe9e7"/>
      <stop offset="55%" stop-color="#f2d9d6"/>
      <stop offset="100%" stop-color="#e7c6c4"/>
    </linearGradient>
    <radialGradient id="hglow" cx="0.4" cy="0.3" r="0.6">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#hbg)"/>
  <circle cx="330" cy="300" r="330" fill="url(#hglow)"/>

  <ellipse cx="400" cy="770" rx="290" ry="34" fill="#3b2b30" opacity="0.1"/>

  <!-- tall serum bottle -->
  <rect x="196" y="420" width="132" height="330" rx="26" fill="#ffffff" opacity="0.95"/>
  <rect x="240" y="352" width="44" height="76" rx="10" fill="#ffffff" opacity="0.8"/>
  <rect x="228" y="330" width="68" height="30" rx="12" fill="#3b2b30" opacity="0.35"/>
  <rect x="222" y="560" width="80" height="4" rx="2" fill="#c98a92" opacity="0.6"/>
  <text x="262" y="620" text-anchor="middle" font-family="Georgia, serif" font-size="21" fill="#8a6570">SERUM</text>

  <!-- wide cream jar -->
  <rect x="350" y="560" width="200" height="190" rx="30" fill="#ffffff" opacity="0.95"/>
  <rect x="336" y="534" width="228" height="42" rx="18" fill="#3b2b30" opacity="0.25"/>
  <text x="450" y="672" text-anchor="middle" font-family="Georgia, serif" font-size="23" fill="#8a6570">CREAM</text>

  <!-- sunscreen tube -->
  <rect x="576" y="470" width="112" height="280" rx="22" fill="#ffffff" opacity="0.95"/>
  <rect x="604" y="436" width="56" height="42" rx="12" fill="#c9a227" opacity="0.55"/>
  <text x="632" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="19" fill="#8a6570">SPF 50+</text>

  <!-- petals -->
  <g fill="#ffffff" opacity="0.55">
    <circle cx="140" cy="180" r="9"/>
    <circle cx="660" cy="230" r="13"/>
    <circle cx="560" cy="130" r="7"/>
    <circle cx="120" cy="640" r="11"/>
    <circle cx="700" cy="820" r="8"/>
  </g>

  <text x="400" y="180" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="#3b2b30" opacity="0.72">Seoul Radiance</text>
  <text x="400" y="222" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="17" letter-spacing="9" fill="#8a6570" opacity="0.85">BANGLADESH</text>
</svg>
`;
writeFileSync(resolve(root, 'public/hero.svg'), hero, 'utf8');

// ---- favicon ---------------------------------------------------------------
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#3b2b30"/>
  <text x="32" y="44" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#e8b4b8">S</text>
</svg>
`;
writeFileSync(resolve(root, 'src/app/icon.svg'), icon, 'utf8');

console.log(`Generated ${entries.length} product images + hero + icon.`);
if (!existsSync(resolve(outDir, entries[0]?.file ?? ''))) {
  console.warn('WARNING: no product images matched — check the regex in this script.');
}
