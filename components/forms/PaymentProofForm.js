'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PaymentProofForm({ invoiceId, balanceDue }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    setMessage('Uploading payment evidence…');
    const form = new FormData(event.currentTarget);
    form.set('invoiceId', invoiceId);
    const response = await fetch('/api/payments', { method: 'POST', body: form });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error || 'Unable to upload payment evidence.');
      return;
    }
    event.currentTarget.reset();
    setMessage('Payment evidence submitted for administrator verification.');
    router.refresh();
  }
  return <form className="inline-form stacked-form" onSubmit={submit} encType="multipart/form-data">
    <label>Amount<input name="amount" type="number" min="0.01" max={Number(balanceDue)} step="0.01" defaultValue={Number(balanceDue).toFixed(2)} required /></label>
    <label>Payment method<select name="method"><option>Bank Transfer</option><option>PayNow</option><option>EcoCash</option><option>Cash</option><option>Other</option></select></label>
    <label>Reference<input name="reference" placeholder="Transaction or receipt reference" /></label>
    <label>Proof file<input name="file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" required /></label>
    <button className="button button-primary">Submit Payment Proof</button>
    {message && <small>{message}</small>}
  </form>;
}
