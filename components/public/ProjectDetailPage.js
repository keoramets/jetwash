// One project's page. It isn't a route yet: a static export can't have /projects/[slug] with no projects to build.
// When lib/projects.js gets its first project, create app/(public)/projects/[slug]/page.js containing:
//   export { default, generateMetadata, generateStaticParams, dynamicParams } from '@/components/public/ProjectDetailPage';
// (npm run check reminds you.)
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/projects';
import { metadata as makeMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

const findProject = (slug) => projects.find((p) => p.slug === slug) || null;

// Every project in lib/projects.js is a page, built when the site is built.
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return makeMetadata({ title: 'Project Not Found', description: 'The requested JetWash project could not be found.', path: `/projects/${slug}`, noIndex: true });
  return makeMetadata({ title: project.title, description: project.summary, path: `/projects/${slug}`, image: project.imageUrl || '/images/og-image.jpg' });
}

export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  const metrics = project.metrics && typeof project.metrics === 'object' ? Object.entries(project.metrics) : [];
  const completed = project.completionDate ? new Date(project.completionDate) : null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    dateCreated: completed?.toISOString(),
    locationCreated: project.location,
    creator: { '@type': 'Organization', name: 'JetWash (Pvt) Ltd' }
  };
  return <>
    <JsonLd data={jsonLd} />
    <section className="page-hero"><div className="container page-hero-inner"><div><span className="eyebrow">{project.category}</span><h1>{project.title}</h1><p>{project.summary}</p><div className="action-row"><Link className="button button-primary" href={`/request-quote?service=${encodeURIComponent(project.category)}`}>Request Similar Work</Link><Link className="button button-secondary" href="/projects">All Projects</Link></div></div><div className="page-image"><Image src={project.imageUrl || '/images/placeholders/factory-cleaning.svg'} width={1200} height={800} alt={`${project.title} project image`} priority /></div></div></section>
    <section className="section"><div className="container content-split"><article className="panel"><h2>Project Overview</h2><p>{project.description}</p><p><strong>Client:</strong> {project.clientName || 'Confidential client'}</p><p><strong>Location:</strong> {project.location || 'Zimbabwe'}</p><p><strong>Completion:</strong> {completed ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(completed) : 'Ongoing or confidential'}</p></article><aside className="panel"><h2>Verified Outcomes</h2>{metrics.length ? metrics.map(([key, value]) => <p key={key}><strong>{String(value)}</strong><br />{key}</p>) : <p>Ask us about the results of this job.</p>}</aside></div></section>
  </>;
}
