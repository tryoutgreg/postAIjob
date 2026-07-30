'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  data: [string, number][];
  total: number;
}

const VIOLET_PALETTE = [
  '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
  '#6D28D9', '#9333EA', '#A855F7', '#C084FC',
  '#5B21B6', '#7E22CE',
];

export default function RoleChart({ data, total }: Props) {
  if (!data.length) return null;

  const top = data.slice(0, 10);
  const labels = top.map(([role]) => role);
  const series = top.map(([, count]) => count);
  const withRole = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
    },
    colors: VIOLET_PALETTE,
    labels,
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: { colors: '#6B7280' },
      markers: { size: 8 },
      itemMargin: { horizontal: 6, vertical: 4 },
    },
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
    </div>
  );
}
