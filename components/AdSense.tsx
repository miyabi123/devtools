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
  // 'pending' = waiting for AdSense response (visible so AdSense can measure width)
  // 'filled'  = ad loaded — show
  // 'unfilled' = no ad — hide
  const [status, setStatus] = useState<'pending' | 'filled' | 'unfilled'>('pending')

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true

    // Observe before push so we catch the first attribute change
    const observer = new MutationObserver(() => {
      const adStatus = insRef.current?.getAttribute('data-ad-status')
      if (adStatus === 'filled') {
        setStatus('filled')
        observer.disconnect()
      } else if (adStatus === 'unfilled') {
        setStatus('unfilled')
        observer.disconnect()
      }
    })
    if (insRef.current) {
      observer.observe(insRef.current, { attributes: true, attributeFilter: ['data-ad-status'] })
    }

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}

    return () => observer.disconnect()
  }, [])

  // pending: absolute + visibility:hidden → ไม่กิน layout แต่ AdSense วัด width ได้
  // filled:  normal flow
  // unfilled: height:0 → ซ่อน ไม่มี blank space
  const isPending = status === 'pending'
  return (
    <div style={{ position: 'relative', width: '100%', height: status === 'unfilled' ? 0 : 'auto', overflow: 'hidden', ...style }}>
      <div style={{
        position: isPending ? 'absolute' : 'static',
        visibility: isPending ? 'hidden' : 'visible',
        width: '100%',
        pointerEvents: isPending ? 'none' : 'auto',
      }}>
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