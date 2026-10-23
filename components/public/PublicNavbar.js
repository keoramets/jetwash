'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [['/','Home'],['/about','About'],['/services','Services'],['/projects','Projects'],['/clients','Who we work with'],['/contact','Contact']];
export function PublicNavbar() {
  const pathname = usePathname();
  const [open,setOpen]=useState(false);
  return <header className="public-header"><div className="container nav-wrap">
    <Link className="brand" href="/" aria-label="JetWash (Pvt) Ltd home"><Image className="brand-logo" src="/images/brand/jetwash-logo-horizontal.svg" width={209} height={34} alt="JetWash" priority/><small>(Pvt) Ltd</small></Link>
    <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>☰</button>
    <nav className={open?'nav-links open':'nav-links'} aria-label="Primary navigation">
      {links.map(([href,label])=><Link key={href} className={pathname===href?'active':''} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
      <Link className="button button-primary nav-cta" href="/request-quote">Request a Quote</Link>
    </nav>
  </div></header>;
}
