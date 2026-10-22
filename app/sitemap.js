import { prisma } from '@/lib/prisma';
import { site } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const staticPaths = ['', '/about', '/services', '/projects', '/clients', '/contact', '/request-quote', '/privacy', '/terms'];
  const [projects, services] = await Promise.all([
    prisma.project.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => [])
  ]);
  return [
    ...staticPaths.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date(), changeFrequency: path === '' ? 'weekly' : 'monthly', priority: path === '' ? 1 : 0.7 })),
    ...services.map((service) => ({ url: `${site.url}/services/${service.slug}`, lastModified: service.updatedAt, changeFrequency: 'monthly', priority: 0.7 })),
    ...projects.map((project) => ({ url: `${site.url}/projects/${project.slug}`, lastModified: project.updatedAt, changeFrequency: 'monthly', priority: 0.6 }))
  ];
}
