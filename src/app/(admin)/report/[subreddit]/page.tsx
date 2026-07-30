import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubredditStats } from '@/lib/subreddit-stats';
import ReportPreview from './ReportPreview';

interface Props {
  params: Promise<{ subreddit: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subreddit } = await params;
  return {
    title: `Weekly Report — r/${subreddit} — postAIjob`,
  };
}

export default async function Page({ params }: Props) {
  const { subreddit } = await params;
  const stats = await getSubredditStats(subreddit);
  if (!stats) notFound();

  return <ReportPreview subreddit={subreddit} />;
}
