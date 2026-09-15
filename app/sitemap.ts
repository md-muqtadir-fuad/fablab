import type { MetadataRoute } from 'next';
import { mockEquipment } from '@/data/fixtures/equipment';
import { featuredProjects } from '@/data/fixtures/homepage';
export default function sitemap(): MetadataRoute.Sitemap {
  const base=(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/,'');
  return ['','/about','/explore','/make','/learn','/research','/research/themes','/collaborate','/community','/facilities','/equipment','/projects','/training','/visit','/consultation','/bangla','/accessibility','/policies/privacy','/policies/terms',...mockEquipment.map(e=>`/equipment/${e.id}`),...featuredProjects.map(p=>`/projects/${p.id}`)].map(route=>({url:base+route,changeFrequency:'monthly',priority:route ? 0.7 : 1}));
}
