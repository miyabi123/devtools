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
  const ref = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      pushed.current = true
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}

    // ตรวจว่า ads โหลดสำเร็จไหม หลัง 2 วินาที
    const timer = setTimeout(() => {
      const ins = ref.current?.querySelector('ins.adsbygoogle')
      const status = ins?.getAttribute('data-ad-status')
      if (status === 'filled') setVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        overflow: 'hidden',
        maxHeight: visible ? 200 : 0,
        transition: 'max-height 0.3s ease',
        ...style,
      }}
    >
      <ins
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