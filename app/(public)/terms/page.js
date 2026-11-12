import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata({ title: 'Terms of Service', path: '/terms', description: 'Terms for using the JetWash website.' });
export default function Terms() {
  return <section className="section"><div className="container" style={{ maxWidth: '850px' }}>
    <span className="eyebrow">Legal</span><h1>Terms of Service</h1>
    <p><strong>Template notice:</strong> Replace this draft with terms reviewed by qualified legal counsel.</p>
    <h2>Website information</h2>
    <p>This website describes JetWash&rsquo;s services in general. Every job is scoped and quoted separately.</p>
    <h2>Quotes and jobs</h2>
    <p>Quotations, scheduling, scope changes and invoices are agreed directly with JetWash and are subject to the approved commercial agreement and project terms.</p>
    <h2>Files you send</h2>
    <p>Send only lawful, relevant files that you are authorised to share.</p>
    <h2>Availability</h2>
    <p>The website may sometimes be unavailable for maintenance or updates.</p>
  </div></section>;
}
