'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  data: [string, number][];
  total: number;
}

const BLUE_PALETTE = [
  '#465FFF', '#6B7FFF', '#8B9FFF', '#ABBFFF',
  '#3347CC', '#5A6FE6', '#7A8FFF', '#9AAFFF',
  '#2233AA', '#4455DD',
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
    colors: BLUE_PALETTE,
    labels,
    legend: {
      position: 'bottom',
      fontSize: '11px',
      labels: { colors: '#6B7280' },
      markers: { size: 6 },
      itemMargin: { horizontal: 4, vertical: 3 },
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
