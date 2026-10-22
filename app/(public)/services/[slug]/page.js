import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { metadata as makeMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug }, select: { name: true, shortDescription: true, imageUrl: true, isActive: true } }).catch(() => null);
  if (!service?.isActive) return makeMetadata({ title: 'Service Not Found', description: 'The requested JetWash service could not be found.', path: `/services/${slug}`, noIndex: true });
  return makeMetadata({ title: service.name, description: service.shortDescription, path: `/services/${slug}`, image: service.imageUrl || '/images/placeholders/og-image.svg' });
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } }).catch(() => null);
  if (!service?.isActive) notFound();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.fullDescription,
    areaServed: { '@type': 'Country', name: 'Zimbabwe' },
    provider: { '@type': 'Organization', name: 'JetWash (Pvt) Ltd' }
  };
  return <>
    <JsonLd data={jsonLd} />
    <section className="page-hero"><div className="container page-hero-inner"><div><span className="eyebrow">{service.category}</span><h1>{service.name}</h1><p>{service.shortDescription}</p><div className="action-row"><Link className="button button-primary" href={`/request-quote?service=${encodeURIComponent(service.name)}`}>Request a Quote</Link><Link className="button button-secondary" href="/services">All Services</Link></div></div><div className="page-image"><Image src={service.imageUrl || '/images/placeholders/factory-cleaning.svg'} width={1200} height={800} alt={`${service.name} service image`} priority /></div></div></section>
    <section className="section"><div className="container content-split"><article className="panel"><h2>Service Scope</h2><p>{service.fullDescription}</p><h3>Planning Inputs</h3><p>Provide site access details, asset dimensions, contamination type, operational restrictions, required completion window, photographs, and applicable safety or compliance controls.</p></article><aside className="panel"><h2>Delivery Principles</h2><p>Every scope is reviewed for safe work controls, environmental responsibilities, equipment suitability, resource planning, and measurable acceptance criteria.</p>{service.basePrice && <p><strong>Indicative base price:</strong> available from {String(service.basePrice)}. Final pricing depends on verified scope.</p>}</aside></div></section>
  </>;
}
