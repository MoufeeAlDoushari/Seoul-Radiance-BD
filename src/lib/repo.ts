import { all, get, run, transaction } from './db';
import type { Category, Product } from '@/data/products';
import type { OrderStatus } from './validate';

/**
 * Data access.
 *
 * Product rows are mapped back into the exact `Product` shape the existing UI
 * already consumes, so ProductCard, the shop grid and the detail page keep
 * working against the same type they always did — the source just moved from a
 * static array to the database.
 */

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  old_price: number | null;
  size: string;
  image: string;
  stock: number;
  badges: string;
  short: string;
  description: string;
  key_ingredients: string;
  how_to_use: string;
  skin_types: string;
};

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function toProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category as Category,
    price: r.price,
    ...(r.old_price != null ? { oldPrice: r.old_price } : {}),
    size: r.size,
    image: r.image,
    stock: r.stock === 1,
    badges: parseJsonArray(r.badges) as Product['badges'],
    short: r.short,
    description: r.description,
    keyIngredients: parseJsonArray(r.key_ingredients),
    howToUse: r.how_to_use,
    skinTypes: parseJsonArray(r.skin_types),
  };
}

/* -------------------------------------------------------------- products -- */

export function listProducts(): Product[] {
  return all<ProductRow>('SELECT * FROM products ORDER BY id').map(toProduct);
}

export function getProductBySlug(slug: string): Product | undefined {
  const row = get<ProductRow>('SELECT * FROM products WHERE slug = ?', [slug]);
  return row ? toProduct(row) : undefined;
}

export function listProductRows() {
  return all<ProductRow>('SELECT * FROM products ORDER BY id');
}

export type ProductInput = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  size: string;
  image: string;
  stock: boolean;
  badges?: string[];
  short?: string;
  description?: string;
  keyIngredients?: string[];
  howToUse?: string;
  skinTypes?: string[];
};

