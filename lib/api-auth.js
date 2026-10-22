import { getCurrentUser } from '@/lib/auth';
import { ADMIN_ROLES, OPERATIONS_ROLES } from '@/lib/permissions';

export async function apiUser() {
  const user = await getCurrentUser();
  if (!user || user.status !== 'ACTIVE') return { error: Response.json({ ok:false,error:'Authentication required.' }, { status:401 }) };
  return { user };
}
export async function apiRoles(roles) {
  const result = await apiUser();
  if (result.error) return result;
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(result.user.role)) return { error: Response.json({ok:false,error:'You do not have permission for this action.'},{status:403}) };
  return result;
}
export const apiAdmin = () => apiRoles(ADMIN_ROLES);
export const apiOperations = () => apiRoles(OPERATIONS_ROLES);
