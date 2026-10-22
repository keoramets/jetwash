import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured.');
  const adapter = new PrismaPg({
    connectionString,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    max: Number(process.env.DATABASE_POOL_SIZE || 10)
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });
}

function getPrismaClient() {
  if (!globalForPrisma.__jetwashPrisma) globalForPrisma.__jetwashPrisma = createPrismaClient();
  return globalForPrisma.__jetwashPrisma;
}

// Lazy initialization prevents build-time route discovery from opening database pools.
export const prisma = new Proxy({}, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = client[property];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});
