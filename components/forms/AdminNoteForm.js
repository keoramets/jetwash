'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminNoteForm({ clientId, companyId }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    setMessage('Saving…');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/notes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ clientId, companyId, content: form.get('content') })
    });
    const body = await response.json();
    if (!response.ok) return setMessage(body.error || 'Unable to save note.');
    event.currentTarget.reset();
    setMessage('Internal note saved.');
    router.refresh();
  }
  return <form className="inline-form stacked-form" onSubmit={submit}><label>Internal note<textarea name="content" rows="4" minLength="3" required /></label><button className="button button-primary">Add Note</button>{message && <small>{message}</small>}</form>;
}
