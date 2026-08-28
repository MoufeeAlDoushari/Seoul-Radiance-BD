import { handle, readJson, fail, json } from '@/lib/api';
import { destroyAllSessionsForUser, hashPassword } from '@/lib/auth';
import { consumeToken } from '@/lib/tokens';
import { validatePassword } from '@/lib/validate';
import { run } from '@/lib/db';

export const runtime = 'nodejs';

type Body = { token?: string; password?: string; confirmPassword?: string };

export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson<Body>(request);
    const token = (body.token ?? '').trim();
    const password = body.password ?? '';
    const confirmPassword = body.confirmPassword ?? '';

    const errors: Record<string, string> = {};
    const strength = validatePassword(password);
    if (strength) errors.password = strength;
    if (password !== confirmPassword) errors.confirmPassword = 'The two passwords do not match.';
    if (Object.keys(errors).length > 0) return fail('Please check the form.', 400, errors);

    // Redeems and marks used in one step, so a link cannot be spent twice.
    const userId = consumeToken('password_reset', token);
    if (userId === null) {
      return fail('That reset link is invalid or has expired. Please request a new one.', 400);
    }

    run(
      "UPDATE users SET password_hash = ?, password_changed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?",
      [hashPassword(password), userId],
    );

    // Every existing session is ended: a reset is usually because access was
    // lost or compromised, so nothing from before should keep working.
    destroyAllSessionsForUser(userId);

    return json({ ok: true });
  });
}
