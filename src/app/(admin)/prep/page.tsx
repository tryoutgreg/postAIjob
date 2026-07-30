import type { Metadata } from 'next';
import PrepPage from '@/components/tracker/PrepPage';

export const metadata: Metadata = {
  title: 'Prep for AI replacement — postAIjob',
  description:
    'Practical guide to preparing for AI-driven job displacement. Based on real data from documented cases.',
};

export default function Prep() {
  return <PrepPage />;
}
