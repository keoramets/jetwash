import { prisma } from '@/lib/prisma';
import { apiAdmin } from '@/lib/api-auth';
import { validOrigin, jsonError } from '@/lib/security';
import { logActivity } from '@/lib/activity';

export async function POST(request) {
  if (!validOrigin(request)) return jsonError('Invalid origin.', 403);
  const auth = await apiAdmin();
  if (auth.error) return auth.error;
  const data = await request.json().catch(() => ({}));
  const content = String(data.content || '').trim();
  if (content.length < 3) return jsonError('Enter an internal note.', 422);
  if (!data.clientId && !data.companyId) return jsonError('A client or company is required.', 422);
  const note = await prisma.adminNote.create({ data: { authorId: auth.user.id, clientId: data.clientId || null, companyId: data.companyId || null, content } });
  await logActivity({ actorId: auth.user.id, action: 'CLIENT_NOTE_ADDED', entityType: 'AdminNote', entityId: note.id });
  return Response.json({ ok: true, id: note.id }, { status: 201 });
}
