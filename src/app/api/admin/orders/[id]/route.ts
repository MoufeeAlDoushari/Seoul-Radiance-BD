import { handle, readJson, fail, json } from '@/lib/api';
import { requireAdmin } from '@/lib/auth';
import { getOrder, getOrderItems, setOrderStatus } from '@/lib/repo';
import { isOrderStatus } from '@/lib/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const order = getOrder(id);
    if (!order) return fail('Order not found.', 404);
    return json({ order, items: getOrderItems(order.id) });
  });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    if (!getOrder(id)) return fail('Order not found.', 404);

    const body = await readJson<{ status?: string }>(request);
    if (!isOrderStatus(body.status)) {
      return fail('Please check the form.', 400, { status: 'Unknown order status.' });
    }

    setOrderStatus(id, body.status);
    return json({ order: getOrder(id), items: getOrderItems(id) });
  });
}
