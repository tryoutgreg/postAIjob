import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use — postAIjob',
  description: 'Terms of Use for postAIjob — AI layoff tracker.',
};

export default function TermsPage() {
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
          Terms of Use
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-12">Last updated: July 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-10">

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">1. Acceptance</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              By accessing or using postAIjob (<strong>postAIjob.org</strong>), you agree to these
              Terms of Use. If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">2. Purpose</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              postAIjob is a public, non-commercial tracker of AI-driven layoffs. Its purpose is
              informational and educational — to document and analyse a significant labour market
              trend.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">3. Submitting reports</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              When you submit a layoff report you agree that:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>The information you provide is accurate to the best of your knowledge.</li>
              <li>You are not submitting information that is confidential or covered by an NDA in a way that would expose you to legal liability.</li>
              <li>You grant postAIjob a perpetual, royalty-free licence to display and aggregate your submission.</li>
              <li>Your submission is anonymous and will be made publicly visible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">4. Accuracy of data</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Data on this site comes from anonymous user submissions and publicly available
              sources. We do not verify individual reports. postAIjob makes no warranties as to
              the accuracy, completeness, or fitness for purpose of any data displayed. Do not
              rely on this data for legal or financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">5. Third-party content</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We display aggregate statistics sourced from{' '}
              <a
                href="https://layoffs.fyi/ai-layoffs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
              >
                layoffs.fyi
              </a>{' '}
              for educational purposes with attribution. We are not affiliated with layoffs.fyi
              and make no claims about the accuracy of their data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">6. Prohibited use</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              You may not use postAIjob to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Submit false, misleading, or defamatory information.</li>
              <li>Attempt to identify or de-anonymise other users.</li>
              <li>Scrape or bulk-download data for commercial resale.</li>
              <li>Interfere with or disrupt the site or its infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">7. Limitation of liability</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              postAIjob is provided &quot;as is&quot; without any warranty. To the fullest extent
              permitted by law, we are not liable for any damages arising from your use of the
              site or reliance on its content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">8. Changes</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We may update these terms at any time. Continued use of the site after changes
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">9. Contact</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              For any questions regarding these terms, please contact us via the website.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
