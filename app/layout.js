import './globals.css';
import { Analytics } from '@/components/seo/Analytics';
import { site } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: { default: `${site.name} | Industrial Cleaning Zimbabwe`, template: `%s | ${site.name}` },
  description: site.description,
  metadataBase: new URL(site.url),
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
  icons: { icon: '/images/placeholders/favicon.svg' }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
