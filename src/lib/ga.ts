import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA_PROPERTY_ID ?? '437435738';

let client: BetaAnalyticsDataClient | null = null;

function getClient() {
  if (client) return client;

  // Option 1: GOOGLE_APPLICATION_CREDENTIALS file path (local dev + Vercel)
  // Option 2: inline credentials via env vars
  const email = process.env.GA_CLIENT_EMAIL;
  const key = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (email && key) {
    client = new BetaAnalyticsDataClient({
      credentials: { client_email: email, private_key: key },
    });
  } else {
    // Falls back to GOOGLE_APPLICATION_CREDENTIALS env var
    client = new BetaAnalyticsDataClient();
  }
  return client;
}

export interface DailyMetrics {
  date: string;
  users: number;
  sessions: number;
  pageviews: number;
  avgSessionDuration: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  users: number;
  sessions: number;
}

export interface TopPage {
  path: string;
  pageviews: number;
  users: number;
}

export interface GAReport {
  daily: DailyMetrics[];
  sources: TrafficSource[];
  topPages: TopPage[];
  totals: { users: number; sessions: number; pageviews: number };
}

export async function fetchGAReport(startDate: string, endDate: string): Promise<GAReport> {
  const c = getClient();

  const [dailyRes, sourcesRes, pagesRes] = await Promise.all([
    // Daily metrics
    c.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    // Traffic sources
    c.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 20,
    }),
    // Top pages
    c.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 15,
    }),
  ]);

  const daily: DailyMetrics[] = (dailyRes[0].rows ?? []).map((r) => ({
    date: r.dimensionValues![0].value!,
    users: Number(r.metricValues![0].value),
    sessions: Number(r.metricValues![1].value),
    pageviews: Number(r.metricValues![2].value),
    avgSessionDuration: Number(r.metricValues![3].value),
  }));

  const sources: TrafficSource[] = (sourcesRes[0].rows ?? []).map((r) => ({
    source: r.dimensionValues![0].value!,
    medium: r.dimensionValues![1].value!,
    users: Number(r.metricValues![0].value),
    sessions: Number(r.metricValues![1].value),
  }));

  const topPages: TopPage[] = (pagesRes[0].rows ?? []).map((r) => ({
    path: r.dimensionValues![0].value!,
    pageviews: Number(r.metricValues![0].value),
    users: Number(r.metricValues![1].value),
  }));

  const totals = daily.reduce(
    (acc, d) => ({
      users: acc.users + d.users,
      sessions: acc.sessions + d.sessions,
      pageviews: acc.pageviews + d.pageviews,
    }),
    { users: 0, sessions: 0, pageviews: 0 }
  );

  return { daily, sources, topPages, totals };
}
