# JetWash [PVT] LTD — Full-Stack Website and Operations Portal

A production-oriented **JavaScript/JSX application** built with Next.js for JetWash [PVT] LTD. It combines a public industrial-services website, a secure client portal, an admin/staff operations portal, PostgreSQL, Prisma ORM, custom cookie-based authentication, role-based access control, quotation and invoice PDFs, payment-proof review, email notifications, file uploads, structured SEO, Google Analytics support, and Railway deployment instructions. All application code is JavaScript/JSX; Prisma generates an internal TypeScript client during installation, which is build output and is not committed.

> **Important:** The included company facts, project stories, client names, numbers, legal pages, images, and contact details are placeholders or demo data. Replace them with verified, company-approved material before launch.

## 1. What is included

### Public website
- SEO-focused Home, About, Services, Projects, Clients, Contact, Request Quote, Privacy, and Terms pages.
- Responsive JetWash design system: dark navy, emerald green, pale blue, white cards, status badges, timelines, and industrial placeholders.
- Public contact and quote-request forms saved to PostgreSQL.
- Optional quote-request attachment upload.
- Organization/LocalBusiness JSON-LD, Open Graph metadata, canonical URLs, sitemap, robots rules, manifest, and GA4 hooks.

### Client portal
- Approval-gated company registration and login.
- Dashboard with jobs, billing, communications, quotes, and notifications.
- Quote creation and quotation acceptance/rejection.
- Job status timelines, progress, shared documents, and context-specific chats.
- Invoice detail pages, PDF downloads, payment-proof uploads, and verification status.
- Company/profile editing and document center.

### Admin/staff portal
- Operational dashboard with revenue, jobs, invoices, approvals, quote requests, schedule, and activity log.
- Client approval workflow and client database.
- Quotation builder with line items, discounts, VAT/tax, totals, PDF output, and client notification.
- Job cards, progress updates, status history, staff assignments, documents, and job chat.
- Invoice builder, invoice details, PDF output, payment-proof verification, reports, settings, documents, and messages.
- Staff can update jobs assigned to them; admin-only actions remain restricted.
- Public service and project content management with dedicated SEO detail pages.

### Security foundations
- bcrypt password hashing.
- Signed HTTP-only session cookies using `jose`.
- Server-side authorization and middleware route protection.
- Company-level client data isolation.
- Origin checks for state-changing requests.
- In-memory form/login rate limiting for a single app instance.
- Upload type/size validation.
- Security headers configured in `next.config.mjs`.

For multi-instance production deployments, replace the in-memory rate limiter with Redis or another shared store.

## 2. Technology stack

- **Next.js 16 App Router** — public pages, portal pages, server components, route handlers, metadata, sitemap, and robots files.
- **React 19** — reusable public, form, and dashboard components.
- **PostgreSQL** — relational storage for companies, users, jobs, quotes, invoices, documents, chats, and audit data.
- **Prisma ORM 7.8.0 with the PostgreSQL driver adapter** — schema, migrations, seed data, and database queries.
- **Custom session authentication** — signed JWT stored in an HTTP-only cookie. `NEXTAUTH_SECRET` is used as the signing key even though Auth.js is not installed.
- **Zod** — server-side request validation.
- **Nodemailer** — SMTP email delivery, with safe console fallback during development.
- **pdf-lib** — dynamically generated quotation and invoice PDFs.
- **Cloudinary or local storage** — local files in development; Cloudinary recommended online.
- **Plain CSS** — no TypeScript and no Tailwind dependency.

## 3. Folder structure

