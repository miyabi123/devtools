'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Presets ───────────────────────────────────────────────────────
const PRESETS: { label: string; code: string }[] = [
  {
    label: 'Flowchart',
    code: `flowchart TD
    A([Start]) --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix the bug]
    E --> B
    C --> F([End])`,
  },
  {
    label: 'Sequence',
    code: `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database

    U->>F: Submit form
    F->>A: POST /api/data
    A->>D: INSERT query
    D-->>A: Row inserted
    A-->>F: 201 Created
    F-->>U: Show success`,
  },
  {
    label: 'ERD',
    code: `erDiagram
    USER {
        int id PK
        string name
        string email
    }
    ORDER {
        int id PK
        int user_id FK
        decimal total
        string status
    }
    PRODUCT {
        int id PK
        string name
        decimal price
    }
    ORDER_ITEM {
        int order_id FK
        int product_id FK
        int quantity
    }
    USER ||--o{ ORDER : "places"
    ORDER ||--|{ ORDER_ITEM : "contains"
    PRODUCT ||--o{ ORDER_ITEM : "included in"`,
  },
  {
    label: 'Mind Map',
    code: `mindmap
  root((Project))
    Frontend
      React
      TypeScript
      Tailwind
    Backend
      Node.js
      PostgreSQL
      Redis
    DevOps
      Docker
      CI/CD
      Monitoring`,
  },
  {
    label: 'Gantt',
    code: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Design
    Wireframes        :done,    d1, 2025-01-01, 7d
    UI Design         :done,    d2, after d1, 7d
    section Development
    Frontend          :active,  dev1, 2025-01-15, 14d
    Backend           :         dev2, after dev1, 14d
    section Testing
    QA Testing        :         qa1, after dev2, 7d
    section Launch
    Deployment        :         launch, after qa1, 2d`,
  },
  {
    label: 'Pie Chart',
    code: `pie title Traffic Sources
    "Organic Search" : 42.5
    "Direct" : 25.3
    "Social Media" : 18.2
    "Referral" : 9.8
    "Email" : 4.2`,
  },
  {
    label: 'Git Graph',
    code: `gitGraph
    commit id: "Initial commit"
    commit id: "Add README"
    branch feature/login
    checkout feature/login
    commit id: "Add login form"
    commit id: "Add validation"
    checkout main
    branch hotfix
    commit id: "Fix typo"
    checkout main
    merge hotfix
    merge feature/login id: "Merge login"
    commit id: "Release v1.0"`,
  },
  {
    label: 'State',
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : fetch()
    Loading --> Success : data received
    Loading --> Error : request failed
    Success --> Idle : reset()
    Error --> Loading : retry()
    Error --> Idle : dismiss()
    Success --> [*] : close()`,
  },
  {
    label: 'Sankey',
    code: `sankey-beta
    Revenue,Product A,300
    Revenue,Product B,200
    Revenue,Product C,100
    Product A,COGS,120
    Product A,Gross Profit,180
    Product B,COGS,80
    Product B,Gross Profit,120
    Product C,COGS,40
    Product C,Gross Profit,60
    Gross Profit,Operating Expenses,150
    Gross Profit,Net Profit,210`,
  },
  {
    label: 'Sequence (Auth)',
    code: `sequenceDiagram
    autonumber
    actor U as User
    participant App
    participant Auth as Auth Server
    participant DB

    U->>App: Login (email + password)
    App->>Auth: Validate credentials
    Auth->>DB: Query user
    DB-->>Auth: User record
    Auth-->>App: JWT token
    App-->>U: Set cookie + redirect
    Note over U,App: User is now authenticated`,
  },
]

// ── Mermaid type (matches mermaid@10 API) ─────────────────────────
interface MermaidAPI {
  initialize: (cfg: Record<string, unknown>) => void
  render: (id: string, code: string, el?: HTMLElement) => Promise<{ svg: string }>
}

