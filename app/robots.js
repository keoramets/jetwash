import { site } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${site.url}/sitemap.xml`, host: site.url };
}
