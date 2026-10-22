import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validators';
import { setSessionCookie, homeForRole } from '@/lib/auth';
import { rateLimit, requestIp, validOrigin, jsonError } from '@/lib/security';
import { logActivity } from '@/lib/activity';

export async function POST(request) {
  if (!validOrigin(request)) return jsonError('Invalid request origin.', 403);
  const limiter = rateLimit(`login:${requestIp(request)}`, { limit: 8, windowMs: 15 * 60_000 });
  if (!limiter.allowed) return jsonError('Too many login attempts. Try again later.', 429);
  const body = await request.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return jsonError('Enter a valid email and password.', 422, parsed.error.flatten());
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return jsonError('Email or password is incorrect.', 401);
  if (body.admin && !['SUPER_ADMIN','ADMIN','STAFF'].includes(user.role)) return jsonError('Use the client login for this account.', 403);
  if (!body.admin && user.role !== 'CLIENT') return jsonError('Use the administrator login for this account.', 403);
  if (user.status === 'PENDING_APPROVAL') return jsonError('Your company registration is awaiting administrator approval.', 403);
  if (user.status !== 'ACTIVE') return jsonError('This account is not active. Contact JetWash support.', 403);
  await setSessionCookie(user);
  await logActivity({ actorId:user.id, action:'USER_LOGIN', entityType:'User', entityId:user.id });
  return Response.json({ ok:true, redirect:homeForRole(user.role) });
}
