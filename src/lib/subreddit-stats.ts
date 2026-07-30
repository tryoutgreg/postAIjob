import { createClient } from '@supabase/supabase-js';
import type { Report } from '@/components/tracker/types';
import { mockReports } from '@/data/mockReports';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseServer = createClient(url, key);

export interface SubredditStats {
  subreddit: string;
  totalReports: number;
  totalPeople: number;
  topIndustry: string;
  topTool: string;
  industries: { name: string; count: number }[];
  tools: { name: string; count: number }[];
  trend: { month: string; count: number }[];
  countries: { name: string; count: number }[];
  recentQuotes: string[];
}

async function getReportsForSubreddit(subreddit: string): Promise<Report[]> {
  const { data } = await supabaseServer
    .from('reports')
    .select('*')
    .eq('subreddit', subreddit)
    .order('created_at', { ascending: false });

  const reports = (data as Report[]) ?? [];
  if (reports.length > 0) return reports;

  // Fallback to mock data when Supabase has no data
  return mockReports.filter((r) => r.subreddit === subreddit);
}

export async function getSubredditStats(subreddit: string): Promise<SubredditStats | null> {
  const reports = await getReportsForSubreddit(subreddit);
  if (reports.length === 0) return null;

  const totalPeople = reports.reduce((sum, r) => sum + (r.people_count ?? 1), 0);

  // Industries
  const industryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    industryCounts[r.industry] = (industryCounts[r.industry] || 0) + 1;
  });
  const industries = Object.entries(industryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  // AI Tools
  const toolCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.ai_tool_replaced) {
      toolCounts[r.ai_tool_replaced] = (toolCounts[r.ai_tool_replaced] || 0) + 1;
    }
  });
  const tools = Object.entries(toolCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  // Trend by month
  const trendCounts: Record<string, number> = {};
  reports.forEach((r) => {
    trendCounts[r.layoff_date] = (trendCounts[r.layoff_date] || 0) + 1;
  });
  const trend = Object.entries(trendCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  // Countries
  const countryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    countryCounts[r.country] = (countryCounts[r.country] || 0) + 1;
  });
  const countries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  // Quotes
  const recentQuotes = reports
    .filter((r) => r.free_text)
    .slice(0, 5)
    .map((r) => r.free_text!);

  return {
    subreddit,
    totalReports: reports.length,
    totalPeople,
    topIndustry: industries[0]?.name ?? '—',
    topTool: tools[0]?.name ?? '—',
    industries,
    tools,
    trend,
    countries,
    recentQuotes,
  };
}

export async function getAllSubreddits(): Promise<string[]> {
  const { data } = await supabaseServer
    .from('reports')
    .select('subreddit')
    .not('subreddit', 'is', null);

  const subs = new Set<string>();
  (data ?? []).forEach((r: { subreddit: string | null }) => {
    if (r.subreddit) subs.add(r.subreddit);
  });

  // Include mock subreddits as fallback
  if (subs.size === 0) {
    mockReports.forEach((r) => {
      if (r.subreddit) subs.add(r.subreddit);
    });
  }

  return Array.from(subs).sort();
}
