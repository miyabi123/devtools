'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Tool } from '@/lib/tools'

interface Props {
  tools: Tool[]
  categoryLabel: Record<string, string>
  categoryColors: Record<string, { bg: string; text: string }>
}

export default function SearchableToolGrid({ tools, categoryLabel, categoryColors }: Props) {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') ?? '').toLowerCase().trim()

  const filtered = useMemo(() => {
    if (!q) return tools
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(q) ||
      tool.shortDesc.toLowerCase().includes(q) ||
      tool.keywords.some(k => k.toLowerCase().includes(q))
    )
  }, [q, tools])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>all tools</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>{filtered.length} tools</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 1, background: '#c8c6c0',
        border: '0.5px solid #c8c6c0', borderRadius: 10, overflow: 'hidden',
      }}>
        {filtered.length > 0 ? filtered.map(tool => {
          const color = categoryColors[tool.category]
          return (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}
              style={{ background: '#ffffff', padding: '18px 16px', textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: color.bg }} />
                <div style={{ display: 'flex', gap: 4 }}>
                  {tool.isNew && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', borderRadius: 99, background: '#eeedfe', color: '#3c3489', fontWeight: 500 }}>new</span>}
                  {tool.isPopular && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', borderRadius: 99, background: '#faece7', color: '#712b13', fontWeight: 500 }}>popular</span>}
                </div>
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1917', marginBottom: 4 }}>{tool.name}</p>
              <p style={{ fontSize: 11, color: '#6b6960', lineHeight: 1.5 }}>{tool.shortDesc}</p>
              <div style={{ marginTop: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px', borderRadius: 99, fontWeight: 500, background: color.bg, color: color.text }}>
                  {categoryLabel[tool.category]}
                </span>
              </div>
            </Link>
          )
        }) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px 24px', textAlign: 'center', background: '#ffffff', color: '#a8a69e', fontSize: 13 }}>
            No tools found for &quot;{q}&quot;
          </div>
        )}
      </div>
    </>
  )
}
