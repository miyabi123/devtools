
import { ImageResponse } from 'next/og'
import { getTool, tools } from '@/lib/tools'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  dev:     { bg: '#eeedfe', text: '#3c3489', label: 'Developer Tool' },
  thai:    { bg: '#e1f5ee', text: '#085041', label: 'Thai Tool' },
  file:    { bg: '#faeeda', text: '#633806', label: 'File Tool' },
  finance: { bg: '#faece7', text: '#712b13', label: 'Finance Tool' },
}

export default async function Image({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug)
  if (!tool) return new Response('Not found', { status: 404 })

  const cat = categoryColors[tool.category] ?? categoryColors.dev

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f8f7f4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ background: cat.bg, color: cat.text, fontSize: 24, fontWeight: 600, padding: '10px 24px', borderRadius: 10 }}>
            {cat.label}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: '#1a1917', lineHeight: 1.05, display: 'flex' }}>
            {tool.name}
          </div>
          <div style={{ fontSize: 34, color: '#6b6960', lineHeight: 1.4, display: 'flex', maxWidth: 900 }}>
            {tool.shortDesc}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, color: '#1a1917', fontWeight: 500, display: 'flex' }}>
            free<span style={{ opacity: 0.35 }}>util</span>
            <span style={{ color: '#a8a69e', fontWeight: 400 }}>.app</span>
          </div>
          <div style={{ fontSize: 24, color: '#a8a69e', display: 'flex' }}>
            Free · No login required · 100% client-side
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}