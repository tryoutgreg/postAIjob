'use client';

import Link from 'next/link';
import ReportForm from '@/components/tracker/ReportForm';
import PublicHeader from '@/components/tracker/PublicHeader';

export default function ZgloszenieePage() {
  return (
    <>
      <PublicHeader />

      <div className="max-w-2xl mx-auto px-4 py-10 md:px-6">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← Wróć na stronę główną
          </Link>
          <h1 className="font-bold text-gray-800 dark:text-white/90 text-title-sm mt-4">
            Zgłoś przypadek
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Anonimowe. Bez rejestracji. Zgłoszenie trafia do trackera automatycznie.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 md:p-8">
          <ReportForm />
        </div>
      </div>
    </>
  );
}
