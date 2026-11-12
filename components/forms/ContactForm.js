'use client';
import { useState } from 'react';
import { trackEvent } from '@/components/seo/Analytics';

// Netlify Forms: Netlify finds this form ("contact") in the built HTML, stores what people send, and emails it to
// the addresses set in Netlify (Forms → Form notifications). bot-field is a trap for spam bots; people never see it.
export function ContactForm() {
  const [msg, setMsg] = useState();
  const [sending, setSending] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setMsg(null);
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      if (!res.ok) throw new Error(String(res.status));
      trackEvent('contact_form_submission');
      form.reset();
      setMsg({ ok: true, text: 'Thank you. A JetWash specialist will contact you shortly.' });
    } catch {
      setMsg({ ok: false, text: 'Your message could not be sent. Please try again, or email or call us using the details on this page.' });
    } finally {
      setSending(false);
    }
  }
  return <form className="form-card" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}>
    <input type="hidden" name="form-name" value="contact" />
    <p hidden><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
    {msg && <div className={msg.ok ? 'form-message success' : 'form-message error'} role="status">{msg.text}</div>}
    <div className="grid-2"><label>Full name<input name="fullName" required /></label><label>Email address<input name="email" type="email" required /></label></div>
    <div className="grid-2"><label>Phone number<input name="phone" /></label><label>Service required<input name="serviceRequired" /></label></div>
    <label>Project details<input name="projectDetails" /></label>
    <label>Message<textarea name="message" rows="6" minLength="10" required /></label>
    <button className="button button-primary" disabled={sending}>{sending ? 'Sending…' : 'Send Inquiry'}</button>
  </form>;
}
