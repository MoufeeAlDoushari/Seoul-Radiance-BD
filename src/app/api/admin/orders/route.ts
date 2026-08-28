import { handle, json } from '@/lib/api';
import { requireAdmin } from '@/lib/auth';
import { listAllOrders } from '@/lib/repo';
import { isOrderStatus } from '@/lib/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const status = new URL(request.url).searchParams.get('status');
    return json({ orders: listAllOrders(isOrderStatus(status) ? status : undefined) });
  });
}
