'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { normalizeIndustry } from '@/lib/normalize';
import { Report } from './types';
import KpiCards from './KpiCards';
import SourceFilter from './SourceFilter';
import SubredditTable from './SubredditTable';
import ChartCard from './ChartCard';
import StoriesCard from './StoriesCard';
import ScaleTab from './ScaleTab';
import RoleChart from './RoleChart';
import JobTitleChart from './JobTitleChart';
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
    const counts: Record<string, number> = {};
    filteredReports.forEach((r) => {
      const raw = r.job_function || r.job_title || '';
      if (!raw) return;
      let category = 'Other';
      if (/software|engineer|dev(eloper)?|coding|programm|frontend|backend|fullstack|sre|devops|qa\b|tester/i.test(raw)) category = 'Software Engineering';
      else if (/product design|ux\b|ui\b|user experience|user interface|figma/i.test(raw)) category = 'UX / Product Design';
      else if (/product manager|product owner|\bpm\b|\bpo\b/i.test(raw)) category = 'Product Management';
      else if (/data analys|data scien|analyst|analytics|\bbi\b|business intelligence/i.test(raw)) category = 'Data & Analytics';
      else if (/content|writer|copywriter|editor|journalist|author|blogger|media/i.test(raw)) category = 'Content & Writing';
      else if (/market|seo|social media|digital market|brand|growth/i.test(raw)) category = 'Marketing';
      else if (/translat|linguist/i.test(raw)) category = 'Translation';
      else if (/graphic|creative|art director|illustrat/i.test(raw)) category = 'Graphic / Creative';
      else if (/account(?!.*exec)|financ|banking|credit|tax|audit/i.test(raw)) category = 'Finance & Accounting';
      else if (/sales|account executive|business dev/i.test(raw)) category = 'Sales';
      else if (/customer|support|helpdesk/i.test(raw)) category = 'Customer Support';
      else if (/clerical|admin|operat|office|secretary/i.test(raw)) category = 'Admin / Operations';
      else if (/legal|paralegal|attorney|lawyer/i.test(raw)) category = 'Legal';
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
  }, [filteredReports]);

  const jobTitleData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredReports.forEach((r) => {
      const title = (r.job_title || '').trim();
      if (!title || title === 'Unknown') return;
      // Normalize casing: capitalize first letter of each word
      const normalized = title.replace(/\b\w/g, (c) => c.toUpperCase());
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
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
        {roleData.length > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                  Breakdown by role
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">postAIjob reports</span>
            </div>
            <div className="p-5 md:p-6">
              <RoleChart data={roleData} total={filteredReports.length} />
              <JobTitleChart data={jobTitleData} />
            </div>
          </div>
        )}

        {/* Subreddit breakdown */}
        {/* <SubredditTable
            data={subredditData}
            selectedSubreddit={selectedSubreddit}
            onSelect={(sub) => setSelectedSubreddit((prev) => (prev === sub ? null : sub))}
          /> */}

        {/* Breakdown by industry */}
        {industryData.length > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                  Breakdown by industry
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">postAIjob reports</span>
            </div>
            <div className="p-5 md:p-6">
              <div className="space-y-3">
                {industryData.map(({ industry, count }) => {
                  const maxCount = industryData[0].count;
                  const pctShare = Math.round((count / maxCount) * 100);
                  return (
                    <div key={industry} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 md:w-44 shrink-0 truncate">
                        {industry}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${pctShare}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right shrink-0">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
