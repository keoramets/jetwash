import { prisma } from '@/lib/prisma';
import { apiAdmin } from '@/lib/api-auth';
import { validOrigin, jsonError } from '@/lib/security';
import { logActivity } from '@/lib/activity';

export async function PATCH(request, { params }) {
  if (!validOrigin(request)) return jsonError('Invalid origin.', 403);
  const auth = await apiAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  const data = await request.json().catch(() => ({}));
  const allowed = {};
  for (const key of ['name', 'slug', 'category', 'shortDescription', 'fullDescription', 'imageUrl', 'isActive']) if (data[key] !== undefined) allowed[key] = data[key];
  if (data.basePrice !== undefined) allowed.basePrice = data.basePrice === '' ? null : Number(data.basePrice);
  const service = await prisma.service.update({ where: { id }, data: allowed }).catch(() => null);
  if (!service) return jsonError('Service not found or slug already used.', 404);
  await logActivity({ actorId: auth.user.id, action: 'SERVICE_UPDATED', entityType: 'Service', entityId: id });
  return Response.json({ ok: true });
}
