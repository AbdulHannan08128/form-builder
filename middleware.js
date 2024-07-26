// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
  const url = new URL(request.url);
  const token = request.cookies.get('token')?.value;

  // Define which paths require authentication
  const protectedPaths = ['/dashboard', '/dashboard/*'];
  const authPaths = ['/auth/login', '/auth/register'];
  const homePath = '/';

  if (protectedPaths.some((path) => url.pathname.startsWith(path))) {
    if (!token || token === 'undefined') {
      // Redirect to login page if token is missing or 'undefined'
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verify token
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch (err) {
      // Redirect to login page if token is invalid
      console.log(err.message);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (authPaths.some((path) => url.pathname.startsWith(path)) || url.pathname === homePath) {
    if (token && token !== 'undefined') {
      try {
        // Verify token
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        // Redirect to dashboard if user is already authenticated
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (err) {
        // If token is invalid, proceed to the requested page
        console.log(err.message);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/', '/auth/:path*'], // Apply middleware to dashboard, home, and auth routes
};
