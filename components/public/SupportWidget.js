'use client';
import { useState } from 'react';
import Link from 'next/link';
// WhatsApp shows only when NEXT_PUBLIC_COMPANY_WHATSAPP is set (digits only, e.g. 2637...).
const whatsapp=(process.env.NEXT_PUBLIC_COMPANY_WHATSAPP||'263772906967').replace(/\D/g,'');
export function SupportWidget(){const[open,setOpen]=useState(false);return <div className="support-widget">
  {open&&<div className="support-card"><strong>Talk to JetWash</strong><small>Quotes and enquiries</small>{whatsapp&&<a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>}<Link href="/contact">Send a message</Link><Link className="button button-primary" href="/contact">Start Conversation</Link></div>}
  <button aria-label="Open support options" onClick={()=>setOpen(!open)}>{open?'×':'💬'}</button>
</div>}
