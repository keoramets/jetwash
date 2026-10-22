// Runs after `next build`. Next.js's standalone output (next.config.mjs: output 'standalone') leaves out the public
// folder and the built CSS/JS in .next/static, so copy them in. Without this, `npm start` serves pages with no styles.
import { cpSync, existsSync } from 'node:fs';

const out = '.next/standalone';
if (!existsSync(out)) {
  console.error('No .next/standalone folder. Run `next build` first.');
  process.exit(1);
}
cpSync('public', `${out}/public`, { recursive: true });
cpSync('.next/static', `${out}/.next/static`, { recursive: true });
console.log('Copied public/ and .next/static/ into .next/standalone.');
