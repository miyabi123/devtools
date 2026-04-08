'use client'

import { useState, useCallback } from 'react'

// UUID v4 using Web Crypto API
function uuidV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

// UUID v1 (time-based simulation)
function uuidV1(): string {
  const now = Date.now()
  const timeHigh = Math.floor(now / 0x100000000)
  const timeLow = now & 0xffffffff
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const tl = timeLow.toString(16).padStart(8, '0')
  const tm = ((timeHigh & 0xffff)).toString(16).padStart(4, '0')
  const th = ((timeHigh >>> 16) | 0x1000).toString(16).padStart(4, '0')
  const cs = ((bytes[8] & 0x3f) | 0x80).toString(16).padStart(2, '0') + bytes[9].toString(16).padStart(2, '0')
  const node = Array.from(bytes.slice(10)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${tl}-${tm}-${th}-${cs}-${node}`
}

// UUID v5 (namespace + name SHA-1 based simulation)
async function uuidV5(namespace: string, name: string): Promise<string> {
  const nsBytes = namespace.replace(/-/g, '').match(/.{2}/g)?.map(h => parseInt(h, 16)) || new Array(16).fill(0)
  const nameBytes = new TextEncoder().encode(name)
  const combined = new Uint8Array([...nsBytes, ...nameBytes])
  const hashBuffer = await crypto.subtle.digest('SHA-1', combined)
  const bytes = new Uint8Array(hashBuffer).slice(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

const NS_PRESETS = [
  { label: 'DNS', value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
  { label: 'URL', value: '6ba7b811-9dad-11d1-80b4-00c04fd430c8' },
  { label: 'OID', value: '6ba7b812-9dad-11d1-80b4-00c04fd430c8' },
]

const FORMATS = [
  { label: 'Standard', fn: (u: string) => u },
  { label: 'UPPERCASE', fn: (u: string) => u.toUpperCase() },
  { label: 'No hyphens', fn: (u: string) => u.replace(/-/g, '') },
  { label: 'Braces', fn: (u: string) => `{${u}}` },
]

export default function UuidGenerator() {
  const [version, setVersion] = useState<'v4' | 'v1' | 'v5'>('v4')
  const [quantity, setQuantity] = useState(1)
  const [format, setFormat] = useState(0)
  const [uuids, setUuids] = useState<string[]>([])
  const [ns, setNs] = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
  const [name, setName] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [autoMode, setAutoMode] = useState(false)
  const [v5Names, setV5Names] = useState<string[]>([''])
  const [nsMode, setNsMode] = useState<'preset' | 'custom'>('preset')

  const generate = useCallback(async () => {
    const results: string[] = []

    if (version === 'v5') {
      const namesToUse = v5Names.filter(n => n.trim())
      if (namesToUse.length === 0) namesToUse.push('example')
      for (const n of namesToUse) {
        results.push(await uuidV5(ns, n))
      }
    } else {
      for (let i = 0; i < quantity; i++) {
        if (version === 'v4') results.push(uuidV4())
        else if (version === 'v1') results.push(uuidV1())
      }
    }

    setUuids(results)
  }, [version, quantity, ns, name, v5Names])

  const applyFormat = (u: string) => FORMATS[format].fn(u)

  const copy = async (text: string, k: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(k); setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = async () => {
    const all = uuids.map(u => applyFormat(u)).join('\n')
    await navigator.clipboard.writeText(all)
    setCopied('all'); setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="space-y-4">

      {/* Version selector */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {(['v4', 'v1', 'v5'] as const).map(v => (
            <button key={v} onClick={() => { setVersion(v); setUuids([]) }} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 16px',
              background: version === v ? '#1a1917' : 'transparent',
              color: version === v ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>UUID {v}</button>
          ))}
        </div>

        {/* Version description */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
          {version === 'v4' && 'random · most common'}
          {version === 'v1' && 'time-based · sortable'}
          {version === 'v5' && 'namespace + name · deterministic'}
        </span>
      </div>

      {/* v5 options */}
      {version === 'v5' && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>namespace & names</span>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Namespace */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px' }}>NAMESPACE</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {[...NS_PRESETS, { label: 'Custom', value: 'custom' }].map(p => (
                  <button key={p.label}
                    onClick={() => {
                      if (p.value !== 'custom') setNs(p.value)
                      setNsMode(p.value === 'custom' ? 'custom' : 'preset')
                    }}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                      background: (p.value === 'custom' ? nsMode === 'custom' : ns === p.value && nsMode !== 'custom') ? '#1a1917' : '#f8f7f4',
                      color: (p.value === 'custom' ? nsMode === 'custom' : ns === p.value && nsMode !== 'custom') ? '#f8f7f4' : '#6b6960',
                      border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                    }}>{p.label}</button>
                ))}
              </div>
              {nsMode === 'custom' && (
                <input type="text" value={ns} onChange={e => setNs(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 10px', border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', color: '#1a1917', background: '#f8f7f4' }} />
              )}
              {nsMode !== 'custom' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', padding: '6px 10px', background: '#f8f7f4', borderRadius: 6 }}>{ns}</div>
              )}
            </div>

            {/* Names list */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0 }}>NAMES — one per line = one UUID each</p>
                <button onClick={() => setV5Names(prev => [...prev, ''])} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 10px',
                  background: 'transparent', color: '#6b6960',
                  border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                }}>+ add name</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {v5Names.map((n, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', minWidth: 16 }}>{i + 1}</span>
                    <input
                      type="text"
                      value={n}
                      onChange={e => {
                        const next = [...v5Names]
                        next[i] = e.target.value
                        setV5Names(next)
                      }}
                      placeholder={`name ${i + 1} e.g. example.com`}
                      style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, padding: '7px 10px', border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', color: '#1a1917', background: '#ffffff' }}
                    />
                    {v5Names.length > 1 && (
                      <button onClick={() => setV5Names(prev => prev.filter((_, j) => j !== i))} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a8a69e',
                        background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px',
                      }}>×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Options row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

          {version !== 'v5' && (
            <>
              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ffffff', border: '0.5px solid #c8c6c0', borderRadius: 6, padding: '4px 10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>qty</span>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}>−</button>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: '#1a1917', minWidth: 28, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(100, q + 1))} style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}>+</button>
              </div>

              {/* Quick qty */}
              {[1, 5, 10, 25, 50].map(n => (
                <button key={n} onClick={() => setQuantity(n)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 10px',
                  background: quantity === n ? '#1a1917' : '#ffffff',
                  color: quantity === n ? '#f8f7f4' : '#6b6960',
                  border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                }}>{n}</button>
              ))}
            </>
          )}

          {/* Format */}
          <select value={format} onChange={e => setFormat(Number(e.target.value))} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 10px',
            background: '#ffffff', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, outline: 'none', cursor: 'pointer',
          }}>
            {FORMATS.map((f, i) => <option key={i} value={i}>{f.label}</option>)}
          </select>

          {/* Auto mode */}
          {version !== 'v5' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
              <input type="checkbox" checked={autoMode} onChange={e => setAutoMode(e.target.checked)} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>auto-regenerate</span>
            </label>
          )}

        </div>

      {/* Generate button */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={generate} style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 28px',
          background: '#1a1917', color: '#f8f7f4',
          border: 'none', borderRadius: 7, cursor: 'pointer',
        }}>
          Generate {version === 'v5' ? `${v5Names.filter(n => n.trim()).length || 1} UUID${v5Names.filter(n => n.trim()).length > 1 ? 's' : ''}` : quantity > 1 ? `${quantity} UUIDs` : 'UUID'}
        </button>
        {uuids.length > 1 && (
          <button onClick={copyAll} style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 20px',
            background: 'transparent', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 7, cursor: 'pointer',
          }}>{copied === 'all' ? 'copied!' : `copy all ${uuids.length}`}</button>
        )}
      </div>

      {/* Results */}
      {uuids.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              {uuids.length} UUID{uuids.length > 1 ? 's' : ''} · {FORMATS[format].label} · {version}
            </span>
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {uuids.map((u, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 14px', borderBottom: i < uuids.length - 1 ? '0.5px solid #f0ede8' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', letterSpacing: '0.02em' }}>
                  {applyFormat(u)}
                </span>
                <button onClick={() => copy(applyFormat(u), `u${i}`)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px', flexShrink: 0,
                  background: copied === `u${i}` ? '#e1f5ee' : 'transparent',
                  color: copied === `u${i}` ? '#085041' : '#a8a69e',
                  border: `0.5px solid ${copied === `u${i}` ? '#1D9E75' : '#e8e6e0'}`,
                  borderRadius: 3, cursor: 'pointer', transition: 'all .15s',
                }}>{copied === `u${i}` ? '✓' : 'copy'}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>UUID VERSIONS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { v: 'v1', desc: 'Time-based + MAC address. Sortable chronologically.' },
            { v: 'v4', desc: 'Randomly generated. Most widely used. 122 bits of randomness.' },
            { v: 'v5', desc: 'SHA-1 hash of namespace + name. Same input = same UUID always.' },
          ].map(r => (
            <div key={r.v} style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', minWidth: 20 }}>{r.v}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
