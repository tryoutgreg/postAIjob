'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Report, NEXT_STEP_LABELS } from './types';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

const WARNING_SIGNS = [
  {
    title: 'AI adoption metrics appear in your reviews',
    detail: 'Meta used an internal tool called Checkpoint to track employee AI usage — those who scored low were laid off first.',
    source: 'Meta layoffs, 2026',
  },
  {
    title: 'You\'re asked to "train" an AI system',
    detail: 'A big bank employee was told to train GPTs before being let go. If you\'re documenting your workflows for AI, you may be training your replacement.',
    source: 'Big Bank layoff, 2026',
  },
  {
    title: '"AI-first" language in company communications',
    detail: 'When leadership starts calling the company "AI-first" or announces "AI-driven restructuring," layoffs typically follow within 3-6 months.',
    source: 'Multiple reports',
  },
  {
    title: 'Your team is shrinking but output expectations stay',
    detail: 'Companies replace departed colleagues with AI tools instead of hiring. If headcount drops but workload doesn\'t, AI is filling the gap.',
    source: 'Software company, 60 people cut',
  },
  {
    title: 'New AI tools appear in your workflow without asking',
    detail: 'When IT rolls out AI assistants for your exact job function, it\'s a pilot. If it works, the next step is reducing headcount.',
    source: 'Multiple reports',
  },
  {
    title: 'Company invests heavily in AI while cutting costs elsewhere',
    detail: '"4k layoffs in NYC office for AI Innovation funding" — your salary budget may be redirected to AI infrastructure.',
    source: 'Big Bank, 2026',
  },
];

const ACTION_ITEMS = [
  {
    category: 'Financial',
    color: 'bg-emerald-400',
    items: [
      { title: 'Build 6-month emergency fund', detail: 'Our data shows many people are "still searching" months later. Severance is not guaranteed.' },
      { title: 'Understand your severance rights', detail: 'Check your contract and local WARN Act requirements. Companies with 100+ employees must give 60-day notice in the US.' },
      { title: 'Don\'t rely on severance alone', detail: 'In our reports, severance ranged from nothing to a few months. Plan as if you\'ll get zero.' },
    ],
  },
  {
    category: 'Career',
    color: 'bg-indigo-400',
    items: [
      { title: 'Learn the AI tools in your field', detail: 'The people who survive aren\'t those who ignore AI — they\'re the ones who become the AI expert on the team.' },
      { title: 'Document your achievements outside company systems', detail: 'Your performance reviews, projects, and metrics live on company servers. Export what you can, keep a personal record.' },
      { title: 'Build a public portfolio or presence', detail: 'GitHub, writing, speaking, LinkedIn content. When the day comes, you need proof of your work that isn\'t behind a corporate login.' },
    ],
  },
  {
    category: 'Network',
    color: 'bg-violet-400',
    items: [
      { title: 'Network before you need to', detail: 'The worst time to start networking is when you\'re already laid off. Build connections now.' },
      { title: 'Join communities in your field', detail: 'Reddit, Discord, Slack groups. People in our tracker found new opportunities through community connections.' },
      { title: 'Talk to recruiters proactively', detail: 'Have conversations with recruiters even when you\'re not looking. Know your market value.' },
    ],
  },
  {
    category: 'Skills',
    color: 'bg-amber-400',
    items: [
      { title: 'Learn to work WITH AI, not against it', detail: 'Prompt engineering, AI workflow design, human-AI collaboration. These are the meta-skills that make you irreplaceable.' },
      { title: 'Develop skills AI can\'t replicate', detail: 'Client relationships, strategic thinking, physical presence, regulatory expertise, creative direction.' },
      { title: 'Consider adjacent roles', detail: 'AI trainers, AI ethicists, prompt engineers, AI product managers — new roles are emerging.' },
    ],
  },
];

export default function PrepPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    supabase
      .from('reports')
      .select('*')
      .then(({ data }) => setReports((data as Report[]) ?? []));
  }, []);

  const nextStepData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.next_step] = (counts[r.next_step] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([step, count]) => ({
        step,
        label: NEXT_STEP_LABELS[step as keyof typeof NEXT_STEP_LABELS] || step,
        count,
        pct: Math.round((count / reports.length) * 100),
      }));
  }, [reports]);

  const topTools = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      if (r.ai_tool_replaced) counts[r.ai_tool_replaced] = (counts[r.ai_tool_replaced] || 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 6);
  }, [reports]);

  return (
    <>
      <PublicHeader cta={{ label: 'Full tracker', href: '/tracker' }} />

      <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 space-y-6 md:space-y-8">
        {/* Page title — same pattern as tracker */}
        <div>
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Practical guide
          </p>
          <h1 className="font-bold text-gray-900 dark:text-white text-2xl md:text-3xl">
            Prep for being replaced by AI
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Based on {reports.length || '40+'} real cases. Not theory — patterns from people who went through it.
          </p>
        </div>

        {/* Risk Assessment — coming soon */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white shadow-lg shadow-indigo-500/10 overflow-hidden dark:border-indigo-900/60 dark:from-indigo-950/40 dark:via-gray-900 dark:to-gray-900">
          <div className="px-5 py-4 border-b border-indigo-100/60 dark:border-indigo-900/40 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
              AI Job Risk Assessment
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Coming soon
            </span>
          </div>
          <div className="p-5 md:p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
              We&apos;re building a personalized risk assessment tool based on our database of real AI layoff cases. Enter your role, industry, and tools you use — and we&apos;ll tell you how exposed you are.
            </p>
            {topTools.length > 0 && (
              <div className="mt-5 pt-5 border-t border-indigo-100/50 dark:border-indigo-900/30">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  Top AI tools replacing jobs
                </p>
                <div className="flex flex-wrap gap-2">
                  {topTools.map(([tool, count]) => (
                    <span key={tool} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      {tool}
                      <span className="text-xs font-semibold text-indigo-400 dark:text-indigo-500">x{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Warning signs */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-red-400 shrink-0" />
              <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                Warning signs from real cases
              </h3>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">postAIjob data</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {WARNING_SIGNS.map((sign, i) => (
              <div key={sign.title} className="px-5 py-4 flex items-start gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{sign.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sign.detail}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Source: {sign.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action plan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
              Action plan
            </h3>
          </div>
          {ACTION_ITEMS.map((group) => (
            <div key={group.category} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <span className={`w-1 h-4 rounded-full ${group.color} shrink-0`} />
                <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">{group.category}</h3>
              </div>
              <div className="p-5 space-y-4">
                {group.items.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* What people did next */}
        {nextStepData.length > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-violet-400 shrink-0" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                  What people did next
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{reports.length} cases</span>
            </div>
            <div className="p-5 md:p-6">
              <div className="space-y-3">
                {nextStepData.map(({ step, label, count, pct }) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40 shrink-0 truncate">
                      {label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${step === 'still_searching' ? 'bg-red-400' : 'bg-indigo-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-16 text-right shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 p-6 md:p-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Know someone who was replaced by AI? Their story helps others prepare.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/zgloszenie"
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Report a case
            </Link>
            <Link
              href="/tracker"
              className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 text-sm font-semibold transition-colors"
            >
              View full tracker
            </Link>
          </div>
        </div>

        <div className="text-center pb-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
