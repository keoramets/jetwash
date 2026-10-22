import { site } from '@/lib/seo';
export default function robots(){return {rules:[{userAgent:'*',allow:'/',disallow:['/admin/','/client/','/api/','/login','/register','/admin-login']}],sitemap:`${site.url}/sitemap.xml`,host:site.url}}
