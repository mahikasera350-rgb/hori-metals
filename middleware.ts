import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to admin login page without redirect loops
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const rawAdminEmails = process.env.ADMIN_EMAILS || 'mahikasera350@gmail.com';
    const adminEmails = rawAdminEmails
      .split(',')
      .map(x => x.trim().toLowerCase())
      .filter(Boolean);

    // Always include target admin
    if (!adminEmails.includes('mahikasera350@gmail.com')) {
      adminEmails.push('mahikasera350@gmail.com');
    }

    const email = request.cookies.get('hori-admin-email')?.value?.trim().toLowerCase();

    if (!email || !adminEmails.includes(email)) {
      const redirectUrl = new URL('/account', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      redirectUrl.searchParams.set('reason', 'admin_required');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
