export const site = {
  name: process.env.COMPANY_NAME || 'JetWash [PVT] LTD',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Industrial cleaning, precision maintenance, pressure washing, chemical cleaning, and facility restoration services in Zimbabwe.',
  email: process.env.COMPANY_EMAIL || 'info@jetwash.co.zw',
  phone: process.env.COMPANY_PHONE || '+263 77 123 4567',
  address: process.env.COMPANY_ADDRESS || 'Industrial Park South, Harare, Zimbabwe'
};
export function metadata({ title, description = site.description, path = '/', image = '/images/placeholders/og-image.svg', noIndex = false }) {
  const canonical = new URL(path, site.url).toString();
  return {
    title,
    description,
    metadataBase: new URL(site.url),
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, url: canonical, siteName: site.name, type: 'website', images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] }
  };
}
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org', '@type': ['Organization','LocalBusiness'],
    name: site.name, url: site.url, email: site.email, telephone: site.phone,
    address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: 'Harare', addressCountry: 'ZW' },
    areaServed: ['Zimbabwe','Southern Africa'],
    knowsAbout: ['Industrial cleaning','Pressure washing','Chemical cleaning','Facility maintenance']
  };
}
