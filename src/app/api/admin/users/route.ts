import { handle, json } from '@/lib/api';
import { requireAdmin } from '@/lib/auth';
import { listUsers } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return json({ users: listUsers() });
  });
}
