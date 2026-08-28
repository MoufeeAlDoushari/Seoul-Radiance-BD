import { handle, readJson, fail, json } from '@/lib/api';
import { requireUser, findUserById } from '@/lib/auth';
import { validateProfile } from '@/lib/validate';
import { updateUserProfile } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { name?: string; phone?: string; address?: string; district?: string };

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    return json({ user });
  });
}

export async function PATCH(request: Request) {
  return handle(async () => {
    // The id comes from the session, never from the body — a user can only ever
    // edit themselves, and there is no field they could send to change that.
    const user = await requireUser();
    const body = await readJson<Body>(request);

    const name = (body.name ?? '').trim();
    const phone = (body.phone ?? '').trim().replace(/[\s-]/g, '');
    const address = (body.address ?? '').trim();
    const district = (body.district ?? '').trim();

    const errors = validateProfile({ name, phone, address, district });
    if (Object.keys(errors).length > 0) return fail('Please check the form.', 400, errors);

    updateUserProfile(user.id, {
      name,
      phone: phone || null,
      address: address || null,
      district: district || null,
    });

    return json({ user: findUserById(user.id) });
  });
}