```text
app/
  (public)/                 Public marketing pages
  (auth)/                   Login and registration pages
  admin/                    Protected admin/staff portal
  client/                   Protected client portal
  api/                      Route handlers for auth and business actions
  sitemap.js                Runtime sitemap with service/project URLs
  robots.js                 Crawler rules
components/
  forms/                    Interactive forms and builders
  layout/                   Portal shell, sidebar, topbar
  public/                   Public navigation, footer, support widget
  seo/                      GA4 and JSON-LD helpers
  ui/                       Tables, badges, cards, alerts, progress
lib/
  auth.js                   Sessions and server route guards
  api-auth.js               API authorization helpers
  prisma.js                 Lazy Prisma client and PostgreSQL adapter
  permissions.js            Role and company-scope rules
  validators.js             Zod schemas
  uploads.js                Local/Cloudinary upload abstraction
  email.js                  SMTP abstraction
  pdf.js                    PDF generation
  security.js               Origin checks and rate limiting
prisma/
  schema.prisma             PostgreSQL schema
  migrations/               Committed production migration history
  seed.js                   Demo records and users
prisma.config.js             Prisma 7 schema, migration, and seed configuration
generated/prisma/            Generated client; created during install and ignored by Git
public/images/placeholders/ Replaceable SVG image placeholders
scripts/
  create-admin.js           Create/update a production administrator
  check-project.js          Basic structure and JS-only check
```

## 4. Prerequisites

Install:

- Node.js 20.19 or newer; Node.js 22 LTS is recommended
- npm
- PostgreSQL 14 or newer, or Docker Desktop
- Git
- A Railway account for online deployment
- Optional: Cloudinary account for durable production uploads
- Optional: SMTP account for production email

Check your tools:

```bash
node --version
npm --version
git --version
psql --version
```

## 5. Local installation

### 5.1 Download or clone

```bash
git clone YOUR_REPOSITORY_URL
cd jetwash-nextjs
```

When working from the provided ZIP, extract it and open the extracted folder in VS Code.

### 5.2 Install packages

```bash
npm install
```

The `postinstall` script generates Prisma Client automatically. Prisma 7 emits generated TypeScript files under `generated/prisma`; these are tooling output only. The authored application, routes, components, scripts, and configuration remain JavaScript/JSX.

### 5.3 Create the environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Windows Command Prompt:

```cmd
copy .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Generate a session secret:

```bash
openssl rand -base64 32
```

If OpenSSL is unavailable on Windows, use Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Put that value in `NEXTAUTH_SECRET`.

## 6. Local PostgreSQL setup

### Option A — installed PostgreSQL

Create a database:

```sql
CREATE DATABASE jetwash;
```

Example `.env` value:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/jetwash?schema=public"
```

### Option B — Docker PostgreSQL

Start only the database service:

```bash
docker compose up -d postgres
```

Use:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jetwash?schema=public"
```

Verify the container:

```bash
docker compose ps
```

The Compose file is primarily a convenient local PostgreSQL service. Run migrations, seed data, and the Next.js development server from your terminal using the commands below.

## 7. Create tables and seed data

The repository already includes the initial migration. Apply it to an empty local database:

```bash
npm run prisma:deploy
```

Generate Prisma Client if `npm install` did not already do so:

```bash
npm run prisma:generate
```

Seed demo records:

```bash
npm run prisma:seed
```

Open Prisma Studio when you need to inspect records:

```bash
npm run prisma:studio
```

## 8. Start locally

```bash
npm run dev
```

Open:

- Public website: `http://localhost:3000`
- Client login: `http://localhost:3000/login`
- Admin login: `http://localhost:3000/admin-login`
- Health endpoint: `http://localhost:3000/api/health`

Run checks:

```bash
npm run check
npm run lint
npm run build
```

The included initial SQL migration and seed have been designed for PostgreSQL. Always test migrations against a disposable or staging database before applying structural changes to production.

## 9. Demo login accounts

After running the seed:

| Portal | Email | Password |
|---|---|---|
| Super Admin | `admin@jetwash.co.zw` | `ChangeMe123!` |
| Staff | `operations@jetwash.co.zw` | `ChangeMe123!` |
| Client | `client@apex.example` | `ClientDemo123!` |

**Change or delete every demo password before production.** Do not seed predictable credentials into a live database unless you immediately replace them.

## 10. Create a secure production administrator

Set these environment variables locally or in Railway:

```env
ADMIN_NAME="Your Name"
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="a-unique-password-of-at-least-12-characters"
```

Then run:

```bash
npm run create-admin
```

The script creates the user or updates the existing account with the same email.

## 11. Prisma command reference

```bash
npx prisma generate
```
Generates the database client from `schema.prisma`.

```bash
npx prisma migrate dev --name descriptive_change
```
Creates and applies a migration locally. Use only in development.

