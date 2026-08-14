'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Report } from './types';
import { normalizeNextStep, NormalizedNextStep } from '@/lib/normalize';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  reports: Report[];
}

const RELEVANT_STEPS: NormalizedNextStep[] = ['pivoted_industry', 'reskilling', 'started_business', 'freelance'];

const PALETTE = [
  '#465FFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
];

function classifyDirection(detail: string): string {
  const s = detail.toLowerCase();

  if (/design|ux|ui|figma|creative/i.test(s)) return 'Design & UX';
  if (/code|coding|software|dev|programming|web dev/i.test(s)) return 'Software / Tech';
  if (/data|analytics|data sci/i.test(s)) return 'Data & Analytics';
  if (/content|seo|marketing|copywriting|strategy/i.test(s)) return 'Content & Marketing';
  if (/media|video|photo|film|production/i.test(s)) return 'Media & Production';
  if (/business|llc|entrepreneur|startup|company/i.test(s)) return 'Own Business';
  if (/teach|education|tutor|instructor/i.test(s)) return 'Education';
  if (/trade|plumb|electric|mechanic|construction|manual/i.test(s)) return 'Trades & Construction';
  if (/retail|store|service|hospitality|food/i.test(s)) return 'Retail & Hospitality';
  if (/health|nurse|medical|clinic/i.test(s)) return 'Healthcare';
  if (/consult|freelanc|contract/i.test(s)) return 'Freelance / Consulting';
  if (/financ|accounting|bank/i.test(s)) return 'Finance';

  return 'Other';
}

export default function NewDirectionsChart({ reports }: Props) {
  const counts: Record<string, number> = {};
  let total = 0;

  reports.forEach((r) => {
    const step = normalizeNextStep(r.next_step);
    if (!RELEVANT_STEPS.includes(step)) return;

    // Prefer clean dropdown data, fall back to regex on freeform text
    const direction = r.next_step_industry?.trim()
      || (r.next_step_detail?.trim() ? classifyDirection(r.next_step_detail) : null);
    if (!direction) return;

    counts[direction] = (counts[direction] || 0) + 1;
    total++;
  });

  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  if (!sorted.length) return null;

  const labels = sorted.map(([dir]) => dir);
  const series = sorted.map(([, count]) => count);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
    },
    colors: PALETTE.slice(0, sorted.length),
    labels,
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '13px',
              color: '#6B7280',
              formatter: (w) =>
                w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString(),
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 700,
              color: '#111827',
              formatter: (v) => v,
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (v) => `${v} people` },
    },
    stroke: { width: 2, colors: ['#ffffff'] },
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
            New directions
          </h3>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {total} of {reports.length} reported
        </span>
      </div>
      <div className="p-5 md:p-6">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Where people who pivoted, reskilled, or started a business are heading.
        </p>
        <ReactApexChart options={options} series={series} type="donut" height={280} />

        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {sorted.map(([dir, count], idx) => {
            const color = PALETTE[idx % PALETTE.length];
            return (
              <div key={dir} className="flex items-center gap-3 py-1.5">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                  {dir}
                </span>
                <span
                  className="text-xs font-bold rounded-full px-2.5 py-0.5 min-w-[2rem] text-center"
                  style={{ backgroundColor: color + '18', color }}
                >
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
