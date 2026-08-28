import { handle, json } from '@/lib/api';
import { requireAdmin } from '@/lib/auth';
import { adminStats, listAllOrders } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return json({ stats: adminStats(), recentOrders: listAllOrders().slice(0, 8) });
  });
}
