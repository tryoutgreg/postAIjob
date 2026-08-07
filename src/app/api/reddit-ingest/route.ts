import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.INGEST_SECRET;
  if (!secret) return true;
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

/**
 * Report structure expected from Claude agent.
 * Agent reads Reddit posts via MCP, parses them, and sends here.
 */
interface IngestReport {
  source_url: string;       // post URL or post URL + #commentId
  comment_url?: string | null; // direct comment permalink (optional, more precise)
  subreddit: string;
  reddit_author: string;
  submission_id: string;
  company: string;
  company_size: string;
  country: string;
  state?: string | null;
  industry: string;
  job_title: string;
  layoff_date: string; // YYYY-MM
  ai_tool_replaced: string;
  next_step: string;
  next_step_detail?: string | null;
  severance_offered?: boolean | null;
  free_text?: string | null;
  people_count: number;
}

async function saveReport(report: IngestReport): Promise<'saved' | 'duplicate' | 'error'> {
  // Dedup by source_url (if column exists)
  const { data: existing, error: dedupErr } = await supabase
    .from('reports')
    .select('id')
    .eq('source_url', report.source_url)
    .limit(1);

  // If no error, check for duplicates; if column doesn't exist, skip dedup
  if (!dedupErr && existing && existing.length > 0) return 'duplicate';

  // Cross-sub dedup: same author + same layoff month
  if (report.reddit_author && report.reddit_author !== '[deleted]') {
    const { data: authorDup, error: authorErr } = await supabase
      .from('reports')
      .select('id')
      .eq('reddit_author', report.reddit_author)
      .eq('layoff_date', report.layoff_date)
      .limit(1);

    if (!authorErr && authorDup && authorDup.length > 0) return 'duplicate';
  }

  // Build insert — start with core columns that always exist
  const coreRow: Record<string, unknown> = {
    source: 'reddit',
    subreddit: report.subreddit,
    company: report.company || 'Undisclosed',
    company_size: report.company_size || 'unknown',
    country: report.country || 'Unknown',
    state: report.state || null,
    industry: report.industry || 'Other',
    job_title: report.job_title || 'Unknown',
    layoff_date: report.layoff_date,
    ai_tool_replaced: report.ai_tool_replaced || 'AI (unspecified)',
    next_step: report.next_step || 'unknown',
    next_step_detail: report.next_step_detail || null,
    severance_offered: report.severance_offered ?? null,
    free_text: report.free_text || null,
    people_count: report.people_count || 1,
  };

  // Try with all fields (source_url + reddit fields)
  const fullRow = {
    ...coreRow,
    source_url: report.source_url,
    comment_url: report.comment_url ?? null,
    reddit_author: report.reddit_author,
    submission_id: report.submission_id,
  };

  let { error } = await supabase.from('reports').insert(fullRow);

  if (error?.message?.includes('column')) {
    // Some columns don't exist yet — insert with core fields only
    ({ error } = await supabase.from('reports').insert(coreRow));
  }

  if (error) {
    console.error('Supabase insert error:', error.message, error.details, error.hint);
    return 'error';
  }
  return 'saved';
}

/**
 * POST /api/reddit-ingest
 *
 * Accepts pre-parsed reports from Claude agent.
 * Body: { reports: IngestReport[] }
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const reports = body.reports as IngestReport[] | undefined;

  if (!reports || !Array.isArray(reports) || reports.length === 0) {
    return NextResponse.json(
      { error: 'Missing or empty "reports" array. Send { reports: [...] }' },
      { status: 400 },
    );
  }

  let saved = 0;
  let duplicates = 0;
  let errors = 0;
  const savedReports: { source_url: string; industry: string; reddit_author: string }[] = [];
  const errorDetails: { source_url: string; error: string }[] = [];

  for (const report of reports) {
    if (!report.source_url || !report.subreddit || !report.layoff_date) {
      errors++;
      continue;
    }

    const status = await saveReport(report);
    if (status === 'saved') {
      saved++;
      savedReports.push({
        source_url: report.source_url,
        industry: report.industry,
        reddit_author: report.reddit_author,
      });
    } else if (status === 'duplicate') {
      duplicates++;
    } else {
      errors++;
      errorDetails.push({ source_url: report.source_url, error: status });
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    summary: {
      received: reports.length,
      saved,
      duplicates,
      errors,
    },
    savedReports,
    ...(errorDetails.length > 0 ? { errorDetails } : {}),
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return recent ingest stats — use only core columns that always exist
  const { data: recent } = await supabase
    .from('reports')
    .select('id, subreddit, industry, created_at')
    .eq('source', 'reddit')
    .order('created_at', { ascending: false })
    .limit(20);

  const { count } = await supabase
    .from('reports')
    .select('id', { count: 'exact', head: true })
    .eq('source', 'reddit');

  return NextResponse.json({
    status: 'ready',
    totalRedditReports: count ?? 0,
    recentIngests: recent ?? [],
    usage: {
      method: 'POST',
      body: '{ "reports": [{ source_url, subreddit, reddit_author, submission_id, company, company_size, country, industry, job_title, layoff_date, ai_tool_replaced, next_step, free_text, people_count }] }',
      auth: 'Bearer $INGEST_SECRET (optional in dev)',
    },
  });
}
