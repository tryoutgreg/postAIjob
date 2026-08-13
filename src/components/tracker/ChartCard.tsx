'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  data: { month: string; count: number }[];
}

function formatMonth(ym: string) {
  const [year, month] = ym.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
}

export default function ChartCard({ data }: Props) {
  const filteredData = useMemo(() => {
    const now = new Date();
    const oneYearAgo = `${now.getFullYear() - 1}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return data.filter((d) => d.month >= oneYearAgo);
  }, [data]);

  const { currentCount, changePercent, isPositive } = useMemo(() => {
    if (filteredData.length === 0) return { currentCount: 0, changePercent: 0, isPositive: false };
    const last = filteredData[filteredData.length - 1].count;
    const prior = filteredData.slice(-4, -1);
    const avg = prior.length ? prior.reduce((s, d) => s + d.count, 0) / prior.length : 0;
    const pct = avg > 0 ? Math.round(((last - avg) / avg) * 100) : 0;
    return { currentCount: last, changePercent: Math.abs(pct), isPositive: pct >= 0 };
  }, [data]);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'area',
      height: 240,
      toolbar: { show: false },
      zoom: { enabled: false },
      selection: { enabled: false },
      animations: { enabled: false },
    },
    colors: ['#465FFF'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.2, opacityTo: 0 },
    },
    dataLabels: { enabled: false },
    markers: { size: 0, hover: { size: 5 } },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      borderColor: '#e5e7eb',
      padding: { left: 4, right: 4 },
    },
    xaxis: {
      categories: filteredData.map((d) => formatMonth(d.month)),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '11px', colors: '#9ca3af' } },
    },
    yaxis: {
      min: 0,
      labels: { style: { fontSize: '12px', colors: ['#9ca3af'] } },
    },
    tooltip: { enabled: true, y: { formatter: (v) => `${v} reports` } },
    legend: { show: false },
  };

  const series = [{ name: 'Reports', data: filteredData.map((d) => d.count) }];

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white shadow-xl shadow-indigo-500/5 p-5 dark:border-indigo-900 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
            Reports / month
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentCount}</p>
          {filteredData.length > 1 && (
            <p className="text-xs mt-1">
              <span
                className={
                  isPositive ? 'text-error-500 dark:text-error-400' : 'text-success-600 dark:text-success-400'
                }
              >
                {isPositive ? '▲' : '▼'} {changePercent}%
              </span>
              <span className="text-gray-400 ml-1">vs prev. 3 months</span>
            </p>
          )}
        </div>
      </div>
      <ReactApexChart options={options} series={series} type="area" height={240} />
    </div>
  );
}
