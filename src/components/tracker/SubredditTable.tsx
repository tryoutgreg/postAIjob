interface SubredditRow {
  name: string;
  count: number;
  topIndustry: string;
}

interface Props {
  data: SubredditRow[];
  selectedSubreddit: string | null;
  onSelect: (sub: string) => void;
}

export default function SubredditTable({ data, selectedSubreddit, onSelect }: Props) {
  if (!data.length) return null;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white shadow-xl shadow-indigo-500/5 overflow-hidden dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900">
      <div className="px-5 py-4 border-b border-indigo-100/60 dark:border-indigo-900/40 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Breakdown by subreddit
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Click a row to filter reports below
          </p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-indigo-100/50 dark:border-indigo-900/30">
            <th className="px-5 py-3 text-left text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
              Subreddit
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
              Reports
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
              Top industry
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.name}
              onClick={() => onSelect(row.name)}
              className={`cursor-pointer border-b border-indigo-100/30 dark:border-indigo-900/20 last:border-0 transition-colors ${
                selectedSubreddit === row.name
                  ? 'bg-indigo-100/60 dark:bg-indigo-900/30'
                  : 'hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30'
              }`}
            >
              <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                r/{row.name}
              </td>
              <td className="px-5 py-3 text-right text-gray-700 dark:text-gray-300">
                {row.count}
              </td>
              <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{row.topIndustry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
