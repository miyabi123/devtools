'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

function AdUnit({ slot, format, layout, style }: {
  slot: string
  format: string
  layout?: string
  style?: React.CSSProperties
}) {
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}

    // Watch data-ad-status — fires immediately when AdSense fills/unfills the slot
    const observer = new MutationObserver(() => {
      if (insRef.current?.getAttribute('data-ad-status') === 'filled') {
        setFilled(true)
        observer.disconnect()
      }
    })
    if (insRef.current) {
      observer.observe(insRef.current, { attributes: true, attributeFilter: ['data-ad-status'] })
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ overflow: 'hidden', height: filled ? 'auto' : 0, width: '100%', ...style }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2562848751614063"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export function AdLeaderboard({ style }: { style?: React.CSSProperties }) {
  return <AdUnit slot="4258757514" format="auto" style={style} />
}

export function AdSidebar({ style }: { style?: React.CSSProperties }) {
  return <AdUnit slot="7704215914" format="auto" style={style} />
}

export function AdInArticle({ style }: { style?: React.CSSProperties }) {
  return <AdUnit slot="9484201440" format="fluid" layout="in-article" style={{ textAlign: 'center', ...style }} />
}