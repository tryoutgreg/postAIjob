import { ImageResponse } from 'next/og';
import { getSubredditStats } from '@/lib/subreddit-stats';

export const runtime = 'edge';
export const alt = 'AI Layoff Stats';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INDIGO = '#4F46E5';
const INDIGO_BG = '#eef2ff';
const WHITE = '#ffffff';
const GRAY_900 = '#111827';
const GRAY_500 = '#6b7280';
const GRAY_400 = '#9ca3af';
const GRAY_200 = '#e5e7eb';
const BAR_BG = '#e0e7ff';

export default async function OgImage({ params }: { params: Promise<{ subreddit: string }> }) {
  const { subreddit } = await params;
  const stats = await getSubredditStats(subreddit);

  if (!stats) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: WHITE, color: GRAY_900, fontSize: 36, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
          r/{subreddit} — No data yet
        </div>
      ),
      { ...size },
    );
  }

  const topIndustries = stats.industries.slice(0, 4);
  const maxInd = topIndustries[0]?.count ?? 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: WHITE,
          padding: '40px 52px',
          fontFamily: 'system-ui, sans-serif',
          color: GRAY_900,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: INDIGO, borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHITE, fontSize: 15, fontWeight: 700 }}>
              r/
            </div>
            <span style={{ fontSize: 26, fontWeight: 700, color: GRAY_900 }}>{subreddit}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: 3 }}>
              AI Layoff Tracker
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: GRAY_900 }}>postAIjob</span>
          </div>
        </div>

        {/* Title */}
        <span style={{ fontSize: 12, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 6 }}>
          Live data
        </span>
        <span style={{ fontSize: 30, fontWeight: 700, color: GRAY_900, marginBottom: 4 }}>
          Who lost their job to AI on r/{subreddit}?
        </span>
        <span style={{ fontSize: 14, color: GRAY_500, marginBottom: 24 }}>
          Data from Reddit reports and direct submissions
        </span>

        {/* KPI row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
          <OgKpi label="Reports" value={String(stats.totalReports)} />
          <OgKpi label="People affected" value={stats.totalPeople.toLocaleString('en-US')} />
          <OgKpi label="Top industry" value={stats.topIndustry} small />
          <OgKpi label="Top AI tool" value={stats.topTool} small />
        </div>

        {/* Industry bars */}
        {topIndustries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topIndustries.map((ind) => {
              const barW = Math.max(Math.round((ind.count / maxInd) * 100), 4);
              return (
                <div key={ind.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: GRAY_500, width: 130, textAlign: 'right' }}>
                    {ind.name}
                  </span>
                  <div style={{ display: 'flex', flex: 1, height: 10, background: BAR_BG, borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${barW}%`, height: '100%', background: INDIGO, borderRadius: 5 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GRAY_900, width: 28 }}>
                    {ind.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${GRAY_200}` }}>
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
    { ...size },
  );
}

function OgKpi({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: `linear-gradient(135deg, ${INDIGO_BG}, ${WHITE})`,
        border: '1px solid #c7d2fe',
        borderRadius: 16,
        padding: '14px 18px',
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
        {label}
      </span>
      <span style={{ fontSize: small ? 18 : 32, fontWeight: 700, color: GRAY_900, lineHeight: 1 }}>
        {value}
      </span>
    </div>
  );
}
