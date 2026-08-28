import { handle, readJson, fail, json } from '@/lib/api';
import { requireAdmin } from '@/lib/auth';
import { createProduct, getProductBySlug, listProducts, type ProductInput } from '@/lib/repo';
import { CATEGORY_NAMES, parseProductInput } from '@/lib/product-input';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return json({ products: listProducts(), categories: CATEGORY_NAMES });
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await readJson<Record<string, unknown>>(request);
    const { value, errors } = parseProductInput(body);
    if (errors) return fail('Please check the form.', 400, errors);

    if (getProductBySlug((value as ProductInput).slug)) {
      return fail('Please check the form.', 409, { slug: 'A product with this slug already exists.' });
    }

    createProduct(value as ProductInput);
    return json({ product: getProductBySlug((value as ProductInput).slug) }, 201);
  });
}
