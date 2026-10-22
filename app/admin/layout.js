import { requireRole } from '@/lib/auth';
import { PortalShell } from '@/components/layout/PortalShell';
export const dynamic='force-dynamic';
export const metadata={title:'Admin Portal',robots:{index:false,follow:false}};
export default async function AdminLayout({children}){const user=await requireRole(['SUPER_ADMIN','ADMIN','STAFF']);return <PortalShell mode="admin" user={user} title="Industrial Operations">{children}</PortalShell>}
