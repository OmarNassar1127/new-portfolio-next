import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';

export const dynamic = 'force-static';

// Site uses `trailingSlash: true`, so every URL in the sitemap must
// also have a trailing slash. Otherwise Google hits a 308 redirect chain
// on every fetch, which can register as "Couldn't fetch" in Search Console.
export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `https://omardev.xyz/projects/${project.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://omardev.xyz/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://omardev.xyz/projects/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectUrls,
  ];
}
