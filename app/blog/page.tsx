import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Blog — Developer Guides & Tool Tutorials | FreeUtil',
  description: 'In-depth guides on JWT, Base64, regex, CIDR, SSL certificates, OpenSSL, Thai tax calculation, and more. Practical tutorials for developers and IT professionals.',
  keywords: ['developer guides', 'jwt tutorial', 'ssl certificate guide', 'regex tutorial', 'cidr guide', 'thai tax 2568'],
  alternates: { canonical: 'https://freeutil.app/blog' },
  openGraph: {
    title: 'Blog — Developer Guides & Tutorials | FreeUtil',
    description: 'Practical guides for developers, sysadmins, and IT professionals.',
    url: 'https://freeutil.app/blog',
  },
}

const CATEGORIES = ['Dev / IT', 'OpenSSL & Cert', 'Thai Tools', 'File & Image']

export default function BlogPage() {
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px 80px', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.08em', marginBottom: 12 }}>
          GUIDES & TUTORIALS
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1917', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Developer Guides
        </h1>
        <p style={{ fontSize: 15, color: '#6b6960', lineHeight: 1.7, maxWidth: 560 }}>
          In-depth articles on the tools, technologies, and concepts behind FreeUtil. Written for developers, sysadmins, and IT professionals.
        </p>
      </div>

      {/* Articles by category */}
      {CATEGORIES.map(cat => {
        const catArticles = articles.filter(a => a.category === cat)
        if (catArticles.length === 0) return null
        const sample = catArticles[0]
        return (
          <section key={cat} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
                padding: '3px 10px', borderRadius: 99,
                background: sample.categoryColor, color: sample.categoryText,
              }}>{cat}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                {catArticles.length} articles
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#c8c6c0', border: '1px solid #c8c6c0', borderRadius: 10, overflow: 'hidden' }}>
              {catArticles.map(article => (
                <Link key={article.slug} href={`/blog/${article.slug}`}
                  style={{ background: '#ffffff', padding: '16px 18px', textDecoration: 'none', display: 'block' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a1917', margin: '0 0 4px', lineHeight: 1.4 }}>
                        {article.title}
                      </h2>
                      <p style={{ fontSize: 12, color: '#6b6960', margin: '0 0 8px', lineHeight: 1.6 }}>
                        {article.description}
                      </p>
                      {article.relatedTool && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px',
                          background: article.categoryColor, color: article.categoryText,
                          borderRadius: 4,
                        }}>🔧 {article.relatedToolName}</span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                        {article.readTime} min read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

    </main>
  )
}
