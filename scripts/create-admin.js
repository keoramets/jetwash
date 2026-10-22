import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma=new PrismaClient({ adapter });
const name=process.env.ADMIN_NAME||'JetWash Administrator';
const email=(process.env.ADMIN_EMAIL||'admin@jetwash.co.zw').toLowerCase();
const password=process.env.ADMIN_PASSWORD;
if(!password||password.length<12){console.error('Set ADMIN_PASSWORD to at least 12 characters before running this command.');process.exit(1)}
const passwordHash=await bcrypt.hash(password,12);
const user=await prisma.user.upsert({where:{email},update:{name,passwordHash,role:'SUPER_ADMIN',status:'ACTIVE'},create:{name,email,passwordHash,role:'SUPER_ADMIN',status:'ACTIVE',emailVerified:new Date()}});
console.log(`Administrator ready: ${user.email}`);
await prisma.$disconnect();
