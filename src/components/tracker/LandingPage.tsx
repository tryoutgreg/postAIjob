'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Report } from './types';
import ChartCard from './ChartCard';
import ReportForm from './ReportForm';
import RedditUrlChecker from './RedditUrlChecker';
import PublicHeader from './PublicHeader';
import Footer from './Footer';
import Badge from '@/components/ui/badge/Badge';
import { normalizeIndustry, normalizeCountry } from '@/lib/normalize';
import {
  ArrowRightIcon,
  ChatIcon,
  ListIcon,
  GroupIcon,
  PieChartIcon,
  BoltIcon,
} from '@/icons';

const LAYOFFS_FYI_URL = 'https://layoffs.fyi';
const LAYOFFS_FYI_FALLBACK = { count: '152 000', year: 2026 };

const PULL_QUOTE = {
  text: 'Our entire office — 40 people — got laid off within a week.',
  role: 'Medical Coder',
  country: 'USA',
  date: 'March 2025',
};

const SUBREDDITS = ['cscareerquestions', 'healthcareworkers', 'QualityAssurance', 'journalism'];

export default function LandingPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [layoffsStats, setLayoffsStats] = useState<{ count: string; year: number }>(LAYOFFS_FYI_FALLBACK);
  const [heroStats, setHeroStats] = useState<{ yearTotal: number; weekEmp: number; weekLabel: string } | null>(null);

  useEffect(() => {
    supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setReports((data as Report[]) ?? []));

    fetch('/api/layoffs-stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.employees && data.year) {
          setLayoffsStats({
            count: data.employees.toLocaleString('en-US'),
            year: data.year,
          });
        }
        // Find last week with actual data for the hero stat
        if (data.weeklySeries?.length) {
          const series: { week: string; emp: number }[] = data.weeklySeries;
          const lastWithData = [...series].reverse().find((w) => w.emp > 0);
          if (lastWithData && data.employees) {
            setHeroStats({
              yearTotal: data.employees,
              weekEmp: lastWithData.emp,
              weekLabel: lastWithData.week,
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  const trendData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.layoff_date] = (counts[r.layoff_date] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [reports]);

  const totalReports = reports.length;
  const uniqueCompanies = new Set(
    reports.map((r) => r.company).filter((c) => c && c !== 'Undisclosed')
  ).size;

  const industryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    const ind = normalizeIndustry(r.industry);
    industryCounts[ind] = (industryCounts[ind] || 0) + 1;
  });
  const topIndustry = Object.entries(industryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';

  const countryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    const c = normalizeCountry(r.country);
    if (c) countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const topCountry = Object.entries(countryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';

  return (
    <>
      <PublicHeader cta={{ label: 'Full tracker →', href: '/tracker' }} />

      <main>
        {/* ═══════════════════════════════════════════
            SEKCJA 1 — Hero
        ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900">
          {/* Wzór kropek w tle */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Rozmyta plama koloru */}
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-indigo-400/20 blur-2xl"
          />

          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              {/* Lewa kolumna */}
              <div>
<p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                  The reality, not the press release
                </p>
                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                  AI is replacing
                  <br />
                  real people.
                </h1>

                {heroStats && (
                  <div className="mt-8 flex flex-wrap items-stretch gap-x-6 gap-y-4">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                        {heroStats.yearTotal.toLocaleString('en-US')}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        AI-driven layoffs in {new Date().getFullYear()}
                      </p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch" />
                    <div>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        +{heroStats.weekEmp.toLocaleString('en-US')}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        last recorded week ({heroStats.weekLabel.replace(/^\d{4}-/, '')})
                      </p>
                    </div>
                  </div>
                )}

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  Companies call it &ldquo;restructuring.&rdquo; We track who actually lost their job, what AI tool replaced them, and what happened next.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#zglos"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
                  >
                    Report your case
                  </a>
                  <Link
                    href="/tracker"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Browse data
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Prawa kolumna: karta z danymi */}
              <div className="relative">
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-8 shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900">
                  <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Tracker data — live
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <StatItem icon={<IconDocument />} value={String(totalReports)} label="documented cases" />
                    <StatItem icon={<IconUsers />} value={String(uniqueCompanies)} label="unique companies" />
                    <StatItem icon={<IconChart />} value={topIndustry} label="top industry" />
                    <StatItem icon={<IconBoltHero />} value={topCountry} label="top country" />
                  </div>

                  <div className="mt-6 border-t border-indigo-100 pt-5 dark:border-indigo-900">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <a href={LAYOFFS_FYI_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                        layoffs.fyi
                      </a>{' '}
                      reports{' '}
                      <span className="font-semibold text-gray-900 dark:text-white">{layoffsStats.count}</span>{' '}
                      layoffs in {layoffsStats.year} across all sectors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SEKCJA 2 — Social proof
            Ciemne tło indigo-950 — wyrazisty break, cytat dominuje
        ════════════════════════════════════════════ */}
        <section className="bg-indigo-950 py-14 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

              {/* X / Twitter share CTA */}
              <div className="shrink-0 max-w-xs">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                  Were you laid off due to AI?
                </p>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Your story belongs here too. Every submission builds a publicly visible database.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="#zglos"
                    className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-indigo-50 transition-colors w-fit"
                  >
                    Share your story
                  </a>
                  <p className="text-xs text-white/30">
                    You can also submit anonymously via the form
                  </p>
                </div>
              </div>

              <div className="hidden lg:block w-px self-stretch bg-white/10 shrink-0" />

              {/* Pull quote — element sygnaturowy: duży, biały, nie do przeoczenia */}
              <blockquote className="flex-1 relative">
                <span className="block text-5xl leading-none text-indigo-500 font-serif select-none mb-3">&ldquo;</span>
                <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                  {PULL_QUOTE.text}
                </p>
                <footer className="mt-4 text-sm text-indigo-400">
                  — {PULL_QUOTE.role}, {PULL_QUOTE.country}, {PULL_QUOTE.date}
                </footer>
              </blockquote>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SEKCJA 3 — Wykres trendu
            bg-gray-50 oddziela od białych sekcji, nagłówek z etykietą
        ════════════════════════════════════════════ */}
        <section className="bg-gray-50 dark:bg-gray-900/50 py-14 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="mb-8">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
                Layoff trend
              </p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                How fast is it growing?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Reports grouped by month of actual layoff.
              </p>
            </div>
            <ChartCard data={trendData} />

            {/* layoffs.fyi dateline — wbudowany pod wykres, styl gazety danych */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-gray-900 dark:bg-gray-800 px-5 py-4">
              <p className="text-sm text-gray-300">
                <a href={LAYOFFS_FYI_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-medium">
                  layoffs.fyi
                </a>{' '}
                reports{' '}
                <span className="font-bold text-white">{layoffsStats.count}</span>{' '}
                layoffs in {layoffsStats.year} across all sectors.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SEKCJA 5 — Formularz
            Gradient indigo-700→indigo-900 — ciemne tło, biała karta, max kontrast
        ════════════════════════════════════════════ */}
        {/* ═══════════════════════════════════════════
            SEKCJA 4 — Reddit URL checker
            Lekkie tło, swobodny ton — "pominęliśmy jakiś post?"
        ════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-gray-900 py-14 md:py-16 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="max-w-xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/40 mb-5">
                <svg className="w-9 h-9 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C4.478 0 0 4.478 0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm6.29 8.998a1.25 1.25 0 0 1-.005 1.995c.003.067.005.134.005.2 0 2.484-2.894 4.5-6.463 4.5-3.568 0-6.462-2.016-6.462-4.5 0-.066.002-.133.005-.2a1.25 1.25 0 1 1 1.458-1.985 6.27 6.27 0 0 1 3.396-.978l.577-2.717-1.87.392a1.25 1.25 0 1 1-.266-.937l2.138-.448a.5.5 0 0 1 .592.375l.67 3.147a6.282 6.282 0 0 1 3.4.976 1.25 1.25 0 1 1 1.825 1.18zM7.5 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-2.5 2.25c.966 0 1.75-.448 1.75-.5s-.784-.5-1.75-.5-1.75.448-1.75.5.784.5 1.75.5z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Did we miss a post?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Spotted something on Reddit that belongs in our tracker? Drop the link — we'll check if we already have it or queue it for review.
              </p>
              <div className="flex gap-2 max-w-lg mx-auto">
                <RedditUrlCheckerInput />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SEKCJA 5 — Formularz
            Gradient indigo-700→indigo-900 — ciemne tło, biała karta, max kontrast
        ════════════════════════════════════════════ */}
        <section id="zglos" className="bg-gradient-to-br from-indigo-700 to-indigo-900 py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="max-w-lg mx-auto">
              <div className="mb-8 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white/80 mb-4">
                  Your story matters
                </span>
                <h2 className="text-3xl font-bold text-white">
                  Were you laid off because of AI?
                </h2>
                <p className="text-indigo-200 mt-2 text-sm">
                  Anonymous. No registration. Goes straight into the public tracker.
                </p>
              </div>

              <div className="rounded-2xl bg-white shadow-2xl p-6 md:p-8 dark:bg-gray-900">
                <ReportForm />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SEKCJA 6 — Trust bar / FunFact
            Solid FunFact pattern: gradient sekcji from-indigo-50 to-white
        ════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/20 dark:to-gray-900 py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                What we know so far
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Aggregated data from all submissions
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {/* Zgłoszenia */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-5 shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500 mx-auto mb-4">
                  <ListIcon className="size-6" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalReports}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">documented cases</p>
              </div>

              {/* Firmy */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-5 shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500 mx-auto mb-4">
                  <GroupIcon className="size-6" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {uniqueCompanies}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">unique companies</p>
              </div>

              {/* Top branża */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-5 shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500 mx-auto mb-4">
                  <PieChartIcon className="size-6" />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{topIndustry}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">top industry</p>
              </div>

              {/* Top kraj */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-5 shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500 mx-auto mb-4">
                  <BoltIcon className="size-6" />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{topCountry}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">top country</p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/tracker"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                View full tracker
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

// ─── Reddit URL checker — wariant jasny (sekcja na białym tle) ────────────────

type CheckerResult =
  | { status: 'exists'; report: { company: string; industry: string; layoff_date: string; job_title: string } }
  | { status: 'queued' }
  | { status: 'pending' }
  | { status: 'error'; message: string }
  | null;

function RedditUrlCheckerInput() {
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<CheckerResult>(null);

  async function handleCheck() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      setResult(res.ok ? data : { status: 'error', message: data.error ?? 'Something went wrong.' });
    } catch {
      setResult({ status: 'error', message: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setResult(null); }}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          placeholder="https://reddit.com/r/Layoffs/comments/..."
          className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleCheck}
          disabled={loading || !url.trim()}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors shrink-0 shadow-sm"
        >
          {loading ? '…' : 'Check'}
        </button>
      </div>

      {result && (
        <div className="text-left">
          {result.status === 'exists' && (
            <div className="rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-4 py-3">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-0.5">✓ Already in our database</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {result.report.company} · {result.report.industry} · {result.report.job_title} · {result.report.layoff_date}
              </p>
            </div>
          )}
          {result.status === 'queued' && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-3">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-0.5">Added to review queue</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">We'll analyze this post and add it if it qualifies. Thank you!</p>
            </div>
          )}
          {result.status === 'pending' && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-0.5">Already in review queue</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Submitted earlier, waiting to be processed.</p>
            </div>
          )}
          {result.status === 'error' && (
            <p className="text-xs text-red-500 dark:text-red-400 px-1">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Komponenty pomocnicze hero ───────────────────────────────────────────────

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
        {icon}
      </div>
      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function IconDocument() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 4v-1a4 4 0 00-3-3.87" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9 9 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );
}

function IconBoltHero() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
