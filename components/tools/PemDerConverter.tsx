'use client'

import { useState, useRef } from 'react'

type Mode = 'pem-to-der' | 'der-to-pem'

function pemToDer(pem: string): ArrayBuffer {
  const lines = pem.trim().split('\n')
  const b64 = lines
    .filter(l => !l.startsWith('-----'))
    .join('')
    .replace(/\s/g, '')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function derToPem(der: ArrayBuffer, type = 'CERTIFICATE'): string {
  const bytes = new Uint8Array(der)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  const lines = base64.match(/.{1,64}/g) || []
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`
}

function detectPemType(pem: string): string {
  const match = pem.match(/-----BEGIN ([^-]+)-----/)
  return match ? match[1] : 'CERTIFICATE'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export default function PemDerConverter() {
  const [mode, setMode] = useState<Mode>('pem-to-der')
  const [pemInput, setPemInput] = useState('')
  const [derInfo, setDerInfo] = useState<{ name: string; buffer: ArrayBuffer } | null>(null)
  const [pemOutput, setPemOutput] = useState('')
  const [derOutput, setDerOutput] = useState<ArrayBuffer | null>(null)
  const [derOutputType, setDerOutputType] = useState('CERTIFICATE')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const convert = () => {
    setError('')
    setCopied(false)

    if (mode === 'pem-to-der') {
      if (!pemInput.trim()) { setError('Please paste a PEM certificate'); return }
      if (!pemInput.includes('-----BEGIN')) { setError('Invalid PEM format — must start with -----BEGIN-----'); return }
      try {
        const der = pemToDer(pemInput)
        setDerOutput(der)
        setDerOutputType(detectPemType(pemInput))
      } catch {
        setError('Failed to convert — please check your PEM input')
      }
    } else {
      if (!derInfo) { setError('Please upload a DER file (.der, .crt, .cer)'); return }
      try {
        const pem = derToPem(derInfo.buffer, derOutputType)
        setPemOutput(pem)
      } catch {
        setError('Failed to convert — please check your DER file')
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setDerInfo(null)
    setPemOutput('')

    const reader = new FileReader()
    reader.onload = ev => {
      const buffer = ev.target?.result as ArrayBuffer
      setDerInfo({ name: file.name, buffer })
    }
    reader.readAsArrayBuffer(file)
  }

  const downloadDer = () => {
    if (!derOutput) return
    const blob = new Blob([derOutput], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificate.der`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPem = () => {
    if (!pemOutput) return
    const blob = new Blob([pemOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificate.pem`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyPem = async () => {
    await navigator.clipboard.writeText(pemOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const reset = () => {
    setPemInput('')
    setDerInfo(null)
    setPemOutput('')
    setDerOutput(null)
    setError('')
    setCopied(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const PEM_TYPES = ['CERTIFICATE', 'PRIVATE KEY', 'RSA PRIVATE KEY', 'CERTIFICATE REQUEST', 'PUBLIC KEY']

  return (
    <div className="space-y-4">

      {/* Mode toggle */}
      <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
        {([
          { val: 'pem-to-der', label: '📄 PEM → DER' },
          { val: 'der-to-pem', label: '🔲 DER → PEM' },
        ] as { val: Mode; label: string }[]).map(o => (
          <button key={o.val} onClick={() => { setMode(o.val); reset() }} style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 20px',
            background: mode === o.val ? '#1a1917' : 'transparent',
            color: mode === o.val ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer',
          }}>{o.label}</button>
        ))}
      </div>

      {/* Info banner */}
      <div style={{ background: '#eef6ff', border: '0.5px solid #93c5fd', borderRadius: 6, padding: '10px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#1D4ED8', margin: 0, lineHeight: 1.7 }}>
          {mode === 'pem-to-der'
            ? '📄 PEM = Base64 text with -----BEGIN----- headers (Linux, Nginx, Apache)\n🔲 DER = Binary format (Windows IIS, Java, Android)'
            : '🔲 DER = Binary format (.der, .cer, .crt binary files)\n📄 PEM = Base64 text output ready for Linux servers'}
        </p>
      </div>

      {/* Input */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
            {mode === 'pem-to-der' ? 'INPUT — Paste PEM text' : 'INPUT — Upload DER file'}
          </span>
        </div>

        <div style={{ padding: '14px' }}>
          {mode === 'pem-to-der' ? (
            <textarea
              value={pemInput}
              onChange={e => { setPemInput(e.target.value); setDerOutput(null); setError('') }}
              placeholder={`-----BEGIN CERTIFICATE-----\nMIID....\n-----END CERTIFICATE-----`}
              rows={8}
              style={{
                width: '100%', padding: '10px', border: '0.5px solid #c8c6c0',
                borderRadius: 6, outline: 'none', resize: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 12,
                color: '#1a1917', background: '#fafaf9', lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".der,.crt,.cer,.cert"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '1.5px dashed #c8c6c0', borderRadius: 8,
                  padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                  background: derInfo ? '#e1f5ee' : '#fafaf9',
                  transition: 'all .15s',
                }}
              >
                {derInfo ? (
                  <>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#085041', margin: '0 0 4px', fontWeight: 600 }}>
                      ✓ {derInfo.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960', margin: 0 }}>
                      {formatBytes(derInfo.buffer.byteLength)} — Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#6b6960', margin: '0 0 4px' }}>
                      Click to upload DER file
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0 }}>
                      .der / .crt / .cer / .cert binary files
                    </p>
                  </>
                )}
              </div>

              {/* PEM type selector for DER→PEM */}
              {derInfo && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px' }}>PEM TYPE (for output header)</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {PEM_TYPES.map(t => (
                      <button key={t} onClick={() => setDerOutputType(t)} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, padding: '4px 10px',
                        background: derOutputType === t ? '#1a1917' : '#f8f7f4',
                        color: derOutputType === t ? '#f8f7f4' : '#6b6960',
                        border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                      }}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '8px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Convert button */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={convert} style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 24px',
          background: '#1a1917', color: '#f8f7f4',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500,
        }}>
          {mode === 'pem-to-der' ? 'Convert PEM → DER →' : 'Convert DER → PEM →'}
        </button>
        <button onClick={reset} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '10px 16px',
          background: '#f8f7f4', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 8, cursor: 'pointer',
        }}>Clear</button>
      </div>

      {/* Output — DER */}
      {mode === 'pem-to-der' && derOutput && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>
              ✓ DER output — {formatBytes(derOutput.byteLength)}
            </span>
            <button onClick={downloadDer} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
              background: '#eeedfe', color: '#3c3489',
              border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
            }}>↓ Download .der</button>
          </div>
          <div style={{ padding: '16px 14px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', margin: '0 0 8px' }}>Binary DER data — {formatBytes(derOutput.byteLength)}</p>
            <div style={{ background: '#1a1917', borderRadius: 6, padding: '10px 12px', overflowX: 'auto' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 4px' }}>HEX PREVIEW (first 64 bytes)</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#e1f5ee', margin: 0, wordBreak: 'break-all', lineHeight: 1.8 }}>
                {Array.from(new Uint8Array(derOutput).slice(0, 64))
                  .map(b => b.toString(16).padStart(2, '0'))
                  .join(' ')}
                {derOutput.byteLength > 64 && <span style={{ color: '#6b6960' }}> ...</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Output — PEM */}
      {mode === 'der-to-pem' && pemOutput && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>✓ PEM output</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={copyPem} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                background: copied ? '#e1f5ee' : '#ffffff', color: copied ? '#085041' : '#6b6960',
                border: `0.5px solid ${copied ? '#1D9E75' : '#c8c6c0'}`, borderRadius: 5, cursor: 'pointer',
              }}>{copied ? '✓ Copied' : 'Copy'}</button>
              <button onClick={downloadPem} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                background: '#eeedfe', color: '#3c3489',
                border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
              }}>↓ Download .pem</button>
            </div>
          </div>
          <textarea readOnly value={pemOutput} rows={10} style={{
            width: '100%', padding: '12px', border: 'none', outline: 'none', resize: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917',
            background: '#fafaf9', lineHeight: 1.5, boxSizing: 'border-box',
          }} />
        </div>
      )}

    </div>
  )
}