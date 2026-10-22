import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.js'
  },
  datasource: {
    // A harmless local fallback lets `prisma generate` run during image builds.
    // Runtime and migration commands still require the real DATABASE_URL.
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jetwash?schema=public'
  }
});
