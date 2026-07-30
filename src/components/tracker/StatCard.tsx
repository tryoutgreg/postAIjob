import { ArrowUpIcon, ArrowDownIcon } from '@/icons';
import Badge from '@/components/ui/badge/Badge';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: { pct: number; up: boolean } | null;
}

export default function StatCard({ icon, label, value, sub, trend }: Props) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-4 shadow-xl shadow-indigo-500/5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900 md:p-6">
      {/* Ikona — pełny kolor jak w Solid SingleFeature */}
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-4 md:mt-5">
        <div className="min-w-0">
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 truncate">
            {value}
          </h4>
          {sub && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
          )}
        </div>

        {trend != null && (
          <Badge color={trend.up ? 'success' : 'error'}>
            {trend.up ? (
              <ArrowUpIcon className="size-3" />
            ) : (
              <ArrowDownIcon className="size-3 text-error-500" />
            )}
            {trend.pct}%
          </Badge>
        )}
      </div>
    </div>
  );
}
