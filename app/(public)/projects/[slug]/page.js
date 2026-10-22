import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { metadata as makeMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, select: { title: true, summary: true, imageUrl: true } }).catch(() => null);
  if (!project) return makeMetadata({ title: 'Project Not Found', description: 'The requested JetWash project could not be found.', path: `/projects/${slug}`, noIndex: true });
  return makeMetadata({ title: project.title, description: project.summary, path: `/projects/${slug}`, image: project.imageUrl || '/images/placeholders/og-image.svg' });
}

export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } }).catch(() => null);
  if (!project) notFound();
  const metrics = project.metricsJson && typeof project.metricsJson === 'object' ? Object.entries(project.metricsJson) : [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    dateCreated: project.completionDate?.toISOString(),
    locationCreated: project.location,
    creator: { '@type': 'Organization', name: 'JetWash (Pvt) Ltd' }
  };
  return <>
    <JsonLd data={jsonLd} />
    <section className="page-hero"><div className="container page-hero-inner"><div><span className="eyebrow">{project.category}</span><h1>{project.title}</h1><p>{project.summary}</p><div className="action-row"><Link className="button button-primary" href={`/request-quote?service=${encodeURIComponent(project.category)}`}>Request Similar Work</Link><Link className="button button-secondary" href="/projects">All Projects</Link></div></div><div className="page-image"><Image src={project.imageUrl || '/images/placeholders/factory-cleaning.svg'} width={1200} height={800} alt={`${project.title} project image`} priority /></div></div></section>
    <section className="section"><div className="container content-split"><article className="panel"><h2>Project Overview</h2><p>{project.description}</p><p><strong>Client:</strong> {project.clientName || 'Confidential client'}</p><p><strong>Location:</strong> {project.location || 'Zimbabwe'}</p><p><strong>Completion:</strong> {project.completionDate ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(project.completionDate) : 'Ongoing or confidential'}</p></article><aside className="panel"><h2>Verified Outcomes</h2>{metrics.length ? metrics.map(([key, value]) => <p key={key}><strong>{String(value)}</strong><br />{key.replace(/([A-Z])/g, ' $1')}</p>) : <p>Add approved performance metrics, safety outcomes, downtime reduction, or compliance results here.</p>}</aside></div></section>
  </>;
}
