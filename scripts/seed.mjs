/**
 * Seeds the catalogue from src/data/products.ts and ensures an admin account.
 *
 * Upsert by slug, never delete: re-running will not wipe products an admin has
 * added through the panel, and will not clobber edits made there either —
 * existing rows are left alone.
 *
 *   npm run db:seed
 *
 * The first admin's credentials come from the environment:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';

const DB_FILE = process.env.DATABASE_FILE || path.join(process.cwd(), 'data', 'seoul-radiance.db');
mkdirSync(path.dirname(DB_FILE), { recursive: true });

const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA foreign_keys = ON');

/* --------------------------------------------------------------- products --
 * products.ts is TypeScript, so rather than adding a build step just to import
 * it, parse the array out of the source. It is a plain literal with no
 * computed values, which makes this reliable.
 */
const src = readFileSync(path.join(process.cwd(), 'src', 'data', 'products.ts'), 'utf8');
const decl = 'export const products: Product[] = ';
const start = src.indexOf(decl);
if (start < 0) throw new Error('could not locate the products array in src/data/products.ts');

// Start at the '[' that opens the VALUE, not the one in the `Product[]` type.
const arrayStart = src.indexOf('[', start + decl.length - 1);

// String-aware bracket matching: product copy contains apostrophes and could
// contain brackets, and a naive counter would terminate on those.
let depth = 0;
let end = -1;
let quote = null;
for (let i = arrayStart; i < src.length; i++) {
  const ch = src[i];
  if (quote) {
    if (ch === '\\') i++;
    else if (ch === quote) quote = null;
    continue;
  }
  if (ch === "'" || ch === '"' || ch === '`') {
    quote = ch;
    continue;
  }
  if (ch === '[') depth++;
  else if (ch === ']') {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
if (end < 0) throw new Error('unterminated products array');

// The literal is valid JS once the trailing commas are gone.
const literal = src.slice(arrayStart, end);
const products = new Function(`return ${literal};`)();

const upsert = db.prepare(`
  INSERT INTO products (slug, name, brand, category, price, old_price, size, image, stock,
                        badges, short, description, key_ingredients, how_to_use, skin_types)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(slug) DO NOTHING
`);

let inserted = 0;
for (const p of products) {
  const res = upsert.run(
    p.slug,
    p.name,
    p.brand,
    p.category,
    p.price,
    p.oldPrice ?? null,
    p.size,
    p.image,
    p.stock ? 1 : 0,
    JSON.stringify(p.badges ?? []),
    p.short ?? '',
    p.description ?? '',
    JSON.stringify(p.keyIngredients ?? []),
    p.howToUse ?? '',
    JSON.stringify(p.skinTypes ?? []),
  );
  if (res.changes > 0) inserted++;
}
console.log(`products : ${products.length} in source, ${inserted} newly inserted`);

/* ------------------------------------------------------------------ admin -- */
const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || '';
const adminName = process.env.ADMIN_NAME || 'Administrator';

if (adminEmail && adminPassword) {
  const existing = db.prepare('SELECT id, role FROM users WHERE email = ?').get(adminEmail);
  if (existing) {
    if (existing.role !== 'admin') {
      db.prepare("UPDATE users SET role='admin', updated_at=datetime('now') WHERE id=?").run(existing.id);
      console.log(`admin    : promoted existing user ${adminEmail}`);
    } else {
      console.log(`admin    : ${adminEmail} already an admin`);
    }
  } else {
    db.prepare(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
    ).run(adminName, adminEmail, bcrypt.hashSync(adminPassword, 10));
    console.log(`admin    : created ${adminEmail}`);
  }
} else {
  console.log('admin    : skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)');
}

const counts = ['users', 'products', 'orders', 'order_items', 'sessions'].map((t) => {
  const { n } = db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get();
  return `${t}=${n}`;
});
console.log('counts   :', counts.join(' '));

db.close();
console.log('\nseed complete.');