```bash
npx prisma migrate deploy
```
Applies committed migrations in staging or production without modifying the schema history.

```bash
npx prisma db seed
```
Runs `prisma/seed.js`.

```bash
npx prisma studio
```
Opens a local database browser.

## 12. Replacing the image placeholders

Placeholder files are in:

```text
public/images/placeholders/
```

You can replace an SVG with a real file and update the path in the related page or database record.

Recommended source sizes:

| Image | Recommended size |
|---|---:|
| Home hero | 1920×1080 or larger |
| Open Graph share image | 1200×630 |
| Service card | 1200×750 |
| Project card | 1400×900 |
| Leadership portrait | 900×1200 |
| CTA background | 1600×600 |
| Client logo | SVG preferred, or transparent PNG at 600×240 |

Use compressed WebP or AVIF where practical. Add accurate alternative text. Do not upload client logos, employee portraits, or project photographs without written authorization.

## 13. Customizing content

### Public pages
Edit files under `app/(public)/`.

### Services and projects
Seed examples come from `prisma/seed.js`. Administrators can add services and projects and change their active/featured state under **Admin → Website Content**. Prisma Studio remains useful for carefully reviewed maintenance and debugging.

### Company contact details
Update `.env` for deployment defaults:

```env
COMPANY_NAME=
COMPANY_EMAIL=
COMPANY_PHONE=
COMPANY_ADDRESS=
```

Admin-managed commercial defaults are stored in `SiteSetting`.

### Branding
Edit CSS variables at the top of `app/globals.css`.

## 14. SEO setup

The project includes:

- Per-page metadata and descriptions.
- Canonical URLs.
- Open Graph and Twitter card metadata.
- `app/sitemap.js`.
- `app/robots.js`.
- Organization and LocalBusiness JSON-LD on the home page.
- Semantic headings and server-rendered public pages.
- Protected portal routes excluded from indexing.

Before launch:

1. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain.
2. Replace `/public/images/placeholders/og-image.svg` with an approved 1200×630 brand image.
3. Review every page title, description, H1, business claim, address, phone number, and service area.
4. Add approved project case studies and client references.
5. Test `/sitemap.xml` and `/robots.txt` on the production domain.
6. Run Lighthouse and correct performance, accessibility, and SEO issues.

### Google Analytics 4

Set:

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

The script is omitted when this variable is empty. Existing event calls cover contact submission, public quote submission, client registration, and quote acceptance.

### Google Search Console

