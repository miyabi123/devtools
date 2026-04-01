'use client'

import { useState, useMemo } from 'react'

interface Match {
  value: string
  index: number
  end: number
  groups: Record<string, string>
}

const FLAGS = [
  { flag: 'g', label: 'global', desc: 'Find all matches' },
  { flag: 'i', label: 'ignore case', desc: 'Case insensitive' },
  { flag: 'm', label: 'multiline', desc: '^ and $ match line start/end' },
  { flag: 's', label: 'dotAll', desc: '. matches newlines' },
]

const PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)', flags: 'g' },
  { label: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g' },
  { label: 'IPv6', pattern: '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}', flags: 'g' },
  { label: 'Thai ID', pattern: '[0-9]{13}', flags: 'g' },
  { label: 'Phone TH', pattern: '(0[689][0-9]{8}|0[2-9][0-9]{7})', flags: 'g' },
  { label: 'Phone Intl', pattern: '\\+?[1-9]\\d{1,14}', flags: 'g' },
  { label: 'Date YYYY-MM-DD', pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}', flags: 'g' },
  { label: 'Date DD/MM/YYYY', pattern: '(0?[1-9]|[12][0-9]|3[01])\\/(0?[1-9]|1[0-2])\\/\\d{4}', flags: 'g' },
  { label: 'Time HH:MM', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?', flags: 'g' },
  { label: 'Hex color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b', flags: 'g' },
  { label: 'JWT', pattern: '[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+', flags: 'g' },
  { label: 'Credit card', pattern: '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\\b', flags: 'g' },
  { label: 'MAC address', pattern: '([0-9A-Fa-f]{2}[:\\-]){5}[0-9A-Fa-f]{2}', flags: 'gi' },
  { label: 'Username', pattern: '^[a-zA-Z0-9_]{3,16}$', flags: 'gm' },
  { label: 'Password strong', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', flags: 'gm' },
  { label: 'HTML tag', pattern: '<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>', flags: 'gi' },
  { label: 'SQL inject', pattern: '(\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\\b)', flags: 'gi' },
  { label: 'Thai text', pattern: '[\\u0E00-\\u0E7F]+', flags: 'g' },
  { label: 'Emoji', pattern: '[\\u{1F300}-\\u{1F9FF}]', flags: 'gu' },
  { label: 'Whitespace', pattern: '\\s+', flags: 'g' },
  { label: 'Empty lines', pattern: '^\\s*$', flags: 'gm' },
  { label: 'Duplicate words', pattern: '\\b(\\w+)\\s+\\1\\b', flags: 'gi' },
  { label: 'Numbers only', pattern: '\\b\\d+\\.?\\d*\\b', flags: 'g' },
  { label: 'CIDR', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\/(?:[0-9]|[1-2][0-9]|3[0-2])\\b', flags: 'g' },
]

const SAMPLE_TEXT = `Contact us at support@freeutil.app or admin@example.com
Visit https://freeutil.app/tools or http://example.com
IP addresses: 192.168.1.1 and 10.0.0.254
Phone: 0812345678 or 0891234567
ID: 1234567890123
Colors: #FF5733 and #abc
Date: 2024-03-15 or 2024/01/01`

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightMatches(text: string, matches: Match[]): string {
  if (!matches.length) return escapeHtml(text)
  let result = ''
  let last = 0
  matches.forEach((m, i) => {
    result += escapeHtml(text.slice(last, m.index))
    result += `<mark style="background:#fef08a;border-radius:2px;padding:0 1px" title="Match ${i + 1}">${escapeHtml(m.value)}</mark>`
    last = m.end
  })
  result += escapeHtml(text.slice(last))
  return result
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testText, setTestText] = useState('')
  const [replaceWith, setReplaceWith] = useState('')
  const [mode, setMode] = useState<'test' | 'replace'>('test')
  const [copied, setCopied] = useState<string | null>(null)
  const [showGroups, setShowGroups] = useState(true)

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)
  }

  const { matches, error, replaceResult } = useMemo(() => {
    if (!pattern || !testText) return { matches: [], error: '', replaceResult: '' }
    try {
      const re = new RegExp(pattern, flags.replace(/[^gimsuy]/g, ''))
      const found: Match[] = []
      if (flags.includes('g')) {
        let m: RegExpExecArray | null
        const reExec = new RegExp(pattern, flags.replace(/[^gimsuy]/g, ''))
        while ((m = reExec.exec(testText)) !== null) {
          found.push({
            value: m[0],
            index: m.index,
            end: m.index + m[0].length,
            groups: m.groups || {},
          })
          if (m[0].length === 0) reExec.lastIndex++
        }
      } else {
        const m = re.exec(testText)
        if (m) found.push({ value: m[0], index: m.index, end: m.index + m[0].length, groups: m.groups || {} })
      }
      const replaceResult = mode === 'replace' ? testText.replace(re, replaceWith) : ''
      return { matches: found, error: '', replaceResult }
    } catch (e: unknown) {
      return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex', replaceResult: '' }
    }
  }, [pattern, flags, testText, replaceWith, mode])

  const applyPreset = (p: typeof PRESETS[0]) => {
    setPattern(p.pattern)
    setFlags(p.flags)
    if (!testText) setTestText(SAMPLE_TEXT)
  }

  const copy = async (text: string, k: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(k); setTimeout(() => setCopied(null), 1500)
  }

  const highlighted = useMemo(() => highlightMatches(testText, matches), [testText, matches])

  const hasNamedGroups = matches.some(m => Object.keys(m.groups).length > 0)

  return (
    <div className="space-y-4">

      {/* Mode */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {(['test', 'replace'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
              background: mode === m ? '#1a1917' : 'transparent',
              color: mode === m ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{m}</button>
          ))}
        </div>
        {!testText && (
          <button onClick={() => setTestText(SAMPLE_TEXT)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
            background: 'transparent', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>load sample text</button>
        )}
        <button onClick={() => { setPattern(''); setTestText(''); setReplaceWith(''); setFlags('g') }} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>clear</button>
      </div>

      {/* Presets */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', marginBottom: 6 }}>PRESETS</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
              background: '#ffffff', color: '#6b6960',
              border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Pattern editor */}
      <div style={{ background: '#ffffff', border: `1.5px solid ${error ? '#f09595' : pattern ? '#1a1917' : '#c8c6c0'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color .15s' }}>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '0.5px solid #e8e6e0' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#a8a69e', padding: '0 8px 0 16px', lineHeight: 1 }}>/</span>
          <input
            type="text" value={pattern} onChange={e => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            style={{ flex: 1, padding: '12px 0', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 15, color: '#1a1917', background: 'transparent' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#a8a69e', padding: '0 4px', lineHeight: 1 }}>/</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#3c3489', padding: '0 12px 0 0', minWidth: 20 }}>{flags}</span>
        </div>

        {/* Flags */}
        <div style={{ display: 'flex',  padding: '8px 12px', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {FLAGS.map(f => (
            <button key={f.flag} onClick={() => toggleFlag(f.flag)} title={f.desc} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
              background: flags.includes(f.flag) ? '#eeedfe' : '#f8f7f4',
              color: flags.includes(f.flag) ? '#3c3489' : '#6b6960',
              border: `0.5px solid ${flags.includes(f.flag) ? '#AFA9EC' : '#c8c6c0'}`,
              borderRadius: 5, cursor: 'pointer', transition: 'all .15s',
            }}>
              {f.flag} — {f.label}
            </button>
          ))}
          <button onClick={() => copy(`/${pattern}/${flags}`, 'regex')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', marginLeft: 'auto',
            background: 'transparent', color: '#a8a69e', border: '0.5px solid #e8e6e0', borderRadius: 5, cursor: 'pointer',
          }}>{copied === 'regex' ? 'copied!' : 'copy regex'}</button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Replace input */}
      {mode === 'replace' && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>replace with — use $1 $2 for capture groups</span>
          </div>
          <input type="text" value={replaceWith} onChange={e => setReplaceWith(e.target.value)}
            placeholder="Replacement string... ($1, $2 for groups, $& for full match)"
            style={{ width: '100%', padding: '10px 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', background: 'transparent' }}
          />
        </div>
      )}

      {/* Test text area */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>test string</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {matches.length > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#e1f5ee', color: '#085041' }}>
                {matches.length} match{matches.length !== 1 ? 'es' : ''}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {testText.length} chars
            </span>
          </div>
        </div>
        <textarea
          value={testText} onChange={e => setTestText(e.target.value)}
          placeholder="Enter text to test against your regex..."
          style={{ width: '100%', height: 150, padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', background: 'transparent', border: 'none', outline: 'none', resize: 'vertical', lineHeight: 1.7 }}
        />
      </div>

      {/* Highlighted preview */}
      {testText && matches.length > 0 && mode === 'test' && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>highlighted matches</span>
          </div>
          <div
            style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {/* Replace result */}
      {mode === 'replace' && replaceResult && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>replace result</span>
            <button onClick={() => copy(replaceResult, 'result')} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
              background: 'transparent', color: '#6b6960', border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
            }}>{copied === 'result' ? 'copied!' : 'copy'}</button>
          </div>
          <pre style={{ padding: '12px', margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {replaceResult}
          </pre>
        </div>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              match details
            </span>
            {hasNamedGroups && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                <input type="checkbox" checked={showGroups} onChange={e => setShowGroups(e.target.checked)} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>show groups</span>
              </label>
            )}
          </div>

          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {matches.map((m, i) => (
              <div key={i} style={{ padding: '9px 14px', borderBottom: '0.5px solid #f0ede8', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', minWidth: 24, marginTop: 2 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', background: '#fef9c3', padding: '0 4px', borderRadius: 3 }}>{m.value}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>index {m.index}–{m.end}</span>
                    <button onClick={() => copy(m.value, `m${i}`)} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 6px',
                      background: 'transparent', color: '#a8a69e', border: '0.5px solid #e8e6e0', borderRadius: 3, cursor: 'pointer',
                    }}>{copied === `m${i}` ? '✓' : 'copy'}</button>
                  </div>
                  {showGroups && Object.keys(m.groups).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                      {Object.entries(m.groups).map(([k, v]) => (
                        <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '1px 7px', background: '#eeedfe', color: '#3c3489', borderRadius: 4 }}>
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No match */}
      {pattern && testText && !error && matches.length === 0 && (
        <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E24B4A', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>No matches found</span>
        </div>
      )}

    </div>
  )
}
