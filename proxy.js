import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const cookieName = 'jetwash_session';
const encoder = new TextEncoder();

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url));
  try {
    const { payload } = await jwtVerify(token, encoder.encode(process.env.NEXTAUTH_SECRET));
    if (payload.status !== 'ACTIVE') throw new Error('inactive');
    if (pathname.startsWith('/admin') && !['SUPER_ADMIN','ADMIN','STAFF'].includes(payload.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (pathname.startsWith('/client') && payload.role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login?reason=session', request.url));
    response.cookies.delete(cookieName);
    return response;
  }
}
export const config = { matcher: ['/admin/:path*','/client/:path*'] };
