'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { trackEvent } from '@/lib/analytics';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  data: Record<string, { total: number; subs: Record<string, number> }>;
  total: number;
}

const PALETTE = [
  '#465FFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
  '#84CC16', '#A855F7', '#0EA5E9', '#D946EF', '#22D3EE',
  '#FB923C', '#E11D48', '#64748B',
];

export default function RoleChart({ data, total }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const entries = Object.entries(data).sort(([, a], [, b]) => b.total - a.total);
  if (!entries.length) return null;

  const withRole = entries.reduce((s, [, v]) => s + v.total, 0);
  const labels = entries.map(([cat]) => cat);
  const series = entries.map(([, v]) => v.total);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
    },
    colors: PALETTE.slice(0, entries.length),
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
      y: { formatter: (v) => `${v} reports` },
    },
    stroke: { width: 2, colors: ['#ffffff'] },
  };

  return (
    <div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Role reported in{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-300">{withRole}</span>
        {' '}of{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-300">{total}</span>
        {' '}reports
      </p>
      <ReactApexChart options={options} series={series} type="donut" height={320} />

      {/* Category list with expandable sub-categories */}
      <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-2">
        {entries.map(([cat, { total: catTotal, subs }], idx) => {
          const color = PALETTE[idx % PALETTE.length];
          const isExpanded = expanded === cat;
          const subEntries = Object.entries(subs).sort(([, a], [, b]) => b - a);
          const hasMultipleSubs = subEntries.length > 1;

          return (
            <div key={cat}>
              <button
                onClick={() => {
                  if (hasMultipleSubs) {
                    if (!isExpanded) trackEvent('role_chart_drilldown', { event_category: 'engagement', event_label: cat });
                    setExpanded(isExpanded ? null : cat);
                  }
                }}
                className={`w-full flex items-center gap-3 py-1.5 ${hasMultipleSubs ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 -mx-2' : 'cursor-default'}`}
              >
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 text-left">
                  {cat}
                </span>
                <span
                  className="text-xs font-bold rounded-full px-2.5 py-0.5 min-w-[2rem] text-center"
                  style={{ backgroundColor: color + '18', color }}
                >
                  {catTotal}
                </span>
                {hasMultipleSubs && (
                  <span className="text-xs text-gray-400 w-4">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="ml-6 mt-2 mb-3 space-y-2.5">
                  {subEntries.map(([sub, count]) => {
                    const pct = Math.round((count / subEntries[0][1]) * 100);
                    return (
                      <div key={sub} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-44 shrink-0 truncate">
                          {sub}
                        </span>
                        <div className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
