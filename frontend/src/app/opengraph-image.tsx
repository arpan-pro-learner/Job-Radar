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
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Glow orb – top left */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: -160,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Glow orb – bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #6366f1, #38bdf8, #4ade80)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 72px',
            height: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Top row — Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Radar icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 12l3.5-3.5" />
              </svg>
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Job Radar
            </span>
            <div
              style={{
                marginLeft: 8,
                padding: '4px 12px',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: 100,
                fontSize: 14,
                color: '#818cf8',
                fontWeight: 600,
              }}
            >
              Beta
            </div>
          </div>

          {/* Center — Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  padding: '6px 16px',
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  borderRadius: 100,
                  fontSize: 15,
                  color: '#4ade80',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                ✦ AI-Powered Discovery
              </div>
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: '#f8fafc',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
              }}
            >
              Discover the next
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                unicorn.
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                color: '#94a3b8',
                lineHeight: 1.5,
                maxWidth: 680,
              }}
            >
              Stop applying to outdated listings. We surface early-stage startups with high hiring probability — fresher, faster, smarter.
            </div>
          </div>

          {/* Bottom row — Stats + URL */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { icon: '🌍', label: 'Remote-First' },
                { icon: '🤖', label: 'AI Scored' },
                { icon: '⚡', label: 'Live Data' },
              ].map((tag) => (
                <div
                  key={tag.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 100,
                    fontSize: 18,
                    color: '#e2e8f0',
                    fontWeight: 500,
                  }}
                >
                  {tag.icon} {tag.label}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 18, color: '#475569', fontWeight: 500 }}>
              find-job-radar.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
