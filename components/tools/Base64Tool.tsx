'use client'

import { useState } from 'react'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [urlSafe, setUrlSafe] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const SAMPLE_ENCODE = 'Hello, FreeUtil! This is a Base64 test string 🎉'
  const SAMPLE_DECODE = 'SGVsbG8sIEZyZWVVdGlsISBUaGlzIGlzIGEgQmFzZTY0IHRlc3Qgc3RyaW5nIPCfjok='

  const process = (text: string, currentMode: 'encode' | 'decode', safe: boolean) => {
    if (!text.trim()) { setOutput(''); setError(''); return }
    try {
      if (currentMode === 'encode') {
        let result = btoa(unescape(encodeURIComponent(text)))
        if (safe) result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
        setOutput(result)
        setError('')
      } else {
        let normalized = text.trim()
        if (safe) normalized = normalized.replace(/-/g, '+').replace(/_/g, '/')
        while (normalized.length % 4) normalized += '='
        setOutput(decodeURIComponent(escape(atob(normalized))))
        setError('')
      }
    } catch {
      setError(currentMode === 'decode' ? 'Invalid Base64 string — check your input' : 'Could not encode — invalid characters')
      setOutput('')
    }
  }

  const handleInput = (val: string) => {
    setInput(val)
    process(val, mode, urlSafe)
  }

  const handleMode = (m: 'encode' | 'decode') => {
    setMode(m)
    setInput('')
    setOutput('')
    setError('')
  }

  const handleUrlSafe = (val: boolean) => {
    setUrlSafe(val)
    process(input, mode, val)
  }

  const swap = () => {
    if (!output) return
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    setInput(output)
    process(output, newMode, urlSafe)
  }

  const loadSample = () => {
    const sample = mode === 'encode' ? SAMPLE_ENCODE : SAMPLE_DECODE
    setInput(sample)
    process(sample, mode, urlSafe)
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

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={e => handleUrlSafe(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>URL-safe</span>
        </label>

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

      {/* IO Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Input */}
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              input · {mode === 'encode' ? 'plain text' : 'base64 string'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {input.length > 0 ? `${input.length} chars` : ''}
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            style={{
              width: '100%', height: 200, padding: '12px',
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
              output · {mode === 'encode' ? 'base64' : 'decoded text'}
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
              width: '100%', height: 200, padding: '12px', margin: 0,
              fontFamily: 'var(--font-mono)', fontSize: 13,
              color: output ? '#1a1917' : '#a8a69e',
              background: 'transparent', overflow: 'auto',
              lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {output || `${mode === 'encode' ? 'Base64' : 'Decoded'} output will appear here...`}
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
