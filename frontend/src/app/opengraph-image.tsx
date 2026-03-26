import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Job Radar OpenGraph Image'
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
          background: 'linear-gradient(to bottom right, #0f172a, #020617)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 20 }}>
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 12l4-4" />
          </svg>
          <h1 style={{ fontSize: 64, fontWeight: 'bold', margin: 0, letterSpacing: '-0.05em' }}>
            Job Radar
          </h1>
        </div>
        
        <p style={{ fontSize: 32, fontWeight: 500, color: '#94a3b8', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4, margin: '0 0 40px 0' }}>
          Stop applying to outdated listings. We use AI to identify early-stage teams with <span style={{ color: '#4ade80', marginLeft: '8px' }}>high hiring probability.</span>
        </p>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ padding: '10px 24px', background: '#1e293b', borderRadius: '100px', fontSize: 24, border: '1px solid #334155' }}>
            🌍 Remote-First
          </div>
           <div style={{ padding: '10px 24px', background: '#1e293b', borderRadius: '100px', fontSize: 24, border: '1px solid #334155' }}>
            📈 High Growth
          </div>
           <div style={{ padding: '10px 24px', background: '#1e293b', borderRadius: '100px', fontSize: 24, border: '1px solid #334155' }}>
            🚀 AI Signals
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
