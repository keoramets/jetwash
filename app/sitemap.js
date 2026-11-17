import { site } from '@/lib/seo';
import { services } from '@/lib/company';
import { projects } from '@/lib/projects';

// Written once, when the site is built (static export).
export const dynamic = 'force-static';

export default function sitemap() {
  const built = new Date();
  const staticPaths = ['', '/about', '/services', '/projects', '/clients', '/contact', '/request-quote', '/privacy', '/terms'];
  return [
    ...staticPaths.map((path) => ({ url: `${site.url}${path}`, lastModified: built, changeFrequency: path === '' ? 'weekly' : 'monthly', priority: path === '' ? 1 : 0.7 })),
    ...services.map(([, slug]) => ({ url: `${site.url}/services/${slug}`, lastModified: built, changeFrequency: 'monthly', priority: 0.7 })),
    ...projects.map((project) => ({ url: `${site.url}/projects/${project.slug}`, lastModified: project.completionDate ? new Date(project.completionDate) : built, changeFrequency: 'monthly', priority: 0.6 }))
  ];
}
