import { Report } from './types';
import StatCard from './StatCard';
import {
  ListIcon,
  GroupIcon,
  PieChartIcon,
  BoltIcon,
} from '@/icons';

interface Props {
  reports: Report[];
}

function computeTrend(reports: Report[], field: 'count' | 'people') {
  const monthly: Record<string, number> = {};
  reports.forEach((r) => {
    const val = field === 'people' ? (r.people_count ?? 1) : 1;
    monthly[r.layoff_date] = (monthly[r.layoff_date] || 0) + val;
  });
  const months = Object.keys(monthly).sort();
  if (months.length < 2) return { pct: 0, up: true };
  const curr = monthly[months[months.length - 1]];
  const prev = monthly[months[months.length - 2]];
  const pct = prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0;
  return { pct: Math.abs(pct), up: pct >= 0 };
}

export default function KpiCards({ reports }: Props) {
  const totalReports = reports.length;
  const uniqueCompanies = new Set(
    reports.map((r) => r.company).filter((c) => c && c !== 'Undisclosed')
  ).size;

  const industryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    industryCounts[r.industry] = (industryCounts[r.industry] || 0) + 1;
  });
  const topIndustryEntry = Object.entries(industryCounts).sort(([, a], [, b]) => b - a)[0];
  const topIndustry = topIndustryEntry ? topIndustryEntry[0] : '—';
  const topIndustryCount = topIndustryEntry ? topIndustryEntry[1] : 0;

  const toolCounts: Record<string, number> = {};
  reports.forEach((r) => {
    const raw = r.ai_tool_replaced || '';
    const first = raw.split(/[+,(]/)[0].trim();
    const tool = /^(AI|Internal|Unknown|AutoML|Wewnętrzny|Nieznane)/i.test(first) ? raw.trim() : first;
    if (tool) toolCounts[tool] = (toolCounts[tool] || 0) + 1;
  });
  const topToolEntry = Object.entries(toolCounts).sort(([, a], [, b]) => b - a)[0];
  const topTool = topToolEntry ? topToolEntry[0] : '—';
  const topToolCount = topToolEntry ? topToolEntry[1] : 0;

  const reportsTrend = computeTrend(reports, 'count');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      <StatCard
        icon={<ListIcon className="size-6" />}
        label="Documented cases"
        value={totalReports.toLocaleString('en-US')}
        trend={reportsTrend}
      />
      <StatCard
        icon={<GroupIcon className="size-6" />}
        label="Unique companies"
        value={uniqueCompanies.toLocaleString('en-US')}
        trend={null}
      />
      <StatCard
        icon={<PieChartIcon className="size-6" />}
        label="Top industry"
        value={topIndustry}
        sub={topIndustryCount > 0 ? `${topIndustryCount} reports` : undefined}
        trend={null}
      />
      <StatCard
        icon={<BoltIcon className="size-6" />}
        label="Top AI tool"
        value={topTool}
        sub={topToolCount > 0 ? `${topToolCount}× reported` : undefined}
        trend={null}
      />
    </div>
  );
}
