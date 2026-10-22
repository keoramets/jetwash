import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { money, date } from '@/lib/format';

export default async function Invoices() {
  const rows = await prisma.invoice.findMany({ include: { company: true, job: true, payments: true }, orderBy: { createdAt: 'desc' } });
  const outstanding = rows.reduce((sum, invoice) => sum + Number(invoice.balanceDue), 0);
  return <>
    <div className="section-heading"><div><span className="eyebrow">Financial control</span><h2>Invoices</h2><p>Manage invoice delivery, payment evidence, partial payments, and overdue balances.</p></div><Link className="button button-primary" href="/admin/invoices/new">+ New Invoice</Link></div>
    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}><article className="stat-card"><span>Total Invoices</span><strong>{rows.length}</strong></article><article className="stat-card"><span>Outstanding</span><strong>{money(outstanding)}</strong></article><article className="stat-card"><span>Pending Proofs</span><strong>{rows.reduce((sum, invoice) => sum + invoice.payments.filter((payment) => payment.status === 'PENDING').length, 0)}</strong></article></div>
    <DataTable columns={['Invoice', 'Company', 'Job', 'Due', 'Status', 'Total', 'Balance', 'Actions']}>{rows.map((invoice) => <tr key={invoice.id}><td><Link href={`/admin/invoices/${invoice.id}`}><strong>{invoice.invoiceNumber}</strong></Link></td><td>{invoice.company.name}</td><td>{invoice.job?.jobNumber || '—'}</td><td>{date(invoice.dueDate)}</td><td><StatusBadge status={invoice.status} /></td><td>{money(invoice.total)}</td><td>{money(invoice.balanceDue)}</td><td><Link href={`/admin/invoices/${invoice.id}`}>Manage</Link> · <a href={`/api/invoices/${invoice.id}/pdf`}>PDF</a></td></tr>)}</DataTable>
  </>;
}
