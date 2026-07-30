'use client';

import { useState } from 'react';
import { Report, NEXT_STEP_LABELS } from './types';

interface Props {
  reports: Report[];
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', {
    month: 'short', year: 'numeric',
  });
}


function StoryCard({ report }: { report: Report }) {
  const [open, setOpen] = useState(false);
  const hasQuote = !!report.free_text;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900 p-5 md:p-6 flex flex-col">

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {report.industry} · {report.country}
        </p>
        <h4 className="mt-1.5 font-bold text-gray-800 dark:text-white/90 text-base leading-snug truncate">
          {report.company}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
          {report.job_title}
        </p>
      </div>

      {/* Details row */}
      <div className="mt-4 pt-4 border-t border-indigo-100/70 dark:border-indigo-900/40 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
        <span className="text-gray-600 dark:text-gray-300 font-medium">{report.ai_tool_replaced}</span>
        <span>{monthLabel(report.layoff_date)}</span>
        <span>{NEXT_STEP_LABELS[report.next_step]}</span>
      </div>

      {/* Quote — expand on click */}
      {hasQuote && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 text-left"
        >
          {open ? (
            <p className="text-xs italic text-gray-500 dark:text-gray-400 leading-relaxed border-l-2 border-indigo-300 dark:border-indigo-700 pl-3">
              &ldquo;{report.free_text}&rdquo;
            </p>
          ) : (
            <p className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline">
              Read quote →
            </p>
          )}
        </button>
      )}

      {/* Reddit link */}
      {report.source_url && (
        <a
          href={report.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs text-gray-400 hover:text-indigo-500 transition-colors"
        >
          r/{report.subreddit}
        </a>
      )}
    </div>
  );
}

const INITIAL = 3;
const PAGE = 6;

export default function StoriesCard({ reports }: Props) {
  const [visible, setVisible] = useState(INITIAL);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
          Recent cases
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Real people. Real jobs lost.
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {reports.length} documented cases from Reddit and direct submissions.
        </p>
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No cases match the current filter.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {reports.slice(0, visible).map((r) => (
              <StoryCard key={r.id} report={r} />
            ))}
          </div>

          {visible < reports.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE)}
              className="mt-5 w-full py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
            >
              Show more ({reports.length - visible} remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}
