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
  for (const key of ['title', 'slug', 'category', 'clientName', 'location', 'summary', 'description', 'imageUrl', 'isFeatured']) if (data[key] !== undefined) allowed[key] = data[key];
  if (data.completionDate !== undefined) allowed.completionDate = data.completionDate ? new Date(data.completionDate) : null;
  const project = await prisma.project.update({ where: { id }, data: allowed }).catch(() => null);
  if (!project) return jsonError('Project not found or slug already used.', 404);
  await logActivity({ actorId: auth.user.id, action: 'PROJECT_UPDATED', entityType: 'Project', entityId: id });
  return Response.json({ ok: true });
}
