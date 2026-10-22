import { prisma } from '@/lib/prisma';
import { apiAdmin } from '@/lib/api-auth';
import { validOrigin, jsonError } from '@/lib/security';
import { logActivity } from '@/lib/activity';

export async function POST(request) {
  if (!validOrigin(request)) return jsonError('Invalid origin.', 403);
  const auth = await apiAdmin();
  if (auth.error) return auth.error;
  const data = await request.json().catch(() => ({}));
  const required = ['title', 'slug', 'category', 'summary', 'description'];
  if (required.some((key) => !String(data[key] || '').trim())) return jsonError('Complete all required project fields.', 422);
  const project = await prisma.project.create({ data: { title: data.title.trim(), slug: data.slug.trim().toLowerCase(), category: data.category.trim(), clientName: data.clientName || null, location: data.location || null, summary: data.summary.trim(), description: data.description.trim(), imageUrl: data.imageUrl || null, completionDate: data.completionDate ? new Date(data.completionDate) : null, isFeatured: Boolean(data.isFeatured) } }).catch(() => null);
  if (!project) return jsonError('The project slug must be unique.', 409);
  await logActivity({ actorId: auth.user.id, action: 'PROJECT_CREATED', entityType: 'Project', entityId: project.id });
  return Response.json({ ok: true, id: project.id }, { status: 201 });
}
