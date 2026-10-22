# JetWash production image. Railway builds this automatically when it finds it.
# On start it applies any new database migrations, then runs the site on port 3000.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json prisma.config.js ./
COPY prisma ./prisma
RUN npm ci --ignore-scripts

FROM node:22-alpine AS builder
WORKDIR /app
# NEXT_PUBLIC_ settings are baked into the build. Railway passes a service's variables in as these build arguments.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_COMPANY_WHATSAPP=263772906967
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_COMPANY_WHATSAPP=$NEXT_PUBLIC_COMPANY_WHATSAPP \
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
# Build-only placeholders so server modules load during the build. They stay in this stage; the real values are
# set on the host and read when the site runs.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build \
    NEXTAUTH_SECRET=build-only-placeholder-not-used-when-the-site-runs
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# postbuild copies public/ and .next/static/ into .next/standalone
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
# The site itself
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# What migrations and `npm run create-admin` need: the Prisma CLI and schema, tsx, the script and the generated client
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/prisma.config.js ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/generated ./generated
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -qO- http://localhost:3000/api/health >/dev/null || exit 1
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
