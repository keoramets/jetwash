import { prisma } from '@/lib/prisma';
import { JobBuilder } from '@/components/forms/JobBuilder';

export default async function NewJobPage() {
  const [companies, staff] = await Promise.all([
    prisma.company.findMany({ where: { status: 'ACTIVE' }, include: { users: { where: { role: 'CLIENT', status: 'ACTIVE' }, select: { id: true, name: true } } }, orderBy: { name: 'asc' } }),
    prisma.user.findMany({ where: { role: 'STAFF', status: 'ACTIVE' }, select: { id: true, name: true, email: true }, orderBy: { name: 'asc' } })
  ]);
  return <><div className="section-heading"><div><span className="eyebrow">Operational control</span><h2>New Service Job</h2><p>Create planned work manually, schedule resources, and assign technicians.</p></div></div><JobBuilder companies={companies} staff={staff} /></>;
}
