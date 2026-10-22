import { prisma } from '@/lib/prisma';
import { InvoiceBuilder } from '@/components/forms/InvoiceBuilder';

export default async function NewInvoicePage() {
  const [companies, jobs, quotations] = await Promise.all([
    prisma.company.findMany({ where: { status: 'ACTIVE' }, include: { users: { where: { role: 'CLIENT', status: 'ACTIVE' }, select: { id: true, name: true } } }, orderBy: { name: 'asc' } }),
    prisma.job.findMany({ where: { status: { not: 'CANCELLED' } }, select: { id: true, jobNumber: true, title: true }, orderBy: { createdAt: 'desc' } }),
    prisma.quotation.findMany({ where: { status: { in: ['SENT', 'VIEWED', 'ACCEPTED'] } }, include: { company: true }, orderBy: { createdAt: 'desc' } })
  ]);
  return <><div className="section-heading"><div><span className="eyebrow">Financial control</span><h2>New Invoice</h2><p>Create an itemized invoice, link it to approved work, and send it to the client portal.</p></div></div><InvoiceBuilder companies={companies} jobs={jobs} quotations={quotations} /></>;
}
