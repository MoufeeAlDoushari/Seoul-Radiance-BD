import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/repo';
import { site } from '@/data/site';
import { newOrderId, orderToText, type Order, type OrderItem } from '@/lib/order';
import { currentUser } from '@/lib/auth';
import { saveOrder } from '@/lib/repo';

export const runtime = 'nodejs';

type Incoming = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  district?: string;
  notes?: string;
  zone?: 'inside' | 'outside';
  payment?: 'cod' | 'bkash' | 'nagad';
  trxId?: string;
  lines?: { slug?: string; qty?: number }[];
};

const BD_PHONE = /^(?:\+?880|0)1[3-9]\d{8}$/;

export async function POST(request: Request) {
  let body: Incoming;
  try {
    body = (await request.json()) as Incoming;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const errors: Record<string, string> = {};

  const name = (body.name ?? '').trim();
  const phone = (body.phone ?? '').trim().replace(/[\s-]/g, '');
  const address = (body.address ?? '').trim();
  const district = (body.district ?? '').trim();
  const email = (body.email ?? '').trim();
  const notes = (body.notes ?? '').trim();
  const zone: Order['zone'] = body.zone === 'outside' ? 'outside' : 'inside';
  const payment: Order['payment'] =
    body.payment === 'bkash' || body.payment === 'nagad' ? body.payment : 'cod';
  const trxId = (body.trxId ?? '').trim();

  if (name.length < 2) errors.name = 'Please enter your full name.';
  if (!BD_PHONE.test(phone)) errors.phone = 'Enter a valid Bangladeshi mobile number.';
  if (address.length < 8) errors.address = 'Please enter a full delivery address.';
  if (!district) errors.district = 'Please choose your district.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'That email looks wrong.';
  if (payment !== 'cod' && trxId.length < 4) {
    errors.trxId = 'Enter the transaction ID from your payment.';
  }

  // Rebuild the cart server-side from the catalogue so prices can never be
  // tampered with by the client.
  const catalogue = listProducts();
  const items: OrderItem[] = [];
  for (const line of body.lines ?? []) {
    const product = catalogue.find((p) => p.slug === line.slug);
    const qty = Math.max(1, Math.min(99, Math.floor(Number(line.qty) || 0)));
    if (!product || !product.stock || qty < 1) continue;
    items.push({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      size: product.size,
      qty,
      price: product.price,
      lineTotal: product.price * qty,
    });
  }

  if (items.length === 0) errors.lines = 'Your cart is empty or the items are no longer available.';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping =
    subtotal >= site.delivery.freeAbove
      ? 0
      : zone === 'inside'
        ? site.delivery.insideDhaka
        : site.delivery.outsideDhaka;

  const order: Order = {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    customer: { name, phone, email: email || undefined, address, district, notes: notes || undefined },
    zone,
    payment,
    trxId: trxId || undefined,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };

  // Guest checkout still works exactly as before: an anonymous order simply has
  // no owner. When someone is signed in, the order becomes theirs and shows up
  // under My orders. The user id comes from the session — never from the body.
  const user = await currentUser();
  saveOrder({
    id: order.id,
    userId: user?.id ?? null,
    customer: order.customer,
    zone: order.zone,
    payment: order.payment,
    trxId: order.trxId,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
  });

  // Always leave a trace in the server log.
  console.log('\n=== NEW ORDER ===\n' + orderToText(order) + '\n=================\n');

  // Optional: forward to a webhook (Google Sheets, Zapier, Make, n8n, Formspree…).
  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, text: orderToText(order) }),
      });
    } catch (err) {
      // Never fail the customer's checkout because a webhook is down.
      console.error('Order webhook failed:', err);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}
