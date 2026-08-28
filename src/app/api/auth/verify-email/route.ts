import { handle, readJson, fail, json } from '@/lib/api';
import { consumeToken } from '@/lib/tokens';
import { run } from '@/lib/db';

export const runtime = 'nodejs';

type Body = { token?: string };

export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson<Body>(request);
    const token = (body.token ?? '').trim();

    const userId = consumeToken('email_verification', token);
    if (userId === null) {
      return fail('That verification link is invalid or has expired.', 400);
    }

    run(
      "UPDATE users SET email_verified_at = datetime('now'), updated_at = datetime('now') WHERE id = ?",
      [userId],
    );

    return json({ ok: true });
  });
}
