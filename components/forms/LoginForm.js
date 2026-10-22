'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
export function LoginForm({admin=false}){
 const router=useRouter();const search=useSearchParams();const[loading,setLoading]=useState(false);const[error,setError]=useState('');
 async function submit(e){e.preventDefault();setLoading(true);setError('');const data=Object.fromEntries(new FormData(e.currentTarget));const res=await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...data,admin})});const body=await res.json();setLoading(false);if(!res.ok){setError(body.error||'Unable to sign in.');return;}router.push(search.get('next')||body.redirect);router.refresh();}
 return <form className="auth-form" onSubmit={submit}>{error&&<div className="form-message error">{error}</div>}<label>Email<input name="email" type="email" autoComplete="email" required placeholder={admin?'admin@jetwash.co.zw':'you@company.com'}/></label><label>Password<input name="password" type="password" autoComplete="current-password" minLength="8" required/></label><div className="form-row"><label className="check"><input type="checkbox"/> Remember this device</label><a href="mailto:support@jetwash.co.zw">Forgot password?</a></div><button className="button button-primary button-block" disabled={loading}>{loading?'Signing in…':'Secure Login'}</button></form>;
}
