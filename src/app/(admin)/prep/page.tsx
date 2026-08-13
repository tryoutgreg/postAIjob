import type { Metadata } from 'next';
import PrepPage from '@/components/tracker/PrepPage';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://postaijob.org'),
  title: 'Prep for AI replacement — postAIjob',
  description:
    'Practical guide to preparing for AI-driven job displacement. Based on real data from documented cases.',
  openGraph: {
    title: 'Prep for AI replacement — postAIjob',
    description:
      'Practical guide to preparing for AI-driven job displacement. Based on real data from documented cases.',
    url: 'https://postaijob.org/prep',
    siteName: 'postAIjob',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prep for AI replacement — postAIjob',
    description:
      'Practical guide to preparing for AI-driven job displacement. Based on real data from documented cases.',
  },
};

export default function Prep() {
  return <PrepPage />;
}
