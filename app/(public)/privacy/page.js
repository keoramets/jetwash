import { metadata as makeMetadata, site } from '@/lib/seo';
export const metadata = makeMetadata({ title: 'Privacy Policy', path: '/privacy', description: 'How JetWash handles the details you send through this website.' });
export default function Privacy() {
  return <section className="section"><div className="container" style={{ maxWidth: '850px' }}>
    <span className="eyebrow">Legal</span><h1>Privacy Policy</h1>
    <p><strong>Template notice:</strong> This page must be reviewed by qualified legal counsel before production launch.</p>
    <h2>Information collected</h2>
    <p>This website has no accounts. When you use the contact form or the quote request form, we receive what you enter: your name, email address, phone number, company, site location and project details, and any file you attach.</p>
    <h2>How information is used</h2>
    <p>We use it to reply to your enquiry, prepare a quotation and plan the work with you.</p>
    <h2>Where it is kept</h2>
    <p>Form submissions are received and stored by Netlify, which hosts this website, and emailed to JetWash. We keep them only as long as we need them for your enquiry, quotation or job, or as the law requires.</p>
    {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && <><h2>Visit statistics</h2><p>We use Google Analytics to count visits and see which pages help people. It sets cookies in your browser and doesn&rsquo;t receive what you type in our forms.</p></>}
    <h2>Contact</h2>
    <p>To see, correct or delete what you sent us, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
  </div></section>;
}
