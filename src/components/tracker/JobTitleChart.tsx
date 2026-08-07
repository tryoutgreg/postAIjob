interface Props {
  data: [string, number][];
}

export default function JobTitleChart({ data }: Props) {
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b[1] - a[1]).slice(0, 15);
  const maxCount = sorted[0]?.[1] ?? 1;

  return (
    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
        Specific roles affected
      </p>
      <div className="space-y-3">
        {sorted.map(([title, count]) => {
          const pctShare = Math.round((count / maxCount) * 100);
          return (
            <div key={title} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-44 shrink-0 truncate">
                {title}
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
  );
}
