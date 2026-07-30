import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubredditStats, getAllSubreddits } from '@/lib/subreddit-stats';
import SubredditStatsPage from './SubredditStatsPage';

interface Props {
  params: Promise<{ subreddit: string }>;
}

export async function generateStaticParams() {
  const subs = await getAllSubreddits();
  return subs.map((subreddit) => ({ subreddit }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subreddit } = await params;
  const stats = await getSubredditStats(subreddit);
  if (!stats) return { title: 'Not Found' };

  const title = `r/${subreddit} AI Layoff Stats — postAIjob`;
  const description = `${stats.totalReports} reports, ${stats.totalPeople} people affected. Top industry: ${stats.topIndustry}. Top AI tool: ${stats.topTool}. Live data from r/${subreddit}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'postAIjob',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function Page({ params }: Props) {
  const { subreddit } = await params;
  const stats = await getSubredditStats(subreddit);
  if (!stats) notFound();

  return <SubredditStatsPage stats={stats} />;
}
