'use client';

import Link from 'next/link';
import type { SubredditStats } from '@/lib/subreddit-stats';
import PublicHeader from '@/components/tracker/PublicHeader';
import Footer from '@/components/tracker/Footer';
import ChartCard from '@/components/tracker/ChartCard';

interface Props {
  stats: SubredditStats;
}

export default function SubredditStatsPage({ stats }: Props) {
  const maxIndustry = stats.industries[0]?.count ?? 1;
  const maxCountry = stats.countries[0]?.count ?? 1;

  return (
    <>
      <PublicHeader cta={{ label: 'Full tracker', href: '/tracker' }} />

      <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/tracker"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to tracker
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544A8.127 8.127 0 0 1 5.5 16.898a5.778 5.778 0 0 0 4.252-1.189 2.879 2.879 0 0 1-2.684-1.995 2.88 2.88 0 0 0 1.3-.049c-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359A2.877 2.877 0 0 1 6.474 5.33a8.168 8.168 0 0 0 5.929 3.005 2.876 2.876 0 0 1 4.895-2.621 5.743 5.743 0 0 0 1.824-.697 2.888 2.888 0 0 1-1.264 1.59 5.733 5.733 0 0 0 1.65-.453 5.845 5.845 0 0 1-1.442 1.491z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                Subreddit stats
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                r/{stats.subreddit}
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            AI layoff reports sourced from r/{stats.subreddit}. Updated hourly.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Reports" value={String(stats.totalReports)} />
          <KpiCard label="People affected" value={stats.totalPeople.toLocaleString('en-US')} />
          <KpiCard label="Top industry" value={stats.topIndustry} small />
          <KpiCard label="Top AI tool" value={stats.topTool} small />
        </div>

        {/* Trend chart */}
        {stats.trend.length > 0 && (
          <div>
            <SectionHeading title="Layoff trend" subtitle="Reports per month from this subreddit" />
            <ChartCard data={stats.trend} />
          </div>
        )}

        {/* Industries */}
        {stats.industries.length > 0 && (
          <div>
            <SectionHeading title="Industries" subtitle="Which sectors are most affected" />
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 md:p-6 space-y-3">
              {stats.industries.map((ind) => (
                <BarRow key={ind.name} label={ind.name} count={ind.count} max={maxIndustry} />
              ))}
            </div>
          </div>
        )}

        {/* AI Tools */}
        {stats.tools.length > 0 && (
          <div>
            <SectionHeading title="AI tools mentioned" subtitle="Tools that replaced workers" />
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 md:p-6">
              <div className="flex flex-wrap gap-2">
                {stats.tools.map((tool) => (
                  <span
                    key={tool.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                  >
                    {tool.name}
                    <span className="text-xs font-semibold text-indigo-400 dark:text-indigo-500">
                      x{tool.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Countries */}
        {stats.countries.length > 0 && (
          <div>
            <SectionHeading title="Countries" subtitle="Geographic distribution" />
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 md:p-6 space-y-3">
              {stats.countries.map((c) => (
                <BarRow key={c.name} label={c.name} count={c.count} max={maxCountry} />
              ))}
            </div>
          </div>
        )}

        {/* Quotes */}
        {stats.recentQuotes.length > 0 && (
          <div>
            <SectionHeading title="What people said" subtitle="Anonymized quotes from reports" />
            <div className="space-y-3">
              {stats.recentQuotes.map((quote, i) => (
                <blockquote
                  key={i}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-5 py-4 border-l-4 border-l-indigo-400 dark:border-l-indigo-600"
                >
                  <p className="text-sm italic text-gray-700 dark:text-gray-300 leading-relaxed">
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl bg-indigo-950 p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Were you laid off from a role discussed on r/{stats.subreddit}?
          </h2>
          <p className="text-sm text-indigo-300 mb-6">
            Your anonymous report helps build a public record of AI-driven layoffs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/zgloszenie"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold text-sm hover:bg-indigo-50 transition-colors"
            >
              Report your case
            </Link>
            <Link
              href="/tracker"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Browse all data
            </Link>
          </div>
        </div>

        <div className="text-center pb-4">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

function KpiCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-5 shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900">
      <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`font-bold text-gray-900 dark:text-white ${small ? 'text-lg leading-snug' : 'text-3xl'}`}>
        {value}
      </p>
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
      <div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">{title}</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right shrink-0">{count}</span>
    </div>
  );
}
