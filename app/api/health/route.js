import { prisma } from '@/lib/prisma';
export async function GET(){try{await prisma.$queryRaw`SELECT 1`;return Response.json({ok:true,service:'jetwash',database:'connected',time:new Date().toISOString()})}catch{return Response.json({ok:false,service:'jetwash',database:'unavailable',time:new Date().toISOString()},{status:503})}}
