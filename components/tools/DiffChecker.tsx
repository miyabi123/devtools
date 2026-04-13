'use client'

import { useState, useMemo } from 'react'

// ── Simple LCS-based diff ────────────────────────────────────────
type DiffLine = { type: 'same' | 'add' | 'remove'; text: string }

function computeDiff(a: string, b: string): DiffLine[] {
  const aLines = a.split('\n')
  const bLines = b.split('\n')
  const m = aLines.length
  const n = bLines.length

  // LCS DP
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aLines[i - 1] === bLines[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  const result: DiffLine[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: 'same', text: aLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'add', text: bLines[j - 1] })
      j--
    } else {
      result.unshift({ type: 'remove', text: aLines[i - 1] })
      i--
    }
  }
  return result
}

const SAMPLE_A = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const user = "World";
greet(user);`

const SAMPLE_B = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return name;
}

const user = "Thailand";
greet(user, "Sawadee");`

export default function DiffChecker() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [compared, setCompared] = useState(false)

  const diff = useMemo(() => {
    if (!compared) return []
    return computeDiff(textA, textB)
  }, [textA, textB, compared])

  const stats = useMemo(() => {
    const added = diff.filter(l => l.type === 'add').length
    const removed = diff.filter(l => l.type === 'remove').length
    const same = diff.filter(l => l.type === 'same').length
    return { added, removed, same }
  }, [diff])

  const loadSample = () => {
    setTextA(SAMPLE_A)
    setTextB(SAMPLE_B)
    setCompared(false)
  }

  const clear = () => {
    setTextA('')
    setTextB('')
    setCompared(false)
  }

  const lineStyle = (type: DiffLine['type']) => {
    if (type === 'add') return {
      background: '#e1f5ee', borderLeft: '3px solid #1D9E75',
      color: '#085041',
    }
    if (type === 'remove') return {
      background: '#fcebeb', borderLeft: '3px solid #e05555',
      color: '#a32d2d',
    }
    return { background: '#ffffff', borderLeft: '3px solid transparent', color: '#1a1917' }
  }

  const linePrefix = (type: DiffLine['type']) => {
    if (type === 'add') return '+'
    if (type === 'remove') return '−'
    return ' '
  }

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={loadSample} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 12px',
            background: '#ffffff', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>Sample</button>
          <button onClick={clear} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 12px',
            background: '#ffffff', color: '#a32d2d',
            border: '0.5px solid #f09595', borderRadius: 5, cursor: 'pointer',
          }}>Clear</button>
        </div>
        <button
          onClick={() => setCompared(true)}
          disabled={!textA || !textB}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 20px',
            background: textA && textB ? '#1a1917' : '#e8e6e0',
            color: textA && textB ? '#f8f7f4' : '#a8a69e',
            border: 'none', borderRadius: 6, cursor: textA && textB ? 'pointer' : 'default',
            fontWeight: 500,
          }}>Compare →</button>
      </div>

      {/* Input panels */}
      {!compared && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'ORIGINAL', value: textA, onChange: setTextA, placeholder: 'Paste original text here...' },
            { label: 'MODIFIED', value: textB, onChange: setTextB, placeholder: 'Paste modified text here...' },
          ].map(panel => (
            <div key={panel.label} style={{ border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '6px 12px', background: '#f8f7f4', borderBottom: '0.5px solid #e8e6e0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>{panel.label}</span>
              </div>
              <textarea
                value={panel.value}
                onChange={e => { panel.onChange(e.target.value); setCompared(false) }}
                placeholder={panel.placeholder}
                rows={14}
                style={{
                  width: '100%', padding: '12px', border: 'none', outline: 'none',
                  resize: 'none', fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: '#1a1917', background: '#ffffff', lineHeight: 1.6,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Diff result */}
      {compared && diff.length > 0 && (
        <div className="space-y-3">
          {/* Stats */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ background: '#e1f5ee', border: '0.5px solid #1D9E75', borderRadius: 6, padding: '6px 14px', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: '#085041' }}>+{stats.added}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#085041' }}>added</span>
            </div>
            <div style={{ background: '#fcebeb', border: '0.5px solid #e05555', borderRadius: 6, padding: '6px 14px', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: '#a32d2d' }}>−{stats.removed}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a32d2d' }}>removed</span>
            </div>
            <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, padding: '6px 14px', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: '#6b6960' }}>{stats.same}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>unchanged</span>
            </div>
            <button
              onClick={() => setCompared(false)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '6px 14px',
                background: '#ffffff', color: '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer', marginLeft: 'auto',
              }}>← Edit</button>
          </div>

          {/* Diff view */}
          <div style={{ border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '6px 12px', background: '#f8f7f4', borderBottom: '0.5px solid #e8e6e0', display: 'flex', gap: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>DIFF RESULT</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#085041' }}>■ added</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a32d2d' }}>■ removed</span>
            </div>
            <div style={{ overflowX: 'auto', background: '#ffffff' }}>
              {diff.map((line, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'stretch',
                  ...lineStyle(line.type),
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, padding: '3px 8px',
                    color: line.type === 'add' ? '#1D9E75' : line.type === 'remove' ? '#e05555' : '#c8c6c0',
                    userSelect: 'none', minWidth: 24, textAlign: 'center',
                    borderRight: '0.5px solid #e8e6e0',
                  }}>{linePrefix(line.type)}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, padding: '3px 12px',
                    whiteSpace: 'pre', flex: 1,
                  }}>{line.text || ' '}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No diff */}
      {compared && diff.length > 0 && stats.added === 0 && stats.removed === 0 && (
        <div style={{ background: '#e1f5ee', border: '0.5px solid #1D9E75', borderRadius: 8, padding: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#085041', margin: 0 }}>✓ Texts are identical — no differences found</p>
        </div>
      )}

    </div>
  )
}