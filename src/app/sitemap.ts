import type { MetadataRoute } from 'next';
import { products, categories } from '@/data/products';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = ['', '/shop', '/about', '/contact'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${site.url}/shop?category=${encodeURIComponent(c.name)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const productPages = products.map((p) => ({
    url: `${site.url}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
