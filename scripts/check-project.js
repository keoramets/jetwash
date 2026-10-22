import { existsSync,readdirSync,statSync } from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const required=['package.json','README.md','.env.example','prisma/schema.prisma','prisma/seed.js','app/layout.js','app/(public)/page.js','app/admin/dashboard/page.js','app/client/dashboard/page.js','app/api/auth/login/route.js','app/sitemap.js','app/robots.js'];
let failed=false;
for(const file of required){if(!existsSync(path.join(root,file))){console.error(`Missing: ${file}`);failed=true}}
function walk(dir){for(const name of readdirSync(dir)){const full=path.join(dir,name);const st=statSync(full);if(st.isDirectory()&&!['node_modules','.next','generated'].includes(name))walk(full);else if(/\.tsx?$/.test(name)){console.error(`TypeScript file found despite JavaScript-only requirement: ${full}`);failed=true}}}
walk(root);
if(failed)process.exit(1);console.log('Project structure check passed.');
