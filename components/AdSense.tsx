'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdProps {
  style?: React.CSSProperties
}

function AdUnit({ slot, format, layout, style }: {
  slot: string
  format: string
  layout?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      pushed.current = true
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-2562848751614063"
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { 'data-ad-layout': layout } : {})}
      data-full-width-responsive="true"
    />
  )
}

// Leaderboard — horizontal, under tool header
export function AdLeaderboard({ style }: AdProps) {
  return (
    <div style={{ width: '100%', overflow: 'hidden', ...style }}>
      <AdUnit slot="4258757514" format="auto" />
    </div>
  )
}

// Sidebar — square, right sidebar
export function AdSidebar({ style }: AdProps) {
  return (
    <div style={{ width: '100%', overflow: 'hidden', ...style }}>
      <AdUnit slot="7704215914" format="auto" />
    </div>
  )
}

// In-article — between how-to and FAQ
export function AdInArticle({ style }: AdProps) {
  return (
    <div style={{ width: '100%', overflow: 'hidden', textAlign: 'center', ...style }}>
      <AdUnit slot="9484201440" format="fluid" layout="in-article" style={{ textAlign: 'center' }} />
    </div>
  )
}
