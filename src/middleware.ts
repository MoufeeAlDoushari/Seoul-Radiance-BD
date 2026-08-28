import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/constants';

/**
 * First line of defence for the protected areas.
 *
 * Middleware runs on the Edge runtime, which cannot open the sqlite database —
 * so this only checks that a session cookie is *present* and sends anonymous
 * visitors to the login page instead of rendering a shell they cannot use.
 *
 * It is deliberately NOT the authorisation boundary. Every page and every API
 * route under /admin re-checks the session against the database and verifies
 * the role there, because a cookie's mere existence proves nothing. Forging one
 * gets you past this file and straight into a 401/403 from the real check.
 */

const PROTECTED = ['/dashboard', '/orders', '/profile', '/settings', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!needsAuth) return NextResponse.next();

  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasCookie) return NextResponse.next();

  const login = new URL('/login', request.url);
  // Come back here once they have signed in.
  login.searchParams.set('next', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/profile/:path*', '/settings/:path*', '/admin/:path*'],
};
