import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/admin','/dashboard','/login']},sitemap:`${(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/,'')}/sitemap.xml`};
}
