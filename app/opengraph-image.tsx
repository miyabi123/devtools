
import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f8f7f4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, color: '#1a1917', display: 'flex' }}>
          free<span style={{ opacity: 0.35 }}>util</span>
        </div>

        <div style={{ fontSize: 34, color: '#6b6960', textAlign: 'center', maxWidth: 780, lineHeight: 1.4, display: 'flex' }}>
          Free online tools for developers &amp; everyone
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {['JWT', 'JSON', 'Base64', 'Regex', 'QR Code', '50+ tools'].map(tag => (
            <div
              key={tag}
              style={{
                background: '#eeedfe',
                color: '#3c3489',
                fontSize: 22,
                fontWeight: 500,
                padding: '10px 22px',
                borderRadius: 10,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 22, color: '#a8a69e', marginTop: 8, display: 'flex' }}>
          freeutil.app — 100% free, no login required
        </div>
      </div>
    ),
    { ...size },
  )
}
