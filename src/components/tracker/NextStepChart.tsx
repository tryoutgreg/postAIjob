import { useState } from 'react';
import { Report } from './types';
import { normalizeNextStep, nextStepLabel, NormalizedNextStep } from '@/lib/normalize';
import { trackEvent } from '@/lib/analytics';

const PAGE_SIZE = 8;

interface Props {
  reports: Report[];
}

const BAR_COLORS: Record<NormalizedNextStep, string> = {
  still_searching: 'bg-amber-500',
  new_job_same_field: 'bg-emerald-500',
  pivoted_industry: 'bg-blue-500',
  reskilling: 'bg-violet-500',
  freelance: 'bg-cyan-500',
  started_business: 'bg-rose-500',
  unknown: 'bg-gray-400',
};

const PILL_STYLES: Partial<Record<NormalizedNextStep, { bg: string; text: string; label: string }>> = {
  freelance: { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-600 dark:text-cyan-400', label: 'Freelance' },
  reskilling: { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-600 dark:text-violet-400', label: 'Reskilling' },
  pivoted_industry: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', label: 'Pivot' },
  new_job_same_field: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'New job' },
  started_business: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-600 dark:text-rose-400', label: 'Business' },
  still_searching: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', label: 'Searching' },
};


export default function NextStepChart({ reports }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const counts: Partial<Record<NormalizedNextStep, number>> = {};
  let knownCount = 0;

  reports.forEach((r) => {
    const step = normalizeNextStep(r.next_step);
    if (step === 'unknown') return;
    counts[step] = (counts[step] || 0) + 1;
    knownCount++;
  });

  const sorted = (Object.entries(counts) as [NormalizedNextStep, number][]).sort(
    ([, a], [, b]) => b - a,
  );
  if (!sorted.length) return null;

  const maxCount = sorted[0][1];

  // Collect career transitions: previous role → new direction
  const transitions = reports
    .filter((r) => r.next_step_detail?.trim() && r.job_title && r.job_title !== 'Unknown')
    .map((r) => ({
      from: r.job_title,
      to: r.next_step_detail!.trim(),
      step: normalizeNextStep(r.next_step),
    }));

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
            What people did next
          </h3>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {knownCount} of {reports.length} reported
        </span>
      </div>
      <div className="p-5 md:p-6">
        <div className="space-y-3">
          {sorted.map(([step, count]) => {
            const pctShare = Math.round((count / maxCount) * 100);
            return (
              <div key={step} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-44 shrink-0 truncate">
                  {nextStepLabel(step)}
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[step]}`}
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

        {transitions.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                  Career transitions
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {transitions.length} stories
              </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {transitions.slice(0, visibleCount).map((t, i) => {
                const pill = PILL_STYLES[t.step];
                return (
                  <div key={i} className={`text-sm py-3 ${i === 0 ? 'pt-0' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-700 dark:text-gray-300">{t.from}</span>
                      <span className="text-gray-400 dark:text-gray-500 shrink-0 hidden sm:inline">→</span>
                      <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">{t.to}</span>
                      {pill && (
                        <span className={`${pill.bg} ${pill.text} text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ml-auto`}>
                          {pill.label}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 sm:hidden">{t.to}</p>
                  </div>
                );
              })}
            </div>
            {transitions.length > visibleCount && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => { trackEvent('show_more_transitions', { event_category: 'engagement' }); setVisibleCount((c) => c + PAGE_SIZE); }}
                  className="px-12 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Show more ({transitions.length - visibleCount})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
