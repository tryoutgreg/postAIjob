import type { Metadata } from 'next';
import TrackerApp from '@/components/tracker/TrackerApp';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://postaijob.org'),
  title: 'AI Layoff Tracker — postAIjob',
  description:
    'Full tracker of AI-driven layoff reports. Filter by source, industry, and date.',
  openGraph: {
    title: 'AI Layoff Tracker — postAIjob',
    description:
      'Browse documented cases of people replaced by AI. Industry breakdown, role analysis, and real stories.',
    url: 'https://postaijob.org/tracker',
    siteName: 'postAIjob',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Layoff Tracker — postAIjob',
    description:
      'Browse documented cases of people replaced by AI. Industry breakdown, role analysis, and real stories.',
  },
};

export default function TrackerPage() {
  return <TrackerApp />;
}
