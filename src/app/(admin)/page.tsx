import type { Metadata } from 'next';
import LandingPage from '@/components/tracker/LandingPage';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://postaijob.org'),
  title: 'postAIjob — Who lost their job to AI?',
  description:
    'A public tracker of AI-driven layoffs. Real stories from Reddit and anonymous submissions — who got replaced, by what tool, and what happened next.',
  openGraph: {
    title: 'postAIjob — Who lost their job to AI?',
    description:
      'Real stories of people replaced by AI. Track who lost their job, what tool replaced them, and what happened next.',
    url: 'https://postaijob.org',
    siteName: 'postAIjob',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'postAIjob — Who lost their job to AI?',
    description:
      'Real stories of people replaced by AI. Track who lost their job, what tool replaced them, and what happened next.',
  },
};

export default function HomePage() {
  return <LandingPage />;
}
