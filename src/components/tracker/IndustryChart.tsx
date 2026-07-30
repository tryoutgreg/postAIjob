'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  data: { industry: string; count: number }[];
}

export default function IndustryChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">Industries</p>
        <p className="text-gray-400 mt-4 text-sm">No data</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => a.count - b.count);
  const chartHeight = Math.max(160, sorted.length * 44);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: chartHeight,
      toolbar: { show: false },
    },
    colors: ['#465FFF'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        barHeight: '60%',
      },
    },
    dataLabels: { enabled: false },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: sorted.map((d) => d.industry),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '12px', colors: ['#667085'] } },
    },
    yaxis: {
      labels: { style: { fontSize: '12px', colors: ['#667085'] } },
    },
    tooltip: { y: { formatter: (v) => `${v} reports` } },
    legend: { show: false },
  };

  const series = [{ name: 'Reports', data: sorted.map((d) => d.count) }];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Industries</p>
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[400px]">
          <ReactApexChart options={options} series={series} type="bar" height={chartHeight} />
        </div>
      </div>
    </div>
  );
}
