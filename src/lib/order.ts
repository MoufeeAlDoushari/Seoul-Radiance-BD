import { site, taka } from '@/data/site';

export type OrderItem = {
  slug: string;
  name: string;
  brand: string;
  size: string;
  qty: number;
  price: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  createdAt: string;
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
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export const SESSION_KEY = 'srbd.lastOrder.v1';

export function newOrderId(): string {
  const d = new Date();
  const stamp =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SRBD-${stamp}-${rand}`;
}

const paymentLabel: Record<Order['payment'], string> = {
  cod: 'Cash on Delivery',
  bkash: 'bKash',
  nagad: 'Nagad',
};

/** A readable summary of the order, used for the WhatsApp fallback message. */
export function orderToText(order: Order): string {
  const lines = order.items
    .map((i) => `• ${i.brand} ${i.name} (${i.size}) x${i.qty} — ${taka(i.lineTotal)}`)
    .join('\n');

  return [
    `New order ${order.id}`,
    '',
    lines,
    '',
    `Subtotal: ${taka(order.subtotal)}`,
    `Delivery (${order.zone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}): ${
      order.shipping === 0 ? 'Free' : taka(order.shipping)
    }`,
    `Total: ${taka(order.total)}`,
    '',
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    order.customer.email ? `Email: ${order.customer.email}` : '',
    `Address: ${order.customer.address}, ${order.customer.district}`,
    `Payment: ${paymentLabel[order.payment]}${order.trxId ? ` (TrxID ${order.trxId})` : ''}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function whatsappOrderLink(order: Order): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(orderToText(order))}`;
}
