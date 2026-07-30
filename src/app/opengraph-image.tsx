import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Indigo blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e0e7ff 0%, #ffffff 70%)',
          }}
        />

        {/* Indigo accent bar left */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '6px',
            background: '#4F46E5',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '64px 80px',
          }}
        >
          {/* Top — wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: '#4F46E5',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
            >
              AI
            </div>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.5px',
              }}
            >
              postAIjob
            </span>
          </div>

          {/* Center — headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#6366F1',
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              THE REALITY, NOT THE PRESS RELEASE
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: '72px',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.0,
                letterSpacing: '-2px',
              }}
            >
              <span>AI is replacing</span>
              <span>real people.</span>
            </div>
            <span
              style={{
                fontSize: '24px',
                color: '#6B7280',
                fontWeight: 400,
                marginTop: '4px',
              }}
            >
              A public tracker of AI-driven layoffs.
            </span>
          </div>

          {/* Bottom — stat + URL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: '3px solid #6366F1',
                  paddingLeft: '16px',
                }}
              >
                <span
                  style={{ fontSize: '36px', fontWeight: 800, color: '#111827', lineHeight: 1 }}
                >
                  96,459
                </span>
                <span style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '4px' }}>
                  people replaced by AI in 2026
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: '16px',
                color: '#9CA3AF',
                fontWeight: 500,
              }}
            >
              postAIjob.org
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
