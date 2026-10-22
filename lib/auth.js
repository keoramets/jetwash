import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export const SESSION_COOKIE = 'jetwash_session';
const encoder = new TextEncoder();

function secret() {
  const value = process.env.NEXTAUTH_SECRET;
  if (!value || value.length < 24) {
    throw new Error('NEXTAUTH_SECRET must be set to a random value of at least 24 characters.');
  }
  return encoder.encode(value);
}

export async function createSessionToken(user) {
  return new SignJWT({ role: user.role, status: user.status, companyId: user.companyId || null })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user) {
  const store = await cookies();
  const token = await createSessionToken(user);
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' });
}

export async function getSessionPayload() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser() {
  const payload = await getSessionPayload();
  if (!payload?.sub) return null;
  return prisma.user.findUnique({
    where: { id: payload.sub },
    include: { company: true, clientProfile: true }
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?reason=session');
  if (user.status !== 'ACTIVE') redirect('/login?reason=inactive');
  return user;
}

export async function requireRole(roles) {
  const user = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect('/unauthorized');
  return user;
}

export function homeForRole(role) {
  return ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(role) ? '/admin/dashboard' : '/client/dashboard';
}
