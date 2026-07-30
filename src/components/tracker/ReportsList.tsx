'use client';

import { useState, useEffect } from 'react';
import { Report } from './types';
import ReportCard from './ReportCard';

const PAGE_SIZE = 8;

interface Props {
  reports: Report[];
}

export default function ReportsList({ reports }: Props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [reports]);

  const visible = reports.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < reports.length;

  return (
    <div>
      <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">
        Reports ({reports.length})
      </p>
      {reports.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm py-8 text-center">
          No reports match the selected filters.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-4 w-full py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
        >
          Load more ({reports.length - visible.length} remaining)
        </button>
      )}
    </div>
  );
}
