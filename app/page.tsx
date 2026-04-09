import { Suspense } from 'react'
import Link from 'next/link'
import { tools, categoryLabel, categoryColors } from '@/lib/tools'
import type { Metadata } from 'next'
import HeroSearch from '@/components/HeroSearch'
import SearchableToolGrid from '@/components/SearchableToolGrid'
import HomeAdSlot from '@/components/HomeAdSlot'

export const metadata: Metadata = {
  title: 'FreeUtil — Free Online Tools for Everyone',
  description: 'Free online utility tools for developers, IT professionals, and everyday users. 100% free, no login required.',
  openGraph: {
    title: 'FreeUtil — Free Online Tools for Everyone',
    description: 'JWT decoder, JSON formatter, Base64, Thai date converter and 50+ free tools.',
    url: 'https://freeutil.app',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FreeUtil',
  url: 'https://freeutil.app',
  logo: 'https://freeutil.app/icon-512.png',
  description: 'Free online utility tools for developers and everyday users. 100% client-side, no login required.',
  sameAs: [],
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)', background: '#f8f7f4' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <nav style={{ background: '#ffffff', borderBottom: '0.5px solid #c8c6c0' }} className="px-6 py-3.5 flex items-center justify-between">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 500, color: '#1a1917' }}>
          free<span style={{ opacity: 0.4 }}>util</span>
        </span>
        <div className="flex items-center gap-5">
          <Link href="/tools" style={{ fontSize: 13, color: '#6b6960', textDecoration: 'none' }}>tools</Link>
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
        <Suspense>
          <HeroSearch />
        </Suspense>
      </div>

      <div className="mx-6 mt-5 mb-2">
        <HomeAdSlot />
      </div>

      <div className="px-6 py-6">
        <Suspense>
          <SearchableToolGrid tools={tools} categoryLabel={categoryLabel} categoryColors={categoryColors} />
        </Suspense>
      </div>

      <div className="mx-6 mb-6">
        <HomeAdSlot />
      </div>

      <footer style={{ borderTop: '0.5px solid #c8c6c0', background: '#ffffff', padding: '16px 24px' }} className="flex items-center justify-between">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>freeutil.app · built with Next.js + Cloudflare</span>
        <div className="flex gap-4">
          <Link href="/privacy" style={{ fontSize: 11, color: '#a8a69e', textDecoration: 'none' }}>privacy</Link>
          <Link href="#" style={{ fontSize: 11, color: '#a8a69e', textDecoration: 'none' }}>about</Link>
        </div>
      </footer>
    </div>
  )
}