// ── Component ─────────────────────────────────────────────────────
export default function MermaidDiagram() {
  const [code, setCode]                 = useState(PRESETS[0].code)
  const [activePreset, setActivePreset] = useState(0)
  const [svgOutput, setSvgOutput]       = useState('')
  const [error, setError]               = useState('')
  const [ready, setReady]               = useState(false)
  const [copying, setCopying]           = useState(false)
  const [theme, setTheme]               = useState<'default' | 'neutral' | 'dark' | 'forest'>('default')

  const renderSeq  = useRef(0)
  const mermaidRef = useRef<MermaidAPI | null>(null)
  // mermaid v10 render() requires a real mounted DOM element
  const hiddenRef  = useRef<HTMLDivElement>(null)

  // Dynamic import mermaid from npm — no CDN, works on Cloudflare Pages
  useEffect(() => {
    import('mermaid').then(mod => {
      mermaidRef.current = mod.default as unknown as MermaidAPI
      setReady(true)
    }).catch(() => {
      setError('Failed to load Mermaid')
    })
  }, [])

  // Re-render whenever code / theme / ready changes
  const doRender = useCallback(async (src: string, t: string) => {
    const m = mermaidRef.current
    if (!ready || !m) return
    const seq = ++renderSeq.current

    try {
      m.initialize({
        startOnLoad: false,
        theme: t,
        securityLevel: 'loose',
      })

      const uid = `mmd-${seq}-${Date.now()}`
      const { svg } = await m.render(uid, src, hiddenRef.current ?? undefined)

      if (renderSeq.current !== seq) return // stale
      setSvgOutput(svg)
      setError('')
    } catch (e: unknown) {
      if (renderSeq.current !== seq) return
      const raw = e instanceof Error ? e.message : String(e)
      const msg = raw.split('\n')[0]
        .replace(/^Parse error on line \d+:/i, 'Parse error:')
        .trim()
      setError(msg || 'Invalid Mermaid syntax')
      setSvgOutput('')
    }
  }, [ready])

  useEffect(() => {
    const t = setTimeout(() => doRender(code, theme), 350)
    return () => clearTimeout(t)
  }, [code, theme, doRender])

  // ── Exports ───────────────────────────────────────────────────
  const exportSvg = () => {
    if (!svgOutput) return
    const a = document.createElement('a')
    a.download = 'diagram.svg'
    a.href = URL.createObjectURL(new Blob([svgOutput], { type: 'image/svg+xml' }))
    a.click()
  }

  const exportPng = () => {
    if (!svgOutput) return
    const url = URL.createObjectURL(new Blob([svgOutput], { type: 'image/svg+xml' }))
    const img = new Image()
    img.onload = () => {
      const scale = 2
      const c = document.createElement('canvas')
      c.width  = img.width  * scale
      c.height = img.height * scale
      const ctx = c.getContext('2d')!
      ctx.scale(scale, scale)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, img.width, img.height)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      const a = document.createElement('a')
      a.download = 'diagram.png'
      a.href = c.toDataURL('image/png')
      a.click()
    }
    img.src = url
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopying(true)
    setTimeout(() => setCopying(false), 1500)
  }

  // ── UI ────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Hidden render target — mermaid v10 needs a mounted DOM node */}
      <div
        ref={hiddenRef}
        aria-hidden="true"
        style={{ position: 'fixed', left: -99999, top: 0, visibility: 'hidden', pointerEvents: 'none' }}
      />

      {/* Preset pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => { setCode(p.code); setActivePreset(i) }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 12px',
              borderRadius: 99,
              border:     `1px solid ${activePreset === i ? '#3c3489' : '#c8c6c0'}`,
              background: activePreset === i ? '#eeedfe' : '#ffffff',
              color:      activePreset === i ? '#3c3489' : '#6b6960',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* Editor + Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Left: editor */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#f8f7f4', border: '1.5px solid #1a1917',
            borderRadius: '10px 10px 0 0', padding: '8px 12px',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>
              MERMAID CODE
            </span>
            <button
              onClick={copyCode}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                borderRadius: 6,
                border:     `0.5px solid ${copying ? '#1D9E75' : '#c8c6c0'}`,
                background: copying ? '#e1f5ee' : '#ffffff',
                color:      copying ? '#085041' : '#6b6960',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >{copying ? '✓ copied' : 'copy'}</button>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1, resize: 'none', padding: '14px',
              border: '1.5px solid #1a1917', borderTop: 'none',
              borderRadius: '0 0 10px 10px',
              fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7,
              color: '#1a1917', background: '#ffffff', outline: 'none',
              minHeight: 460, tabSize: 2,
            }}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault()
                const el = e.currentTarget
                const s = el.selectionStart, en = el.selectionEnd
                el.value = el.value.slice(0, s) + '  ' + el.value.slice(en)
                el.selectionStart = el.selectionEnd = s + 2
                setCode(el.value)
              }
            }}
          />
        </div>

        {/* Right: preview */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#f8f7f4', border: '1.5px solid #1a1917',
            borderRadius: '10px 10px 0 0', padding: '8px 12px',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>
              PREVIEW
            </span>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value as typeof theme)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 8px',
                border: '0.5px solid #c8c6c0', borderRadius: 6,
                background: '#ffffff', color: '#6b6960',
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="default">Default</option>
              <option value="neutral">Neutral</option>
              <option value="forest">Forest</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div style={{
            flex: 1, border: '1.5px solid #1a1917', borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            background: theme === 'dark' ? '#1a1917' : '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'auto', padding: 20, minHeight: 460,
          }}>
            {!ready && !error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a8a69e' }}>
                Loading…
              </p>
            )}
            {ready && error && (
              <div style={{
                background: '#fcebeb', border: '1px solid #f09595',
                borderRadius: 8, padding: '12px 16px', maxWidth: '90%',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a32d2d', letterSpacing: '0.06em', margin: '0 0 6px' }}>
                  SYNTAX ERROR
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a32d2d', margin: 0, lineHeight: 1.6 }}>
                  {error}
                </p>
              </div>
            )}
            {!error && svgOutput && (
              <div
                dangerouslySetInnerHTML={{ __html: svgOutput }}
                style={{ maxWidth: '100%', overflow: 'auto' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Export buttons */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={exportSvg}
          disabled={!svgOutput}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 18px',
            border: '1px solid #c8c6c0', borderRadius: 8,
            background: '#ffffff', color: svgOutput ? '#1a1917' : '#a8a69e',
            cursor: svgOutput ? 'pointer' : 'not-allowed',
          }}
        >↓ Export SVG</button>
        <button
          onClick={exportPng}
          disabled={!svgOutput}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 18px',
            border: '1px solid #1a1917', borderRadius: 8,
            background: svgOutput ? '#1a1917' : '#f8f7f4',
            color: svgOutput ? '#f8f7f4' : '#a8a69e',
            cursor: svgOutput ? 'pointer' : 'not-allowed',
          }}
        >↓ Export PNG</button>
      </div>

      {/* GitHub tip */}
      <div style={{ background: '#eeedfe', border: '0.5px solid #8b7fd4', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#3c3489', margin: 0, lineHeight: 1.7 }}>
          💡 <strong>GitHub tip:</strong> Paste your code inside a{' '}
          <code style={{ background: '#d4d0f8', padding: '1px 5px', borderRadius: 3 }}>```mermaid</code>{' '}
          block in any README or PR — GitHub renders it automatically.
        </p>
      </div>

    </div>
  )
}