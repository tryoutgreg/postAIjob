'use client';

import { useEffect, useState, useCallback } from 'react';
import PublicHeader from '@/components/tracker/PublicHeader';
import Footer from '@/components/tracker/Footer';

type PendingUrl = {
  id: string;
  url: string;
  submitted_at: string;
  status: 'pending' | 'processing' | 'done' | 'skipped';
};

const STATUS_FILTER_OPTIONS = ['pending', 'processing', 'done', 'skipped'] as const;

export default function PendingPage() {
  const [urls, setUrls] = useState<PendingUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'processing' | 'done' | 'skipped'>('pending');
  const [updating, setUpdating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/pending-urls?status=${statusFilter}`);
    const data = await res.json();
    setUrls(data.urls ?? []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: PendingUrl['status']) {
    setUpdating(id);
    await fetch('/api/pending-urls', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setUpdating(null);
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const statusBadge = (s: PendingUrl['status']) => {
    const map = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
      processing: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
      done: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
      skipped: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    };
    return map[s];
  };

  return (
    <>
      <PublicHeader cta={{ label: 'Back to tracker', href: '/tracker' }} />

      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-6">
        <div>
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Reddit URLs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            URLs submitted by users that haven't been processed yet.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 w-fit">
          {STATUS_FILTER_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-sm text-gray-400">Loading…</p>
          ) : urls.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-400">No {statusFilter} URLs.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {urls.map((item) => (
                <div key={item.id} className="p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                    >
                      {item.url}
                    </a>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Submitted {new Date(item.submitted_at).toLocaleString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>

                    {/* Copy URL for MCP */}
                    <button
                      onClick={() => copyUrl(item.url)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {copied === item.url ? '✓ Copied' : 'Copy URL'}
                    </button>

                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, 'processing')}
                          disabled={updating === item.id}
                          className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors"
                        >
                          Mark processing
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, 'skipped')}
                          disabled={updating === item.id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          Skip
                        </button>
                      </>
                    )}

                    {item.status === 'processing' && (
                      <button
                        onClick={() => updateStatus(item.id, 'done')}
                        disabled={updating === item.id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white transition-colors"
                      >
                        Mark done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
