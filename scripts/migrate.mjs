/**
 * Applies src/lib/schema.sql to the database.
 *
 * Safe to run repeatedly: every statement is CREATE ... IF NOT EXISTS, so it
 * never drops or rewrites a table that already holds data.
 *
 *   npm run db:migrate
 */
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { addColumns } from './migrate-columns.mjs';

const DB_FILE = process.env.DATABASE_FILE || path.join(process.cwd(), 'data', 'seoul-radiance.db');
mkdirSync(path.dirname(DB_FILE), { recursive: true });

const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA foreign_keys = ON');

const sql = readFileSync(path.join(process.cwd(), 'src', 'lib', 'schema.sql'), 'utf8');
db.exec(sql);

const added = addColumns(db);
if (added.length) console.log('columns :', added.join(', '));

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map((r) => r.name);

console.log('database :', DB_FILE);
console.log('tables   :', tables.join(', '));

for (const t of tables) {
  const { n } = db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get();
  console.log(`  ${t.padEnd(12)} ${n} row(s)`);
}

db.close();
console.log('\nmigration complete.');
