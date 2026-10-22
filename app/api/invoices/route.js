import { prisma } from '@/lib/prisma';
import { apiAdmin } from '@/lib/api-auth';
import { validOrigin, jsonError } from '@/lib/security';
import { reference } from '@/lib/format';
import { logActivity, notifyUsers } from '@/lib/activity';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  if (!validOrigin(request)) return jsonError('Invalid origin.', 403);
  const auth = await apiAdmin();
  if (auth.error) return auth.error;
  const data = await request.json().catch(() => ({}));
  if (!data.companyId || !Array.isArray(data.items) || !data.items.length) return jsonError('Company and invoice items are required.', 422);
  if (data.items.some((item) => !String(item.description || '').trim() || Number(item.quantity) <= 0 || Number(item.rate) < 0)) return jsonError('Every invoice item needs a description, positive quantity, and valid rate.', 422);
  const company = await prisma.company.findUnique({ where: { id: data.companyId }, include: { users: { where: { role: 'CLIENT', status: 'ACTIVE' }, select: { id: true, email: true, name: true } } } });
  if (!company) return jsonError('Company not found.', 404);
  const subtotal = data.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.rate), 0);
  const taxRate = Math.min(100, Math.max(0, Number(data.taxRate || 0)));
  const taxAmount = subtotal * taxRate / 100;
  const total = subtotal + taxAmount;
  const clientId = data.clientId || company.users[0]?.id || null;
  const status = data.status === 'SENT' ? 'SENT' : 'DRAFT';
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: reference('INV'),
      jobId: data.jobId || null,
      quotationId: data.quotationId || null,
      companyId: data.companyId,
      clientId,
      issueDate: new Date(data.issueDate || Date.now()),
      dueDate: new Date(data.dueDate || Date.now() + 14 * 86400000),
      status,
      subtotal,
      taxRate,
      taxAmount,
      total,
      balanceDue: total,
      items: { create: data.items.map((item, index) => ({ description: String(item.description).trim(), quantity: Number(item.quantity), rate: Number(item.rate), amount: Number(item.quantity) * Number(item.rate), sortOrder: index })) }
    }
  });
  if (status === 'SENT' && clientId) {
    await notifyUsers([clientId], { title: 'New invoice', message: `${invoice.invoiceNumber} is available for review.`, type: 'INVOICE', linkUrl: `/client/invoices/${invoice.id}` });
    const client = company.users.find((user) => user.id === clientId);
    if (client?.email) await sendEmail({ to: client.email, subject: `${invoice.invoiceNumber} from JetWash`, text: `Hello ${client.name}, your JetWash invoice is available in the client portal.` });
  }
  await logActivity({ actorId: auth.user.id, action: 'INVOICE_CREATED', entityType: 'Invoice', entityId: invoice.id, metadataJson: { status, total } });
  return Response.json({ ok: true, id: invoice.id }, { status: 201 });
}
