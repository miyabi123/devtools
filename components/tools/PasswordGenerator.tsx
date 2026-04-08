'use client'

import { useState, useCallback, useEffect } from 'react'

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'iIlL1oO0',
}

function generatePassword(length: number, opts: {
  upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; excludeSimilar: boolean
}): string {
  let charset = ''
  if (opts.upper) charset += CHARS.upper
  if (opts.lower) charset += CHARS.lower
  if (opts.numbers) charset += CHARS.numbers
  if (opts.symbols) charset += CHARS.symbols
  if (opts.excludeSimilar) charset = charset.split('').filter(c => !CHARS.similar.includes(c)).join('')
  if (!charset) charset = CHARS.lower

  const bytes = crypto.getRandomValues(new Uint8Array(length * 2))
  let result = ''
  let i = 0
  while (result.length < length && i < bytes.length) {
    const idx = bytes[i] % charset.length
    result += charset[idx]
    i++
  }
  // ensure at least one char from each selected type
  if (result.length < length) {
    const extra = crypto.getRandomValues(new Uint8Array(length))
    result = Array.from(extra).map(b => charset[b % charset.length]).join('')
  }
  return result.slice(0, length)
}

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: 'Weak', color: '#E24B4A' }
  if (score <= 4) return { score, label: 'Fair', color: '#EF9F27' }
  if (score <= 5) return { score, label: 'Good', color: '#1D9E75' }
  return { score, label: 'Strong', color: '#085041' }
}

function calcEntropy(length: number, opts: {
  upper: boolean; lower: boolean; numbers: boolean; symbols: boolean
}): number {
  let poolSize = 0
  if (opts.upper) poolSize += 26
  if (opts.lower) poolSize += 26
  if (opts.numbers) poolSize += 10
  if (opts.symbols) poolSize += 28
  if (!poolSize) poolSize = 26
  return Math.floor(length * Math.log2(poolSize))
}

const PRESETS = [
  { label: 'PIN (4)', length: 4, upper: false, lower: false, numbers: true, symbols: false, excludeSimilar: false },
  { label: 'Simple (8)', length: 8, upper: true, lower: true, numbers: true, symbols: false, excludeSimilar: true },
  { label: 'Strong (16)', length: 16, upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: false },
  { label: 'Max (32)', length: 32, upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: false },
]

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState(true)

  const opts = { upper, lower, numbers, symbols, excludeSimilar }

  const generate = useCallback(() => {
    const results = Array.from({ length: quantity }, () => generatePassword(length, opts))
    setPasswords(results)
  }, [length, upper, lower, numbers, symbols, excludeSimilar, quantity])

  // Auto generate on mount
  useEffect(() => { generate() }, [])

  const copy = async (text: string, k: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(k); setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(passwords.join('\n'))
    setCopied('all'); setTimeout(() => setCopied(null), 1500)
  }

  const applyPreset = (p: typeof PRESETS[0]) => {
    setLength(p.length)
    setUpper(p.upper)
    setLower(p.lower)
    setNumbers(p.numbers)
    setSymbols(p.symbols)
    setExcludeSimilar(p.excludeSimilar)
  }

  const strength = passwords[0] ? getStrength(passwords[0]) : null
  const entropy = calcEntropy(length, opts)

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
      background: value ? '#1a1917' : '#ffffff',
      color: value ? '#f8f7f4' : '#6b6960',
      border: `0.5px solid ${value ? '#1a1917' : '#c8c6c0'}`,
      borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
    }}>{label}</button>
  )

  return (
    <div className="space-y-4">

      {/* Presets */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>presets:</span>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
            background: '#ffffff', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>{p.label}</button>
        ))}
      </div>

      {/* Length slider */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>length</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500, color: '#1a1917' }}>{length}</span>
        </div>
        <input type="range" min={4} max={128} step={1} value={length}
          onChange={e => setLength(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>4</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>128</span>
        </div>
      </div>

      {/* Character options */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Toggle label="A–Z uppercase" value={upper} onChange={setUpper} />
        <Toggle label="a–z lowercase" value={lower} onChange={setLower} />
        <Toggle label="0–9 numbers" value={numbers} onChange={setNumbers} />
        <Toggle label="!@# symbols" value={symbols} onChange={setSymbols} />
      </div>

      {/* Extra options */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={excludeSimilar} onChange={e => setExcludeSimilar(e.target.checked)} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>exclude similar (i, l, 1, o, 0)</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={!showPasswords} onChange={e => setShowPasswords(!e.target.checked)} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>hide passwords</span>
        </label>
      </div>

      {/* Quantity */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>quantity:</span>
        {[1, 5, 10, 20].map(n => (
          <button key={n} onClick={() => setQuantity(n)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
            background: quantity === n ? '#1a1917' : '#ffffff',
            color: quantity === n ? '#f8f7f4' : '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>{n}</button>
        ))}
      </div>

      {/* Generate button */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={generate} style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 28px',
          background: '#1a1917', color: '#f8f7f4',
          border: 'none', borderRadius: 7, cursor: 'pointer',
        }}>
          Generate {quantity > 1 ? `${quantity} passwords` : 'password'}
        </button>
        {passwords.length > 1 && (
          <button onClick={copyAll} style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 16px',
            background: 'transparent', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 7, cursor: 'pointer',
          }}>{copied === 'all' ? 'copied!' : 'copy all'}</button>
        )}
      </div>

      {/* Strength + entropy */}
      {strength && (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>strength:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: strength.color }}>{strength.label}</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{
                  width: 20, height: 4, borderRadius: 2,
                  background: i < Math.ceil(strength.score / 2) ? strength.color : '#e8e6e0',
                  transition: 'background .2s',
                }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>entropy:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917' }}>{entropy} bits</span>
          </div>
        </div>
      )}

      {/* Password results */}
      {passwords.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              {passwords.length} password{passwords.length > 1 ? 's' : ''} · {length} chars
            </span>
          </div>
          {passwords.map((pw, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderBottom: i < passwords.length - 1 ? '0.5px solid #f0ede8' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917',
                letterSpacing: '0.05em', wordBreak: 'break-all',
                filter: showPasswords ? 'none' : 'blur(6px)',
                transition: 'filter .2s', userSelect: showPasswords ? 'auto' : 'none',
              }}>{pw}</span>
              <button onClick={() => copy(pw, `p${i}`)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px', flexShrink: 0, marginLeft: 8,
                background: copied === `p${i}` ? '#e1f5ee' : 'transparent',
                color: copied === `p${i}` ? '#085041' : '#a8a69e',
                border: `0.5px solid ${copied === `p${i}` ? '#1D9E75' : '#e8e6e0'}`,
                borderRadius: 3, cursor: 'pointer', transition: 'all .15s',
              }}>{copied === `p${i}` ? '✓' : 'copy'}</button>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>TIPS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { bits: '< 40 bits', desc: 'Very weak — avoid' },
            { bits: '40–60 bits', desc: 'Weak — OK for low-risk accounts' },
            { bits: '60–80 bits', desc: 'Good — suitable for most uses' },
            { bits: '80+ bits', desc: 'Strong — recommended for sensitive accounts' },
          ].map(r => (
            <div key={r.bits} style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', minWidth: 80 }}>{r.bits}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}