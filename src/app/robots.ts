import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/order-success', '/api/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
