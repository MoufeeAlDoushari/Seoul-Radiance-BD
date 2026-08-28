import { handle, readJson, fail, json } from '@/lib/api';
import { requireAdmin } from '@/lib/auth';
import { getUserDetail, setUserRole, setUserStatus } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { status?: 'active' | 'suspended'; role?: 'user' | 'admin' };

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const numeric = Number(id);
    if (!Number.isInteger(numeric)) return fail('Invalid user id.', 400);
    const user = getUserDetail(numeric);
    if (!user) return fail('User not found.', 404);
    return json({ user });
  });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const numeric = Number(id);
    if (!Number.isInteger(numeric)) return fail('Invalid user id.', 400);

    const target = getUserDetail(numeric);
    if (!target) return fail('User not found.', 404);

    // Guard against an admin locking themselves out of the panel.
    if (admin.id === numeric) {
      return fail('You cannot change your own role or status.', 400);
    }

    const body = await readJson<Body>(request);
    if (body.status === 'active' || body.status === 'suspended') {
      setUserStatus(numeric, body.status);
    }
    if (body.role === 'user' || body.role === 'admin') {
      setUserRole(numeric, body.role);
    }

    return json({ user: getUserDetail(numeric) });
  });
}
