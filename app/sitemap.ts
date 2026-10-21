import type { MetadataRoute } from 'next';
import { lessons } from '@/lib/catalog';
export default function sitemap(): MetadataRoute.Sitemap {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://level-up.example');
  return ['az', 'en'].flatMap((locale) =>
    [
      '',
      '/lessons',
      '/glossary',
      '/sources',
      ...lessons.filter((l) => l.status === 'published').map((l) => `/lessons/${l.id}`),
    ].map((route) => ({
      url: `${site}/${locale}${route}`,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7,
      alternates: { languages: { az: `${site}/az${route}`, en: `${site}/en${route}` } },
    })),
  );
}
