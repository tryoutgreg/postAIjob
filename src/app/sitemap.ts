import type { MetadataRoute } from 'next';
import { getAllSubreddits } from '@/lib/subreddit-stats';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://postaijob.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const subreddits = await getAllSubreddits();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/tracker`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/zgloszenie`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const subredditPages: MetadataRoute.Sitemap = subreddits.map((sub) => ({
    url: `${BASE_URL}/stats/${sub}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...subredditPages];
}
