'use client'

import Link from 'next/link'
import { Tool, getRelatedTools, categoryLabel, categoryColors } from '@/lib/tools'
import { AdLeaderboard, AdSidebar, AdInArticle } from '@/components/AdSense'

interface Props {
  tool: Tool
  children: React.ReactNode
}

export default function ToolLayout({ tool, children }: Props) {
  const related = getRelatedTools(tool)
  const color = categoryColors[tool.category]

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[#c8c6c0]">
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 500, color: '#1a1917', letterSpacing: '-0.02em', textDecoration: 'none' }}>
            free<span style={{ opacity: 0.4 }}>util</span>
        </Link>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#a8a69e]">
          <Link href="/" className="hover:text-[#1a1917] transition-colors">← all tools</Link>
          <span>/</span>
          <span className="text-[#6b6960]">{tool.slug}</span>
        </div>
      </nav>

      <div className="flex flex-1">

        {/* Main content */}
        <main className="flex-1 border-r border-[#c8c6c0] min-w-0">

          {/* Tool header */}
          <div className="px-6 py-6 border-b border-[#c8c6c0]">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full tracking-wide"
                style={{ background: color.bg, color: color.text }}
              >
                {categoryLabel[tool.category]}
              </span>
              {tool.isNew && (
                <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#eeedfe] text-[#3c3489]">new</span>
              )}
              {tool.isPopular && (
                <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#faece7] text-[#712b13]">popular</span>
              )}
            </div>
            <h1 className="text-[22px] font-light tracking-tight mb-2">{tool.name}</h1>
            <p className="text-[15px] text-[#6b6960] leading-relaxed max-w-xl">{tool.longDesc}</p>
          </div>

          {/* Ad slot — top (728×90 leaderboard) */}
          <div className="mx-6 mt-5">
            <AdLeaderboard style={{ marginBottom: 16 }} />
          </div>

          {/* Tool-specific UI */}
          <div className="px-6 py-5">
            {children}
          </div>

          {/* SEO content — HowTo + FAQ */}
          <div className="px-6 pb-8 border-t border-[#c8c6c0] mt-4 pt-6 space-y-6">

            <section>
              <h2 className="font-mono text-[13px] text-[#6b6960] tracking-wide mb-3 font-medium">how to use</h2>
              <ol className="space-y-2">
                {tool.howTo.map((step, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-[#6b6960]">
                    <span className="font-mono text-[14px] text-[#6b6960] mt-0.5 flex-shrink-0 w-5">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
            
            <AdInArticle style={{ margin: '16px 0' }} />

            <section>
              <h2 className="font-mono text-[13px] text-[#6b6960] tracking-wide mb-3 font-medium">frequently asked</h2>
              <div className="space-y-4">
                {tool.faq.map((item, i) => (
                  <div key={i}>
                    <p className="text-[15px] font-medium text-[#1a1917] mb-1">{item.q}</p>
                    <p className="text-[15px] text-[#6b6960] leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-[240px] flex-shrink-0 p-4 hidden lg:block">

          {/* Ad slot — sidebar (240×400) */}
          <AdSidebar style={{ marginBottom: 20 }} />

          {/* Related tools */}
          {related.length > 0 && (
            <div className="mt-5">
              <p className="font-mono text-[13px] text-[#6b6960] tracking-wide mb-3 font-medium">related tools</p>
              <div className="space-y-1">
                {related.map(t => {
                  const c = categoryColors[t.category]
                  return (
                    <Link
                      key={t.slug}
                      href={`/tools/${t.slug}`}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white transition-colors group"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex-shrink-0 mt-0.5"
                        style={{ background: c.bg }}
                      />
                      <div>
                        <p className="text-[12px] font-medium text-[#1a1917] group-hover:text-[#3c3489] transition-colors">{t.name}</p>
                        <p className="text-[10px] text-[#a8a69e] leading-tight mt-0.5">{t.shortDesc}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Privacy note */}
          <div className="mt-5 p-3 bg-white border border-[#e8e6e0] rounded-lg">
            <p className="font-mono text-[10px] text-[#a8a69e] tracking-widest mb-1.5">privacy</p>
            <p className="text-[11px] text-[#6b6960] leading-relaxed mb-2">
              All processing runs in your browser. No data is sent to any server.
            </p>
            <Link href="/privacy" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', textDecoration: 'underline' }}>
              Privacy Policy →
            </Link>
          </div>
        </aside>

      </div>
    </div>
  )
}
