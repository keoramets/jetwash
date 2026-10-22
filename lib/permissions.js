export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];
export const OPERATIONS_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'];

export function isAdmin(user) {
  return Boolean(user && ADMIN_ROLES.includes(user.role));
}

export function canManageJobs(user) {
  return Boolean(user && OPERATIONS_ROLES.includes(user.role));
}

export function ensureCompanyScope(user, companyId) {
  if (isAdmin(user) || user?.role === 'STAFF') return true;
  return Boolean(user?.companyId && user.companyId === companyId);
}
