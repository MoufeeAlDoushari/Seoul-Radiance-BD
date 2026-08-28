import { cookies } from 'next/headers';
import { handle, readJson, fail, json } from '@/lib/api';
import {
  createSession,
  findUserByEmail,
  purgeExpiredSessions,
  sessionCookieOptions,
  SESSION_COOKIE,
  verifyPassword,
} from '@/lib/auth';
import { clearLoginAttempts, clientIp, loginAllowed, recordFailedLogin } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type Body = { email?: string; password?: string };

export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson<Body>(request);
    const email = (body.email ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    if (!email || !password) {
      return fail('Enter your email and password.', 400);
    }

    const ip = clientIp(request);

    // Throttle before touching the database, so a blocked caller cannot use
    // this endpoint to probe for accounts at all.
    if (!loginAllowed(ip, email)) {
      return fail('Too many attempts. Please wait a few minutes and try again.', 429);
    }

    const user = findUserByEmail(email);

    // One message for "no such user" and "wrong password" alike, so the
    // endpoint cannot be used to discover which emails have accounts. The
    // bcrypt compare runs either way to keep the timing similar.
    const dummy = '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012';
    const ok = user
      ? verifyPassword(password, user.password_hash)
      : (verifyPassword(password, dummy), false);

    if (!user || !ok) {
      recordFailedLogin(ip, email);
      return fail('That email or password is not right.', 401);
    }

    if (user.status !== 'active') {
      // Counted as a failure too: otherwise a suspended account is an
      // unlimited oracle for checking passwords.
      recordFailedLogin(ip, email);
      return fail('That email or password is not right.', 401);
    }

    clearLoginAttempts(ip, email);
    purgeExpiredSessions();

    const cookie = createSession(user.id);
    (await cookies()).set(SESSION_COOKIE, cookie, sessionCookieOptions);

    return json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });
}
