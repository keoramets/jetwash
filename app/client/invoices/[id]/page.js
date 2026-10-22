import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PaymentProofForm } from '@/components/forms/PaymentProofForm';
import { DocumentUpload } from '@/components/forms/DocumentUpload';
import { money, date } from '@/lib/format';

export default async function ClientInvoiceDetail({ params }) {
  const user = await requireRole('CLIENT');
  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, companyId: user.companyId },
    include: { company: true, job: true, items: { orderBy: { sortOrder: 'asc' } }, payments: { orderBy: { createdAt: 'desc' } }, documents: { where: { visibility: 'CLIENT_VISIBLE' }, orderBy: { createdAt: 'desc' } } }
  });
  if (!invoice) notFound();
  return <>
    <div className="section-heading"><div><span className="eyebrow">Billing</span><h2>{invoice.invoiceNumber}</h2><p>Issued {date(invoice.issueDate)} · Due {date(invoice.dueDate)} · {invoice.job?.jobNumber || 'JetWash services'}</p></div><div className="action-row"><StatusBadge status={invoice.status} /><a className="button button-secondary" href={`/api/invoices/${invoice.id}/pdf`}>Download PDF</a></div></div>
    <div className="grid-3"><article className="stat-card"><span>Total</span><strong>{money(invoice.total)}</strong></article><article className="stat-card"><span>Paid</span><strong>{money(invoice.amountPaid)}</strong></article><article className="stat-card"><span>Balance</span><strong>{money(invoice.balanceDue)}</strong></article></div>
    <section className="panel" style={{ marginTop: 24 }}><h3>Invoice Items</h3><DataTable columns={['Description', 'Quantity', 'Rate', 'Amount']}>{invoice.items.map((item) => <tr key={item.id}><td>{item.description}</td><td>{String(item.quantity)}</td><td>{money(item.rate)}</td><td>{money(item.amount)}</td></tr>)}</DataTable></section>
    {Number(invoice.balanceDue) > 0 && <section className="panel" style={{ marginTop: 24 }}><h3>Upload Payment Proof</h3><p>Submit evidence after paying through the approved instructions provided by JetWash. Submission does not mark the invoice paid until verified.</p><PaymentProofForm invoiceId={invoice.id} balanceDue={invoice.balanceDue} /></section>}
    <section className="panel" style={{ marginTop: 24 }}><h3>Payment History</h3>{invoice.payments.length ? invoice.payments.map((payment) => <p key={payment.id}><strong>{money(payment.amount)}</strong> · {payment.method} · <StatusBadge status={payment.status} /></p>) : <p>No payment records yet.</p>}</section>
    <section className="panel" style={{ marginTop: 24 }}><h3>Shared Documents</h3><DocumentUpload companyId={invoice.companyId} invoiceId={invoice.id} />{invoice.documents.map((document) => <p key={document.id}><a href={document.url}>{document.originalName}</a></p>)}</section>
  </>;
}