Set:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="verification-token"
```

After deployment, verify the property and submit:

```text
https://YOUR_DOMAIN/sitemap.xml
```

## 15. Email setup

Without SMTP credentials, emails are logged to the development terminal and the app does not crash.

Production example:

```env
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="smtp-user"
EMAIL_PASS="smtp-password"
EMAIL_FROM="JetWash <no-reply@yourdomain.com>"
```

Use a transactional email service rather than a personal mailbox. Configure SPF, DKIM, and DMARC for the sending domain.

## 16. File uploads

### Local development

```env
UPLOAD_PROVIDER="local"
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE_MB="10"
```

Local files are not a safe durable production strategy on hosts with ephemeral disks.

### Recommended online setup — Cloudinary

```env
UPLOAD_PROVIDER="cloudinary"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
CLOUDINARY_FOLDER="jetwash"
```

The application validates supported types and file size before upload. For higher compliance requirements, add malware scanning, retention policies, signed download URLs, audit review, and storage-region controls.

## 17. PDF generation

Quotation and invoice PDFs are generated dynamically by protected API routes:

```text
/api/quotations/{id}/pdf
/api/invoices/{id}/pdf
```

The route rechecks the current user’s role and company scope before returning the PDF. Edit `lib/pdf.js` to add the approved logo, tax registration, banking details, signatures, legal terms, and document numbering rules.

## 18. Recommended hosting — Railway

Railway is used here because one project can contain the Next.js service and managed PostgreSQL, supports GitHub deployments, environment variables, custom domains, health checks, and pre-deploy migration commands.

### 18.1 Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial JetWash platform"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Confirm `.env` was not committed:

```bash
git status
git ls-files .env
```

The second command should return nothing.

### 18.2 Create the Railway project

1. Sign in to Railway.
2. Choose **New Project**.
3. Choose **Deploy from GitHub repo**.
4. Select the JetWash repository.
5. Add a PostgreSQL service in the same Railway project.

### 18.3 Connect PostgreSQL

In the Next.js service variables, add a reference to the PostgreSQL service’s `DATABASE_URL`. Railway commonly exposes the Postgres connection variable automatically when linked, but verify that the application service can see it.

### 18.4 Add environment variables

Add all required values from `.env.example`, especially:

```env
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://YOUR_RAILWAY_OR_CUSTOM_DOMAIN
APP_URL=https://YOUR_RAILWAY_OR_CUSTOM_DOMAIN
NEXT_PUBLIC_SITE_URL=https://YOUR_RAILWAY_OR_CUSTOM_DOMAIN
NODE_ENV=production
UPLOAD_PROVIDER=cloudinary
```

Also add SMTP, Cloudinary, GA4, Search Console, and company variables when ready.

Remember: variables beginning with `NEXT_PUBLIC_` are included in browser bundles during the build. Never put secrets in them.

### 18.5 Build and start settings

Recommended build command:

```bash
npm ci && npx prisma generate && npm run build
```

`npm ci` also runs the project `postinstall` generator. The explicit `prisma generate` is kept in the Railway build command so a missing generated client fails early and clearly.

Recommended start command:

```bash
npm start
```

Recommended pre-deploy command:

```bash
npx prisma migrate deploy
```

Use Railway’s **Pre-Deploy Command** field for migrations. This is safer than running migrations every time the web process restarts.

### 18.6 Verify the committed migration

The project already includes `prisma/migrations/20260710190000_init/migration.sql`. Keep that directory in Git and confirm it is present before deployment:

```bash
git add prisma/migrations prisma/migrations/migration_lock.toml
git commit -m "Keep JetWash database migrations"
git push
```

For later schema changes, create a new migration locally with `npx prisma migrate dev --name meaningful_change`, review the SQL, and commit it. Production must use `prisma migrate deploy`; never use `prisma migrate dev` against the live database.

### 18.7 Generate a public domain

In the Railway service networking settings:

1. Generate a Railway domain.
2. Set `NEXTAUTH_URL`, `APP_URL`, and `NEXT_PUBLIC_SITE_URL` to the HTTPS URL.
3. Redeploy because public variables are included at build time.
4. Open `/api/health` and confirm the database reports `connected`.

### 18.8 Create the production admin

Temporarily set secure `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` variables. Use a Railway shell or one-off command to run:

```bash
npm run create-admin
```

Remove `ADMIN_PASSWORD` from Railway after the administrator is created.

Do **not** run the demo seed on a real production database unless you intentionally want the demo records. For a clean production database, create only the admin and enter approved data.

### 18.9 Custom domain

1. Add the domain in Railway networking settings.
2. Add the requested DNS record at the domain registrar.
3. Wait for Railway to verify the record and issue HTTPS.
4. Update:

```env
NEXTAUTH_URL=https://www.yourdomain.com
APP_URL=https://www.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
```

5. Redeploy.
6. Decide whether the root domain redirects to `www` or the reverse, and use one canonical host consistently.

### 18.10 Production verification

Test all of the following:

- Home, About, Services, Projects, Clients, Contact, and Quote pages.
- Client and administrator login.
- Pending registration and admin approval.
- Public and client quote requests.
- Quotation creation and PDF download.
- Manual invoice creation, client payment-proof upload, and administrator verification.
- Service/project content creation and SEO detail pages.
- Quote acceptance and automatic job creation.
- Job status update and client visibility.
- Document upload through Cloudinary.
- Invoice PDF.
- SMTP delivery.
- `/sitemap.xml`, `/robots.txt`, Open Graph preview, GA4 events, and Search Console verification.
- Unauthorized cross-company requests return 404/403.

## 19. Database migrations in production

Safe workflow:

1. Edit `prisma/schema.prisma` locally.
2. Run `npx prisma migrate dev --name meaningful_name`.
3. Test locally.
4. Review the generated SQL.
5. Back up production before destructive changes.
6. Commit the migration.
7. Push to GitHub.
8. Railway runs `npx prisma migrate deploy` before the new deployment starts.

Never edit a migration that has already been applied to production.

## 20. Backup and maintenance

- Enable Railway database backups or take scheduled PostgreSQL dumps.
- Test database restoration periodically.
- Keep off-platform copies of critical documents when required by company policy.
- Review admin/staff accounts and client approvals regularly.
- Rotate secrets and SMTP/storage credentials.
- Run dependency and security updates in a staging environment first.
- Review activity logs and failed login patterns.
- Archive old jobs and documents according to approved retention policy.

Example manual PostgreSQL backup:

```bash
pg_dump "$DATABASE_URL" --format=custom --file=jetwash-backup.dump
```

Example restore to an empty database:

```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" jetwash-backup.dump
```

## 21. Troubleshooting

### `DATABASE_URL` is missing
Copy `.env.example` to `.env`, set the PostgreSQL connection string, restart the development server, and rerun Prisma generation/migrations.

### Prisma Client is not generated

```bash
npx prisma generate
```

### `P1001: Can't reach database server`
Confirm PostgreSQL is running, port 5432 is available, credentials are correct, and Docker/Railway networking variables point to the right service.

