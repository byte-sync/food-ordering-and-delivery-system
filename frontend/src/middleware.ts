import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// User types for role-based access control
type UserType = 'admin' | 'customer' | 'restaurant' | 'driver';

// Map of routes to the user types that can access them
const PROTECTED_ROUTES: Record<string, UserType> = {
  '/admin': 'admin',
  '/customer': 'customer',
  '/restaurant': 'restaurant',
  '/driver': 'driver',
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/',
  '/about',
  '/contact',
  '/api',
  '/browse',
  '/_next',
  '/favicon.ico',
  '/placeholder.svg',
  '/unauthorized', // Added unauthorized page to public routes
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token and user type from cookies - do this early to check session status
  const token = request.cookies.get('authToken')?.value;
  const userType = request.cookies.get('userType')?.value?.toLowerCase() as UserType;
  const userId = request.cookies.get('userId')?.value;
  
  // If user has a valid session, redirect to their dashboard when accessing public routes
  // like sign-in, sign-up, or root path
  if (token && userType && userId) {
    if (pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up') {
      const dashboardUrl = `/${userType}`;
      console.log(`Valid session detected: Redirecting user to ${dashboardUrl}`);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }
  
 
  // Get auth token and user type from cookies
  const token = request.cookies.get('authToken')?.value;
  const userType = request.cookies.get('userType')?.value?.toLowerCase() as UserType;
  const userId = request.cookies.get('userId')?.value;
  
  
  // If the user is at the root, redirect them to their appropriate dashboard
  if (pathname === '/') {
    const dashboardUrl = `/${userType}`;
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }
  
