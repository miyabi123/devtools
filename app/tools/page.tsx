import Link from 'next/link'
import type { Metadata } from 'next'
import { tools, categoryLabel, categoryColors, toolsByCategory } from '@/lib/tools'
import type { ToolCategory } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'All Free Online Tools — FreeUtil',
  description: `Browse all ${tools.length}+ free online tools. Developer tools, file converters, Thai utilities and more. 100% client-side, no login required.`,
  alternates: { canonical: 'https://freeutil.app/tools' },
  openGraph: {
    title: 'All Free Online Tools — FreeUtil',
    description: `Browse all ${tools.length}+ free online tools — JWT, JSON, Base64, QR Code, Image Resize and more.`,
    url: 'https://freeutil.app/tools',
  },
}

const categories: ToolCategory[] = ['dev', 'thai', 'file', 'finance']

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://freeutil.app' },
    { '@type': 'ListItem', position: 2, name: 'All Tools', item: 'https://freeutil.app/tools' },
  ],
}

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)', background: '#f8f7f4' }}>
        {/* Nav */}
        <nav style={{ background: '#ffffff', borderBottom: '0.5px solid #c8c6c0' }} className="px-6 py-3.5 flex items-center justify-between">
          <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 500, color: '#1a1917', textDecoration: 'none' }}>
            free<span style={{ opacity: 0.4 }}>util</span>
          </Link>
          <div className="flex items-center gap-5">
            <span style={{ fontSize: 13, color: '#1a1917' }}>tools</span>
            <Link href="#" style={{ fontSize: 13, color: '#6b6960', textDecoration: 'none' }}>about</Link>
          </div>
        </nav>

        {/* Header */}
        <div className="px-6 py-10" style={{ background: '#ffffff', borderBottom: '0.5px solid #c8c6c0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Link href="/" style={{ fontSize: 12, color: '#a8a69e', textDecoration: 'none' }}>Home</Link>
            <span style={{ fontSize: 12, color: '#c8c6c0' }}>/</span>
            <span style={{ fontSize: 12, color: '#6b6960' }}>All Tools</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#1a1917', marginBottom: 8 }}>
            All <strong style={{ fontWeight: 500 }}>free tools</strong>
          </h1>
          <p style={{ fontSize: 14, color: '#6b6960' }}>
            {tools.length} tools · 100% client-side · no login required
          </p>
        </div>

        {/* Tool list by category */}
        <div className="px-6 py-8" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {categories.map(cat => {
            const catTools = toolsByCategory(cat)
            if (catTools.length === 0) return null
            const color = categoryColors[cat]
            return (
              <section key={cat}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                    padding: '4px 10px', borderRadius: 99,
                    background: color.bg, color: color.text,
                  }}>
                    {categoryLabel[cat]}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>
                    {catTools.length} tools
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 1, background: '#c8c6c0',
                  border: '0.5px solid #c8c6c0', borderRadius: 10, overflow: 'hidden',
                }}>
                  {catTools.map(tool => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}
                      style={{ background: '#ffffff', padding: '16px', textDecoration: 'none', display: 'block' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: color.bg }} />
                        <div style={{ display: 'flex', gap: 4 }}>
                          {tool.isNew && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', borderRadius: 99, background: '#eeedfe', color: '#3c3489', fontWeight: 500 }}>new</span>}
                          {tool.isPopular && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', borderRadius: 99, background: '#faece7', color: '#712b13', fontWeight: 500 }}>popular</span>}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1917', marginBottom: 4 }}>{tool.name}</p>
                      <p style={{ fontSize: 11, color: '#6b6960', lineHeight: 1.5 }}>{tool.shortDesc}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <footer style={{ borderTop: '0.5px solid #c8c6c0', background: '#ffffff', padding: '16px 24px' }} className="flex items-center justify-between">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>freeutil.app · built with Next.js + Cloudflare</span>
          <div className="flex gap-4">
            <Link href="/privacy" style={{ fontSize: 11, color: '#a8a69e', textDecoration: 'none' }}>privacy</Link>
            <Link href="#" style={{ fontSize: 11, color: '#a8a69e', textDecoration: 'none' }}>about</Link>
          </div>
        </footer>
      </div>
    </>
  )
}
