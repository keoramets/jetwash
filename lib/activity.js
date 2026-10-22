import { prisma } from '@/lib/prisma';
export async function logActivity({ actorId, action, entityType, entityId, metadata }) {
  try {
    await prisma.activityLog.create({ data: { actorId: actorId || null, action, entityType, entityId, metadataJson: metadata || undefined } });
  } catch (error) {
    console.error('Unable to write activity log', error);
  }
}
export async function notifyUsers(userIds, notification) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (!ids.length) return;
  await prisma.notification.createMany({ data: ids.map((userId) => ({ userId, ...notification })) });
}
