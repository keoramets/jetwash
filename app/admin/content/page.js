import { prisma } from '@/lib/prisma';
import { ContentManager } from '@/components/forms/ContentManager';

export default async function ContentPage() {
  const [services, projects] = await Promise.all([
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
    prisma.project.findMany({ orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] })
  ]);
  return <><div className="section-heading"><div><span className="eyebrow">Public website</span><h2>Services & Projects</h2><p>Manage the searchable public-service catalog and approved portfolio stories. Replace placeholders with authorized content before launch.</p></div></div><ContentManager services={services} projects={projects} /></>;
}
