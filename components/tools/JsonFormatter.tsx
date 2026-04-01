'use client'

import { useState, useCallback } from 'react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'format' | 'minify'>('format')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  const SAMPLE = `{"name":"Nat Thaidev","role":"admin","tools":["jwt","json","base64"],"active":true,"score":42}`

  const process = useCallback((text: string, currentMode: 'format' | 'minify', indent: number) => {
    if (!text.trim()) { setOutput(''); setError(''); return }
    try {
      const parsed = JSON.parse(text)
      if (currentMode === 'format') {
        setOutput(JSON.stringify(parsed, null, indent))
      } else {
        setOutput(JSON.stringify(parsed))
      }
      setError('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }, [])

  const handleInput = (val: string) => {
    setInput(val)
    process(val, mode, indentSize)
  }

  const handleMode = (m: 'format' | 'minify') => {
    setMode(m)
    process(input, m, indentSize)
  }

  const handleIndent = (n: number) => {
    setIndentSize(n)
    process(input, mode, n)
  }

  const loadSample = () => {
    setInput(SAMPLE)
    process(SAMPLE, mode, indentSize)
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const lineCount = output ? output.split('\n').length : 0
  const charCount = output ? output.length : 0

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {(['format', 'minify'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
                background: mode === m ? '#1a1917' : 'transparent',
                color: mode === m ? '#f8f7f4' : '#6b6960',
                border: 'none', cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === 'format' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>indent</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => handleIndent(n)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 10px',
                  background: indentSize === n ? '#1a1917' : 'transparent',
                  color: indentSize === n ? '#f8f7f4' : '#6b6960',
                  border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={loadSample}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
            background: 'transparent', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}
        >
          load sample
        </button>

        <button
          onClick={clear}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
            background: 'transparent', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}
        >
          clear
        </button>
      </div>

      {/* IO Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Input */}
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>input · json</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {input.length > 0 ? `${input.length} chars` : ''}
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder='{"key": "value"}'
            style={{
              width: '100%', height: 280, padding: '12px',
              fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917',
              background: 'transparent', border: 'none', outline: 'none',
              resize: 'none', lineHeight: 1.7,
            }}
          />
        </div>

        {/* Output */}
        <div style={{ background: '#ffffff', border: `1px solid ${error ? '#f09595' : '#c8c6c0'}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              {error ? 'error' : `output · ${mode === 'format' ? 'formatted' : 'minified'}`}
            </span>
            {output && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                  {lineCount} lines · {charCount} chars
                </span>
                <button
                  onClick={copy}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                    background: 'transparent', color: '#6b6960',
                    border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                  }}
                >
                  {copied ? 'copied!' : 'copy'}
                </button>
              </div>
            )}
          </div>

          {error ? (
            <div style={{ padding: 12 }}>
              <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>
                  {error}
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', marginTop: 10 }}>
                Fix the error in the input and try again.
              </p>
            </div>
          ) : (
            <pre style={{
              width: '100%', height: 280, padding: '12px',
              fontFamily: 'var(--font-mono)', fontSize: 13, color: output ? '#1a1917' : '#a8a69e',
              background: 'transparent', margin: 0,
              overflow: 'auto', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {output || 'Formatted JSON will appear here...'}
            </pre>
          )}
        </div>
      </div>

      {/* Valid badge */}
      {output && !error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>valid json</span>
        </div>
      )}

    </div>
  )
}
