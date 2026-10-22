'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ContentManager({ services, projects }) {
  const router = useRouter();
  const [message, setMessage] = useState('');

  async function create(event, endpoint) {
    event.preventDefault();
    setMessage('Saving…');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    if ('isFeatured' in payload) payload.isFeatured = payload.isFeatured === 'on';
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) return setMessage(body.error || 'Unable to save content.');
    event.currentTarget.reset();
    setMessage('Content saved.');
    router.refresh();
  }

  async function toggle(endpoint, data) {
    setMessage('Updating…');
    const response = await fetch(endpoint, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const body = await response.json();
    if (!response.ok) return setMessage(body.error || 'Unable to update content.');
    setMessage('Content updated.');
    router.refresh();
  }

  return <div className="settings-grid">
    <div className="stack">
      <section className="panel"><h3>Add Service</h3><form className="form-grid" onSubmit={(event) => create(event, '/api/services')}>
        <label>Name<input name="name" required /></label><label>Slug<input name="slug" placeholder="high-pressure-cleaning" required /></label><label>Category<input name="category" required /></label><label>Image path<input name="imageUrl" defaultValue="/images/placeholders/factory-cleaning.svg" /></label><label className="full">Short description<textarea name="shortDescription" rows="3" required /></label><label className="full">Full description<textarea name="fullDescription" rows="5" required /></label><label>Indicative base price<input name="basePrice" type="number" min="0" step="0.01" /></label><div className="full"><button className="button button-primary">Add Service</button></div>
      </form></section>
      <section className="panel"><h3>Services</h3>{services.map((service) => <div className="content-list-row" key={service.id}><div><strong>{service.name}</strong><br /><small>{service.category} · /services/{service.slug}</small></div><button className="button button-secondary button-small" onClick={() => toggle(`/api/services/${service.id}`, { isActive: !service.isActive })}>{service.isActive ? 'Deactivate' : 'Activate'}</button></div>)}</section>
    </div>
    <div className="stack">
      <section className="panel"><h3>Add Project</h3><form className="form-grid" onSubmit={(event) => create(event, '/api/projects')}>
        <label>Title<input name="title" required /></label><label>Slug<input name="slug" placeholder="project-name" required /></label><label>Category<input name="category" required /></label><label>Client name<input name="clientName" /></label><label>Location<input name="location" /></label><label>Completion date<input name="completionDate" type="date" /></label><label className="full">Summary<textarea name="summary" rows="3" required /></label><label className="full">Description<textarea name="description" rows="5" required /></label><label className="full">Image path<input name="imageUrl" defaultValue="/images/placeholders/factory-cleaning.svg" /></label><label className="checkbox-label"><input name="isFeatured" type="checkbox" /> Featured project</label><div className="full"><button className="button button-primary">Add Project</button></div>
      </form></section>
      <section className="panel"><h3>Projects</h3>{projects.map((project) => <div className="content-list-row" key={project.id}><div><strong>{project.title}</strong><br /><small>{project.category} · /projects/{project.slug}</small></div><button className="button button-secondary button-small" onClick={() => toggle(`/api/projects/${project.id}`, { isFeatured: !project.isFeatured })}>{project.isFeatured ? 'Remove Feature' : 'Feature'}</button></div>)}</section>
    </div>
    {message && <div className="form-message full">{message}</div>}
  </div>;
}
