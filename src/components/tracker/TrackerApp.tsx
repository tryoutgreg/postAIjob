'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { normalizeIndustry, classifyRole } from '@/lib/normalize';
import { Report } from './types';
import KpiCards from './KpiCards';
import SourceFilter from './SourceFilter';
import SubredditTable from './SubredditTable';
import ChartCard from './ChartCard';
import StoriesCard from './StoriesCard';
import ScaleTab from './ScaleTab';
import RoleChart from './RoleChart';

import NextStepChart from './NextStepChart';
import RedditUrlChecker from './RedditUrlChecker';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

export default function TrackerApp() {
  const [sourceFilter, setSourceFilter] = useState<'all' | 'reddit' | 'form'>('all');
  const [selectedSubreddit, setSelectedSubreddit] = useState<string | null>(null);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAllReports((data as Report[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filteredReports = useMemo(() => {
    let reports = allReports;
    if (sourceFilter !== 'all') {
      reports = reports.filter((r) => r.source === sourceFilter);
    }
    if (selectedSubreddit) {
      reports = reports.filter((r) => r.subreddit === selectedSubreddit);
    }
    return reports;
  }, [allReports, sourceFilter, selectedSubreddit]);

  const handleSourceChange = (source: 'all' | 'reddit' | 'form') => {
    setSourceFilter(source);
    setSelectedSubreddit(null);
  };

  const trendData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredReports.forEach((r) => {
      counts[r.layoff_date] = (counts[r.layoff_date] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [filteredReports]);

  const roleData = useMemo(() => {
    const result: Record<string, { total: number; subs: Record<string, number> }> = {};
    filteredReports.forEach((r) => {
      const raw = r.job_title || '';
      if (!raw) return;
      const { category, subcategory } = classifyRole(raw);
      if (!result[category]) result[category] = { total: 0, subs: {} };
      result[category].total++;
      result[category].subs[subcategory] = (result[category].subs[subcategory] || 0) + 1;
    });
    return result;
  }, [filteredReports]);

  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredReports.forEach((r) => {
      const ind = normalizeIndustry(r.industry);
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([industry, count]) => ({ industry, count }));
  }, [filteredReports]);

  const subredditData = useMemo(() => {
    if (sourceFilter !== 'reddit') return [];
    const data: Record<string, { count: number; industries: Record<string, number> }> = {};
    filteredReports.forEach((r) => {
      if (!r.subreddit) return;
      if (!data[r.subreddit]) data[r.subreddit] = { count: 0, industries: {} };
      data[r.subreddit].count++;
      const ind = normalizeIndustry(r.industry);
      data[r.subreddit].industries[ind] =
        (data[r.subreddit].industries[ind] || 0) + 1;
    });
    return Object.entries(data)
      .map(([name, { count, industries }]) => ({
        name,
        count,
        topIndustry:
          Object.entries(industries).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—',
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredReports, sourceFilter]);

  if (loading) {
    return (
      <>
        <PublicHeader cta={{ label: 'Report a case', href: '/zgloszenie' }} />
        <div className="max-w-5xl mx-auto px-4 py-24 text-center">
          <p className="text-sm text-gray-400">Loading data…</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicHeader cta={{ label: 'Report a case', href: '/zgloszenie' }} />

      <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 space-y-6 md:space-y-8">
        {/* Page title */}
        <div>
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Live data
          </p>
          <h1 className="font-bold text-gray-900 dark:text-white text-2xl md:text-3xl">
            AI Layoff Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data from Reddit and direct submissions. Grouped by actual layoff date.
          </p>
        </div>

        {/* Source Filter */}
        {/* <SourceFilter value={sourceFilter} onChange={handleSourceChange} /> */}

        {/* KPI Cards */}
        <KpiCards reports={filteredReports} />

        {/* Trend Chart */}
        <ChartCard data={trendData} />

        {/* Breakdown by role */}
        {Object.keys(roleData).length > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                  Most reported roles
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">based on {filteredReports.length} reports</span>
            </div>
            <div className="p-5 md:p-6">
              <RoleChart data={roleData} total={filteredReports.length} />
            </div>
          </div>
        )}

        {/* Subreddit breakdown */}
        {/* <SubredditTable
            data={subredditData}
            selectedSubreddit={selectedSubreddit}
            onSelect={(sub) => setSelectedSubreddit((prev) => (prev === sub ? null : sub))}
          /> */}

        {/* Breakdown by industry — hidden until industry data is cleaned up (currently reflects role/dept, not company industry) */}

        {/* What people did next */}
        <NextStepChart reports={filteredReports} />

        {/* Reddit URL checker */}
        <RedditUrlChecker />

        {/* Scale / market context */}
        <ScaleTab reports={filteredReports} />

        {/* Stories */}
        <StoriesCard reports={filteredReports} />

        {/* Back to home */}
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
