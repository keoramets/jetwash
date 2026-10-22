import { requireRole } from '@/lib/auth';
import { PortalShell } from '@/components/layout/PortalShell';
export const dynamic='force-dynamic';
export const metadata={title:'Client Portal',robots:{index:false,follow:false}};
export default async function ClientLayout({children}){const user=await requireRole('CLIENT');return <PortalShell mode="client" user={user} title="Client Portal">{children}</PortalShell>}
