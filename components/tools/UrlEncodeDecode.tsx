'use client'

import { useState } from 'react'

export default function UrlEncodeDecode() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [encodeMode, setEncodeMode] = useState<'component' | 'full'>('component')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const SAMPLE_ENCODE = 'https://freeutil.app/search?q=hello world&lang=ภาษาไทย&tag=dev tools'
  const SAMPLE_DECODE = 'https%3A%2F%2Ffreeutil.app%2Fsearch%3Fq%3Dhello%20world%26lang%3D%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2%26tag%3Ddev%20tools'

  const process = (text: string, currentMode: 'encode' | 'decode', currentEncodeMode: 'component' | 'full') => {
    if (!text.trim()) { setOutput(''); setError(''); return }
    try {
      if (currentMode === 'encode') {
        const result = currentEncodeMode === 'component'
          ? encodeURIComponent(text)
          : encodeURI(text)
        setOutput(result)
      } else {
        const result = currentEncodeMode === 'component'
          ? decodeURIComponent(text.trim())
          : decodeURI(text.trim())
        setOutput(result)
      }
      setError('')
    } catch {
      setError('Invalid URL encoding — check your input')
      setOutput('')
    }
  }

  const handleInput = (val: string) => {
    setInput(val)
    process(val, mode, encodeMode)
  }

  const handleMode = (m: 'encode' | 'decode') => {
    setMode(m)
    setInput('')
    setOutput('')
    setError('')
  }

  const handleEncodeMode = (m: 'component' | 'full') => {
    setEncodeMode(m)
    process(input, mode, m)
  }

  const swap = () => {
    if (!output) return
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    setInput(output)
    process(output, newMode, encodeMode)
  }

  const loadSample = () => {
    const sample = mode === 'encode' ? SAMPLE_ENCODE : SAMPLE_DECODE
    setInput(sample)
    process(sample, mode, encodeMode)
  }

  const clear = () => { setInput(''); setOutput(''); setError('') }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {(['encode', 'decode'] as const).map(m => (
            <button key={m} onClick={() => handleMode(m)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
              background: mode === m ? '#1a1917' : 'transparent',
              color: mode === m ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{m}</button>
          ))}
        </div>

        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {([
            { key: 'component', label: 'encodeURIComponent' },
            { key: 'full', label: 'encodeURI' },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => handleEncodeMode(key)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
              background: encodeMode === key ? '#1a1917' : 'transparent',
              color: encodeMode === key ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{label}</button>
          ))}
        </div>

        <button onClick={loadSample} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>load sample</button>

        <button onClick={clear} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>clear</button>
      </div>

      {/* Mode hint */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, padding: '8px 12px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', margin: 0 }}>
          {encodeMode === 'component'
            ? 'encodeURIComponent — encodes everything except letters, digits, and - _ . ~ · Best for query parameter values'
            : 'encodeURI — preserves :, /, ?, #, &, = and other URL characters · Best for full URLs'}
        </p>
      </div>

      {/* IO Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Input */}
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              input · {mode === 'encode' ? 'plain url / text' : 'encoded string'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {input.length > 0 ? `${input.length} chars` : ''}
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world' : 'https%3A%2F%2Fexample.com...'}
            style={{
              width: '100%', height: 180, padding: '12px',
              fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917',
              background: 'transparent', border: 'none', outline: 'none',
              resize: 'none', lineHeight: 1.7,
            }}
          />
        </div>

        {/* Output */}
        <div style={{ background: '#ffffff', border: `1px solid ${error ? '#f09595' : '#c8c6c0'}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              output · {mode === 'encode' ? 'encoded' : 'decoded'}
            </span>
            {output && (
              <button onClick={copy} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                background: 'transparent', color: '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
              }}>{copied ? 'copied!' : 'copy'}</button>
            )}
          </div>

          {error ? (
            <div style={{ padding: 12 }}>
              <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>{error}</p>
              </div>
            </div>
          ) : (
            <pre style={{
              width: '100%', height: 180, padding: '12px', margin: 0,
              fontFamily: 'var(--font-mono)', fontSize: 13,
              color: output ? '#1a1917' : '#a8a69e',
              background: 'transparent', overflow: 'auto',
              lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {output || 'Output will appear here...'}
            </pre>
          )}
        </div>
      </div>

      {/* Swap + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {output && !error && (
          <button onClick={swap} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '7px 16px',
            background: '#1a1917', color: '#f8f7f4',
            border: 'none', borderRadius: 6, cursor: 'pointer',
          }}>
            ⇄ swap input / output
          </button>
        )}
        {output && !error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>
              {mode === 'encode' ? 'encoded successfully' : 'decoded successfully'}
            </span>
          </div>
        )}
      </div>

    </div>
  )
}
