import { handle, json } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { listOrdersForUser, userStats } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    // Scoped by user_id in the query itself; there is no parameter that could
    // widen it.
    return json({ orders: listOrdersForUser(user.id), stats: userStats(user.id) });
  });
}
