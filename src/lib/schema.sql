-- ---------------------------------------------------------------------------
-- Seoul Radiance BD — schema
--
-- Plain SQL against node:sqlite (built into Node 22+). Every statement is
-- CREATE ... IF NOT EXISTS so the migration is idempotent and safe to re-run
-- against a database that already holds live data.
--
-- Portable to Postgres later: the only sqlite-isms are INTEGER PRIMARY KEY and
-- the TEXT timestamps, both of which have direct equivalents.
-- ---------------------------------------------------------------------------

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------- users ---
CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT    NOT NULL,
  email          TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  password_hash  TEXT    NOT NULL,
  role           TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone          TEXT,
  address        TEXT,
  district       TEXT,
  status         TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- -------------------------------------------------------------- sessions ---
-- Server-side sessions rather than stateless JWTs, so a session can actually be
-- revoked (logout, suspension) instead of merely expiring.
CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT    PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- -------------------------------------------------------------- products ---
-- Seeded from src/data/products.ts, which stays the source of truth for the
-- initial catalogue. Columns mirror the existing Product type exactly so no
-- product information is lost in the move.
CREATE TABLE IF NOT EXISTS products (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT    NOT NULL UNIQUE,
  name             TEXT    NOT NULL,
  brand            TEXT    NOT NULL,
  category         TEXT    NOT NULL,
  price            INTEGER NOT NULL,
  old_price        INTEGER,
  size             TEXT    NOT NULL,
  image            TEXT    NOT NULL,
  stock            INTEGER NOT NULL DEFAULT 1,
  badges           TEXT    NOT NULL DEFAULT '[]',  -- JSON array
  short            TEXT    NOT NULL DEFAULT '',
  description      TEXT    NOT NULL DEFAULT '',
  key_ingredients  TEXT    NOT NULL DEFAULT '[]',  -- JSON array
  how_to_use       TEXT    NOT NULL DEFAULT '',
  skin_types       TEXT    NOT NULL DEFAULT '[]',  -- JSON array
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ---------------------------------------------------------------- orders ---
-- user_id is nullable on purpose: guest checkout already exists on this site
-- and the brief says to preserve it. A guest order simply has no owner.
CREATE TABLE IF NOT EXISTS orders (
  id             TEXT    PRIMARY KEY,          -- existing human-readable id, e.g. SRBD-4F2A19
  user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status         TEXT    NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_name  TEXT    NOT NULL,
  phone          TEXT    NOT NULL,
  email          TEXT,
  address        TEXT    NOT NULL,
  district       TEXT    NOT NULL,
  notes          TEXT,
  zone           TEXT    NOT NULL CHECK (zone IN ('inside', 'outside')),
  payment        TEXT    NOT NULL CHECK (payment IN ('cod', 'bkash', 'nagad')),
  trx_id         TEXT,
  subtotal       INTEGER NOT NULL,
  shipping       INTEGER NOT NULL,
  total          INTEGER NOT NULL,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- ----------------------------------------------------------- order_items ---
-- Prices are copied in at purchase time. A later price change on the product
-- must never rewrite what a customer was actually charged.
CREATE TABLE IF NOT EXISTS order_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id    TEXT    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  slug        TEXT    NOT NULL,
  name        TEXT    NOT NULL,
  brand       TEXT    NOT NULL,
  size        TEXT    NOT NULL,
  qty         INTEGER NOT NULL,
  price       INTEGER NOT NULL,
  line_total  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ---------------------------------------------------------------------------
-- Hardening additions
-- ---------------------------------------------------------------------------

-- One-time password reset tokens.
-- Only a SHA-256 hash of the token is stored: a database leak must not hand an
-- attacker a working reset link. used_at makes each token single-use.
CREATE TABLE IF NOT EXISTS password_resets (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT    NOT NULL UNIQUE,
  expires_at  TEXT    NOT NULL,
  used_at     TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_hash ON password_resets(token_hash);

-- Email verification tokens. Same hashed, expiring, single-use design.
CREATE TABLE IF NOT EXISTS email_verifications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT    NOT NULL UNIQUE,
  expires_at  TEXT    NOT NULL,
  used_at     TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_hash ON email_verifications(token_hash);

-- Login throttling.
-- `scope` is a hash, never a raw address or email: rate limiting should not
-- become a second, quieter log of who tried to sign in from where.
CREATE TABLE IF NOT EXISTS login_attempts (
  scope         TEXT    PRIMARY KEY,
  attempts      INTEGER NOT NULL DEFAULT 0,
  window_start  TEXT    NOT NULL DEFAULT (datetime('now')),
  blocked_until TEXT
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_window ON login_attempts(window_start);
