'use client';

import { useState } from 'react';

type Result =
  | { status: 'exists'; report: { company: string; industry: string; layoff_date: string; job_title: string } }
  | { status: 'queued' }
  | { status: 'pending'; submitted_at: string; queue_status: string }
  | { status: 'error'; message: string }
  | null;

export default function RedditUrlChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function handleCheck() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ status: 'error', message: data.error ?? 'Something went wrong.' });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ status: 'error', message: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/40 mb-5">
        <svg className="w-9 h-9 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0C4.478 0 0 4.478 0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm6.29 8.998a1.25 1.25 0 0 1-.005 1.995c.003.067.005.134.005.2 0 2.484-2.894 4.5-6.463 4.5-3.568 0-6.462-2.016-6.462-4.5 0-.066.002-.133.005-.2a1.25 1.25 0 1 1 1.458-1.985 6.27 6.27 0 0 1 3.396-.978l.577-2.717-1.87.392a1.25 1.25 0 1 1-.266-.937l2.138-.448a.5.5 0 0 1 .592.375l.67 3.147a6.282 6.282 0 0 1 3.4.976 1.25 1.25 0 1 1 1.825 1.18zM7.5 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-2.5 2.25c.966 0 1.75-.448 1.75-.5s-.784-.5-1.75-.5-1.75.448-1.75.5.784.5 1.75.5z"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Did we miss a post?
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Spotted something on Reddit that belongs in our tracker? Drop the link — we'll check if we already have it or queue it for review.
      </p>
      <div className="flex gap-2 max-w-lg mx-auto">
        <div className="w-full space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResult(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="https://reddit.com/r/Layoffs/comments/..."
              className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleCheck}
              disabled={loading || !url.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors shrink-0 shadow-sm"
            >
              {loading ? '…' : 'Check'}
            </button>
          </div>

          {result && (
            <div className="text-left">
              {result.status === 'exists' && (
                <div className="rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-4 py-3">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-0.5">
                    ✓ Already in our database
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {result.report.company} · {result.report.industry} · {result.report.job_title} · {result.report.layoff_date}
                  </p>
                </div>
              )}

              {result.status === 'queued' && (
                <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-3">
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-0.5">
                    Added to review queue
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    We'll analyze this post and add it if it qualifies. Thank you!
                  </p>
                </div>
              )}

              {result.status === 'pending' && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                    Already in review queue
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Submitted earlier, waiting to be processed.
                  </p>
                </div>
              )}

              {result.status === 'error' && (
                <p className="text-xs text-red-500 dark:text-red-400 px-1">{result.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
