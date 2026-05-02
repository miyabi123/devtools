'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { articles } from '@/lib/articles'

// Derive unique categories from articles
const allCategories = Array.from(new Set(articles.map(a => a.category))).sort()

const categoryOrder = ['Dev / IT', 'OpenSSL & Cert', 'Thai Tools', 'File & Image', 'Finance']
const sortedCategories = [
  ...categoryOrder.filter(c => allCategories.includes(c)),
  ...allCategories.filter(c => !categoryOrder.includes(c)),
]

// Sort articles by date desc
const sortedArticles = [...articles].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState<string>('All')
  const [showAll, setShowAll] = useState(false)

  const PAGE_SIZE = 12

  const filtered = useMemo(() => {
    if (activeCat === 'All') return sortedArticles
    return sortedArticles.filter(a => a.category === activeCat)
  }, [activeCat])

  const displayed = showAll ? filtered : filtered.slice(0, PAGE_SIZE)
  const hasMore = filtered.length > PAGE_SIZE && !showAll

  const featuredArticle = filtered[0]
  const restArticles = displayed.slice(1)

  // Reset showAll when category changes
  const handleCatChange = (cat: string) => {
    setActiveCat(cat)
    setShowAll(false)
  }

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px 80px', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.1em', margin: '0 0 12px' }}>
          GUIDES & TUTORIALS
        </p>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#1a1917', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Developer Guides
        </h1>
        <p style={{ fontSize: 14, color: '#6b6960', margin: 0 }}>
          {articles.length} articles · tools, technologies, and concepts behind FreeUtil
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {['All', ...sortedCategories].map(cat => {
          const isActive = activeCat === cat
          const count = cat === 'All' ? articles.length : articles.filter(a => a.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => handleCatChange(cat)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                border: isActive ? '1px solid #1a1917' : '1px solid #c8c6c0',
                background: isActive ? '#1a1917' : '#ffffff',
                color: isActive ? '#f8f7f4' : '#6b6960',
                transition: 'all 0.12s',
              }}
            >
              {cat}
              <span style={{ opacity: 0.55, marginLeft: 5 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#a8a69e' }}>No articles found.</p>
      )}

      {/* Featured article (first item) */}
      {featuredArticle && (
        <Link href={`/blog/${featuredArticle.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
          <div style={{
            background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 12,
            padding: '28px 32px', cursor: 'pointer',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = '#1a1917'
              el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = '#c8c6c0'
              el.style.boxShadow = 'none'
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                background: featuredArticle.categoryColor, color: featuredArticle.categoryText,
                padding: '3px 10px', borderRadius: 99, letterSpacing: '0.06em',
              }}>
                {featuredArticle.category}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                LATEST
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1917', lineHeight: 1.3, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
              {featuredArticle.title}
            </h2>
            <p style={{ fontSize: 14, color: '#6b6960', lineHeight: 1.7, margin: '0 0 16px' }}>
              {featuredArticle.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                {featuredArticle.readTime} min read
              </span>
              {featuredArticle.relatedTool && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                  🔧 {featuredArticle.relatedToolName}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a8a69e', marginLeft: 'auto' }}>
                Read →
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {restArticles.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 10,
          marginBottom: hasMore ? 24 : 0,
        }}>
          {restArticles.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#ffffff', border: '1px solid #c8c6c0',
                borderRadius: 10, padding: '20px', cursor: 'pointer',
                height: '100%', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1a1917' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#c8c6c0' }}
              >
                <div style={{ marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    background: article.categoryColor, color: article.categoryText,
                    padding: '2px 8px', borderRadius: 99, letterSpacing: '0.04em',
                  }}>
                    {article.category}
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1917', margin: '0 0 8px', lineHeight: 1.4, flex: 1 }}>
                  {article.title}
                </p>
                <p style={{ fontSize: 12, color: '#6b6960', lineHeight: 1.65, margin: '0 0 14px' }}>
                  {article.description.length > 100 ? article.description.slice(0, 100) + '…' : article.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                    {article.readTime} min read
                  </span>
                  {article.relatedTool && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      🔧 {article.relatedToolName}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Show more */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              padding: '10px 28px', borderRadius: 8, cursor: 'pointer',
              border: '1px solid #c8c6c0', background: '#ffffff', color: '#6b6960',
              transition: 'border-color 0.12s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a1917' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8c6c0' }}
          >
            Show all {filtered.length} articles
          </button>
        </div>
      )}

    </main>
  )
}