import { handle, json } from '@/lib/api';
import { currentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const user = await currentUser();
    return json({ user });
  });
}
