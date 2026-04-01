import Link from 'next/link'
import { tools, categoryLabel, categoryColors } from '@/lib/tools'
import type { Metadata } from 'next'
import SearchInput from '@/components/SearchInput'

export const metadata: Metadata = {
  title: 'FreeUtil — Free Online Tools for Everyone',
  description: 'Free online utility tools for developers, IT professionals, and everyday users. 100% free, no login required.',
  openGraph: {
    title: 'FreeUtil — Free Online Tools for Everyone',
    description: 'JWT decoder, JSON formatter, Base64, Thai date converter and 50+ free tools.',
    url: 'https://freeutil.app',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)', background: '#f8f7f4' }}>
      <nav style={{ background: '#ffffff', borderBottom: '0.5px solid #c8c6c0' }} className="px-6 py-3.5 flex items-center justify-between">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500, color: '#1a1917' }}>
          free<span style={{ opacity: 0.4 }}>util</span>
        </span>
        <div className="flex items-center gap-5">
          <Link href="/tools/jwt-decoder" style={{ fontSize: 13, color: '#6b6960', textDecoration: 'none' }}>tools</Link>
          <Link href="#" style={{ fontSize: 13, color: '#6b6960', textDecoration: 'none' }}>about</Link>
        </div>
      </nav>

      <div className="px-6 py-12" style={{ borderBottom: '0.5px solid #c8c6c0', background: '#ffffff' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', letterSpacing: '0.08em', marginBottom: 12 }}>
          {tools.length}+ tools · free · no login required
        </p>
        <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 12, color: '#1a1917' }}>
          Useful tools that<br /><strong style={{ fontWeight: 500 }}>actually work</strong>
        </h1>
        <p style={{ fontSize: 15, color: '#6b6960', lineHeight: 1.6, maxWidth: 440, marginBottom: 28 }}>
          Fast, client-side utilities for developers and everyday users. No server, no tracking, no nonsense.
        </p>
        <SearchInput />
      </div>

      <div className="mx-6 mt-5 mb-2">
        <div style={{ border: '0.5px dashed #c8c6c0', borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>advertisement · 728×90</span>
        </div>
      </div>

      <div className="px-6 py-6">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>all tools</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>{tools.length} tools</span>
        </div>
        <div id="toolGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1, background: '#c8c6c0', border: '0.5px solid #c8c6c0', borderRadius: 10, overflow: 'hidden' }}>
          {tools.map(tool => {
            const color = categoryColors[tool.category]
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card"
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
          })}
        </div>
      </div>

      <div className="mx-6 mb-6">
        <div style={{ border: '0.5px dashed #c8c6c0', borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>advertisement · 728×90</span>
        </div>
      </div>

      <footer style={{ borderTop: '0.5px solid #c8c6c0', background: '#ffffff', padding: '16px 24px' }} className="flex items-center justify-between">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>freeutil.app · built with Next.js + Cloudflare</span>
        <div className="flex gap-4">
          <Link href="#" style={{ fontSize: 11, color: '#a8a69e', textDecoration: 'none' }}>privacy</Link>
          <Link href="#" style={{ fontSize: 11, color: '#a8a69e', textDecoration: 'none' }}>about</Link>
        </div>
      </footer>
    </div>
  )
}
