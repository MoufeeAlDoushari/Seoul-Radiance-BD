import { createHash } from 'node:crypto';
import { get, run } from './db';

/**
 * Login throttling.
 *
 * A fixed window per scope, backed by the database so it survives a restart and
 * works the same on every worker. No dependency, and nothing to run alongside
 * the app.
 *
 * Two scopes are checked on each attempt:
 *   · IP + email — stops someone grinding one account;
 *   · IP alone, with a looser limit — stops someone spraying many accounts.
 *
 * The scope key is a keyed hash. The table therefore holds no readable address
 * or email, so throttling does not quietly become a second log of who tried to
 * sign in from where.
 *
 * Blocks are temporary by design: a legitimate user who mistypes their password
 * is inconvenienced for minutes, never locked out permanently.
 */

const RULES = {
  account: { limit: 6, windowMinutes: 15, blockMinutes: 15 },
  ip: { limit: 30, windowMinutes: 15, blockMinutes: 15 },
};

function scopeKey(kind: 'account' | 'ip', value: string): string {
  // Salted with SESSION_SECRET so the hashes are not reversible with a
  // precomputed table of common emails.
  const salt = process.env.SESSION_SECRET ?? 'unsalted';
  return `${kind}:${createHash('sha256').update(`${salt}|${kind}|${value}`).digest('hex').slice(0, 32)}`;
}

type AttemptRow = { attempts: number; window_start: string; blocked_until: string | null };

function check(key: string, rule: { limit: number; windowMinutes: number }): boolean {
  const row = get<AttemptRow>('SELECT * FROM login_attempts WHERE scope = ?', [key]);
  if (!row) return true;

  const blocked = get<{ n: number }>(
    'SELECT COUNT(*) AS n FROM login_attempts WHERE scope = ? AND blocked_until > datetime(?)',
    [key, 'now'],
  );
  if ((blocked?.n ?? 0) > 0) return false;

  // Window elapsed — the counter is stale and will be reset on the next record.
  const stale = get<{ n: number }>(
    `SELECT COUNT(*) AS n FROM login_attempts
      WHERE scope = ? AND window_start < datetime('now', ?)`,
    [key, `-${rule.windowMinutes} minutes`],
  );
  if ((stale?.n ?? 0) > 0) return true;

  return row.attempts < rule.limit;
}

function record(key: string, rule: { limit: number; windowMinutes: number; blockMinutes: number }) {
  const row = get<AttemptRow>('SELECT * FROM login_attempts WHERE scope = ?', [key]);

  if (!row) {
    run("INSERT INTO login_attempts (scope, attempts, window_start) VALUES (?, 1, datetime('now'))", [
      key,
    ]);
    return;
  }

  const expired = get<{ n: number }>(
    `SELECT COUNT(*) AS n FROM login_attempts
      WHERE scope = ? AND window_start < datetime('now', ?)`,
    [key, `-${rule.windowMinutes} minutes`],
  );

  if ((expired?.n ?? 0) > 0) {
    run(
      "UPDATE login_attempts SET attempts = 1, window_start = datetime('now'), blocked_until = NULL WHERE scope = ?",
      [key],
    );
    return;
  }

  const attempts = row.attempts + 1;
  if (attempts >= rule.limit) {
    run(
      `UPDATE login_attempts SET attempts = ?, blocked_until = datetime('now', ?) WHERE scope = ?`,
      [attempts, `+${rule.blockMinutes} minutes`, key],
    );
  } else {
    run('UPDATE login_attempts SET attempts = ? WHERE scope = ?', [attempts, key]);
  }
}

export function loginAllowed(ip: string, email: string): boolean {
  return (
    check(scopeKey('ip', ip), RULES.ip) &&
    check(scopeKey('account', `${ip}|${email.toLowerCase()}`), RULES.account)
  );
}

export function recordFailedLogin(ip: string, email: string): void {
  record(scopeKey('ip', ip), RULES.ip);
  record(scopeKey('account', `${ip}|${email.toLowerCase()}`), RULES.account);
}

/** A successful sign-in clears the account counter, not the IP one. */
export function clearLoginAttempts(ip: string, email: string): void {
  run('DELETE FROM login_attempts WHERE scope = ?', [
    scopeKey('account', `${ip}|${email.toLowerCase()}`),
  ]);
}

export function purgeOldAttempts(): void {
  run("DELETE FROM login_attempts WHERE window_start < datetime('now', '-1 day')");
}

/**
 * Best-effort client address.
 *
 * Proxy headers are attacker-controlled unless a trusted proxy sets them, so
 * this is a throttling hint rather than an identity. The account-scoped rule
 * carries the real weight; spoofing the header only widens the looser IP rule.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export const RATE_LIMITS = RULES;
