'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/components/seo/Analytics';
export function QuoteResponseButtons({quotationId}){const router=useRouter();const[busy,setBusy]=useState(false);async function respond(decision){if(decision==='REJECTED'&&!confirm('Reject this quotation?'))return;setBusy(true);const res=await fetch(`/api/quotations/${quotationId}/respond`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({decision})});setBusy(false);if(res.ok){if(decision==='ACCEPTED')trackEvent('quote_acceptance');router.refresh();}}return <div className="button-row"><button disabled={busy} className="button button-primary" onClick={()=>respond('ACCEPTED')}>Accept Quotation</button><button disabled={busy} className="button button-danger" onClick={()=>respond('REJECTED')}>Reject</button></div>}
