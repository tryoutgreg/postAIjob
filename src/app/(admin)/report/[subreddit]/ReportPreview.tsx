'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/tracker/PublicHeader';
import Footer from '@/components/tracker/Footer';

interface Props {
  subreddit: string;
}

export default function ReportPreview({ subreddit }: Props) {
  const [copying, setCopying] = useState(false);
  const imageUrl = `/api/weekly-report/${subreddit}`;

  const handleDownload = async () => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postAIjob-weekly-${subreddit}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const redditPost = `I analyzed AI layoff reports from r/${subreddit} — here's what the data shows

Hey r/${subreddit},

I've been tracking AI-driven layoffs reported across Reddit. Here's the latest weekly snapshot for this community.

Full interactive data with charts: postaijob.org/stats/${subreddit}

If you were laid off because of AI, you can add your case anonymously: postaijob.org/zgloszenie

The tracker is public and open. Every data point helps document what's actually happening.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(redditPost);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <>
      <PublicHeader cta={{ label: 'Full tracker', href: '/tracker' }} />

      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">
        <div>
          <Link
            href={`/stats/${subreddit}`}
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to r/{subreddit} stats
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Weekly Report — r/{subreddit}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Download the image and use the template below for your Reddit post.
          </p>
        </div>

        {/* Image preview */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-900">
          <img
            src={imageUrl}
            alt={`Weekly report for r/${subreddit}`}
            className="w-full h-auto"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
            </svg>
            Download PNG
          </button>
          <a
            href={`https://www.reddit.com/r/${subreddit}/submit`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Open r/{subreddit} submit
          </a>
        </div>

        {/* Reddit post template */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Reddit post template
            </h2>
            <button
              onClick={handleCopy}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {copying ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
          <pre className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {redditPost}
          </pre>
        </div>

        <div className="text-center pb-4">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
