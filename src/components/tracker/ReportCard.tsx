'use client';

import { useState } from 'react';
import { Report, NEXT_STEP_LABELS, COMPANY_SIZE_LABELS, NextStep } from './types';
import Badge from '@/components/ui/badge/Badge';

type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';

const NEXT_STEP_COLOR: Record<NextStep, BadgeColor> = {
  new_job_same_field: 'success',
  started_business: 'success',
  freelance: 'primary',
  pivoted_industry: 'info',
  reskilling: 'info',
  still_searching: 'warning',
  unknown: 'light',
};

interface Props {
  report: Report;
}

function monthLabel(layoff_date: string) {
  const [y, m] = layoff_date.split('-');
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function ReportCard({ report }: Props) {
  const [expanded, setExpanded] = useState(false);
  const showPeopleCount = (report.people_count ?? 1) > 1;
  const isReddit = report.source === 'reddit';

  return (
    <div
      className={[
        'rounded-2xl border bg-white dark:bg-white/[0.03] overflow-hidden',
        isReddit
          ? 'border-indigo-100 dark:border-indigo-900/50'
          : 'border-emerald-100 dark:border-emerald-900/40',
      ].join(' ')}
    >
      {/* Source-keyed left border — structural colour, not decoration */}
      <div
        className={[
          'border-l-4 h-full',
          isReddit
            ? 'border-l-indigo-400 dark:border-l-indigo-600'
            : 'border-l-emerald-400 dark:border-l-emerald-600',
        ].join(' ')}
      >
        <button onClick={() => setExpanded((e) => !e)} className="w-full text-left px-5 py-4 md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Linia 1: firma + badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800 dark:text-white/90">{report.company}</span>
                <Badge
                  variant="light"
                  color={isReddit ? 'primary' : 'success'}
                  size="sm"
                >
                  {isReddit ? 'Reddit' : 'Form'}
                </Badge>
                <Badge variant="light" color={NEXT_STEP_COLOR[report.next_step]} size="sm">
                  {NEXT_STEP_LABELS[report.next_step]}
                </Badge>
              </div>

              {/* Linia 2: meta */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {report.industry} · {report.job_title} ·{' '}
                <span className="text-gray-400">{report.country}</span>
                {showPeopleCount && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    · <svg className="inline h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 4v-1a4 4 0 00-3-3.87" />
                    </svg>
                    {report.people_count} people
                  </span>
                )}
              </p>

              {/* Linia 3: AI tool + data */}
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <span>
                  <span className="text-gray-400 dark:text-gray-500">AI tool:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">{report.ai_tool_replaced}</span>
                </span>
                <span>
                  <span className="text-gray-400 dark:text-gray-500">Date:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">{monthLabel(report.layoff_date)}</span>
                </span>
              </div>

              {/* Reddit link */}
              {isReddit && report.source_url && (
                <a
                  href={report.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-indigo-500 hover:underline mt-2 inline-block"
                >
                  r/{report.subreddit} → original thread
                </a>
              )}
            </div>

            {/* Chevron */}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Expanded state */}
        {expanded && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 md:px-6 space-y-3">
            {report.free_text && (
              <blockquote className="relative pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
                <p className="text-sm font-medium italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  &ldquo;{report.free_text}&rdquo;
                </p>
              </blockquote>
            )}
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Company size:{' '}
                <span className="text-gray-800 dark:text-white/90">
                  {COMPANY_SIZE_LABELS[report.company_size]}
                </span>
              </p>
              {report.severance_offered !== null && (
                <p className="text-gray-500 dark:text-gray-400">
                  Severance:{' '}
                  <span className="text-gray-800 dark:text-white/90">
                    {report.severance_offered ? 'Yes' : 'No'}
                  </span>
                </p>
              )}
              {report.next_step_detail && (
                <p className="text-gray-500 dark:text-gray-400">
                  Details:{' '}
                  <span className="text-gray-800 dark:text-white/90">{report.next_step_detail}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
