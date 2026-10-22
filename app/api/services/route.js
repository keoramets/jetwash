import { prisma } from '@/lib/prisma';
import { apiAdmin } from '@/lib/api-auth';
import { validOrigin, jsonError } from '@/lib/security';
import { logActivity } from '@/lib/activity';

export async function POST(request) {
  if (!validOrigin(request)) return jsonError('Invalid origin.', 403);
  const auth = await apiAdmin();
  if (auth.error) return auth.error;
  const data = await request.json().catch(() => ({}));
  const required = ['name', 'slug', 'category', 'shortDescription', 'fullDescription'];
  if (required.some((key) => !String(data[key] || '').trim())) return jsonError('Complete all required service fields.', 422);
  const service = await prisma.service.create({ data: { name: data.name.trim(), slug: data.slug.trim().toLowerCase(), category: data.category.trim(), shortDescription: data.shortDescription.trim(), fullDescription: data.fullDescription.trim(), basePrice: data.basePrice ? Number(data.basePrice) : null, imageUrl: data.imageUrl || null, isActive: true } }).catch((error) => null);
  if (!service) return jsonError('The service slug must be unique.', 409);
  await logActivity({ actorId: auth.user.id, action: 'SERVICE_CREATED', entityType: 'Service', entityId: service.id });
  return Response.json({ ok: true, id: service.id }, { status: 201 });
}
