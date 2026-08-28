import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Database handle.
 *
 * node:sqlite ships with Node 22+, so the whole persistence layer needs no
 * third-party dependency and no native build step — which matters on this
 * project, whose entire runtime footprint was four packages.
 *
 * The connection is cached on globalThis because Next's dev server re-evaluates
 * modules on every hot reload; without this each reload would open another
 * handle to the same file and eventually exhaust them.
 */

const DB_FILE = process.env.DATABASE_FILE || path.join(process.cwd(), 'data', 'seoul-radiance.db');

declare global {
  // eslint-disable-next-line no-var
  var __srbdDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  const db = new DatabaseSync(DB_FILE);
  // Enforced per-connection in sqlite, so it has to be set every time.
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA journal_mode = WAL');
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalThis.__srbdDb) globalThis.__srbdDb = open();
  return globalThis.__srbdDb;
}

/** Applies schema.sql. Idempotent — every statement is CREATE ... IF NOT EXISTS. */
export function migrate(db: DatabaseSync = getDb()): void {
  const sql = readFileSync(path.join(process.cwd(), 'src', 'lib', 'schema.sql'), 'utf8');
  db.exec(sql);
}

/**
 * Typed row helpers.
 *
 * node:sqlite hands back null-prototype objects. React Server Components refuse
 * to serialise those to a client component ("Classes or null prototypes are not
 * supported"), so rows are rebuilt as plain objects here — at the single point
 * every query passes through, rather than at each call site where it would
 * eventually be forgotten.
 */
function plain<T>(row: unknown): T {
  return { ...(row as object) } as T;
}

export function all<T>(sql: string, params: unknown[] = []): T[] {
  const rows = getDb()
    .prepare(sql)
    .all(...(params as never[]));
  return rows.map((r) => plain<T>(r));
}

export function get<T>(sql: string, params: unknown[] = []): T | undefined {
  const row = getDb()
    .prepare(sql)
    .get(...(params as never[]));
  return row === undefined ? undefined : plain<T>(row);
}

export function run(sql: string, params: unknown[] = []) {
  return getDb()
    .prepare(sql)
    .run(...(params as never[]));
}

/** Wraps a unit of work in a transaction so partial writes can't survive. */
export function transaction<T>(fn: () => T): T {
  const db = getDb();
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export const DB_PATH = DB_FILE;
