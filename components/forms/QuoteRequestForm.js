'use client';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/components/seo/Analytics';

// Netlify Forms (see ContactForm.js). The file goes with the request; Netlify accepts up to 8 MB per submission.
const MAX_MB = 8;

export function QuoteRequestForm({ services = [], compact = false }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const serviceRef = useRef(null);
  // "Request a quote" links from a service page carry ?service=<name>: pick that service.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('service');
    if (wanted && serviceRef.current && services.some((s) => s.name === wanted)) serviceRef.current.value = wanted;
  }, [services]);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = form.elements.file?.files?.[0];
    if (file && file.size > MAX_MB * 1024 * 1024) {
      setMessage({ ok: false, text: `The file is larger than ${MAX_MB} MB. Please choose a smaller one, or send it to us by email.` });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/', { method: 'POST', body: new FormData(form) });
      if (!res.ok) throw new Error(String(res.status));
      trackEvent('quote_form_submission', { source: 'public' });
      form.reset();
      setMessage({ ok: true, text: 'Thank you. Your request was sent to JetWash, and we will contact you by email or phone.' });
    } catch {
      setMessage({ ok: false, text: 'Your request could not be sent. Please try again, or email or call us using the details on the contact page.' });
    } finally {
      setLoading(false);
    }
  }
  return <form className={compact ? 'form-card compact' : 'form-card'} name="quote-request" method="POST" data-netlify="true" netlify-honeypot="bot-field" encType="multipart/form-data" onSubmit={submit}>
    <input type="hidden" name="form-name" value="quote-request" />
    <p hidden><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
    {message && <div className={message.ok ? 'form-message success' : 'form-message error'} role="status">{message.text}</div>}
    <div className="grid-2"><label>Full name<input name="fullName" required /></label><label>Email address<input name="email" type="email" required /></label></div>
    <div className="grid-2"><label>Phone number<input name="phone" /></label><label>Company name<input name="companyName" /></label></div>
    <div className="grid-2"><label>Service required<select ref={serviceRef} name="serviceRequired" required defaultValue=""><option value="">Select a service</option>{services.map((s) => <option key={s.id || s.slug} value={s.name}>{s.name}</option>)}</select></label><label>Urgency<select name="urgency"><option>Standard</option><option>Priority</option><option>Emergency</option></select></label></div>
    <label>Project location<input name="location" required placeholder="Facility, city, or site address" /></label>
    <label>Preferred date<input name="preferredDate" type="date" /></label>
    <label>Project details<textarea name="projectDetails" rows="6" minLength="20" required placeholder="Describe the equipment, surfaces, access constraints, safety requirements, and desired outcome." /></label>
    <label>Supporting file <small>(optional, max {MAX_MB} MB)</small><input name="file" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.xlsx,.txt" /></label>
    <button className="button button-primary" disabled={loading}>{loading ? 'Sending…' : 'Send Quote Request'}</button>
  </form>;
}
