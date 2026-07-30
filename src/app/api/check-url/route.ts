import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function normalizeRedditUrl(url: string): string {
  // Strip query params and trailing slash
  return url.split('?')[0].replace(/\/$/, '');
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const rawUrl: string = body.url ?? '';

  if (!rawUrl || !rawUrl.includes('reddit.com')) {
    return NextResponse.json({ error: 'Please provide a valid Reddit URL.' }, { status: 400 });
  }

  const url = normalizeRedditUrl(rawUrl);

  // 1. Check if already in reports
  const { data: existing } = await supabase
    .from('reports')
    .select('id, company, industry, layoff_date, job_title, source_url')
    .ilike('source_url', `${url}%`)
    .limit(1);

  if (existing && existing.length > 0) {
    const r = existing[0];
    return NextResponse.json({
      status: 'exists',
      report: {
        company: r.company,
        industry: r.industry,
        layoff_date: r.layoff_date,
        job_title: r.job_title,
        source_url: r.source_url,
      },
    });
  }

  // 2. Check if already in pending queue
  const { data: pending } = await supabase
    .from('pending_urls')
    .select('id, status, submitted_at')
    .eq('url', url)
    .limit(1);

  if (pending && pending.length > 0) {
    return NextResponse.json({
      status: 'pending',
      submitted_at: pending[0].submitted_at,
      queue_status: pending[0].status,
    });
  }

  // 3. Add to pending queue
  const { error } = await supabase
    .from('pending_urls')
    .insert({ url });

  if (error) {
    console.error('pending_urls insert error:', error.message);
    return NextResponse.json({ error: 'Failed to queue URL. Try again.' }, { status: 500 });
  }

  return NextResponse.json({ status: 'queued' });
}
