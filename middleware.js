// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
  const url = new URL(request.url);
  const token = request.cookies.get('token')?.value;

  // Define which paths require authentication
  const protectedPaths = ['/dashboard', '/dashboard/*'];

  // Check if the request is for a protected path
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to dashboard and nested routes
};
 