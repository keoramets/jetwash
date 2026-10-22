import Link from 'next/link';
import { site } from '@/lib/seo';
export function PublicFooter() {
  return <footer className="public-footer"><div className="container footer-grid">
    <div><h3>{site.name}</h3><p>High-standard industrial cleaning and precision maintenance for Zimbabwe’s engineering, manufacturing, energy, and infrastructure sectors.</p></div>
    <div><h4>Navigation</h4><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/clients">Clients</Link></div>
    <div><h4>Services</h4><span>High-pressure cleaning</span><span>Chemical cleaning</span><span>Tank restoration</span><span>Fleet sanitization</span></div>
    <div><h4>Contact</h4><span>{site.address}</span><a href={`tel:${site.phone}`}>{site.phone}</a><a href={`mailto:${site.email}`}>{site.email}</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></span></div></footer>;
}
