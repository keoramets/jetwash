import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PaymentReviewButtons } from '@/components/forms/PaymentReviewButtons';
import { DocumentUpload } from '@/components/forms/DocumentUpload';
import { money, date } from '@/lib/format';

export default async function AdminInvoiceDetail({ params }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { company: true, client: true, job: true, quotation: true, items: { orderBy: { sortOrder: 'asc' } }, payments: { orderBy: { createdAt: 'desc' } }, documents: { include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } } }
  });
  if (!invoice) notFound();
  return <>
    <div className="section-heading"><div><span className="eyebrow">{invoice.invoiceNumber}</span><h2>{invoice.company.name}</h2><p>Issued {date(invoice.issueDate)} · Due {date(invoice.dueDate)} · {invoice.job?.jobNumber || 'Standalone invoice'}</p></div><div className="action-row"><StatusBadge status={invoice.status} /><a className="button button-secondary" href={`/api/invoices/${invoice.id}/pdf`}>Download PDF</a></div></div>
    <div className="grid-3">
      <article className="stat-card"><span>Total</span><strong>{money(invoice.total)}</strong></article>
      <article className="stat-card"><span>Verified paid</span><strong>{money(invoice.amountPaid)}</strong></article>
      <article className="stat-card"><span>Balance due</span><strong>{money(invoice.balanceDue)}</strong></article>
    </div>
    <section className="panel" style={{ marginTop: 24 }}><h3>Invoice Items</h3><DataTable columns={['Description', 'Quantity', 'Rate', 'Amount']}>{invoice.items.map((item) => <tr key={item.id}><td>{item.description}</td><td>{String(item.quantity)}</td><td>{money(item.rate)}</td><td>{money(item.amount)}</td></tr>)}</DataTable></section>
    <section className="panel" style={{ marginTop: 24 }}><h3>Payment Evidence</h3>{invoice.payments.length ? <DataTable columns={['Date', 'Method', 'Reference', 'Amount', 'Status', 'Proof', 'Review']}>{invoice.payments.map((payment) => <tr key={payment.id}><td>{date(payment.createdAt)}</td><td>{payment.method}</td><td>{payment.reference || '—'}</td><td>{money(payment.amount)}</td><td><StatusBadge status={payment.status} /></td><td>{payment.proofUrl ? <a href={payment.proofUrl} target="_blank" rel="noreferrer">Open</a> : '—'}</td><td>{payment.status === 'PENDING' ? <PaymentReviewButtons paymentId={payment.id} /> : 'Reviewed'}</td></tr>)}</DataTable> : <p>No payment evidence has been submitted.</p>}</section>
    <section className="panel" style={{ marginTop: 24 }}><h3>Invoice Documents</h3><DocumentUpload companyId={invoice.companyId} invoiceId={invoice.id} admin />{invoice.documents.map((document) => <p key={document.id}><a href={document.url}>{document.originalName}</a> · {document.visibility} · {document.uploadedBy.name}</p>)}</section>
  </>;
}
