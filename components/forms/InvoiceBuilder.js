'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export function InvoiceBuilder({ companies, jobs, quotations }) {
  const router = useRouter();
  const [dates] = useState(() => ({
    issue: new Date().toISOString().slice(0, 10),
    due: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  }));
  const [items, setItems] = useState([{ description: 'Industrial cleaning service', quantity: 1, rate: 0 }]);
  const [taxRate, setTaxRate] = useState(15);
  const [error, setError] = useState('');
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0), 0), [items]);
  const tax = subtotal * Number(taxRate || 0) / 100;
  const total = subtotal + tax;

  function update(index, key, value) {
    setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const payload = {
      companyId: form.get('companyId'),
      clientId: form.get('clientId') || null,
      jobId: form.get('jobId') || null,
      quotationId: form.get('quotationId') || null,
      issueDate: form.get('issueDate'),
      dueDate: form.get('dueDate'),
      taxRate,
      status: form.get('intent') || 'DRAFT',
      items
    };
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await response.json();
    if (!response.ok) {
      setError(body.error || 'Unable to create invoice.');
      return;
    }
    router.push(`/admin/invoices/${body.id}`);
    router.refresh();
  }

  return <form className="quote-builder" onSubmit={submit}>
    {error && <div className="form-message error">{error}</div>}
    <div className="grid-3">
      <section className="panel">
        <h3>Client</h3>
        <label>Company<select name="companyId" required><option value="">Select company</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
        <label>Client contact<select name="clientId"><option value="">Company billing contact</option>{companies.flatMap((company) => company.users.map((user) => <option key={user.id} value={user.id}>{company.name} — {user.name}</option>))}</select></label>
      </section>
      <section className="panel">
        <h3>Related work</h3>
        <label>Job<select name="jobId"><option value="">No linked job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNumber} — {job.title}</option>)}</select></label>
        <label>Quotation<select name="quotationId"><option value="">No linked quotation</option>{quotations.map((quote) => <option key={quote.id} value={quote.id}>{quote.quoteNumber} — {quote.company.name}</option>)}</select></label>
      </section>
      <section className="panel">
        <h3>Invoice dates</h3>
        <label>Issue date<input name="issueDate" type="date" defaultValue={dates.issue} required /></label>
        <label>Due date<input name="dueDate" type="date" defaultValue={dates.due} required /></label>
        <label>Tax/VAT (%)<input type="number" min="0" max="100" step="0.01" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} /></label>
      </section>
    </div>
    <section className="panel">
      <div className="section-heading"><h3>Invoice items</h3><button type="button" className="button button-secondary button-small" onClick={() => setItems([...items, { description: '', quantity: 1, rate: 0 }])}>+ Add line</button></div>
      <div className="line-items">
        <div className="line-header"><span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span><span /></div>
        {items.map((item, index) => <div className="line-row invoice-line" key={index}>
          <input value={item.description} onChange={(event) => update(index, 'description', event.target.value)} required />
          <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => update(index, 'quantity', event.target.value)} required />
          <input type="number" min="0" step="0.01" value={item.rate} onChange={(event) => update(index, 'rate', event.target.value)} required />
          <strong>${(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}</strong>
          <button type="button" aria-label="Remove item" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>×</button>
        </div>)}
      </div>
    </section>
    <div className="builder-bottom">
      <section className="panel"><h3>Delivery</h3><p>Choose <strong>Save Draft</strong> to continue editing internally or <strong>Create & Send</strong> to make the invoice visible and notify the client.</p></section>
      <aside className="quote-summary"><h3>Invoice Summary</h3><p><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></p><p><span>Tax</span><strong>${tax.toFixed(2)}</strong></p><div><span>Total</span><strong>${total.toFixed(2)}</strong></div><button name="intent" value="DRAFT" className="button button-secondary button-block">Save Draft</button><button name="intent" value="SENT" className="button button-primary button-block">Create & Send</button></aside>
    </div>
  </form>;
}
