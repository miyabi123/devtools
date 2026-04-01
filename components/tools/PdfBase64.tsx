'use client'

import { useState, useRef } from 'react'

export default function PdfBase64() {
  const [mode, setMode] = useState<'pdf-to-b64' | 'b64-to-pdf'>('pdf-to-b64')
  const [b64Output, setB64Output] = useState('')
  const [b64Input, setB64Input] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const clear = () => {
    setB64Output('')
    setB64Input('')
    setFileName('')
    setFileSize('')
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleMode = (m: 'pdf-to-b64' | 'b64-to-pdf') => {
    setMode(m)
    clear()
  }

  const handleFile = (file: File) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only')
      return
    }
    setError('')
    setFileName(file.name)
    setFileSize(formatSize(file.size))
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const b64 = result.split(',')[1]
      setB64Output(b64)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDownload = () => {
    if (!b64Input.trim()) { setError('Please paste a Base64 string first'); return }
    setError('')
    try {
      const clean = b64Input.trim().replace(/\s/g, '')
      const byteCharacters = atob(clean)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch {
      setError('Invalid Base64 string — could not decode to PDF')
    }
  }

  const copy = async () => {
    if (!b64Output) return
    await navigator.clipboard.writeText(b64Output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          <button onClick={() => handleMode('pdf-to-b64')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
            background: mode === 'pdf-to-b64' ? '#1a1917' : 'transparent',
            color: mode === 'pdf-to-b64' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>PDF → Base64</button>
          <button onClick={() => handleMode('b64-to-pdf')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
            background: mode === 'b64-to-pdf' ? '#1a1917' : 'transparent',
            color: mode === 'b64-to-pdf' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>Base64 → PDF</button>
        </div>
        <button onClick={clear} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>clear</button>
      </div>

      {mode === 'pdf-to-b64' && (
        <div className="space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#1a1917' : '#c8c6c0'}`,
              borderRadius: 10, padding: '40px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, cursor: 'pointer', transition: 'all .15s',
              background: dragging ? '#f8f7f4' : '#ffffff',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#a8a69e" strokeWidth="1.5">
              <path d="M20 4H8a2 2 0 00-2 2v20a2 2 0 002 2h16a2 2 0 002-2V12L20 4z"/>
              <path d="M20 4v8h8"/>
              <path d="M16 18v-6M13 15l3-3 3 3"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#6b6960', margin: 0, textAlign: 'center' }}>
              {fileName ? fileName : 'Drop PDF here or click to upload'}
            </p>
            {fileSize && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', margin: 0 }}>{fileSize}</p>}
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
          </div>

          {b64Output && (
            <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
                  base64 output · {b64Output.length.toLocaleString()} chars
                </span>
                <button onClick={copy} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                  background: 'transparent', color: '#6b6960',
                  border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                }}>{copied ? 'copied!' : 'copy'}</button>
              </div>
              <pre style={{
                padding: '12px', margin: 0, maxHeight: 200, overflow: 'auto',
                fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917',
                lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {b64Output.slice(0, 500)}{b64Output.length > 500 ? `\n... (${(b64Output.length - 500).toLocaleString()} more chars)` : ''}
              </pre>
            </div>
          )}

          {b64Output && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>
                converted successfully · {fileName}
              </span>
            </div>
          )}
        </div>
      )}

      {mode === 'b64-to-pdf' && (
        <div className="space-y-4">
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>input · base64 string</span>
            </div>
            <textarea
              value={b64Input}
              onChange={e => { setB64Input(e.target.value); setError('') }}
              placeholder="Paste your Base64 encoded PDF string here..."
              style={{
                width: '100%', height: 200, padding: '12px',
                fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917',
                background: 'transparent', border: 'none', outline: 'none',
                resize: 'none', lineHeight: 1.7,
              }}
            />
          </div>
          <button onClick={handleDownload} style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 24px',
            background: '#1a1917', color: '#f8f7f4',
            border: 'none', borderRadius: 6, cursor: 'pointer',
          }}>
            Open PDF
          </button>
        </div>
      )}

      {error && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>{error}</p>
        </div>
      )}
    </div>
  )
}
