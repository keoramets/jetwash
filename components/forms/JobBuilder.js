'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function JobBuilder({ companies, staff }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    setMessage('Creating job…');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.staffIds = form.getAll('staffIds');
    const response = await fetch('/api/jobs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) return setMessage(body.error || 'Unable to create job.');
    router.push(`/admin/jobs/${body.id}`);
    router.refresh();
  }
  return <form className="panel form-grid" onSubmit={submit}>
    <label>Company<select name="companyId" required><option value="">Select company</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
    <label>Client contact<select name="clientId"><option value="">Company contact</option>{companies.flatMap((company) => company.users.map((user) => <option key={user.id} value={user.id}>{company.name} — {user.name}</option>))}</select></label>
    <label>Job title<input name="title" required /></label>
    <label>Service type<input name="serviceType" required /></label>
    <label className="full">Location<input name="location" required /></label>
    <label className="full">Description<textarea name="description" rows="5" /></label>
    <label>Scheduled start<input name="scheduledStart" type="datetime-local" /></label>
    <label>Scheduled end<input name="scheduledEnd" type="datetime-local" /></label>
    <label>Status<select name="status"><option>SCHEDULED</option><option>APPROVED</option><option>DEPLOYED</option><option>IN_PROGRESS</option></select></label>
    <label>Priority<select name="priority"><option>NORMAL</option><option>LOW</option><option>HIGH</option><option>CRITICAL</option></select></label>
    <label>Assigned team name<input name="assignedTeam" placeholder="Alpha Team" /></label>
    <label>Assign staff<select name="staffIds" multiple size="4">{staff.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select><small>Hold Ctrl/Cmd to select multiple staff.</small></label>
    <div className="full"><button className="button button-primary">Create Service Job</button>{message && <small style={{ marginLeft: 12 }}>{message}</small>}</div>
  </form>;
}
