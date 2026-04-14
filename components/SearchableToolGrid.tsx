'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Tool, ToolCategory } from '@/lib/tools'

interface Props {
  tools: Tool[]
  categoryLabel: Record<string, string>
  categoryColors: Record<string, { bg: string; text: string }>
}

const ALL = 'all'

export default function SearchableToolGrid({ tools, categoryLabel, categoryColors }: Props) {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') ?? '').toLowerCase().trim()
  const [activeCategory, setActiveCategory] = useState<string>(ALL)

  // categories ที่มี tools จริงๆ
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map(t => t.category)))
    return cats
  }, [tools])

  const filtered = useMemo(() => {
    let result = tools
    if (q) {
      result = result.filter(tool =>
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q))
      )
    }
    if (activeCategory !== ALL) {
      result = result.filter(t => t.category === activeCategory)
    }
    return result
  }, [q, tools, activeCategory])

  const catCount = (cat: string) =>
    cat === ALL ? tools.length : tools.filter(t => t.category === cat).length

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>
          {activeCategory === ALL ? 'all tools' : categoryLabel[activeCategory]}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>{filtered.length} tools</span>
      </div>

      {/* Category filter tabs */}
      {!q && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
          {/* All button */}
          <button
            onClick={() => setActiveCategory(ALL)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 10px',
              background: activeCategory === ALL ? '#1a1917' : '#ffffff',
              color: activeCategory === ALL ? '#f8f7f4' : '#6b6960',
              border: '0.5px solid #c8c6c0', borderRadius: 99,
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            All {tools.length}
          </button>

          {/* Category buttons */}
          {categories.map(cat => {
            const color = categoryColors[cat]
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 10px',
                  background: isActive ? color.text : '#ffffff',
                  color: isActive ? '#ffffff' : color.text,
                  border: `0.5px solid ${color.text}`,
                  borderRadius: 99, cursor: 'pointer', transition: 'all .15s',
                }}
              >
                {categoryLabel[cat]} {catCount(cat)}
              </button>
            )
          })}
        </div>
      )}

      {/* Tool grid */}
      <style>{`
        .tool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: #c8c6c0;
          border: 0.5px solid #c8c6c0;
          border-radius: 10px;
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .tool-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .tool-card {
            padding: 12px 10px !important;
          }
          .tool-card-icon {
            width: 24px !important;
            height: 24px !important;
          }
          .tool-card-name {
            font-size: 12px !important;
          }
          .tool-card-desc {
            display: none !important;
          }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          .tool-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .tool-card {
            padding: 14px 12px !important;
          }
          .tool-card-desc {
            font-size: 11px !important;
          }
        }
      `}</style>

      <div className="tool-grid">
        {filtered.length > 0 ? filtered.map(tool => {
          const color = categoryColors[tool.category]
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="tool-card"
              style={{ background: '#ffffff', padding: '18px 16px', textDecoration: 'none', display: 'block' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div
                  className="tool-card-icon"
                  style={{ width: 28, height: 28, borderRadius: 6, background: color.bg, flexShrink: 0 }}
                />
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {tool.isNew && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 5px', borderRadius: 99, background: '#eeedfe', color: '#3c3489', fontWeight: 500 }}>new</span>
                  )}
                  {tool.isPopular && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 5px', borderRadius: 99, background: '#faece7', color: '#712b13', fontWeight: 500 }}>popular</span>
                  )}
                </div>
              </div>

              <p className="tool-card-name" style={{ fontSize: 13, fontWeight: 500, color: '#1a1917', marginBottom: 3, lineHeight: 1.3 }}>
                {tool.name}
              </p>

              <p className="tool-card-desc" style={{ fontSize: 11, color: '#6b6960', lineHeight: 1.5, margin: 0 }}>
                {tool.shortDesc}
              </p>

              <div style={{ marginTop: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px',
                  borderRadius: 99, fontWeight: 500,
                  background: color.bg, color: color.text,
                }}>
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