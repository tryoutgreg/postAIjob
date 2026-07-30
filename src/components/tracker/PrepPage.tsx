'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Report, NEXT_STEP_LABELS } from './types';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

const RISK_ROLES: Record<string, { level: 'high' | 'medium' | 'low'; note: string }> = {
  'Content Writer / Copywriter': { level: 'high', note: 'Most replaced role in our data. AI writing tools are the #1 reason.' },
  'Graphic Designer': { level: 'high', note: 'AI image generation (Midjourney, DALL-E) is actively displacing design roles.' },
  'Software Engineer': { level: 'medium', note: 'AI coding assistants augment but also reduce team sizes.' },
  'Product Designer / UX': { level: 'medium', note: 'AI prototyping tools are shrinking UX teams.' },
  'Marketing': { level: 'medium', note: 'AI automates campaign creation, analytics, and content.' },
  'Finance / Accounting': { level: 'medium', note: 'AI automation replacing routine financial operations.' },
  'Backend Engineer': { level: 'medium', note: 'AI agents and code generation reducing backend team sizes.' },
  'Operations': { level: 'medium', note: 'Process automation and AI agents replacing ops roles.' },
  'QA / Test Engineer': { level: 'high', note: 'AI-powered testing tools are rapidly replacing manual QA.' },
  'Translator': { level: 'high', note: 'Machine translation has decimated the translation industry.' },
  'Data Entry / Admin': { level: 'high', note: 'Among the first roles fully automated by AI.' },
  'Management': { level: 'low', note: 'Strategic roles are less affected, but middle management is shrinking.' },
};

const WARNING_SIGNS = [
  {
    icon: '📊',
    title: 'AI adoption metrics appear in your reviews',
    detail: 'Meta used an internal tool called Checkpoint to track employee AI usage — those who scored low were laid off first.',
    source: 'Meta layoffs, 2026',
  },
  {
    icon: '🤖',
    title: 'You\'re asked to "train" an AI system',
    detail: 'A big bank employee was told to train GPTs before being let go. If you\'re documenting your workflows for AI, you may be training your replacement.',
    source: 'Big Bank layoff, 2026',
  },
  {
    icon: '📢',
    title: '"AI-first" language in company communications',
    detail: 'When leadership starts calling the company "AI-first" or announces "AI-driven restructuring," layoffs typically follow within 3-6 months.',
    source: 'Multiple reports',
  },
  {
    icon: '📉',
    title: 'Your team is shrinking but output expectations stay',
    detail: 'Companies replace departed colleagues with AI tools instead of hiring. If headcount drops but workload doesn\'t, AI is filling the gap.',
    source: 'Software company, 60 people cut',
  },
  {
    icon: '🔄',
    title: 'New AI tools appear in your workflow without asking',
    detail: 'When IT rolls out AI assistants for your exact job function, it\'s a pilot. If it works, the next step is reducing headcount.',
    source: 'Multiple reports',
  },
  {
    icon: '💰',
    title: 'Company invests heavily in AI while cutting costs elsewhere',
    detail: '"4k layoffs in NYC office for AI Innovation funding" — your salary budget may be redirected to AI infrastructure.',
    source: 'Big Bank, 2026',
  },
];

const ACTION_ITEMS = [
  {
    category: 'Financial',
    items: [
      { title: 'Build 6-month emergency fund', detail: 'Our data shows many people are "still searching" months later. Severance is not guaranteed.' },
      { title: 'Understand your severance rights', detail: 'Check your contract and local WARN Act requirements. Companies with 100+ employees must give 60-day notice in the US.' },
      { title: 'Don\'t rely on severance alone', detail: 'In our reports, severance ranged from nothing to a few months. Plan as if you\'ll get zero.' },
    ],
  },
  {
    category: 'Career',
    items: [
      { title: 'Learn the AI tools in your field', detail: 'The people who survive aren\'t those who ignore AI — they\'re the ones who become the AI expert on the team.' },
      { title: 'Document your achievements outside company systems', detail: 'Your performance reviews, projects, and metrics live on company servers. Export what you can, keep a personal record.' },
      { title: 'Build a public portfolio or presence', detail: 'GitHub, writing, speaking, LinkedIn content. When the day comes, you need proof of your work that isn\'t behind a corporate login.' },
    ],
  },
  {
    category: 'Network',
    items: [
      { title: 'Network before you need to', detail: 'The worst time to start networking is when you\'re already laid off. Build connections now.' },
      { title: 'Join communities in your field', detail: 'Reddit, Discord, Slack groups. People in our tracker found new opportunities through community connections.' },
      { title: 'Talk to recruiters proactively', detail: 'Have conversations with recruiters even when you\'re not looking. Know your market value.' },
    ],
  },
  {
    category: 'Skills',
    items: [
      { title: 'Learn to work WITH AI, not against it', detail: 'Prompt engineering, AI workflow design, human-AI collaboration. These are the meta-skills that make you irreplaceable.' },
      { title: 'Develop skills AI can\'t replicate', detail: 'Client relationships, strategic thinking, physical presence, regulatory expertise, creative direction.' },
      { title: 'Consider adjacent roles', detail: 'AI trainers, AI ethicists, prompt engineers, AI product managers — new roles are emerging.' },
    ],
  },
];

const RISK_COLORS = {
  high: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400',
  medium: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400',
  low: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400',
};

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
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 5);
  }, [reports]);


  return (
    <>
      <PublicHeader cta={{ label: 'Full tracker', href: '/tracker' }} />

      <div className="max-w-3xl mx-auto px-4 py-12 md:px-6 space-y-12">
        {/* Hero */}
        <div className="text-center">
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Practical guide
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Prep for being replaced by AI
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Based on {reports.length || '40+'} real cases we&apos;ve documented. Not theory — patterns from people who already went through it.
          </p>
        </div>

        {/* 1. Am I at risk? */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold">1</span>
            Am I at risk?
          </h2>
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 md:p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 mb-4">
              <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              AI Job Risk Assessment
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              We&apos;re building a personalized risk assessment tool based on our database of real AI layoff cases. Enter your role, industry, and tools you use — and we&apos;ll tell you how exposed you are.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Coming soon
            </span>
          </div>
        </section>

        {/* 2. Warning signs */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold">2</span>
            Warning signs from real cases
          </h2>
          <div className="space-y-3">
            {WARNING_SIGNS.map((sign) => (
              <div key={sign.title} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{sign.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{sign.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sign.detail}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 italic">Source: {sign.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Action plan */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold">3</span>
            Action plan
          </h2>
          <div className="space-y-6">
            {ACTION_ITEMS.map((group) => (
              <div key={group.category} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
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
        </section>

        {/* 4. What people did next */}
        {nextStepData.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold">4</span>
              What people did next
            </h2>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 md:p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Based on {reports.length} documented cases:
              </p>
              <div className="space-y-3">
                {nextStepData.map(({ step, label, count, pct }) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40 shrink-0 truncate">
                      {label}
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
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
          </section>
        )}

        {/* CTA */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Know someone who was replaced by AI? Their story helps others prepare.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/zgloszenie"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Report a case
            </Link>
            <Link
              href="/tracker"
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold transition-colors"
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
