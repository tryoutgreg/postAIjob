import type { Metadata } from 'next';
import TrackerApp from '@/components/tracker/TrackerApp';

export const metadata: Metadata = {
  title: 'AI Layoff Tracker — postAIjob',
  description:
    'Full tracker of AI-driven layoff reports. Filter by source, industry, and date.',
};

export default function TrackerPage() {
  return <TrackerApp />;
}
