import { PortalSidebar } from './PortalSidebar';
import { PortalTopbar } from './PortalTopbar';
export function PortalShell({mode,user,title,children}){return <div className="portal"><PortalSidebar mode={mode}/><div className="portal-main"><PortalTopbar user={user} title={title}/><div className="portal-content">{children}</div></div></div>}
