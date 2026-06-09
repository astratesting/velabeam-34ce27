import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Public routes that don't need auth
  const publicRoutes = [
    '/',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/sign-in',
    '/sign-up',
  ];

  // Public API routes
  const publicApiRoutes = [
    '/api/auth/',
    '/api/billing/webhook',
  ];

  // Preview routes are public (token-based)
  if (pathname.startsWith('/preview/')) {
    return NextResponse.next();
  }

  // Check if it's a public route
  if (publicRoutes.some(r => pathname === r || (r !== '/' && pathname.startsWith(r + '/')))) {
    // If authenticated and hitting auth pages, redirect to dashboard
    if (isAuthenticated && (pathname === '/sign-in' || pathname === '/sign-up')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Check public API routes
  if (publicApiRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Everything else requires auth
  if (!isAuthenticated) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|images|logos|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.woff2$).*)',
  ],
};
