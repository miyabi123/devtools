// app/page.tsx
import Link from 'next/link'
import { tools, categoryLabel, categoryColors, type ToolCategory } from '@/lib/tools'
import { articles } from '@/lib/articles'
import HomeAdSlot from '@/components/HomeAdSlot'

const popularTools = tools.filter(t => t.isPopular).slice(0, 8)

const categories: { key: ToolCategory; icon: string; desc: string }[] = [
  { key: 'dev',     icon: '{ }',  desc: 'JSON, JWT, Base64, Regex, UUID' },
  { key: 'thai',    icon: 'ก ข',  desc: 'วันที่ ภาษี VAT บัตรประชาชน' },
  { key: 'file',    icon: '⇄',    desc: 'Images, QR codes, Favicons' },
  { key: 'finance', icon: '฿',    desc: 'VAT, Tax, Loan, Income calculators' },
  { key: 'openssl', icon: '🔒',   desc: 'Certs, CSR, RSA Keys, PEM/DER' },
  { key: 'linux',   icon: '$_',   desc: 'chmod, cron, permissions' },
]

const recentArticles = [...articles]
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 3)

const totalTools = tools.length

export const metadata = {
  title: 'FreeUtil — Free Online Tools for Developers & Everyone',
  description: `${totalTools}+ free browser-based tools for developers, IT professionals, and Thai users. JSON formatter, JWT decoder, Base64, CIDR calculator, Thai date converter, and more. No login, no install.`,
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#f8f7f4', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '64px 20px 48px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e',
          letterSpacing: '0.1em', marginBottom: 16,
        }}>
          {totalTools}+ TOOLS · FREE · NO LOGIN REQUIRED
        </p>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: '#1a1917',
          lineHeight: 1.15, letterSpacing: '-0.03em', margin: '0 0 20px',
          maxWidth: 640,
        }}>
          Useful tools that<br />
          <span style={{ color: '#6b6960' }}>actually work.</span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b6960', lineHeight: 1.7, maxWidth: 480, margin: '0 0 32px' }}>
          Fast, client-side utilities for developers and everyday users.
          No server, no tracking, no nonsense.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#1a1917', color: '#f8f7f4',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            padding: '11px 22px', borderRadius: 8, textDecoration: 'none',
          }}>
            Browse all tools →
          </Link>
          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#ffffff', color: '#1a1917',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            padding: '11px 22px', borderRadius: 8, textDecoration: 'none',
            border: '1px solid #c8c6c0',
          }}>
            Read the blog
          </Link>
        </div>
      </section>

      {/* ── Popular Tools ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e',
            letterSpacing: '0.08em', margin: 0,
          }}>
            POPULAR TOOLS
          </p>
          <Link href="/tools" style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960',
            textDecoration: 'none',
          }}>
            View all →
          </Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 10,
        }}>
          {popularTools.map(tool => {
            const c = categoryColors[tool.category]
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
                <div className="tool-card" style={{
                  background: '#ffffff', border: '1px solid #c8c6c0',
                  borderRadius: 10, padding: '16px 18px',
                  height: '100%', boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                >
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    background: c.bg, color: c.text,
                    padding: '2px 8px', borderRadius: 99, marginBottom: 10,
                    letterSpacing: '0.04em',
                  }}>
                    {categoryLabel[tool.category]}
                  </span>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1917', margin: '0 0 4px', lineHeight: 1.3 }}>
                    {tool.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', margin: 0, lineHeight: 1.5 }}>
                    {tool.shortDesc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Ad slot ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 40px' }}>
        <HomeAdSlot />
      </div>

      {/* ── Categories ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 56px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e',
          letterSpacing: '0.08em', marginBottom: 20,
        }}>
          CATEGORIES
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 10,
        }}>
          {categories.map(cat => {
            const c = categoryColors[cat.key]
            const count = tools.filter(t => t.category === cat.key).length
            return (
              <Link key={cat.key} href={`/tools?cat=${cat.key}`} style={{ textDecoration: 'none' }}>
                <div className="cat-card" style={{
                  background: '#ffffff', border: '1px solid #c8c6c0',
                  borderRadius: 10, padding: '18px 20px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: c.bg, color: c.text,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {cat.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1917', margin: '0 0 2px' }}>
                      {categoryLabel[cat.key]}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', marginLeft: 6 }}>
                        {count}
                      </span>
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0, lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Latest articles ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e',
            letterSpacing: '0.08em', margin: 0,
          }}>
            FROM THE BLOG
          </p>
          <Link href="/blog" style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960',
            textDecoration: 'none',
          }}>
            All articles →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid #c8c6c0', borderRadius: 10, overflow: 'hidden' }}>
          {recentArticles.map((article, i) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div className="article-row" style={{
                background: '#ffffff',
                borderBottom: i < recentArticles.length - 1 ? '1px solid #e8e6e0' : 'none',
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9,
                      background: article.categoryColor, color: article.categoryText,
                      padding: '2px 8px', borderRadius: 99, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    }}>
                      {article.category}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1917', margin: '0 0 2px', lineHeight: 1.4 }}>
                    {article.title}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0 }}>
                    {article.readTime} min read
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#c8c6c0', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .tool-card { transition: border-color 0.15s, box-shadow 0.15s; }
        .tool-card:hover { border-color: #1a1917 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
        .cat-card { transition: border-color 0.15s; }
        .cat-card:hover { border-color: #1a1917 !important; }
        .article-row { transition: background 0.1s; }
        .article-row:hover { background: #fafaf9 !important; }
      `}</style>

    </div>
  )
}