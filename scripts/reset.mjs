/**
 * Development database reset.
 *
 *   npm run db:reset
 *
 * Clears users, sessions, orders, order items and tokens, then re-seeds the 24
 * products from src/data/products.ts and recreates the admin from the
 * environment. The product source file is never touched.
 *
 * Three guards, because "reset the database" is the kind of command that should
 * be hard to run by accident:
 *
 *   1. refuses when NODE_ENV=production;
 *   2. refuses when DATABASE_FILE looks remote or lives outside the project;
 *   3. requires --yes, so a stray npm script cannot wipe anything.
 *
 * DELETE FROM, never DROP: the schema and its constraints stay intact, so a
 * reset cannot quietly leave the database in a shape the app does not expect.
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));

if (process.env.NODE_ENV === 'production') {
  console.error('refusing to reset: NODE_ENV is production.');
  process.exit(1);
}

const DB_FILE = process.env.DATABASE_FILE || path.join(process.cwd(), 'data', 'seoul-radiance.db');
const resolved = path.resolve(DB_FILE);

if (/^[a-z]+:\/\//i.test(DB_FILE)) {
  console.error('refusing to reset: DATABASE_FILE looks like a remote URL.');
  process.exit(1);
}

if (!resolved.startsWith(path.resolve(process.cwd()))) {
  console.error('refusing to reset: the database lives outside this project directory.');
  console.error(`  ${resolved}`);
  process.exit(1);
}

if (!args.has('--yes')) {
  console.error('This clears all users, sessions and orders in:');
  console.error(`  ${resolved}`);
  console.error('');
  console.error('Products are re-seeded from src/data/products.ts (that file is not modified).');
  console.error('Re-run with --yes to proceed:  npm run db:reset -- --yes');
  process.exit(1);
}

mkdirSync(path.dirname(resolved), { recursive: true });
if (!existsSync(resolved)) {
  console.error('no database file yet — run "npm run db:migrate" first.');
  process.exit(1);
}

const db = new DatabaseSync(resolved);
db.exec('PRAGMA foreign_keys = ON');

const before = {};
for (const t of ['users', 'products', 'orders', 'order_items', 'sessions']) {
  before[t] = db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
}

db.exec('BEGIN');
try {
  // Child rows first even though cascades exist, so the intent is explicit.
  db.exec('DELETE FROM order_items');
  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM sessions');
  db.exec('DELETE FROM password_resets');
  db.exec('DELETE FROM email_verifications');
  db.exec('DELETE FROM login_attempts');
  db.exec('DELETE FROM users');
  db.exec('DELETE FROM products');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('users','products','order_items')");
  db.exec('COMMIT');
} catch (err) {
  db.exec('ROLLBACK');
  console.error('reset failed, nothing was changed:', err.message);
  process.exit(1);
}

console.log('cleared   :', Object.entries(before).map(([t, n]) => `${t}=${n}`).join(' '));
db.close();

console.log('re-seeding from src/data/products.ts …\n');
