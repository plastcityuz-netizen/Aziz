import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.plastcity.uz';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date('2026-11-10'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
