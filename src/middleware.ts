import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'homiq_super_secret_dev_key_2026_india_housing_platform_123456789'
);

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'homiq_session';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;

  // Verify token
  let sessionPayload: any = null;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, JWT_SECRET);
      sessionPayload = payload;
    } catch {
      sessionPayload = null;
    }
  }

  // If unauthenticated, redirect to login
  if (!sessionPayload) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = sessionPayload.role;

  // Role-based restrictions
  if (pathname.startsWith('/dashboard/admin')) {
    if (userRole !== 'admin') {
      const fallbackUrl = new URL(`/dashboard/${userRole || 'renter'}`, request.url);
      return NextResponse.redirect(fallbackUrl);
    }
  }

  if (pathname.startsWith('/dashboard/owner')) {
    if (userRole !== 'owner' && userRole !== 'admin') {
      const fallbackUrl = new URL(`/dashboard/${userRole || 'renter'}`, request.url);
      return NextResponse.redirect(fallbackUrl);
    }
  }

  if (pathname.startsWith('/dashboard/operator')) {
    if (userRole !== 'operator' && userRole !== 'admin') {
      const fallbackUrl = new URL(`/dashboard/${userRole || 'renter'}`, request.url);
      return NextResponse.redirect(fallbackUrl);
    }
  }

  if (pathname.startsWith('/dashboard/broker')) {
    if (userRole !== 'broker' && userRole !== 'admin') {
      const fallbackUrl = new URL(`/dashboard/${userRole || 'renter'}`, request.url);
      return NextResponse.redirect(fallbackUrl);
    }
  }

  if (pathname.startsWith('/dashboard/renter')) {
    if (userRole !== 'renter' && userRole !== 'admin') {
      const fallbackUrl = new URL(`/dashboard/${userRole || 'owner'}`, request.url);
      return NextResponse.redirect(fallbackUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/listings/new',
    '/move-in/:path*',
  ],
};
