import { prisma } from '@/lib/prisma';
import { apiAdmin } from '@/lib/api-auth';
import { validOrigin, jsonError } from '@/lib/security';
import { logActivity, notifyUsers } from '@/lib/activity';

export async function PATCH(request, { params }) {
  if (!validOrigin(request)) return jsonError('Invalid origin.', 403);
  const auth = await apiAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (!['VERIFIED', 'REJECTED'].includes(body.status)) return jsonError('Select VERIFIED or REJECTED.', 422);

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({ where: { id }, data: { status: body.status, recordedById: auth.user.id }, include: { invoice: true } });
    const totals = await tx.payment.aggregate({ where: { invoiceId: payment.invoiceId, status: 'VERIFIED' }, _sum: { amount: true } });
    const amountPaid = Number(totals._sum.amount || 0);
    const total = Number(payment.invoice.total);
    const balanceDue = Math.max(0, total - amountPaid);
    const invoiceStatus = balanceDue <= 0 ? 'PAID' : amountPaid > 0 ? 'PARTIALLY_PAID' : payment.invoice.status === 'OVERDUE' ? 'OVERDUE' : 'SENT';
    const invoice = await tx.invoice.update({ where: { id: payment.invoiceId }, data: { amountPaid, balanceDue, status: invoiceStatus } });
    return { payment, invoice };
  });

  if (result.invoice.clientId) await notifyUsers([result.invoice.clientId], { title: `Payment ${body.status.toLowerCase()}`, message: `Payment evidence for ${result.invoice.invoiceNumber} was ${body.status.toLowerCase()}.`, type: 'PAYMENT_REVIEW', linkUrl: `/client/invoices/${result.invoice.id}` });
  await logActivity({ actorId: auth.user.id, action: `PAYMENT_${body.status}`, entityType: 'Payment', entityId: id });
  return Response.json({ ok: true, invoiceStatus: result.invoice.status });
}
