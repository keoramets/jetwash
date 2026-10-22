import Link from 'next/link';
import { site } from '@/lib/seo';
import { services } from '@/lib/company';
export function PublicFooter() {
  return <footer className="public-footer"><div className="container footer-grid">
    <div><h3>{site.name}</h3><p>Industrial cleaning and maintenance in Zimbabwe since 1998.</p></div>
    <div><h4>Navigation</h4><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/clients">Who we work with</Link></div>
    <div><h4>Services</h4>{services.map(([name,slug])=><Link key={slug} href={`/services/${slug}`}>{name}</Link>)}</div>
    <div><h4>Contact</h4><span>{site.address}</span><a href={`tel:${site.phone}`}>{site.phone}</a><a href={`mailto:${site.email}`}>{site.email}</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></span></div></footer>;
}
