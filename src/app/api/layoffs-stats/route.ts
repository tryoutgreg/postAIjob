import { NextResponse } from 'next/server';

export const revalidate = 86400;

/** Returns ISO week key "YYYY-Www" for a given date string */
function isoWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  // Copy date so Thursday stays in the same week
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7; // Mon=0, Sun=6
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNo =
    1 +
    Math.round(
      ((target.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7
    );
  return `${target.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/** Returns the ISO week key for today */
function currentWeekKey(): string {
  return isoWeekKey(new Date().toISOString().slice(0, 10));
}

/** Returns the ISO week key for 7 days ago */
function prevWeekKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return isoWeekKey(d.toISOString().slice(0, 10));
}

export async function GET() {
  try {
    const res = await fetch('https://layoffsfyi-production.up.railway.app/api/ai-layoffs-stats', {
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const currentYear = new Date().getFullYear();
    const yearData =
      data.years.find((y: { year: string }) => Number(y.year) === currentYear) ??
      data.years[data.years.length - 1];

    // Build weekly buckets from all eventsByYear events
    type Event = { date: string; count: number; company: string };
    const allEvents: Event[] = Object.values(
      data.eventsByYear as Record<string, Event[]>
    ).flat();

    const weeklyMap: Record<string, { emp: number; events: number; companies: { company: string; count: number }[] }> = {};
    for (const ev of allEvents) {
      if (!ev.date) continue;
      const key = isoWeekKey(ev.date);
      if (!weeklyMap[key]) weeklyMap[key] = { emp: 0, events: 0, companies: [] };
      weeklyMap[key].emp += ev.count ?? 0;
      weeklyMap[key].events += 1;
      if (ev.company) {
        weeklyMap[key].companies.push({ company: ev.company, count: ev.count ?? 0 });
      }
    }

    const thisWeek = currentWeekKey();
    const lastWeek = prevWeekKey();

    const weekCurrent = weeklyMap[thisWeek] ?? { emp: 0, events: 0 };
    const weekPrev = weeklyMap[lastWeek] ?? { emp: 0, events: 0 };

    const weeklyDelta = {
      thisWeek,
      lastWeek,
      current: weekCurrent,
      previous: weekPrev,
      deltaEmp: weekCurrent.emp - weekPrev.emp,
      deltaEvents: weekCurrent.events - weekPrev.events,
      pctChange:
        weekPrev.emp > 0
          ? Math.round(((weekCurrent.emp - weekPrev.emp) / weekPrev.emp) * 100)
          : null,
    };

    // Last 12 weeks for a sparkline
    const sortedWeeks = Object.keys(weeklyMap).sort().slice(-12);
    const weeklySeries = sortedWeeks.map((w) => ({
      week: w,
      emp: weeklyMap[w].emp,
      events: weeklyMap[w].events,
      companies: weeklyMap[w].companies.sort((a, b) => b.count - a.count).slice(0, 5),
    }));

    // Compute top companies for current year only from eventsByYear
    const currentYearEvents = (data.eventsByYear as Record<string, { company: string; count: number }[]>)[String(currentYear)] ?? [];
    const companyMap: Record<string, number> = {};
    for (const ev of currentYearEvents) {
      if (!ev.company) continue;
      companyMap[ev.company] = (companyMap[ev.company] ?? 0) + (ev.count ?? 0);
    }
    const topCompaniesCurrentYear = Object.entries(companyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company, ai_emp]) => ({ company, ai_emp }));

    return NextResponse.json({
      year: Number(yearData.year),
      employees: yearData.ai_emp as number,
      events: yearData.ai_events as number,
      companies: topCompaniesCurrentYear,
      monthly: data.monthly as { ym: string; ai_events: number; ai_emp: number }[],
      weeklyDelta,
      weeklySeries,
    });
  } catch {
    return NextResponse.json(
      { year: null, employees: null, events: null, companies: null, monthly: null, weeklyDelta: null, weeklySeries: null },
      { status: 500 }
    );
  }
}
