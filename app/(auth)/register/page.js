import Image from 'next/image';
import Link from 'next/link';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata=makeMetadata({title:'Client Registration',path:'/register',description:'Register a company account for the JetWash client portal.',noIndex:true});
export default function Register(){return <main className="register-page"><div className="container register-grid"><section style={{color:'#fff'}}><Link className="brand" href="/" aria-label="JetWash home"><Image src="/images/brand/jetwash-logo-horizontal-white.svg" width={209} height={34} alt="JetWash"/></Link><h1 style={{fontSize:'4rem',lineHeight:1,marginTop:'80px'}}>Precision <span style={{color:'var(--green-2)'}}>Industrial</span> Partners.</h1><p style={{color:'#b8c7d3'}}>Join the client portal to manage quote requests, operational documents, job progress, communications, and billing.</p></section><section className="auth-card" style={{width:'100%'}}><RegisterForm/></section></div></main>}
