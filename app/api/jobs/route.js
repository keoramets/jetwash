import { prisma } from '@/lib/prisma';
import { apiAdmin } from '@/lib/api-auth';
import { validOrigin, jsonError } from '@/lib/security';
import { reference } from '@/lib/format';
import { logActivity, notifyUsers } from '@/lib/activity';

export async function POST(request) {
  if (!validOrigin(request)) return jsonError('Invalid origin.', 403);
  const auth = await apiAdmin();
  if (auth.error) return auth.error;
  const data = await request.json().catch(() => ({}));
  if (!data.companyId || !data.title || !data.serviceType || !data.location) return jsonError('Company, title, service, and location are required.', 422);
  const staffIds = Array.isArray(data.staffIds) ? [...new Set(data.staffIds.filter(Boolean))] : [];
  const job = await prisma.$transaction(async (tx) => {
    const created = await tx.job.create({ data: {
      jobNumber: reference('JW'), companyId: data.companyId, clientId: data.clientId || null, title: data.title.trim(), serviceType: data.serviceType.trim(), location: data.location.trim(), description: data.description || '', scheduledStart: data.scheduledStart ? new Date(data.scheduledStart) : null, scheduledEnd: data.scheduledEnd ? new Date(data.scheduledEnd) : null, status: data.status || 'SCHEDULED', priority: data.priority || 'NORMAL', assignedTeam: data.assignedTeam || null, createdById: auth.user.id,
      staff: staffIds.length ? { create: staffIds.map((userId) => ({ userId })) } : undefined
    } });
    await tx.jobStatusHistory.create({ data: { jobId: created.id, status: created.status, note: 'Job created manually.', changedById: auth.user.id } });
    return created;
  });
  const recipients = [...staffIds, ...(data.clientId ? [data.clientId] : [])];
  if (recipients.length) await notifyUsers(recipients, { title: 'Job scheduled', message: `${job.jobNumber}: ${job.title}`, type: 'JOB', linkUrl: data.clientId ? `/client/jobs/${job.id}` : `/admin/jobs/${job.id}` });
  await logActivity({ actorId: auth.user.id, action: 'JOB_CREATED', entityType: 'Job', entityId: job.id });
  return Response.json({ ok: true, id: job.id }, { status: 201 });
}
