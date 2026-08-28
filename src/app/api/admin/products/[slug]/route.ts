import { handle, readJson, fail, json } from '@/lib/api';
import { requireAdmin } from '@/lib/auth';
import { deleteProduct, getProductBySlug, updateProduct, type ProductInput } from '@/lib/repo';
import { parseProductInput } from '@/lib/product-input';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { slug } = await ctx.params;
    const product = getProductBySlug(slug);
    if (!product) return fail('Product not found.', 404);
    return json({ product });
  });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { slug } = await ctx.params;
    if (!getProductBySlug(slug)) return fail('Product not found.', 404);

    const body = await readJson<Record<string, unknown>>(request);
    const { value, errors } = parseProductInput(body);
    if (errors) return fail('Please check the form.', 400, errors);

    const next = value as ProductInput;
    // Renaming the slug must not collide with a different product.
    if (next.slug !== slug && getProductBySlug(next.slug)) {
      return fail('Please check the form.', 409, { slug: 'A product with this slug already exists.' });
    }

    updateProduct(slug, next);
    return json({ product: getProductBySlug(next.slug) });
  });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { slug } = await ctx.params;
    if (!getProductBySlug(slug)) return fail('Product not found.', 404);
    // order_items keep their own copy of name/price, so past orders survive a
    // product being removed from the catalogue.
    deleteProduct(slug);
    return json({ ok: true });
  });
}
