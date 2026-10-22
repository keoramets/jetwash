'use client';
import { useState } from 'react';
import Link from 'next/link';
export function SupportWidget(){const[open,setOpen]=useState(false);return <div className="support-widget">
  {open&&<div className="support-card"><strong>Live Support</strong><small>Industrial consultation</small><a href="https://wa.me/263771234567" target="_blank" rel="noreferrer">WhatsApp</a><Link href="/contact">Send a message</Link><Link className="button button-primary" href="/contact">Start Conversation</Link></div>}
  <button aria-label="Open support options" onClick={()=>setOpen(!open)}>{open?'×':'💬'}</button>
</div>}
