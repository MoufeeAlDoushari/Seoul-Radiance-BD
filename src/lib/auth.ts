import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { get, run } from './db';
import { SESSION_COOKIE } from './constants';

/**
 * Session-based authentication.
 *
 * Opaque random tokens stored in the `sessions` table, handed to the browser in
 * an HTTP-only cookie alongside an HMAC signature. Two reasons for server-side
 * sessions rather than a stateless JWT:
 *
 *   · they can be revoked — logging out, or suspending an account, takes effect
 *     immediately rather than whenever the token happens to expire;
 *   · the cookie carries no claims, so a tampered cookie cannot assert a role.
 *
 * Role is always read from the database row, never from anything the client
 * sent.
 */

export { SESSION_COOKIE };
const SESSION_DAYS = 30;

export type Role = 'user' | 'admin';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  address: string | null;
  district: string | null;
  status: 'active' | 'suspended';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

type UserRow = User & { password_hash: string };

/* ------------------------------------------------------------- secrets --- */

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    // Refuse rather than silently signing with a guessable key.
    throw new Error(
      'SESSION_SECRET is missing or too short. Set it in .env.local — see .env.example.',
    );
  }
  return s;
}

function sign(token: string): string {
  return createHmac('sha256', secret()).update(token).digest('hex');
}

/** Constant-time compare so a signature cannot be brute-forced by timing. */
function signatureValid(token: string, signature: string): boolean {
  const expected = Buffer.from(sign(token), 'utf8');
  const given = Buffer.from(signature, 'utf8');
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

/* ------------------------------------------------------------ passwords --- */

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

/* ------------------------------------------------------------- sessions --- */

export function createSession(userId: number): string {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  run('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)', [
    token,
    userId,
    expires,
  ]);
  return `${token}.${sign(token)}`;
}

/**
 * Ends every session a user has.
 *
 * Called after a password change and after a reset: whoever knew the old
 * password must not keep a working session, which is the whole point of
 * changing it.
 */
export function destroyAllSessionsForUser(userId: number, exceptToken?: string): number {
  const res = exceptToken
    ? run('DELETE FROM sessions WHERE user_id = ? AND token != ?', [userId, exceptToken])
    : run('DELETE FROM sessions WHERE user_id = ?', [userId]);
  return Number(res.changes);
}

/** Extracts the raw token from a cookie value, without verifying it. */
export function tokenFromCookie(cookieValue: string): string {
  return cookieValue.split('.')[0] ?? '';
}

export function destroySession(cookieValue: string): void {
  const [token] = cookieValue.split('.');
  if (token) run('DELETE FROM sessions WHERE token = ?', [token]);
}

/** Housekeeping — called opportunistically on login. */
export function purgeExpiredSessions(): void {
  run("DELETE FROM sessions WHERE expires_at < datetime('now')");
}

/* ----------------------------------------------------------- current user -- */

/**
 * Resolves the signed-in user, or null.
 *
 * Every check that matters happens here: signature, expiry, existence, and
 * account status. A suspended user is treated as signed out.
 */
export async function currentUser(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [token, signature] = raw.split('.');
  if (!token || !signature) return null;
  if (!signatureValid(token, signature)) return null;

  const row = get<User & { expires_at: string }>(
    `SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.district, u.status,
            u.email_verified_at, u.created_at, u.updated_at, s.expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')`,
    [token],
  );

  if (!row) return null;
  if (row.status !== 'active') return null;

  const { expires_at: _ignored, ...user } = row;
  return user;
}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new HttpError(401, 'You need to sign in to do that.');
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== 'admin') throw new HttpError(403, 'Administrator access only.');
  return user;
}

/* --------------------------------------------------------------- lookups -- */

export function findUserByEmail(email: string): UserRow | undefined {
  return get<UserRow>('SELECT * FROM users WHERE email = ? COLLATE NOCASE', [email.trim()]);
}

export function findUserById(id: number): User | undefined {
  return get<User>(
    `SELECT id, name, email, role, phone, address, district, status, email_verified_at,
            created_at, updated_at
       FROM users WHERE id = ?`,
    [id],
  );
}

/* ---------------------------------------------------------------- errors -- */

/** Carries an HTTP status so route handlers can translate it uniformly. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
