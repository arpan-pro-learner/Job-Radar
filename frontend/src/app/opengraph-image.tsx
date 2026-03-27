import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Job Radar — AI-Powered Startup Job Discovery'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top gradient accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #6366f1, #38bdf8, #4ade80)',
            display: 'flex',
          }}
        />

        {/* Purple glow blob top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: '#6366f1',
            opacity: 0.15,
            display: 'flex',
            filter: 'blur(80px)',
          }}
        />

        {/* Blue glow blob bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            right: -100,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: '#38bdf8',
            opacity: 0.12,
            display: 'flex',
            filter: 'blur(80px)',
          }}
        />

        {/* ── TOP ROW: Brand ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Icon badge */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 12l3.2-3.2" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
            }}
          >
            Job Radar
          </span>
          <div
            style={{
              marginLeft: 6,
              padding: '4px 14px',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 100,
              fontSize: 14,
              color: '#818cf8',
              fontWeight: 600,
              display: 'flex',
            }}
          >
            Beta
          </div>
        </div>

        {/* ── MIDDLE: Headline ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* AI pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: 100,
              width: 'fit-content',
            }}
          >
            <span style={{ fontSize: 16, color: '#4ade80', fontWeight: 600 }}>
              ✦ AI-Powered Startup Job Discovery
            </span>
          </div>

          {/* Main headline — two lines, no gradient (Satori limitation) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                fontSize: 76,
                fontWeight: 800,
                color: '#f8fafc',
                lineHeight: 1,
                letterSpacing: '-0.045em',
              }}
            >
              Discover the next
            </span>
            <span
              style={{
                fontSize: 76,
                fontWeight: 800,
                color: '#818cf8',
                lineHeight: 1,
                letterSpacing: '-0.045em',
              }}
            >
              unicorn.
            </span>
          </div>

          {/* Subline */}
          <span
            style={{
              fontSize: 22,
              color: '#64748b',
              lineHeight: 1.5,
              maxWidth: 700,
            }}
          >
            Stop applying to outdated listings. We surface early-stage startups
            with high hiring probability — fresher, faster, smarter.
          </span>
        </div>

        {/* ── BOTTOM ROW: Tags + URL ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            {['🌍  Remote-First', '🤖  AI Scored', '⚡  Live Data'].map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 100,
                  fontSize: 18,
                  color: '#cbd5e1',
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 18, color: '#334155', fontWeight: 500 }}>
            find-job-radar.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
