import type { MetadataRoute } from 'next';
import { mockEquipment } from '@/data/fixtures/equipment';
import { featuredProjects } from '@/data/fixtures/homepage';
import { contentEnabled } from '@/lib/features';
import { listPublicNotices, safely } from '@/lib/server/notices';

// Rebuilt at most once an hour so new notices reach search engines.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base=(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/,'');
  const pages=['','/about','/explore','/make','/learn','/research','/research/themes','/collaborate','/facilities','/equipment','/projects','/training','/visit','/consultation','/bangla','/accessibility','/policies/privacy','/policies/terms',...(contentEnabled() ? ['/notices'] : []),...mockEquipment.map(e=>`/equipment/${e.id}`),...featuredProjects.map(p=>`/projects/${p.id}`)].map(route=>({url:base+route,changeFrequency:'monthly' as const,priority:route ? 0.7 : 1}));
  const notices=contentEnabled() ? (await safely(()=>listPublicNotices({limit:200}),[])).data : [];
  return [...pages,...notices.map(n=>({url:`${base}/notices/${n.id}`,lastModified:n.updated_at,changeFrequency:'weekly' as const,priority:0.5}))];
}
