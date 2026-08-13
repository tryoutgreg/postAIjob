import { Report } from './types';
import { classifySeniority, SeniorityLevel } from '@/lib/normalize';

interface Props {
  reports: Report[];
}

const BAR_COLORS: Record<SeniorityLevel, string> = {
  'Senior': 'bg-indigo-500',
  'Mid': 'bg-emerald-500',
  'Junior / Entry': 'bg-amber-500',
  'Unknown': 'bg-gray-400',
};

export default function SeniorityChart({ reports }: Props) {
  const counts: Partial<Record<SeniorityLevel, number>> = {};
  let knownCount = 0;

  reports.forEach((r) => {
    const level = classifySeniority(r.job_title);
    if (level === 'Unknown') return;
    counts[level] = (counts[level] || 0) + 1;
    knownCount++;
  });

  const sorted = (Object.entries(counts) as [SeniorityLevel, number][]).sort(
    ([, a], [, b]) => b - a,
  );
  if (knownCount === 0) return null;

  const maxCount = sorted[0][1];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
            Seniority level
          </h3>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {knownCount} of {reports.length} classified
        </span>
      </div>
      <div className="p-5 md:p-6">
        <div className="space-y-3">
          {sorted.map(([level, count]) => {
            const pctShare = Math.round((count / maxCount) * 100);
            return (
              <div key={level} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">
                  {level}
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[level]}`}
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
  );
}
