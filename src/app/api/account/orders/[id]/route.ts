import { handle, fail, json } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { getOrder, getOrderItems } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const order = getOrder(id);

    // The ownership check is the whole point of this endpoint. Answering 404
    // rather than 403 for someone else's order also avoids confirming that the
    // id exists at all.
    if (!order || order.user_id !== user.id) {
      return fail('Order not found.', 404);
    }

    return json({ order, items: getOrderItems(order.id) });
  });
}
