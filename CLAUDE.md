# JetWash website and operations portal: guide for Claude Code

Client project for JetWash (Pvt) Ltd, a Zimbabwean industrial cleaning and maintenance company established in 1998.
Built and maintained by Julius (keoramets). Next.js 16 App Router, React 19, PostgreSQL with Prisma 7, plain
JavaScript (JSX). Public website, client portal (quotes, jobs, invoices) and admin/staff portal. See README.md.

## Commands
- `npm run dev`: http://localhost:3000 (needs PostgreSQL and a `.env`, see `.env.example`)
- `npm run lint`, `npm run check` (structure), `npm run build`
- `npm run prisma:migrate`, `npm run prisma:seed`, `npm run create-admin`

## Rules
- Company facts and services live in `lib/company.js`. Only put in what JetWash has confirmed. Never invent clients,
  testimonials, project results, figures or leadership quotes; leave a section out until the real content exists.
- Contact details come from the environment (`COMPANY_*`, `NEXT_PUBLIC_COMPANY_WHATSAPP`). If one is missing, the site
  falls back to JetWash's real details in `lib/seo.js`. Keep those, `.env.example` and `prisma/seed.js` in step.
- Keep the JetWash brand (navy, emerald, pale blue). This is not a Global Alfabet product.
- Plain JavaScript only (`npm run check` rejects TypeScript files). Prisma's generated client is build output.
- Security: keep `next`, `react` and `nodemailer` patched; CI fails on high or critical advisories in runtime
  dependencies. Never commit `.env` files or secrets.
- Work on a branch and open a pull request. Julius approves every merge.
- Commit messages: conventional style, e.g. `feat(services): add tank inspection`, `fix(portal): invoice total`.
