import { existsSync,readdirSync,statSync } from 'node:fs';
import path from 'node:path';
const root=process.cwd();
let failed=false;
const required=['package.json','README.md','.env.example','netlify.toml','next.config.mjs','app/layout.js','app/(public)/page.js','app/(public)/contact/page.js','app/(public)/request-quote/page.js','components/forms/ContactForm.js','components/forms/QuoteRequestForm.js','lib/company.js','lib/projects.js','app/sitemap.js','app/robots.js'];
// Frontend only: a server or database must not come back by accident (the site is a static export on Netlify).
const forbidden=['app/api','prisma','proxy.js','middleware.js'];
for(const file of forbidden){if(existsSync(path.join(root,file))){console.error(`Not allowed in the frontend-only site: ${file}`);failed=true}}
for(const file of required){if(!existsSync(path.join(root,file))){console.error(`Missing: ${file}`);failed=true}}
function walk(dir){for(const name of readdirSync(dir)){const full=path.join(dir,name);const st=statSync(full);if(st.isDirectory()&&!['node_modules','.next','out','generated'].includes(name))walk(full);else if(/\.tsx?$/.test(name)){console.error(`TypeScript file found despite JavaScript-only requirement: ${full}`);failed=true}}}
walk(root);
// Each project in lib/projects.js needs the project page route (see components/public/ProjectDetailPage.js).
const { projects } = await import(path.join(root, 'lib/projects.js'));
if (projects.length && !existsSync(path.join(root, 'app/(public)/projects/[slug]/page.js'))) { console.error('lib/projects.js has projects but app/(public)/projects/[slug]/page.js is missing: see components/public/ProjectDetailPage.js'); failed = true; }
if(failed)process.exit(1);console.log('Project structure check passed.');
