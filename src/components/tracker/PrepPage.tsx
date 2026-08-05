'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Report } from './types';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

export default function PrepPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    supabase
      .from('reports')
      .select('*')
      .then(({ data }) => setReports((data as Report[]) ?? []));
  }, []);

  const topTools = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      if (r.ai_tool_replaced) counts[r.ai_tool_replaced] = (counts[r.ai_tool_replaced] || 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 6);
  }, [reports]);

  return (
    <>
      <PublicHeader cta={{ label: 'Full tracker', href: '/tracker' }} />

      <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 space-y-6 md:space-y-8">
        {/* Page title — same pattern as tracker */}
        <div>
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Practical guide
          </p>
          <h1 className="font-bold text-gray-900 dark:text-white text-2xl md:text-3xl">
            Prep for being replaced by AI
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Based on {reports.length || '40+'} real cases. Not theory — patterns from people who went through it.
          </p>
        </div>

        {/* Risk Assessment — coming soon */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white shadow-lg shadow-indigo-500/10 overflow-hidden dark:border-indigo-900/60 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900">
          <div className="px-5 py-4 border-b border-indigo-100/60 dark:border-indigo-900/40 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
              AI Job Risk Assessment
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Coming soon
            </span>
          </div>
          <div className="p-5 md:p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
              We&apos;re building a personalized risk assessment tool based on our database of real AI layoff cases. Enter your role, industry, and tools you use — and we&apos;ll tell you how exposed you are.
            </p>
            {topTools.length > 0 && (
              <div className="mt-5 pt-5 border-t border-indigo-100/50 dark:border-indigo-900/30">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  Top AI tools replacing jobs
                </p>
                <div className="flex flex-wrap gap-2">
                  {topTools.map(([tool, count]) => (
                    <span key={tool} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      {tool}
                      <span className="text-xs font-semibold text-indigo-400 dark:text-indigo-500">x{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 p-6 md:p-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Know someone who was replaced by AI? Their story helps others prepare.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/zgloszenie"
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Report a case
            </Link>
            <Link
              href="/tracker"
              className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 text-sm font-semibold transition-colors"
            >
              View full tracker
            </Link>
          </div>
        </div>

        <div className="text-center pb-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
