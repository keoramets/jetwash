import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { money, date } from '@/lib/format';

export default async function ClientInvoices() {
  const user = await requireRole('CLIENT');
  const rows = await prisma.invoice.findMany({ where: { companyId: user.companyId }, include: { payments: true }, orderBy: { createdAt: 'desc' } });
  return <>
    <div className="section-heading"><div><span className="eyebrow">Billing</span><h2>Invoices</h2><p>Review invoice status, balances, payment proof, and PDF copies.</p></div></div>
    <DataTable columns={['Invoice', 'Issue', 'Due', 'Status', 'Total', 'Paid', 'Balance', 'Actions']}>{rows.map((invoice) => <tr key={invoice.id}><td><Link href={`/client/invoices/${invoice.id}`}><strong>{invoice.invoiceNumber}</strong></Link></td><td>{date(invoice.issueDate)}</td><td>{date(invoice.dueDate)}</td><td><StatusBadge status={invoice.status} /></td><td>{money(invoice.total)}</td><td>{money(invoice.amountPaid)}</td><td>{money(invoice.balanceDue)}</td><td><Link href={`/client/invoices/${invoice.id}`}>View & Pay</Link> · <a href={`/api/invoices/${invoice.id}/pdf`}>PDF</a></td></tr>)}</DataTable>
  </>;
}
