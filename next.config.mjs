/** @type {import('next').NextConfig} */
// Frontend only: `next build` writes the whole site as static files to out/, which Netlify serves (netlify.toml).
// No server, no database. Security headers are set in netlify.toml (Next.js can't set headers on a static export).
const nextConfig = {
  output: 'export',
  // Static files have no image server, so photos are served as they are (they're already sized: lib/photos.js).
  images: { unoptimized: true },
  experimental: { cpus: 1 },
};
export default nextConfig;
