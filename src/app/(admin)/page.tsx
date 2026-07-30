import type { Metadata } from 'next';
import LandingPage from '@/components/tracker/LandingPage';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://postaijob.org'),
  title: 'postAIjob — Who lost their job to AI?',
  description:
    'A public tracker of AI-driven layoffs. Data from Reddit and direct anonymous submissions.',
};

export default function HomePage() {
  return <LandingPage />;
}
