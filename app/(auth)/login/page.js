import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata=makeMetadata({title:'Client Portal Login',path:'/login',description:'Secure JetWash client portal login.',noIndex:true});
export default function Login(){return <main className="auth-page"><section className="auth-card"><div className="auth-logo"><span className="brand-mark">JW</span><h1>JetWash Client Portal</h1><p>Access quotations, jobs, invoices, documents, and messages.</p></div><LoginForm/><div className="auth-links"><p>Need an account? <Link href="/register">Register your company</Link></p><p><Link href="/admin-login">Administrator login</Link></p></div></section></main>}
