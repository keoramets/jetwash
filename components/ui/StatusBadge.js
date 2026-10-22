import { titleCase } from '@/lib/format';
export function StatusBadge({status}){const key=String(status||'UNKNOWN').toLowerCase();return <span className={`status status-${key}`}>{titleCase(status||'Unknown')}</span>}
