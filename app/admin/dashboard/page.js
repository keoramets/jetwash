import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { money,dateTime } from '@/lib/format';
export default async function Dashboard(){const [activeJobs,pendingInvoices,newClients,quoteRequests,revenue,upcoming,activity]=await Promise.all([
 prisma.job.count({where:{status:{in:['SCHEDULED','DEPLOYED','IN_PROGRESS','QA_REVIEW']}}}),
 prisma.invoice.count({where:{status:{in:['SENT','PARTIALLY_PAID','OVERDUE']}}}),
 prisma.user.count({where:{role:'CLIENT',status:'PENDING_APPROVAL'}}),
 prisma.quoteRequest.count({where:{status:{in:['NEW','REVIEWING']}}}),
 prisma.invoice.aggregate({_sum:{amountPaid:true},where:{status:{in:['PAID','PARTIALLY_PAID']},issueDate:{gte:new Date(new Date().getFullYear(),new Date().getMonth(),1)}}}),
 prisma.job.findMany({where:{status:{in:['SCHEDULED','DEPLOYED','IN_PROGRESS']}},include:{company:true},orderBy:{scheduledStart:'asc'},take:6}),
 prisma.activityLog.findMany({include:{actor:{select:{name:true}}},orderBy:{createdAt:'desc'},take:7})
]);return <><div className="section-heading"><div><span className="eyebrow">Systems operational</span><h2>Industrial Overview</h2></div><div className="button-row"><Link className="button button-secondary" href="/admin/quotations/new">Create Quote</Link><Link className="button button-primary" href="/admin/jobs/new">Add Job</Link></div></div><div className="dashboard-grid"><StatCard accent icon="$" label="Monthly Revenue" value={money(revenue._sum.amountPaid||0)} note="Posted invoice payments this month"/><StatCard icon="⚙" label="Active Jobs" value={activeJobs} note="Scheduled through QA review"/><StatCard icon="▤" label="Pending Invoices" value={pendingInvoices} note="Sent, partial, or overdue"/><StatCard icon="+" label="New Clients" value={newClients} note="Awaiting approval"/><StatCard icon="Q" label="Quote Requests" value={quoteRequests} note="New or under review"/></div><div className="dashboard-columns"><section><div className="panel-header"><h2>Upcoming Operations</h2><Link href="/admin/jobs">View schedule →</Link></div><DataTable columns={['Client & Location','Service','Time','Status']}>{upcoming.map(job=><tr key={job.id}><td><strong>{job.company.name}</strong><br/><small>{job.location}</small></td><td>{job.serviceType}</td><td>{dateTime(job.scheduledStart)}</td><td><StatusBadge status={job.status}/></td></tr>)}</DataTable></section><aside className="panel"><h2>Operation Log</h2>{activity.length?activity.map(item=><div key={item.id} style={{padding:'12px 0',borderBottom:'1px solid var(--line)'}}><strong>{item.action.replaceAll('_',' ')}</strong><p style={{margin:0}}>{item.entityType} · {item.actor?.name||'System'}</p><small>{dateTime(item.createdAt)}</small></div>):<p>No recent activity.</p>}</aside></div></>}
