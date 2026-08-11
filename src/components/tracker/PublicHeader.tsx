'use client';

import Link from 'next/link';

interface Props {
  cta?: { label: string; href: string };
}

export default function PublicHeader({ cta }: Props) {
  return (
    <header className="sticky top-0 w-full bg-white/90 backdrop-blur border-b border-gray-100 z-50">
      <div className="max-w-5xl mx-auto grid grid-cols-3 items-center px-4 py-3 lg:px-6 lg:py-4">
        <Link href="/" className="font-bold text-gray-900 text-lg tracking-tight">
          postAIjob.org
        </Link>

        <Link
          href="/prep"
          className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors text-center"
        >
          <span className="sm:hidden">AI Prep</span>
          <span className="hidden sm:inline">Prep for AI replacement</span>
        </Link>

        <div className="flex justify-end">
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
