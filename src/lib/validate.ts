/**
 * Shared validation. Used by the API routes so the server is always the
 * authority; the forms reuse the same rules for immediate feedback, but nothing
 * relies on the client having run them.
 */

export type Errors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(name: string): string | null {
  const n = name.trim();
  if (n.length < 2) return 'Please enter your full name.';
  if (n.length > 80) return 'That name is too long.';
  return null;
}

export function validateEmail(email: string): string | null {
  const e = email.trim();
  if (!e) return 'Please enter your email address.';
  if (!EMAIL.test(e)) return 'That email address does not look right.';
  if (e.length > 160) return 'That email address is too long.';
  return null;
}

/**
 * Deliberately modest: long enough to resist casual guessing, without the
 * symbol-class rules that push people toward "Passw0rd!".
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Use at least 8 characters.';
  if (password.length > 200) return 'That password is too long.';
  if (!/[a-zA-Z]/.test(password)) return 'Include at least one letter.';
  if (!/[0-9]/.test(password)) return 'Include at least one number.';
  return null;
}

export function validateRegistration(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Errors {
  const errors: Errors = {};
  const name = validateName(input.name);
  if (name) errors.name = name;
  const email = validateEmail(input.email);
  if (email) errors.email = email;
  const password = validatePassword(input.password);
  if (password) errors.password = password;
  if (input.password !== input.confirmPassword) {
    errors.confirmPassword = 'The two passwords do not match.';
  }
  return errors;
}

/** Bangladeshi mobile, matching the rule the checkout already enforces. */
const BD_PHONE = /^(?:\+?880|0)1[3-9]\d{8}$/;

export function validateProfile(input: {
  name: string;
  phone?: string;
  address?: string;
  district?: string;
}): Errors {
  const errors: Errors = {};
  const name = validateName(input.name);
  if (name) errors.name = name;
  const phone = (input.phone ?? '').trim().replace(/[\s-]/g, '');
  if (phone && !BD_PHONE.test(phone)) {
    errors.phone = 'Enter a valid Bangladeshi mobile number.';
  }
  if ((input.address ?? '').length > 400) errors.address = 'That address is too long.';
  return errors;
}

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(v: unknown): v is OrderStatus {
  return typeof v === 'string' && (ORDER_STATUSES as readonly string[]).includes(v);
}
