import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata=makeMetadata({title:'Administrator Login',path:'/admin-login',description:'Secure JetWash administrator login.',noIndex:true});
export default function AdminLogin(){return <main className="auth-page"><section className="auth-card"><div className="auth-logo"><span className="brand-mark">JW</span><h1>Administrator Login</h1><p>Access the industrial operations management system.</p></div><LoginForm admin/><div className="auth-links"><Link href="/login">Client login</Link></div></section></main>}
