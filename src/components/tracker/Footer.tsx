import Link from 'next/link';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Full tracker', href: '/tracker' },
  { label: 'Report a case', href: '/zgloszenie' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
];

const SOURCES = [
  { label: 'layoffs.fyi', href: 'https://layoffs.fyi' },
  { label: 'r/cscareerquestions', href: 'https://www.reddit.com/r/cscareerquestions' },
  { label: 'r/healthcareworkers', href: 'https://www.reddit.com/r/healthcareworkers' },
  { label: 'r/QualityAssurance', href: 'https://www.reddit.com/r/QualityAssurance' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          <div className="sm:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                postAIjob.org
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              A public tracker of AI-driven layoffs. Anonymous submissions + data from Reddit.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
              Pages
            </h4>
            <ul className="space-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
              Data sources
            </h4>
            <ul className="space-y-3">
              {SOURCES.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@postaijob.org"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  contact@postaijob.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} postAIjob
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Data from{' '}
            <a
              href="https://layoffs.fyi/ai-layoffs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 dark:hover:text-gray-300 underline"
            >
              layoffs.fyi
            </a>{' '}
            used for educational purposes with attribution.
          </p>
        </div>
      </div>
    </footer>
  );
}
