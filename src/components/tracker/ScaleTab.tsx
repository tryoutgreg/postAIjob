'use client';

import { useMemo, useEffect, useState } from 'react';
import { Report } from './types';
import Badge from '@/components/ui/badge/Badge';
import CountryMapTracker from './CountryMapTracker';
import { normalizeIndustry, normalizeCountry } from '@/lib/normalize';

const LAYOFFS_FYI_AI_URL = 'https://layoffs.fyi/ai-layoffs/';
const FALLBACK = {
  count: 96459,
  countLabel: '96,459',
  events: 100,
  year: 2026,
  companies: [] as { company: string; ai_emp: number }[],
};

type WeeklyDelta = {
  thisWeek: string;
  lastWeek: string;
  current: { emp: number; events: number };
  previous: { emp: number; events: number };
  deltaEmp: number;
  deltaEvents: number;
  pctChange: number | null;
};

type WeeklySeries = { week: string; emp: number; events: number; companies: { company: string; count: number }[] }[];

interface Props {
  reports: Report[];
}

function shortWeek(w: string) {
  // "2026-W31" → "W31"
  return w.replace(/^\d{4}-/, '');
}

export default function ScaleTab({ reports }: Props) {
  const [liveStats, setLiveStats] = useState(FALLBACK);
  const [weeklyDelta, setWeeklyDelta] = useState<WeeklyDelta | null>(null);
  const [weeklySeries, setWeeklySeries] = useState<WeeklySeries>([]);

  useEffect(() => {
    fetch('/api/layoffs-stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.employees && data.year) {
          setLiveStats({
            count: data.employees,
            countLabel: data.employees.toLocaleString('en-US'),
            events: data.events ?? 0,
            year: data.year,
            companies: data.companies ?? [],
          });
        }
        if (data.weeklyDelta) setWeeklyDelta(data.weeklyDelta);
        if (data.weeklySeries) setWeeklySeries(data.weeklySeries);
      })
      .catch(() => {});
  }, []);

  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      const ind = normalizeIndustry(r.industry);
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([industry, count]) => ({ industry, count }));
  }, [reports]);

  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      const c = normalizeCountry(r.country);
      if (c) counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
  }, [reports]);

  const aiToolData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      if (r.ai_tool_replaced) {
        counts[r.ai_tool_replaced] = (counts[r.ai_tool_replaced] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }, [reports]);

  return (
    <div className="space-y-8 mt-12">
      {/* AI layoffs in context */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white shadow-lg shadow-indigo-500/10 overflow-hidden dark:border-indigo-900/60 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900">
        <div className="px-5 py-4 border-b border-indigo-100/60 dark:border-indigo-900/40 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
            AI layoffs in context — {liveStats.year}
          </h3>
          <Badge variant="light" color="light" size="sm">postAIjob + layoffs.fyi</Badge>
        </div>
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
                Personal reports
              </p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white leading-none">
                {reports.length}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                real stories collected
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
                Industries hit
              </p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white leading-none">
                {industryData.length}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                distinct sectors
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Market total
              </p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white leading-none">
                {liveStats.countLabel}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                confirmed across {liveStats.events} events
              </p>
            </div>
          </div>
          <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 border-t border-indigo-100/50 dark:border-indigo-900/30 pt-4">
            Market data:{' '}
            <a
              href={LAYOFFS_FYI_AI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              layoffs.fyi/ai-layoffs
            </a>
            . Covers publicly confirmed AI-driven layoffs only.
          </p>
        </div>
      </div>

      {/* Weekly delta */}
      {weeklyDelta && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
              <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                Weekly pulse — AI layoffs
              </h3>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">via layoffs.fyi</span>
          </div>
          <div className="p-5 md:p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* This week */}
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  This week <span className="normal-case">({shortWeek(weeklyDelta.thisWeek)})</span>
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                  {weeklyDelta.current.emp > 0 ? weeklyDelta.current.emp.toLocaleString('en-US') : '—'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {weeklyDelta.current.events > 0
                    ? `${weeklyDelta.current.events} events`
                    : 'no data yet'}
                </p>
              </div>
              {/* Last week */}
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  Last week <span className="normal-case">({shortWeek(weeklyDelta.lastWeek)})</span>
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                  {weeklyDelta.previous.emp > 0 ? weeklyDelta.previous.emp.toLocaleString('en-US') : '—'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {weeklyDelta.previous.events} events
                </p>
              </div>
            </div>

            {/* Delta badge — only meaningful when current week has data */}
            {weeklyDelta.current.emp > 0 && weeklyDelta.pctChange !== null && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    weeklyDelta.deltaEmp > 0
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50'
                      : 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/50'
                  }`}
                >
                  {weeklyDelta.deltaEmp > 0 ? '▲' : '▼'}{' '}
                  {Math.abs(weeklyDelta.pctChange)}% vs last week
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {weeklyDelta.deltaEmp > 0 ? '+' : ''}{weeklyDelta.deltaEmp.toLocaleString('en-US')} people
                </span>
              </div>
            )}

            {/* 12-week sparkline bars */}
            {weeklySeries.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Last 12 weeks</p>
                <div className="flex items-end gap-1" style={{ height: '64px' }}>
                  {(() => {
                    const maxEmp = Math.max(...weeklySeries.map((x) => x.emp), 1);
                    return weeklySeries.map((w) => {
                      const barH = Math.max(Math.round((w.emp / maxEmp) * 60), 3);
                      const isCurrent = w.week === weeklyDelta.thisWeek;
                      return (
                        <div
                          key={w.week}
                          className="flex-1 relative group"
                          style={{ height: '64px', display: 'flex', alignItems: 'flex-end' }}
                        >
                          <div
                            className={`w-full rounded-sm cursor-default transition-opacity group-hover:opacity-100 ${
                              isCurrent
                                ? 'bg-indigo-500'
                                : 'bg-indigo-200 dark:bg-indigo-800/60 opacity-80'
                            }`}
                            style={{ height: `${barH}px` }}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 hidden group-hover:block pointer-events-none">
                            <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-lg px-3 py-2 shadow-xl text-xs w-44">
                              <p className="font-semibold text-gray-300 mb-1">{w.week}</p>
                              <p className="text-white font-bold">
                                {w.emp > 0 ? w.emp.toLocaleString('en-US') : '—'} people
                              </p>
                              <p className="text-gray-400 mb-2">{w.events} events</p>
                              {w.companies.length > 0 && (
                                <div className="border-t border-gray-700 pt-1.5 space-y-0.5">
                                  {w.companies.map((c) => (
                                    <div key={c.company} className="flex justify-between gap-2">
                                      <span className="text-gray-300 truncate">{c.company}</span>
                                      <span className="text-gray-500 shrink-0">
                                        {c.count > 0 ? c.count.toLocaleString('en-US') : '—'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 mx-auto -mt-1" />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top companies from layoffs.fyi */}
      {liveStats.companies.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
              <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                Top companies — AI layoffs {liveStats.year}
              </h3>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">via layoffs.fyi</span>
          </div>
          <div className="p-5 md:p-6">
            <div className="space-y-3">
              {liveStats.companies.map((c) => {
                const maxEmp = liveStats.companies[0]?.ai_emp ?? 1;
                const pctShare = Math.round((c.ai_emp / maxEmp) * 100);
                return (
                  <div key={c.company} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32 shrink-0 truncate">
                      {c.company}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${pctShare}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20 text-right shrink-0">
                      {c.ai_emp > 0 ? c.ai_emp.toLocaleString('en-US') : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Geographic breakdown — map */}
      {countryData.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
              Geographic breakdown
            </h3>
          </div>
          <div className="px-4 py-6 mx-5 my-5 md:mx-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <CountryMapTracker countryData={countryData} total={countryData.reduce((s, [, n]) => s + n, 0)} />
          </div>
          <div className="px-5 pb-5 md:px-6 md:pb-6">
            <div className="space-y-4">
              {countryData.map(([country, count]) => {
                const knownTotal = countryData.reduce((s, [, n]) => s + n, 0);
                const pctShare = Math.round((count / knownTotal) * 100);
                return (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90 w-16 shrink-0">
                      {country}
                    </span>
                    <div className="flex w-full max-w-[160px] items-center gap-3">
                      <div className="relative h-2 w-full max-w-[110px] rounded-full bg-gray-200 dark:bg-gray-800">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-indigo-500"
                          style={{ width: `${pctShare}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 w-14 text-right">
                        {count} ({pctShare}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Most common AI tools */}
      {aiToolData.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
              Most common AI tools
            </h3>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap gap-2">
              {aiToolData.map(([tool, count]) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                >
                  {tool}
                  <span className="text-xs font-semibold text-indigo-400 dark:text-indigo-500">
                    ×{count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
