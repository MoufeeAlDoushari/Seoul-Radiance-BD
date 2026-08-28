import { categories } from '@/data/products';
import type { ProductInput } from './repo';
import type { Errors } from './validate';

/**
 * Parses and validates the admin product form.
 *
 * Kept apart from the route handlers because create and update need exactly the
 * same rules, and because coercion of an untrusted body is worth reading in one
 * place: everything is re-derived from the payload rather than trusted, and
 * prices are forced to non-negative integers (BDT has no minor unit here).
 */

export const CATEGORY_NAMES = categories.map((c) => c.name);

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function strArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => str(x)).filter(Boolean);
  // The form sends comma-separated text; accept both shapes.
  if (typeof v === 'string') {
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function intOrNull(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null;
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? n : null;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseProductInput(body: Record<string, unknown>): {
  value: ProductInput | null;
  errors: Errors | null;
} {
  const errors: Errors = {};

  const slug = str(body.slug).toLowerCase();
  const name = str(body.name);
  const brand = str(body.brand);
  const category = str(body.category);
  const size = str(body.size);
  const image = str(body.image);
  const price = intOrNull(body.price);
  const oldPrice = intOrNull(body.oldPrice);

  if (!slug) errors.slug = 'A slug is required.';
  else if (!SLUG.test(slug)) errors.slug = 'Use lowercase letters, numbers and hyphens only.';

  if (name.length < 2) errors.name = 'Enter the product name.';
  if (brand.length < 1) errors.brand = 'Enter the brand.';
  if (!CATEGORY_NAMES.includes(category as (typeof CATEGORY_NAMES)[number])) {
    errors.category = 'Choose one of the existing categories.';
  }
  if (!size) errors.size = 'Enter the size, for example "50 ml".';
  if (!image) errors.image = 'Enter an image path, for example /products/name.svg';

  if (price === null || price < 0) errors.price = 'Enter a price in taka.';
  if (oldPrice !== null && oldPrice < 0) errors.oldPrice = 'The old price cannot be negative.';
  if (price !== null && oldPrice !== null && oldPrice <= price) {
    errors.oldPrice = 'The old price should be higher than the current price.';
  }

  if (Object.keys(errors).length > 0) return { value: null, errors };

  return {
    value: {
      slug,
      name,
      brand,
      category,
      price: price as number,
      oldPrice,
      size,
      image,
      stock: body.stock === true || body.stock === 'true' || body.stock === 1,
      badges: strArray(body.badges).filter((b) => b === 'bestseller' || b === 'new'),
      short: str(body.short),
      description: str(body.description),
      keyIngredients: strArray(body.keyIngredients),
      howToUse: str(body.howToUse),
      skinTypes: strArray(body.skinTypes),
    },
    errors: null,
  };
}
