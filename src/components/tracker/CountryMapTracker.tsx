'use client';

import { useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { worldMill } from '@react-jvectormap/world';

const VectorMap = dynamic(
  () => import('@react-jvectormap/core').then((mod) => mod.VectorMap),
  { ssr: false },
);

// Maps raw country strings (names or codes) → ISO 3166-1 alpha-2 for jvectormap
const TO_ISO: Record<string, string> = {
  // codes
  US: 'US', USA: 'US', UK: 'GB',
  // full names
  'United States': 'US',
  'United Kingdom': 'GB',
  'Vietnam': 'VN',
  'Poland': 'PL',
  'Germany': 'DE',
  'France': 'FR',
  'India': 'IN',
  'Canada': 'CA',
  'Australia': 'AU',
  'Netherlands': 'NL',
  'Brazil': 'BR',
  'Spain': 'ES',
  'Italy': 'IT',
  'Sweden': 'SE',
  'Portugal': 'PT',
  'Philippines': 'PH',
  'Singapore': 'SG',
  'Japan': 'JP',
  'South Korea': 'KR',
  'Mexico': 'MX',
  'Argentina': 'AR',
  'Colombia': 'CO',
  'South Africa': 'ZA',
  'Nigeria': 'NG',
  'Egypt': 'EG',
  'Romania': 'RO',
  'Czech Republic': 'CZ',
  'Hungary': 'HU',
  'Ukraine': 'UA',
  'Russia': 'RU',
  'Pakistan': 'PK',
  'Bangladesh': 'BD',
  'Indonesia': 'ID',
  'Malaysia': 'MY',
  'Thailand': 'TH',
  'New Zealand': 'NZ',
  'Ireland': 'IE',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Norway': 'NO',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Israel': 'IL',
  'Turkey': 'TR',
  'UAE': 'AE',
  'United Arab Emirates': 'AE',
  'Saudi Arabia': 'SA',
};

const toIso = (raw: string): string => TO_ISO[raw] ?? raw;

function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const r = Math.round(((ah >> 16) & 0xff) * (1 - t) + ((bh >> 16) & 0xff) * t);
  const g = Math.round(((ah >> 8) & 0xff) * (1 - t) + ((bh >> 8) & 0xff) * t);
  const bl = Math.round((ah & 0xff) * (1 - t) + (bh & 0xff) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

const COLOR_LOW = '#a5b4fc';
const COLOR_MID = '#818cf8';
const COLOR_HIGH = '#4338ca';

function getColor(count: number, max: number): string {
  const t = max > 1 ? count / max : 1;
  if (t <= 0.5) return lerpColor(COLOR_LOW, COLOR_MID, t * 2);
  return lerpColor(COLOR_MID, COLOR_HIGH, (t - 0.5) * 2);
}

interface Props {
  countryData: [string, number][];
  total: number;
}

export default function CountryMapTracker({ countryData, total }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxCount = Math.max(...countryData.filter(([c]) => c !== 'Unknown').map(([, n]) => n), 1);

  const colorValues: Record<string, string> = {};
  countryData.forEach(([code, count]) => {
    if (code === 'Unknown') return;
    colorValues[toIso(code)] = getColor(count, maxCount);
  });

  // Directly color SVG paths after render
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const applyColors = () => {
      const paths = el.querySelectorAll('path[data-code]');
      if (paths.length === 0) return false;
      paths.forEach((path) => {
        const code = path.getAttribute('data-code');
        if (code && colorValues[code]) {
          (path as SVGPathElement).style.fill = colorValues[code];
        }
      });
      return true;
    };

    // Try immediately, then retry with delays for dynamic loading
    if (!applyColors()) {
      const t1 = setTimeout(applyColors, 300);
      const t2 = setTimeout(applyColors, 800);
      const t3 = setTimeout(applyColors, 1500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [colorValues]);

  return (
    <div ref={containerRef} className="h-[260px] sm:h-[300px] md:h-[340px] w-full">
      <VectorMap
        map={worldMill}
        backgroundColor="transparent"
        zoomOnScroll={false}
        zoomMax={12}
        zoomMin={1}
        zoomAnimate={true}
        zoomStep={1.5}
        onRegionTipShow={((e: any, el: any, code: string) => {
          const count = countryData.find(([c]) => toIso(c) === code)?.[1];
          if (count) {
            const pct = Math.round((count / total) * 100);
            el.html(`<strong>${code}</strong>: ${count} reports (${pct}%)`);
          }
        }) as any}
        regionStyle={{
          initial: {
            fill: '#f3f4f6',
            fillOpacity: 1,
            stroke: '#d1d5db',
            strokeWidth: 0.4,
            strokeOpacity: 1,
          },
          hover: {
            fillOpacity: 0.85,
            cursor: 'pointer',
          },
          selected: {},
          selectedHover: {},
        }}
        regionLabelStyle={{
          initial: { fill: '#35373e', fontWeight: 500, fontSize: '13px', stroke: 'none' },
          hover: {},
          selected: {},
          selectedHover: {},
        }}
      />
    </div>
  );
}
