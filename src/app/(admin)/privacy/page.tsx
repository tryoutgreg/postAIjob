import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — postAIjob',
  description: 'Privacy Policy for postAIjob — AI layoff tracker.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-10"
        >
          ← Back to home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-12">Last updated: July 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-10">

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">1. Who we are</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              postAIjob (<strong>postAIjob.org</strong>) is a public tracker of AI-driven layoffs.
              We collect anonymous reports from individuals and aggregate publicly available data
              from Reddit and other sources.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">2. What data we collect</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              When you submit a layoff report via our form, we collect:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Industry, country, company size, and job title (optional)</li>
              <li>The AI tool you believe replaced your role (optional)</li>
              <li>Approximate date and number of people affected</li>
              <li>Any free-text description you choose to share</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              We do <strong>not</strong> collect your name, email address, or any information that
              could identify you. Submissions are anonymous by design.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">3. How we use the data</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              All submitted data is used solely to display aggregated statistics and individual
              anonymized reports on this website. We do not sell, share, or transfer data to
              third parties for commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">4. Third-party data</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We display aggregated data from{' '}
              <a
                href="https://layoffs.fyi/ai-layoffs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
              >
                layoffs.fyi
              </a>{' '}
              for market context. This data is used for educational purposes with full attribution.
              We are not affiliated with layoffs.fyi.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">5. Cookies and analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We may use basic analytics (e.g., page view counts) to understand site usage.
              We do not use tracking cookies or build individual user profiles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">6. Data storage</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Submitted reports are stored in a database hosted by Supabase (EU region).
              Data is retained indefinitely for research and statistical purposes.
              If you submitted a report and wish to have it removed, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">7. Your rights</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Because submissions are anonymous, we cannot identify which record belongs to you
              without additional context you provide. If you believe you can identify your
              submission and wish to correct or delete it, reach out to us and we will do our best
              to accommodate your request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">8. Contact</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              For any privacy-related questions, please open an issue or contact us via the
              website.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