### Login redirects back to login
Check `NEXTAUTH_SECRET`, account status, cookie settings, production HTTPS, and that `NEXTAUTH_URL`/`APP_URL` use the exact deployed origin.

### Client registration cannot log in
This is expected until an administrator approves it under **Admin → Approvals**.

### Images do not load
Confirm the file exists under `public/` and use a URL beginning with `/`, such as `/images/placeholders/industrial-hero.svg`.

### Upload works locally but disappears online
The hosting filesystem is ephemeral. Configure Cloudinary and set `UPLOAD_PROVIDER=cloudinary`.

### Email is only printed in logs
SMTP is not configured. Add all `EMAIL_*` variables and check provider logs, SPF, DKIM, DMARC, and sender verification.

### Railway build fails during Prisma generation
Confirm `prisma` is available during the build, `DATABASE_URL` is set, and Railway is using Node.js 20.19+ or Node.js 22. The project’s `postinstall` runs `prisma generate`, and the build command runs it again explicitly.

### Railway deployment fails during migration
Review the pre-deploy logs. Do not bypass a failed migration without understanding the SQL. Fix locally, use Prisma’s migration resolution workflow when appropriate, and redeploy.

### PDF download returns 404
The logged-in user must be an authorized admin/staff user or belong to the same company as the quotation/invoice.

### `NEXT_PUBLIC_*` value did not change
Public variables are embedded at build time. Trigger a new deployment after changing them.

## 22. Known production hardening work

This codebase is a strong functional foundation, but any real launch should include a professional review of:

- Zimbabwean and customer-jurisdiction privacy, tax, electronic acceptance, record-retention, and invoice requirements.
- Distributed rate limiting and bot protection.
- Password reset and email verification flows.
- Optional multi-factor authentication for administrators.
- Malware scanning and private signed downloads for sensitive documents.
- Background jobs/queues for email, PDF, and notification delivery at scale.
- Centralized error monitoring, audit export, and uptime monitoring.
- Database connection pooling and load testing.
- Accessibility testing with keyboard and assistive technology users.
- Approved backup, disaster recovery, incident response, and account offboarding procedures.

## 23. Official documentation references

- Next.js deployment and self-hosting: `https://nextjs.org/docs/app/getting-started/deploying`
- Next.js metadata: `https://nextjs.org/docs/app/getting-started/metadata-and-og-images`
- Next.js sitemap: `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap`
- Next.js robots: `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots`
- Railway Next.js + Postgres: `https://docs.railway.com/guides/nextjs`
- Railway PostgreSQL: `https://docs.railway.com/databases/postgresql`
- Railway pre-deploy commands: `https://docs.railway.com/deployments/pre-deploy-command`
- Prisma configuration: `https://www.prisma.io/docs/orm/reference/prisma-config-reference`
- Prisma Next.js guide: `https://www.prisma.io/docs/guides/frameworks/nextjs`
- Prisma production migrations: `https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate`

## License

Private/proprietary starter project. Add the company’s approved license and ownership notice before distribution.
