import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { SupportWidget } from './SupportWidget';
export function PublicLayout({children}){return <><PublicNavbar/><main>{children}</main><PublicFooter/><SupportWidget/></>}
