import { Report, NEXT_STEP_LABELS, NextStep } from './types';

interface Props {
  reports: Report[];
}

export default function NextStepChart({ reports }: Props) {
  const counts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.next_step && r.next_step !== 'unknown') {
      const label = NEXT_STEP_LABELS[r.next_step] ?? r.next_step;
      counts[label] = (counts[label] || 0) + 1;
    }
  });

  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  if (!sorted.length) return null;

  const maxCount = sorted[0][1];
  const withStep = sorted.reduce((s, [, c]) => s + c, 0);

  // Collect career transitions: previous role → new direction
  const transitions = reports
    .filter((r) => r.next_step_detail?.trim() && r.job_title && r.job_title !== 'Unknown')
    .map((r) => ({ from: r.job_title, to: r.next_step_detail!.trim() }));

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
          {withStep} of {reports.length} reported
        </span>
      </div>
      <div className="p-5 md:p-6">
        <div className="space-y-3">
          {sorted.map(([label, count]) => {
            const pctShare = Math.round((count / maxCount) * 100);
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-44 shrink-0 truncate">
                  {label}
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

        {transitions.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              Career transitions
            </p>
            <div className="space-y-2.5">
              {transitions.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t.from}</span>
                  <span className="text-gray-400 dark:text-gray-500 shrink-0">→</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{t.to}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
