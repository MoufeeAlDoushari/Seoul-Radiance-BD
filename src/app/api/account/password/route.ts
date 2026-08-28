import { cookies } from 'next/headers';
import { handle, readJson, fail, json } from '@/lib/api';
import {
  destroyAllSessionsForUser,
  findUserByEmail,
  hashPassword,
  requireUser,
  SESSION_COOKIE,
  tokenFromCookie,
  verifyPassword,
} from '@/lib/auth';
import { validatePassword } from '@/lib/validate';
import { run } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { currentPassword?: string; newPassword?: string; confirmPassword?: string };

export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const body = await readJson<Body>(request);

    const currentPassword = body.currentPassword ?? '';
    const newPassword = body.newPassword ?? '';
    const confirmPassword = body.confirmPassword ?? '';

    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = 'Enter your current password.';

    const strength = validatePassword(newPassword);
    if (strength) errors.newPassword = strength;
    if (newPassword !== confirmPassword) errors.confirmPassword = 'The two passwords do not match.';
    if (newPassword && currentPassword === newPassword) {
      errors.newPassword = 'Choose a password you have not used here before.';
    }

    if (Object.keys(errors).length > 0) return fail('Please check the form.', 400, errors);

    // Re-read with the hash; the session user object deliberately omits it.
    const row = findUserByEmail(user.email);
    if (!row || !verifyPassword(currentPassword, row.password_hash)) {
      return fail('Please check the form.', 400, {
        currentPassword: 'That is not your current password.',
      });
    }

    run(
      "UPDATE users SET password_hash = ?, password_changed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?",
      [hashPassword(newPassword), user.id],
    );

    // Every other session is ended. Whoever knew the old password must not keep
    // a working session — that is the point of changing it. The current device
    // is kept so the person is not signed out of the page they are on.
    const store = await cookies();
    const keep = tokenFromCookie(store.get(SESSION_COOKIE)?.value ?? '');
    const revoked = destroyAllSessionsForUser(user.id, keep);

    return json({ ok: true, revokedSessions: revoked });
  });
}
