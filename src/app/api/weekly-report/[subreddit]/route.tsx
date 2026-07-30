import { ImageResponse } from 'next/og';
import { getSubredditStats } from '@/lib/subreddit-stats';

export const runtime = 'edge';

const W = 1080;
const H = 1350;

// postAIjob brand colors
const INDIGO = '#4F46E5';
const INDIGO_LIGHT = '#818cf8';
const INDIGO_BG = '#eef2ff'; // indigo-50
const WHITE = '#ffffff';
const GRAY_900 = '#111827';
const GRAY_500 = '#6b7280';
const GRAY_400 = '#9ca3af';
const GRAY_200 = '#e5e7eb';
const GRAY_50 = '#f9fafb';
const BAR_BG = '#e0e7ff'; // indigo-100

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ subreddit: string }> },
) {
  const { subreddit } = await params;
  const stats = await getSubredditStats(subreddit);

  if (!stats) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: GRAY_50, color: GRAY_900, fontSize: 32, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
          r/{subreddit} — No data yet
        </div>
      ),
      { width: W, height: H },
    );
  }

  const topIndustries = stats.industries.slice(0, 6);
  const maxInd = topIndustries[0]?.count ?? 1;
  const topTools = stats.tools.slice(0, 5);
  const topCountries = stats.countries.slice(0, 5);
  const quote = stats.recentQuotes[0];

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRange = `${fmt(weekAgo)} – ${fmt(now)}, ${now.getFullYear()}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: WHITE,
          padding: '52px 56px',
          fontFamily: 'system-ui, sans-serif',
          color: GRAY_900,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: INDIGO, borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHITE, fontSize: 16, fontWeight: 700 }}>
              r/
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: GRAY_900 }}>{subreddit}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: INDIGO, textTransform: 'uppercase', letterSpacing: 3 }}>
                Weekly AI Layoff Report
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: GRAY_900 }}>postAIjob</span>
            <span style={{ fontSize: 12, color: GRAY_400 }}>{dateRange}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          <KpiCard label="Reports" value={String(stats.totalReports)} />
          <KpiCard label="People affected" value={stats.totalPeople.toLocaleString('en-US')} />
          <KpiCard label="Industries hit" value={String(stats.industries.length)} />
        </div>

        {/* Two columns */}
        <div style={{ display: 'flex', gap: 16, flex: 1 }}>
          {/* Left — Industries */}
          <div style={{
            display: 'flex', flexDirection: 'column', flex: 1,
            background: INDIGO_BG, borderRadius: 20, border: `1px solid #c7d2fe`,
            padding: '20px 24px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>
              Industries affected
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {topIndustries.map((ind) => {
                const pct = Math.round((ind.count / stats.totalReports) * 100);
                const barW = Math.max(Math.round((ind.count / maxInd) * 100), 6);
                return (
                  <div key={ind.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: GRAY_900 }}>{ind.name}</span>
                      <span style={{ fontSize: 13, color: GRAY_500 }}>{ind.count} ({pct}%)</span>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: 8, background: BAR_BG, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${barW}%`, height: '100%', background: INDIGO, borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Tools + Countries */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>
            {/* AI Tools card */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: INDIGO_BG, borderRadius: 20, border: `1px solid #c7d2fe`,
              padding: '20px 24px', flex: 1,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14 }}>
                AI tools cited
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topTools.map((tool) => (
                  <div key={tool.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: GRAY_900 }}>{tool.name}</span>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: INDIGO, color: WHITE, borderRadius: 10,
                      padding: '3px 10px', fontSize: 12, fontWeight: 700,
                    }}>
                      {tool.count}x
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countries card */}
            {topCountries.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column',
                background: INDIGO_BG, borderRadius: 20, border: `1px solid #c7d2fe`,
                padding: '20px 24px',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12 }}>
                  Countries
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {topCountries.map((c) => (
                    <div key={c.name} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: WHITE, borderRadius: 10, padding: '6px 14px',
                      border: `1px solid ${GRAY_200}`,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: GRAY_900 }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: GRAY_400 }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quote */}
        {quote && (
          <div style={{
            display: 'flex', flexDirection: 'column', marginTop: 20,
            background: INDIGO_BG, borderRadius: 20, border: `1px solid #c7d2fe`,
            padding: '20px 28px', borderLeft: `4px solid ${INDIGO}`,
          }}>
            <span style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.5, color: GRAY_900 }}>
              &ldquo;{quote.length > 180 ? quote.slice(0, 177) + '...' : quote}&rdquo;
            </span>
            <span style={{ fontSize: 12, color: GRAY_400, marginTop: 8 }}>
              — anonymous, r/{subreddit}
            </span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${GRAY_200}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: '#22c55e' }} />
            <span style={{ fontSize: 12, color: GRAY_400 }}>Updated hourly</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: INDIGO }}>
            postaijob.org/stats/{subreddit}
          </span>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: `linear-gradient(135deg, ${INDIGO_BG}, ${WHITE})`,
        border: `1px solid #c7d2fe`,
        borderRadius: 20,
        padding: '20px 24px',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>
        {label}
      </span>
      <span style={{ fontSize: 40, fontWeight: 800, color: GRAY_900, lineHeight: 1 }}>{value}</span>
    </div>
  );
}
