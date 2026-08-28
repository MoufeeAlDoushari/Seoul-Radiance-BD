import { cookies } from 'next/headers';
import { handle, json } from '@/lib/api';
import { destroySession, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  return handle(async () => {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    // Delete the row as well as the cookie, so the token is dead server-side
    // even if a copy of it was captured.
    if (raw) destroySession(raw);
    store.delete(SESSION_COOKIE);
    return json({ ok: true });
  });
}