export function createProduct(p: ProductInput) {
  return run(
    `INSERT INTO products (slug, name, brand, category, price, old_price, size, image, stock,
                           badges, short, description, key_ingredients, how_to_use, skin_types)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.slug,
      p.name,
      p.brand,
      p.category,
      p.price,
      p.oldPrice ?? null,
      p.size,
      p.image,
      p.stock ? 1 : 0,
      JSON.stringify(p.badges ?? []),
      p.short ?? '',
      p.description ?? '',
      JSON.stringify(p.keyIngredients ?? []),
      p.howToUse ?? '',
      JSON.stringify(p.skinTypes ?? []),
    ],
  );
}

export function updateProduct(slug: string, p: ProductInput) {
  return run(
    `UPDATE products
        SET slug = ?, name = ?, brand = ?, category = ?, price = ?, old_price = ?, size = ?,
            image = ?, stock = ?, badges = ?, short = ?, description = ?, key_ingredients = ?,
            how_to_use = ?, skin_types = ?, updated_at = datetime('now')
      WHERE slug = ?`,
    [
      p.slug,
      p.name,
      p.brand,
      p.category,
      p.price,
      p.oldPrice ?? null,
      p.size,
      p.image,
      p.stock ? 1 : 0,
      JSON.stringify(p.badges ?? []),
      p.short ?? '',
      p.description ?? '',
      JSON.stringify(p.keyIngredients ?? []),
      p.howToUse ?? '',
      JSON.stringify(p.skinTypes ?? []),
      slug,
    ],
  );
}

export function deleteProduct(slug: string) {
  return run('DELETE FROM products WHERE slug = ?', [slug]);
}

/* ---------------------------------------------------------------- orders -- */

export type OrderRow = {
  id: string;
  user_id: number | null;
  status: OrderStatus;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  district: string;
  notes: string | null;
  zone: 'inside' | 'outside';
  payment: 'cod' | 'bkash' | 'nagad';
  trx_id: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: number;
  order_id: string;
  slug: string;
  name: string;
  brand: string;
  size: string;
  qty: number;
  price: number;
  line_total: number;
};

export type PersistOrder = {
  id: string;
  userId: number | null;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    district: string;
    notes?: string;
  };
  zone: 'inside' | 'outside';
  payment: 'cod' | 'bkash' | 'nagad';
  trxId?: string;
  items: { slug: string; name: string; brand: string; size: string; qty: number; price: number; lineTotal: number }[];
  subtotal: number;
  shipping: number;
  total: number;
};

/** Order + items written as one unit; a half-saved order is worse than none. */
export function saveOrder(o: PersistOrder): void {
  transaction(() => {
    run(
      `INSERT INTO orders (id, user_id, customer_name, phone, email, address, district, notes,
                           zone, payment, trx_id, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.id,
        o.userId,
        o.customer.name,
        o.customer.phone,
        o.customer.email ?? null,
        o.customer.address,
        o.customer.district,
        o.customer.notes ?? null,
        o.zone,
        o.payment,
        o.trxId ?? null,
        o.subtotal,
        o.shipping,
        o.total,
      ],
    );
    for (const i of o.items) {
      run(
        `INSERT INTO order_items (order_id, slug, name, brand, size, qty, price, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [o.id, i.slug, i.name, i.brand, i.size, i.qty, i.price, i.lineTotal],
      );
    }
  });
}

export function listOrdersForUser(userId: number): OrderRow[] {
  return all<OrderRow>('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export function listAllOrders(status?: OrderStatus): OrderRow[] {
  return status
    ? all<OrderRow>('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC', [status])
    : all<OrderRow>('SELECT * FROM orders ORDER BY created_at DESC');
}

export function getOrder(id: string): OrderRow | undefined {
  return get<OrderRow>('SELECT * FROM orders WHERE id = ?', [id]);
}

export function getOrderItems(orderId: string): OrderItemRow[] {
  return all<OrderItemRow>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', [orderId]);
}

export function setOrderStatus(id: string, status: OrderStatus) {
  return run("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
}

/* ----------------------------------------------------------------- users -- */

export type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  phone: string | null;
  district: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
};

export function listUsers(): AdminUserRow[] {
  return all<AdminUserRow>(
    `SELECT u.id, u.name, u.email, u.role, u.status, u.phone, u.district, u.created_at,
            COUNT(o.id) AS order_count,
            COALESCE(SUM(o.total), 0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'cancelled'
      GROUP BY u.id
      ORDER BY u.created_at DESC`,
  );
}

export function getUserDetail(id: number): AdminUserRow | undefined {
  return get<AdminUserRow>(
    `SELECT u.id, u.name, u.email, u.role, u.status, u.phone, u.district, u.created_at,
            COUNT(o.id) AS order_count,
            COALESCE(SUM(o.total), 0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'cancelled'
      WHERE u.id = ?
      GROUP BY u.id`,
    [id],
  );
}

export function setUserStatus(id: number, status: 'active' | 'suspended') {
  return run("UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
}

export function setUserRole(id: number, role: 'user' | 'admin') {
  return run("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?", [role, id]);
}

export function updateUserProfile(
  id: number,
  p: { name: string; phone: string | null; address: string | null; district: string | null },
) {
  return run(
    `UPDATE users SET name = ?, phone = ?, address = ?, district = ?, updated_at = datetime('now')
      WHERE id = ?`,
    [p.name, p.phone, p.address, p.district, id],
  );
}

/* ------------------------------------------------------------ statistics -- */

export function adminStats() {
  const users = get<{ n: number }>("SELECT COUNT(*) AS n FROM users WHERE role = 'user'")?.n ?? 0;
  const admins = get<{ n: number }>("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'")?.n ?? 0;
  const productCount = get<{ n: number }>('SELECT COUNT(*) AS n FROM products')?.n ?? 0;
  const orderCount = get<{ n: number }>('SELECT COUNT(*) AS n FROM orders')?.n ?? 0;
  // Cancelled orders are excluded — they are not revenue.
  const revenue =
    get<{ n: number }>("SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status != 'cancelled'")
      ?.n ?? 0;
  const byStatus = all<{ status: OrderStatus; n: number }>(
    'SELECT status, COUNT(*) AS n FROM orders GROUP BY status',
  );
  return { users, admins, productCount, orderCount, revenue, byStatus };
}

export function userStats(userId: number) {
  const rows = all<{ status: OrderStatus; n: number; total: number }>(
    'SELECT status, COUNT(*) AS n, COALESCE(SUM(total),0) AS total FROM orders WHERE user_id = ? GROUP BY status',
    [userId],
  );
  const total = rows.reduce((s, r) => s + r.n, 0);
  const find = (s: OrderStatus) => rows.find((r) => r.status === s)?.n ?? 0;
  const spent = rows.filter((r) => r.status !== 'cancelled').reduce((s, r) => s + r.total, 0);
  return {
    total,
    pending: find('pending') + find('processing'),
    completed: find('delivered'),
    cancelled: find('cancelled'),
    spent,
  };
}
