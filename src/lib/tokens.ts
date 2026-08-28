import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { get, run } from './db';

/**
 * One-time tokens for password reset and email verification.
 *
 * The raw token goes to the user; only its SHA-256 hash is stored. A dump of
 * the database therefore yields nothing usable — unlike storing the token
 * itself, which would be equivalent to storing a live password.
 *
 * SHA-256 without a salt is deliberate here and different from password
 * hashing: these are 256 bits of CSPRNG output with a short lifetime, so there
 * is nothing to brute-force and no need for a slow KDF. Lookup has to be by
 * exact hash, which bcrypt could not do.
 */

const RESET_TTL_MINUTES = 45;
const VERIFY_TTL_HOURS = 48;

export type TokenKind = 'password_reset' | 'email_verification';

const TABLE: Record<TokenKind, string> = {
  password_reset: 'password_resets',
  email_verification: 'email_verifications',
};

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Constant-time compare for the rare paths that compare hashes directly. */
export function hashesEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function issueToken(kind: TokenKind, userId: number): string {
  const token = randomBytes(32).toString('base64url');
  const ttlMs =
    kind === 'password_reset' ? RESET_TTL_MINUTES * 60_000 : VERIFY_TTL_HOURS * 3_600_000;
  const expires = new Date(Date.now() + ttlMs).toISOString();

  // Any outstanding token of the same kind is retired first, so requesting a
  // new link invalidates the previous one.
  run(`UPDATE ${TABLE[kind]} SET used_at = datetime('now') WHERE user_id = ? AND used_at IS NULL`, [
    userId,
  ]);

  run(`INSERT INTO ${TABLE[kind]} (user_id, token_hash, expires_at) VALUES (?, ?, ?)`, [
    userId,
    hashToken(token),
    expires,
  ]);

  return token;
}

type TokenRow = { id: number; user_id: number };

/**
 * Redeems a token, or returns null.
 *
 * Marking it used happens in the same call as the lookup so a token cannot be
 * spent twice by two requests arriving together.
 */
export function consumeToken(kind: TokenKind, token: string): number | null {
  if (!token || token.length < 20) return null;

  const row = get<TokenRow>(
    `SELECT id, user_id FROM ${TABLE[kind]}
      WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')`,
    [hashToken(token)],
  );

  if (!row) return null;

  const res = run(`UPDATE ${TABLE[kind]} SET used_at = datetime('now') WHERE id = ? AND used_at IS NULL`, [
    row.id,
  ]);

  // Zero rows changed means another request redeemed it first.
  if (Number(res.changes) === 0) return null;

  return row.user_id;
}

/** Housekeeping, called opportunistically when tokens are issued. */
export function purgeExpiredTokens(): void {
  for (const table of Object.values(TABLE)) {
    run(`DELETE FROM ${table} WHERE expires_at < datetime('now', '-7 days')`);
  }
}

export const TOKEN_TTL = {
  resetMinutes: RESET_TTL_MINUTES,
  verifyHours: VERIFY_TTL_HOURS,
};
